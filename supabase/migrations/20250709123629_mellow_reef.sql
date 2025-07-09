/*
  # Fix Row Level Security Policies

  This migration fixes all RLS policy issues by:
  1. Dropping existing problematic policies
  2. Creating consistent policies using auth.uid()
  3. Ensuring proper permissions for user registration and profile management
  4. Fixing contact number and email related policies

  ## Tables Updated
  - user_profiles: Fixed policies for profile management
  - user_settings: Fixed policies for settings management
  - ai_characters: Updated to use auth.uid() consistently
  - recordings: Updated to use auth.uid() consistently
  - interactions: Updated to use auth.uid() consistently
  - investment_plans: Updated to use auth.uid() consistently
  - daily_gains: Updated to use auth.uid() consistently
  - investment_history: Updated to use auth.uid() consistently

  ## Security
  - All policies now use auth.uid() for consistency
  - Proper INSERT policies for user registration
  - Consistent role assignments (authenticated vs public)
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings during signup" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

DROP POLICY IF EXISTS "Users can view their own characters" ON ai_characters;
DROP POLICY IF EXISTS "Users can insert their own characters" ON ai_characters;
DROP POLICY IF EXISTS "Users can update their own characters" ON ai_characters;
DROP POLICY IF EXISTS "Users can delete their own characters" ON ai_characters;

DROP POLICY IF EXISTS "Users can view their own recordings" ON recordings;
DROP POLICY IF EXISTS "Users can insert their own recordings" ON recordings;
DROP POLICY IF EXISTS "Users can update their own recordings" ON recordings;
DROP POLICY IF EXISTS "Users can delete their own recordings" ON recordings;

DROP POLICY IF EXISTS "Users can view their own interactions" ON interactions;
DROP POLICY IF EXISTS "Users can insert their own interactions" ON interactions;

DROP POLICY IF EXISTS "Users can view own investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Users can insert own investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Users can update own investment plans" ON investment_plans;
DROP POLICY IF EXISTS "Users can delete own investment plans" ON investment_plans;

DROP POLICY IF EXISTS "Users can view own daily gains" ON daily_gains;
DROP POLICY IF EXISTS "Users can insert own daily gains" ON daily_gains;

DROP POLICY IF EXISTS "Users can view own investment history" ON investment_history;
DROP POLICY IF EXISTS "Users can insert own investment history" ON investment_history;

-- Create consistent policies for user_profiles
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

-- Create consistent policies for user_settings
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

-- Create consistent policies for ai_characters
CREATE POLICY "Users can view their own characters"
  ON ai_characters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own characters"
  ON ai_characters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters"
  ON ai_characters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters"
  ON ai_characters
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create consistent policies for recordings
CREATE POLICY "Users can view their own recordings"
  ON recordings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recordings"
  ON recordings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recordings"
  ON recordings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recordings"
  ON recordings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create consistent policies for interactions
CREATE POLICY "Users can view their own interactions"
  ON interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create consistent policies for investment_plans
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

-- Create consistent policies for daily_gains
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

-- Create consistent policies for investment_history
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

-- Ensure all tables have RLS enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_gains ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_history ENABLE ROW LEVEL SECURITY;