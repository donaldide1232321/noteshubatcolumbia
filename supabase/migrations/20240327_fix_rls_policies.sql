-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own uploads" ON uploads;
DROP POLICY IF EXISTS "Authenticated users can view all uploads" ON uploads;
DROP POLICY IF EXISTS "Users can update their own uploads" ON uploads;
DROP POLICY IF EXISTS "Users can delete their own uploads" ON uploads;

-- Enable RLS on the uploads table
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Policy for inserting uploads (authenticated users can insert)
CREATE POLICY "Users can insert their own uploads"
ON uploads FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for viewing uploads (authenticated users can view all uploads)
CREATE POLICY "Authenticated users can view all uploads"
ON uploads FOR SELECT 
TO authenticated
USING (true);

-- Policy for updating uploads (users can only update their own uploads)
CREATE POLICY "Users can update their own uploads"
ON uploads FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for deleting uploads (users can only delete their own uploads)
CREATE POLICY "Users can delete their own uploads"
ON uploads FOR DELETE 
TO authenticated
USING (auth.uid() = user_id); 