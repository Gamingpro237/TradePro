/*
  # Add contact_number to user_profiles table

  1. Schema Changes
    - Add `contact_number` column to `user_profiles` table
    - Update the `handle_new_user` function to properly handle the contact number

  2. Security
    - Maintain existing RLS policies
    - No changes to existing security setup
*/

-- Add contact_number column to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'contact_number'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN contact_number text;
  END IF;
END $$;

-- Update the handle_new_user function to properly handle contact_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, contact_number)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'contact_number'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists (recreate if needed)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();