-- 02_add_sessions_to_roadmaps.sql
ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS sessions JSONB DEFAULT '[]'::jsonb;
