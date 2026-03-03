-- website for testvaliant
-- Add is_visible column to google_reviews table
ALTER TABLE public.google_reviews 
ADD COLUMN is_visible boolean NOT NULL DEFAULT true;
