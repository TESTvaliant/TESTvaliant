-- website for testvaliant
-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true);

-- Allow public read access to site images
CREATE POLICY "Public can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Allow authenticated uploads (we'll use service role in edge function)
CREATE POLICY "Service role can upload site images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Service role can update site images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-images');

CREATE POLICY "Service role can delete site images"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-images');
