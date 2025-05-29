-- Add upload_count column to app_stats
ALTER TABLE app_stats
ADD COLUMN IF NOT EXISTS upload_count integer DEFAULT 0;

-- Initialize the counter if not already set
UPDATE app_stats
SET upload_count = (SELECT COUNT(*) FROM uploads)
WHERE id = 1; 