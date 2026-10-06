
-- migration: 08_portfolio_usage.sql

CREATE TABLE IF NOT EXISTS portfolio_usage (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES ai_portfolios(id),
    visitor_email VARCHAR(255),
    seconds_used INTEGER DEFAULT 0,
    last_reset_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, visitor_email)
);
