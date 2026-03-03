-- website for testvaliant
-- Add slug and channel_url columns to open_learning_tracks table
ALTER TABLE public.open_learning_tracks 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS channel_name text,
ADD COLUMN IF NOT EXISTS channel_url text;

-- Generate slugs for existing tracks based on title
UPDATE public.open_learning_tracks 
SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;
