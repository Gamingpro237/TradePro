/*
  # Fix RLS policies for user authentication

  1. Security Updates
    - Fix RLS policies for user_profiles table to allow proper signup flow
    - Fix RLS policies for user_settings table to allow creation during signup
    - Add email column to user_profiles table for storing actual user email
  
  2. Changes
    - Drop and recreate RLS policies with proper conditions
    - Add email column to user_profiles table
    - Ensure policies work for both authenticated and public users during signup
*/

-- Add email column to user_profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email text;
  END IF;
END $$;

-- Drop existing policies for user_profiles
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for public users during signup" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- Create new policies for user_profiles that work properly
CREATE POLICY "Users can insert their own profile during signup"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Drop existing policies for user_settings
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON user_settings;
DROP POLICY IF EXISTS "Enable insert for public users during signup" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;

-- Create new policies for user_settings that work properly
CREATE POLICY "Users can insert their own settings during signup"
  ON user_settings
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own settings"
  ON user_settings
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings
  FOR UPDATE
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);