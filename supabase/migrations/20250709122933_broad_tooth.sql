/*
  # Fix Authentication System

  This migration fixes the authentication system to properly handle:
  1. Email-based authentication (with optional email)
  2. Contact number as separate field
  3. Proper RLS policies
  4. Clean data structure

  ## Changes Made
  1. Update RLS policies to work with proper email authentication
  2. Ensure contact numbers are stored as contact numbers, not emails
  3. Allow email field to be optional in user_profiles
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile during signup" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

-- Create proper RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Update the handle_new_user function to work with proper email auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile with data from user metadata
  INSERT INTO public.user_profiles (id, full_name, contact_number, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'contact_number', ''),
    COALESCE(new.raw_user_meta_data->>'actual_email', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(new.raw_user_meta_data->>'full_name', user_profiles.full_name),
    contact_number = COALESCE(new.raw_user_meta_data->>'contact_number', user_profiles.contact_number),
    email = COALESCE(new.raw_user_meta_data->>'actual_email', user_profiles.email),
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

-- Create index on contact_number for faster lookups during login
CREATE INDEX IF NOT EXISTS idx_user_profiles_contact_number 
ON user_profiles(contact_number);

-- Function to help with contact number login (for reference, not used in current implementation)
CREATE OR REPLACE FUNCTION public.get_user_by_contact(contact_num text)
RETURNS TABLE(user_id uuid, auth_email text) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id as user_id,
    au.email as auth_email
  FROM user_profiles up
  JOIN auth.users au ON up.id = au.id
  WHERE up.contact_number = contact_num
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;