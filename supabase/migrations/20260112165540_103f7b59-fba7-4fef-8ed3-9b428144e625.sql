-- website for testvaliant
-- Add content column to open_learning_tracks for rich HTML content (same as blogs)
ALTER TABLE public.open_learning_tracks 
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT;
