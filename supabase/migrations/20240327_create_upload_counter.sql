-- Create a function to increment the upload count
CREATE OR REPLACE FUNCTION increment_upload_count()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO app_stats (id, upload_count)
  VALUES (1, 1)
  ON CONFLICT (id) DO UPDATE
  SET upload_count = app_stats.upload_count + 1;
END;
$$; 