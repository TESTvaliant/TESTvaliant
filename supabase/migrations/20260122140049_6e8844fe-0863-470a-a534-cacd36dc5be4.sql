-- website for testvaliant
-- Create google_reviews table
CREATE TABLE public.google_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  reviewer_image_url TEXT,
  review_date DATE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Google reviews are viewable by everyone" 
ON public.google_reviews 
FOR SELECT 
USING (true);

-- Allow admin insert/update/delete (admins only through authenticated session)
CREATE POLICY "Admins can manage google reviews" 
ON public.google_reviews 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Create google_reviews_settings table for section settings
CREATE TABLE public.google_reviews_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_title TEXT NOT NULL DEFAULT 'What Our Students Say on Google',
  total_reviews_count INTEGER DEFAULT 0,
  google_place_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_reviews_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Google reviews settings are viewable by everyone" 
ON public.google_reviews_settings 
FOR SELECT 
USING (true);

-- Allow admin update
CREATE POLICY "Admins can manage google reviews settings" 
ON public.google_reviews_settings 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Insert default settings
INSERT INTO public.google_reviews_settings (section_title, total_reviews_count)
VALUES ('What Our Students Say on Google', 111);

-- Create trigger for automatic timestamp updates on google_reviews
CREATE TRIGGER update_google_reviews_updated_at
BEFORE UPDATE ON public.google_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on google_reviews_settings
CREATE TRIGGER update_google_reviews_settings_updated_at
BEFORE UPDATE ON public.google_reviews_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
