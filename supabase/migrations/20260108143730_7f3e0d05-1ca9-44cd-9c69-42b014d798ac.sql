-- website for testvaliant
-- Add content column for full blog content with rich text (HTML)
ALTER TABLE public.blogs 
ADD COLUMN content TEXT DEFAULT '';

-- Add slug column for URL-friendly blog URLs
ALTER TABLE public.blogs 
ADD COLUMN slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX idx_blogs_slug ON public.blogs(slug) WHERE slug IS NOT NULL;
