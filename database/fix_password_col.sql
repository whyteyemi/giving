USE asa;

-- Fix the password_hash column to be long enough (bcrypt needs exactly 60 chars, VARCHAR(255) is safe)
ALTER TABLE profiles MODIFY COLUMN password_hash VARCHAR(255) NOT NULL;

-- Now set the correct hash using a known-good value
UPDATE profiles 
SET password_hash = '$2y$10$HDDJRHYOlflm/uDmW3SU/.24X7gc6ey/iOn0wjK.9yJFTqTDAIu2y'
WHERE email = 'osabiyemi@yahoo.com';

-- Verify
SELECT email, LENGTH(password_hash) AS hash_length, role FROM profiles WHERE email = 'osabiyemi@yahoo.com';
