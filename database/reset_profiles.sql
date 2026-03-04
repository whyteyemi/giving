USE asa;

-- Drop indices first to avoid issues
DROP INDEX IF EXISTS idx_profiles_email ON profiles;
DROP INDEX IF EXISTS idx_profiles_role ON profiles;

-- Drop table and recreate correctly
DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'volunteer', 'user') NOT NULL DEFAULT 'user',
  location TEXT,
  phone VARCHAR(50),
  department VARCHAR(100),
  position VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
