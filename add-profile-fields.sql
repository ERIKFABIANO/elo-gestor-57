-- SQL script to add new profile fields to the profiles table
-- Run this in your Supabase SQL Editor

-- Add new columns to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20);

-- Update the grant admin script as well
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'erikfabiano082@gmail.com';

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;