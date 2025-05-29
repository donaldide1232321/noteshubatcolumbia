-- Drop all existing tables and start fresh
DROP TABLE IF EXISTS uploads CASCADE;
DROP TABLE IF EXISTS app_stats CASCADE;

-- Create a simplified uploads table
CREATE TABLE uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    course TEXT NOT NULL,
    professor TEXT NOT NULL,
    file_type TEXT NOT NULL,
    label TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_size BIGINT,
    mime_type TEXT,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0
);

-- Create a simple app_stats table for tracking total uploads
CREATE TABLE app_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    upload_count INTEGER DEFAULT 0
);

-- Insert initial app stats
INSERT INTO app_stats (id, upload_count) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Function to increment upload count
CREATE OR REPLACE FUNCTION increment_upload_count()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO app_stats (id, upload_count)
    VALUES (1, 1)
    ON CONFLICT (id) DO UPDATE
    SET upload_count = app_stats.upload_count + 1;
END;
$$;

-- Enable RLS
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_stats ENABLE ROW LEVEL SECURITY;

-- Create simple, open policies for uploads
CREATE POLICY "Open access for uploads"
ON uploads FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Create simple, open policies for app_stats
CREATE POLICY "Open access for app_stats"
ON app_stats FOR ALL
TO anon
USING (true)
WITH CHECK (true); 