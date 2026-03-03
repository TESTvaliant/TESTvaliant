-- website for testvaliant
-- Add embed_code column to google_reviews_settings table
ALTER TABLE public.google_reviews_settings 
ADD COLUMN IF NOT EXISTS embed_code TEXT;
