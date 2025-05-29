-- First, drop ALL policies
DROP POLICY IF EXISTS "Anyone can insert uploads" ON uploads;
DROP POLICY IF EXISTS "Anyone can view uploads" ON uploads;
DROP POLICY IF EXISTS "Anyone can update uploads" ON uploads;
DROP POLICY IF EXISTS "Anyone can delete uploads" ON uploads;
DROP POLICY IF EXISTS "Users can insert their own uploads" ON uploads;
DROP POLICY IF EXISTS "Authenticated users can view all uploads" ON uploads;
DROP POLICY IF EXISTS "Users can update their own uploads" ON uploads;
DROP POLICY IF EXISTS "Users can delete their own uploads" ON uploads;
DROP POLICY IF EXISTS "Public read access" ON uploads;
DROP POLICY IF EXISTS "Users can insert uploads" ON uploads;

-- Disable RLS temporarily
ALTER TABLE uploads DISABLE ROW LEVEL SECURITY;

-- Drop any foreign key constraints on user_id
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'uploads'
        AND constraint_name LIKE '%user_id%'
    ) THEN
        ALTER TABLE uploads DROP CONSTRAINT IF EXISTS uploads_user_id_fkey;
    END IF;
END $$;

-- Create a new temporary column
ALTER TABLE uploads ADD COLUMN temp_user_id text;

-- Update the temporary column with existing values
UPDATE uploads SET temp_user_id = user_id::text;

-- Drop the old column
ALTER TABLE uploads DROP COLUMN user_id;

-- Rename the temporary column to user_id
ALTER TABLE uploads RENAME COLUMN temp_user_id TO user_id;

-- Add file metadata columns
ALTER TABLE uploads
ADD COLUMN IF NOT EXISTS file_size bigint,
ADD COLUMN IF NOT EXISTS mime_type text;

-- Re-enable RLS
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create new policies
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