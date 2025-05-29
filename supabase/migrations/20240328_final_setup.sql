-- First, drop existing upload policies
DROP POLICY IF EXISTS "Anyone can insert uploads" ON uploads;
DROP POLICY IF EXISTS "Anyone can view uploads" ON uploads;
DROP POLICY IF EXISTS "Anyone can update uploads" ON uploads;
DROP POLICY IF EXISTS "Anyone can delete uploads" ON uploads;
DROP POLICY IF EXISTS "Users can insert their own uploads" ON uploads;
DROP POLICY IF EXISTS "Authenticated users can view all uploads" ON uploads;
DROP POLICY IF EXISTS "Users can update their own uploads" ON uploads;
DROP POLICY IF EXISTS "Users can delete their own uploads" ON uploads;

-- Add file metadata columns to uploads table
ALTER TABLE uploads
ADD COLUMN IF NOT EXISTS file_size bigint,
ADD COLUMN IF NOT EXISTS mime_type text;

-- Enable RLS on uploads table
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create new policies for uploads table
CREATE POLICY "Anyone can insert uploads"
ON uploads FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can view uploads"
ON uploads FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Anyone can update uploads"
ON uploads FOR UPDATE 
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete uploads"
ON uploads FOR DELETE 
TO anon
USING (true); 