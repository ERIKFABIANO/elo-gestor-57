-- SQL script to grant admin access to erikfabiano082@gmail.com
-- Run this in your Supabase SQL Editor

UPDATE profiles 
SET role = 'admin' 
WHERE email = 'erikfabiano082@gmail.com';

-- Verify the update
SELECT * FROM profiles WHERE email = 'erikfabiano082@gmail.com';