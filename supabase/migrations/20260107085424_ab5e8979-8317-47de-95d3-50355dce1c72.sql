-- website for testvaliant
-- Add paragraph4 and paragraph5 columns to about_content table
ALTER TABLE public.about_content 
ADD COLUMN IF NOT EXISTS paragraph4 text DEFAULT '',
ADD COLUMN IF NOT EXISTS paragraph5 text DEFAULT '';
