-- Add missing profile fields for AI Portfolio
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
