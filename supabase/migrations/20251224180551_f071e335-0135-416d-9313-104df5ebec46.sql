-- website for testvaliant
-- Update storage policies to allow admin users to upload images

-- First, drop existing service role policies
DROP POLICY IF EXISTS "Service role can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete images" ON storage.objects;

-- Create new policies for admin users to manage storage
CREATE POLICY "Admins can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-images' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-images' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-images' 
  AND public.has_role(auth.uid(), 'admin')
);
