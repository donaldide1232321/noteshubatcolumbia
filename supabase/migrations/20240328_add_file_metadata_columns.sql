-- Add file metadata columns to uploads table
ALTER TABLE uploads
ADD COLUMN IF NOT EXISTS file_size bigint,
ADD COLUMN IF NOT EXISTS mime_type text; 