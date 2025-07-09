/*
  # Complete Authentication System Overhaul

  1. New Tables
    - `user_accounts` - Main user account table with username, contact_number, email
    - Enhanced `user_profiles` - Extended user profile information
    - Updated `user_settings` - User preferences and settings

  2. Authentication Features
    - Register with: contact_number (required), password (required), username (required), email (optional)
    - Sign in with: username + password, email + password, or contact_number + password
    - Unique constraints on username, contact_number, and email

  3. Security
    - Enable RLS on all tables
    - Proper policies for authenticated users
    - Secure lookup functions for multi-method login
*/

-- Drop existing problematic policies and functions
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.get_user_by_contact(text);

-- Create user_accounts table for comprehensive authentication
CREATE TABLE IF NOT EXISTS user_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  contact_number text UNIQUE NOT NULL,
  email text UNIQUE,
  full_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_accounts_username ON user_accounts(username);
CREATE INDEX IF NOT EXISTS idx_user_accounts_contact_number ON user_accounts(contact_number);
CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON user_accounts(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_accounts_auth_user_id ON user_accounts(auth_user_id);

-- Update user_profiles table structure
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES user_accounts(auth_user_id) ON DELETE CASCADE;

-- Add username to user_profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'username') THEN
    ALTER TABLE user_profiles ADD COLUMN username text;
  END IF;
END $$;

-- Enable RLS on user_accounts
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_accounts
CREATE POLICY "Users can view their own account"
  ON user_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own account"
  ON user_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for user_settings
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

-- Function to find user by login identifier (username, email, or contact_number)
CREATE OR REPLACE FUNCTION public.find_user_for_login(login_identifier text)
RETURNS TABLE(auth_email text, user_id uuid) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.email as auth_email,
    ua.auth_user_id as user_id
  FROM user_accounts ua
  JOIN auth.users au ON ua.auth_user_id = au.id
  WHERE 
    ua.username = login_identifier 
    OR ua.contact_number = login_identifier 
    OR (ua.email IS NOT NULL AND ua.email = login_identifier)
    AND ua.is_active = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to check if username exists
CREATE OR REPLACE FUNCTION public.check_username_exists(check_username text)
RETURNS boolean
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM user_accounts 
    WHERE username = check_username
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check if contact number exists
CREATE OR REPLACE FUNCTION public.check_contact_exists(check_contact text)
RETURNS boolean
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM user_accounts 
    WHERE contact_number = check_contact
  );
END;
$$ LANGUAGE plpgsql;

-- Function to check if email exists
CREATE OR REPLACE FUNCTION public.check_email_exists(check_email text)
RETURNS boolean
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM user_accounts 
    WHERE email = check_email
  );
END;
$$ LANGUAGE plpgsql;

-- Updated trigger function for new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
AS $$
DECLARE
  user_username text;
  user_contact text;
  user_email text;
  user_fullname text;
BEGIN
  -- Extract data from user metadata
  user_username := COALESCE(new.raw_user_meta_data->>'username', '');
  user_contact := COALESCE(new.raw_user_meta_data->>'contact_number', '');
  user_email := new.raw_user_meta_data->>'email'; -- Can be null
  user_fullname := COALESCE(new.raw_user_meta_data->>'full_name', '');

  -- Insert into user_accounts
  INSERT INTO public.user_accounts (
    auth_user_id, 
    username, 
    contact_number, 
    email, 
    full_name
  )
  VALUES (
    new.id,
    user_username,
    user_contact,
    user_email,
    user_fullname
  );

  -- Insert into user_profiles
  INSERT INTO public.user_profiles (
    id, 
    full_name, 
    contact_number, 
    email,
    username
  )
  VALUES (
    new.id,
    user_fullname,
    user_contact,
    user_email,
    user_username
  );

  -- Insert into user_settings
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update trigger for user_accounts
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_accounts_updated_at
  BEFORE UPDATE ON user_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON user_accounts TO authenticated;
GRANT UPDATE ON user_accounts TO authenticated;
GRANT EXECUTE ON FUNCTION find_user_for_login(text) TO authenticated;
GRANT EXECUTE ON FUNCTION check_username_exists(text) TO authenticated;
GRANT EXECUTE ON FUNCTION check_contact_exists(text) TO authenticated;
GRANT EXECUTE ON FUNCTION check_email_exists(text) TO authenticated;