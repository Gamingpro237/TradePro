/*
  # Investment Plans and Settings Schema

  1. New Tables
    - `investment_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `plan_type` (text: '2000', '5000', '10000', '20000')
      - `initial_amount` (decimal)
      - `daily_increment` (decimal)
      - `current_balance` (decimal)
      - `total_gained` (decimal)
      - `start_date` (timestamp)
      - `last_increment_date` (timestamp)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `theme` (text, default 'dark')
      - `language` (text, default 'en')
      - `currency` (text, default 'USD')
      - `notifications_enabled` (boolean, default true)
      - `email_notifications` (boolean, default true)
      - `sms_notifications` (boolean, default false)
      - `two_factor_enabled` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `daily_gains`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `investment_plan_id` (uuid, foreign key to investment_plans)
      - `gain_amount` (decimal)
      - `balance_before` (decimal)
      - `balance_after` (decimal)
      - `gain_date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Functions
    - Function to process daily gains
    - Function to create default settings for new users
*/

-- Create investment_plans table
CREATE TABLE IF NOT EXISTS investment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('2000', '5000', '10000', '20000')),
  initial_amount decimal(15,2) NOT NULL,
  daily_increment decimal(15,2) NOT NULL,
  current_balance decimal(15,2) NOT NULL DEFAULT 0,
  total_gained decimal(15,2) NOT NULL DEFAULT 0,
  start_date timestamptz NOT NULL DEFAULT now(),
  last_increment_date date,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme text DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  language text DEFAULT 'en',
  currency text DEFAULT 'USD',
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  two_factor_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create daily_gains table
CREATE TABLE IF NOT EXISTS daily_gains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  investment_plan_id uuid REFERENCES investment_plans(id) ON DELETE CASCADE NOT NULL,
  gain_amount decimal(15,2) NOT NULL,
  balance_before decimal(15,2) NOT NULL,
  balance_after decimal(15,2) NOT NULL,
  gain_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_gains ENABLE ROW LEVEL SECURITY;

-- Investment Plans Policies
CREATE POLICY "Users can view own investment plans"
  ON investment_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investment plans"
  ON investment_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investment plans"
  ON investment_plans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own investment plans"
  ON investment_plans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User Settings Policies
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Daily Gains Policies
CREATE POLICY "Users can view own daily gains"
  ON daily_gains
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily gains"
  ON daily_gains
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to get daily increment based on plan type
CREATE OR REPLACE FUNCTION get_daily_increment(plan_type text)
RETURNS decimal AS $$
BEGIN
  CASE plan_type
    WHEN '2000' THEN RETURN 60.00;
    WHEN '5000' THEN RETURN 160.00;
    WHEN '10000' THEN RETURN 330.00;
    WHEN '20000' THEN RETURN 660.00;
    ELSE RETURN 0.00;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to process daily gains for all active plans
CREATE OR REPLACE FUNCTION process_daily_gains()
RETURNS void AS $$
DECLARE
  plan_record RECORD;
  daily_gain decimal(15,2);
  new_balance decimal(15,2);
BEGIN
  FOR plan_record IN 
    SELECT * FROM investment_plans 
    WHERE is_active = true 
    AND (last_increment_date IS NULL OR last_increment_date < CURRENT_DATE)
  LOOP
    -- Get the daily increment for this plan type
    daily_gain := get_daily_increment(plan_record.plan_type);
    new_balance := plan_record.current_balance + daily_gain;
    
    -- Insert daily gain record
    INSERT INTO daily_gains (
      user_id,
      investment_plan_id,
      gain_amount,
      balance_before,
      balance_after,
      gain_date
    ) VALUES (
      plan_record.user_id,
      plan_record.id,
      daily_gain,
      plan_record.current_balance,
      new_balance,
      CURRENT_DATE
    );
    
    -- Update investment plan
    UPDATE investment_plans 
    SET 
      current_balance = new_balance,
      total_gained = total_gained + daily_gain,
      last_increment_date = CURRENT_DATE,
      updated_at = now()
    WHERE id = plan_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create default settings for new users
CREATE OR REPLACE FUNCTION create_default_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the existing handle_new_user function to also create settings
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, contact_number)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'contact_number', '')
  );
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_investment_plans_updated_at
  BEFORE UPDATE ON investment_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investment_plans_user_id ON investment_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_plans_active ON investment_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_daily_gains_user_id ON daily_gains(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_gains_date ON daily_gains(gain_date);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);