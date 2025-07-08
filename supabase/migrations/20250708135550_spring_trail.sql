/*
  # Fix Authentication System for Contact Number Login

  1. Updates
    - Fix the handle_new_user function to properly create profiles
    - Add better error handling for profile creation
    - Ensure user_settings are created for new users

  2. Security
    - Maintain existing RLS policies
    - Add additional policies for better access control
*/

-- Update the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile
  INSERT INTO public.user_profiles (id, full_name, contact_number)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'contact_number', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(new.raw_user_meta_data->>'full_name', user_profiles.full_name),
    contact_number = COALESCE(new.raw_user_meta_data->>'contact_number', user_profiles.contact_number),
    updated_at = now();

  -- Insert user settings
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add additional RLS policies for better access control
CREATE POLICY IF NOT EXISTS "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add policies for user_settings
CREATE POLICY IF NOT EXISTS "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to find user by contact number
CREATE OR REPLACE FUNCTION public.find_user_by_contact(contact_num text)
RETURNS TABLE(user_id uuid, user_email text) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id as user_id,
    au.email as user_email
  FROM user_profiles up
  JOIN auth.users au ON up.id = au.id
  WHERE up.contact_number = contact_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;