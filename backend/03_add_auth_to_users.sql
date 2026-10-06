-- 03_add_auth_to_users.sql
-- Adding authentication columns to the users table for native RDS auth

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS referral_code TEXT,
ADD COLUMN IF NOT EXISTS referred_by TEXT;

-- Also add helpful indexes for auth performance
CREATE INDEX IF NOT EXISTS idx_users_email_auth ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users (verification_token);
