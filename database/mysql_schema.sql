-- =====================================================
-- GIVING WITHOUT LIMIT - MYSQL DATABASE SCHEMA (asa)
-- =====================================================

CREATE DATABASE IF NOT EXISTS asa;
USE asa;

-- 1. PROFILES TABLE
-- Replaces Supabase Auth metadata + profiles table
CREATE TABLE IF NOT EXISTS profiles (
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

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATETIME NOT NULL,
  location TEXT,
  status VARCHAR(20) DEFAULT 'upcoming', -- 'upcoming', 'past', 'cancelled'
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. EVENT MEDIA TABLE
CREATE TABLE IF NOT EXISTS event_media (
  id VARCHAR(36) PRIMARY KEY,
  event_id VARCHAR(36),
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) NOT NULL, -- 'image', 'video', 'audio'
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 4. HELP ME CAMPAIGNS (Special Fundraising)
CREATE TABLE IF NOT EXISTS help_me_campaigns (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  closing_date DATETIME,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'closed'
  beneficiary_name VARCHAR(255),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. VOLUNTEER APPLICATIONS
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  interest_area VARCHAR(255),
  bio TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'disapproved'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. DONATIONS table
CREATE TABLE IF NOT EXISTS donations (
  id VARCHAR(36) PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  campaign_id VARCHAR(36),
  status VARCHAR(20) DEFAULT 'success', -- 'pending', 'success', 'failed'
  payment_id VARCHAR(255), -- external payment reference
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES help_me_campaigns(id) ON DELETE SET NULL
);

-- 7. IMPACT RECORDS (Media, Videos, Stories for Impact Page)
CREATE TABLE IF NOT EXISTS impact_records (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(20) NOT NULL, -- 'image', 'video', 'story'
  title VARCHAR(255) NOT NULL,
  content TEXT,
  media_url TEXT,
  thumbnail_url TEXT,
  category VARCHAR(50), -- 'general', 'feeding', 'recovery', 'widows', 'education'
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_campaigns_status ON help_me_campaigns(status);
