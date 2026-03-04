-- ============================================================
-- REPAIR ADMIN USER SCRIPT
-- Run this in Supabase SQL Editor to fix your stuck account
-- ============================================================

-- 1. First, verify the correct role constraints exist
DO $$ BEGIN
    -- Ensure the correct enum exists (if you missed the previous script)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('admin', 'staff', 'volunteer', 'user');
    END IF;
END $$;

-- 2. Insert or Update the profile for your email
-- This fixes the issue if the profile is missing or has the wrong role
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Admin User'), 
    'admin'::user_role_enum  -- FORCE role to be 'admin'
FROM auth.users
WHERE email = 'osabiyemi@yahoo.com'
ON CONFLICT (id) DO UPDATE
SET 
    role = 'admin'::user_role_enum,
    updated_at = NOW();

-- 3. Confirm the fix
SELECT * FROM public.profiles WHERE email = 'osabiyemi@yahoo.com';
