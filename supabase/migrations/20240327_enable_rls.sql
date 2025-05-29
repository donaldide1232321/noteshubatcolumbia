-- Enable RLS on uploads table
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own uploads"
ON public.uploads
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view all uploads"
ON public.uploads
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can update their own uploads"
ON public.uploads
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads"
ON public.uploads
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Enable RLS on storage.objects (for file storage)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Add storage policies
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated users can read files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'uploads');

CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text); 