-- 01_migration_subscriptions.sql
-- JobNinjas Subscription and Interview Schema Update

-- 1. Ensure ninja_plans exists with all required columns
CREATE TABLE IF NOT EXISTS ninja_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    plan_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(50) DEFAULT 'inactive',
    calls_per_period INTEGER DEFAULT 0,
    calls_remaining INTEGER DEFAULT 0,
    billing_period_start TIMESTAMP,
    billing_period_end TIMESTAMP,
    current_streak INTEGER DEFAULT 0,
    last_completed_day TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create payment_events for idempotency
CREATE TABLE IF NOT EXISTS payment_events (
    id SERIAL PRIMARY KEY,
    webhook_id TEXT UNIQUE,
    event_type TEXT,
    payload JSONB,
    signature_valid BOOLEAN,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processing_error TEXT
);

-- Ensure columns exist in payment_events if it was created earlier
ALTER TABLE payment_events ADD COLUMN IF NOT EXISTS webhook_id TEXT;
ALTER TABLE payment_events ADD COLUMN IF NOT EXISTS event_type TEXT;
ALTER TABLE payment_events ADD COLUMN IF NOT EXISTS payload JSONB;
ALTER TABLE payment_events ADD COLUMN IF NOT EXISTS signature_valid BOOLEAN;
ALTER TABLE payment_events ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE payment_events ADD COLUMN IF NOT EXISTS processing_error TEXT;

-- 3. Ensure interviews table exists and has required columns
-- If it doesn't exist, we create it. If it does, we add columns.
CREATE TABLE IF NOT EXISTS interviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'scheduled',
    day_number INTEGER,
    phase VARCHAR(50),
    question_count INTEGER,
    questions JSONB DEFAULT '[]'::jsonb,
    vapi_call_id TEXT,
    transcript TEXT,
    feedback JSONB DEFAULT '{}'::jsonb,
    recording_url TEXT,
    duration_seconds INTEGER,
    ended_reason TEXT,
    completed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add columns if missing (in case table already existed from a different context)
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS vapi_call_id      TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS transcript        TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS feedback          JSONB DEFAULT '{}'::jsonb;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS recording_url     TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS duration_seconds  INT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS ended_reason      TEXT;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS completed_at      TIMESTAMPTZ;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS metadata          JSONB DEFAULT '{}'::jsonb;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS day_number        INTEGER;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS phase             VARCHAR(50);
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS question_count    INTEGER;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS questions         JSONB DEFAULT '[]'::jsonb;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_interviews_vapi_call_id ON interviews (vapi_call_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews (user_id);
CREATE INDEX IF NOT EXISTS idx_ninja_plans_user_id ON ninja_plans (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_webhook_id ON payment_events (webhook_id);

-- 5. Cleanup legacy tables (optional but keeps things clean)
-- DROP TABLE IF EXISTS call_attempts;
-- DROP TABLE IF EXISTS call_results;
