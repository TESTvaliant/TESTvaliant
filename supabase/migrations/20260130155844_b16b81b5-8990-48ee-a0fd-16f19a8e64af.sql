-- website for testvaliant
-- Add role_color column to testimonials table for custom text color
ALTER TABLE public.testimonials 
ADD COLUMN role_color TEXT DEFAULT '#f59e0b';
