-- AI Portfolio Tables

-- AI Portfolios Table
CREATE TABLE IF NOT EXISTS ai_portfolios (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    public_id VARCHAR(100) UNIQUE NOT NULL,
    voice_choice VARCHAR(20) DEFAULT 'female',
    bio TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verifications Table
CREATE TABLE IF NOT EXISTS verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'certification', 'company_email', 'resume'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    data JSONB DEFAULT '{}'::jsonb, -- cert details, email, etc.
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skill Assessments Table
CREATE TABLE IF NOT EXISTS skill_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'passed', 'failed'
    score INTEGER,
    quiz_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visitor Logs Table
CREATE TABLE IF NOT EXISTS visitor_logs (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES ai_portfolios(id) ON DELETE CASCADE,
    visitor_email VARCHAR(255) NOT NULL,
    visitor_company VARCHAR(255) NOT NULL,
    summary TEXT,
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for public portfolio lookup
CREATE INDEX IF NOT EXISTS idx_portfolios_public_id ON ai_portfolios(public_id);
