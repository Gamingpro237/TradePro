/*
  # Enhanced Investment Tracking System

  1. New Tables
    - Enhanced `daily_gains` table with more detailed tracking
    - `investment_history` table for comprehensive tracking
    
  2. New Features
    - Daily progress tracking from registration date
    - Bonus tracking and special events
    - Investment milestones and achievements
    
  3. Functions
    - Enhanced daily gain processing
    - Investment progress calculation
    - Bonus application system
*/

-- Add bonus tracking columns to daily_gains if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_gains' AND column_name = 'bonus_amount'
  ) THEN
    ALTER TABLE daily_gains ADD COLUMN bonus_amount decimal(15,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_gains' AND column_name = 'bonus_type'
  ) THEN
    ALTER TABLE daily_gains ADD COLUMN bonus_type text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_gains' AND column_name = 'day_number'
  ) THEN
    ALTER TABLE daily_gains ADD COLUMN day_number integer;
  END IF;
END $$;

-- Create investment_history table for comprehensive tracking
CREATE TABLE IF NOT EXISTS investment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  investment_plan_id uuid REFERENCES investment_plans(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  day_number integer NOT NULL,
  opening_balance decimal(15,2) NOT NULL,
  daily_gain decimal(15,2) NOT NULL,
  bonus_amount decimal(15,2) DEFAULT 0,
  bonus_type text,
  closing_balance decimal(15,2) NOT NULL,
  total_gained_to_date decimal(15,2) NOT NULL,
  roi_percentage decimal(8,4) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on investment_history
ALTER TABLE investment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for investment_history
CREATE POLICY "Users can view own investment history"
  ON investment_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investment history"
  ON investment_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to calculate day number since plan start
CREATE OR REPLACE FUNCTION calculate_day_number(plan_start_date timestamptz, target_date date)
RETURNS integer AS $$
BEGIN
  RETURN EXTRACT(DAY FROM target_date - plan_start_date::date) + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate bonus based on milestones
CREATE OR REPLACE FUNCTION calculate_milestone_bonus(day_number integer, daily_gain decimal)
RETURNS TABLE(bonus_amount decimal, bonus_type text) AS $$
BEGIN
  -- Weekly bonus (every 7 days)
  IF day_number % 7 = 0 THEN
    RETURN QUERY SELECT daily_gain * 0.5, 'Weekly Bonus';
  -- Monthly bonus (every 30 days)
  ELSIF day_number % 30 = 0 THEN
    RETURN QUERY SELECT daily_gain * 2.0, 'Monthly Bonus';
  -- Milestone bonuses
  ELSIF day_number = 100 THEN
    RETURN QUERY SELECT daily_gain * 5.0, '100 Days Milestone';
  ELSIF day_number = 365 THEN
    RETURN QUERY SELECT daily_gain * 10.0, '1 Year Anniversary';
  ELSE
    RETURN QUERY SELECT 0.0::decimal, NULL::text;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Enhanced function to process daily gains with bonuses
CREATE OR REPLACE FUNCTION process_daily_gains_enhanced()
RETURNS void AS $$
DECLARE
  plan_record RECORD;
  daily_gain decimal(15,2);
  bonus_info RECORD;
  new_balance decimal(15,2);
  day_num integer;
  total_gained decimal(15,2);
  roi_percent decimal(8,4);
BEGIN
  FOR plan_record IN 
    SELECT * FROM investment_plans 
    WHERE is_active = true 
    AND (last_increment_date IS NULL OR last_increment_date < CURRENT_DATE)
  LOOP
    -- Calculate day number since plan start
    day_num := calculate_day_number(plan_record.start_date, CURRENT_DATE);
    
    -- Get the daily increment for this plan type
    daily_gain := get_daily_increment(plan_record.plan_type);
    
    -- Calculate milestone bonus
    SELECT * INTO bonus_info FROM calculate_milestone_bonus(day_num, daily_gain);
    
    -- Calculate new balance
    new_balance := plan_record.current_balance + daily_gain + COALESCE(bonus_info.bonus_amount, 0);
    total_gained := plan_record.total_gained + daily_gain + COALESCE(bonus_info.bonus_amount, 0);
    
    -- Calculate ROI percentage
    roi_percent := (total_gained / plan_record.initial_amount) * 100;
    
    -- Insert daily gain record with bonus information
    INSERT INTO daily_gains (
      user_id,
      investment_plan_id,
      gain_amount,
      bonus_amount,
      bonus_type,
      balance_before,
      balance_after,
      gain_date,
      day_number
    ) VALUES (
      plan_record.user_id,
      plan_record.id,
      daily_gain,
      COALESCE(bonus_info.bonus_amount, 0),
      bonus_info.bonus_type,
      plan_record.current_balance,
      new_balance,
      CURRENT_DATE,
      day_num
    );
    
    -- Insert comprehensive history record
    INSERT INTO investment_history (
      user_id,
      investment_plan_id,
      date,
      day_number,
      opening_balance,
      daily_gain,
      bonus_amount,
      bonus_type,
      closing_balance,
      total_gained_to_date,
      roi_percentage
    ) VALUES (
      plan_record.user_id,
      plan_record.id,
      CURRENT_DATE,
      day_num,
      plan_record.current_balance,
      daily_gain,
      COALESCE(bonus_info.bonus_amount, 0),
      bonus_info.bonus_type,
      new_balance,
      total_gained,
      roi_percent
    );
    
    -- Update investment plan
    UPDATE investment_plans 
    SET 
      current_balance = new_balance,
      total_gained = total_gained,
      last_increment_date = CURRENT_DATE,
      updated_at = now()
    WHERE id = plan_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investment_history_user_date ON investment_history(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_investment_history_plan_id ON investment_history(investment_plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_gains_day_number ON daily_gains(day_number);

-- Function to get user's investment progress summary
CREATE OR REPLACE FUNCTION get_investment_progress_summary(user_uuid uuid)
RETURNS TABLE(
  total_plans integer,
  total_invested decimal,
  total_current_value decimal,
  total_gained decimal,
  average_roi decimal,
  days_active integer,
  total_bonuses decimal
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::integer as total_plans,
    SUM(ip.initial_amount) as total_invested,
    SUM(ip.current_balance) as total_current_value,
    SUM(ip.total_gained) as total_gained,
    AVG((ip.total_gained / ip.initial_amount) * 100) as average_roi,
    MAX(EXTRACT(DAY FROM CURRENT_DATE - ip.start_date::date))::integer as days_active,
    COALESCE(SUM(dg.bonus_amount), 0) as total_bonuses
  FROM investment_plans ip
  LEFT JOIN daily_gains dg ON ip.id = dg.investment_plan_id
  WHERE ip.user_id = user_uuid AND ip.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;