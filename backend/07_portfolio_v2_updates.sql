-- Portfolio 2.0 Updates

-- Add new columns to ai_portfolios
ALTER TABLE ai_portfolios 
ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS last_voice_session TIMESTAMP,
ADD COLUMN IF NOT EXISTS custom_username VARCHAR(100) UNIQUE;

-- Add verified column to skill_assessments
ALTER TABLE skill_assessments
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Create an index for custom_username
CREATE INDEX IF NOT EXISTS idx_portfolios_custom_username ON ai_portfolios(custom_username);
