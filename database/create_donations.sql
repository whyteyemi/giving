-- =====================================================
-- GIVING WITHOUT LIMIT - DONATIONS TABLE (Enhanced for Stripe)
-- Run this in phpMyAdmin on the `asa` database
-- =====================================================

USE asa;

-- Drop existing donations table if it needs to be recreated
DROP TABLE IF EXISTS donations;

-- DONATIONS TABLE (Enhanced with Stripe fields)
CREATE TABLE IF NOT EXISTS donations (
  id VARCHAR(36) PRIMARY KEY,
  
  -- Donor Info
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- Payment Details
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'usd',
  frequency ENUM('one-time', 'monthly') NOT NULL DEFAULT 'one-time',
  program VARCHAR(255) DEFAULT 'General Fund (Most Needed)',
  
  -- Stripe References
  stripe_payment_intent_id VARCHAR(255),     -- Stripe PaymentIntent ID (pi_...)
  stripe_customer_id VARCHAR(255),            -- Stripe Customer ID (cus_...)
  stripe_subscription_id VARCHAR(255),        -- For monthly donations (sub_...)
  
  -- Status Tracking
  status ENUM('pending', 'succeeded', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
  
  -- Optional
  message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_donations_email ON donations(email);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_stripe_pi ON donations(stripe_payment_intent_id);
CREATE INDEX idx_donations_created ON donations(created_at);
