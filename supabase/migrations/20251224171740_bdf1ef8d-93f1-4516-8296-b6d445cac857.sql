-- website for testvaliant
-- Site Settings (navbar, footer, contact info)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hero Section
CREATE TABLE public.hero_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  badge_text TEXT NOT NULL DEFAULT 'Welcome to TESTvaliant',
  heading_line1 TEXT NOT NULL DEFAULT 'Unlock Your',
  heading_highlight TEXT NOT NULL DEFAULT 'Potential',
  heading_line2 TEXT NOT NULL DEFAULT 'with TESTvaliant',
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hero Background Images
CREATE TABLE public.hero_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- About Section
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  heading_line1 TEXT NOT NULL DEFAULT 'Transforming',
  heading_highlight TEXT NOT NULL DEFAULT 'Education',
  heading_line2 TEXT NOT NULL DEFAULT 'One Student at a Time',
  paragraph1 TEXT NOT NULL,
  paragraph2 TEXT NOT NULL,
  paragraph3 TEXT NOT NULL,
  youtube_url TEXT NOT NULL DEFAULT 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- About Stats
CREATE TABLE public.about_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Founder Section
CREATE TABLE public.founder_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  quote TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT 'Dr. Rajesh Kumar',
  title TEXT NOT NULL DEFAULT 'Founder & Chief Mentor',
  bio_paragraph1 TEXT NOT NULL,
  bio_paragraph2 TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Learners Track Videos
CREATE TABLE public.learner_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_id TEXT NOT NULL,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- YouTube Channels
CREATE TABLE public.youtube_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  description TEXT NOT NULL,
  color_from TEXT NOT NULL DEFAULT 'red-500',
  color_to TEXT NOT NULL DEFAULT 'rose-600',
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT NOT NULL,
  story TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Testimonials Section Settings
CREATE TABLE public.testimonials_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_url TEXT NOT NULL DEFAULT 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Differentiators
CREATE TABLE public.differentiators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Blogs
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- FAQs
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CTA Section
CREATE TABLE public.cta_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  heading_line1 TEXT NOT NULL DEFAULT 'Ready to Start Your',
  heading_highlight TEXT NOT NULL DEFAULT 'Success Journey?',
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Footer Content
CREATE TABLE public.footer_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tagline TEXT NOT NULL DEFAULT 'Empowering students to achieve their dreams through quality education and personalized guidance.',
  email TEXT NOT NULL DEFAULT 'hello@testvaliant.com',
  phone TEXT NOT NULL DEFAULT '+91 98765 43210',
  address TEXT NOT NULL DEFAULT 'Delhi, India',
  copyright_text TEXT NOT NULL DEFAULT '© 2024 TESTvaliant. All rights reserved.',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Social Links
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founder_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.differentiators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cta_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (website visitors can view)
CREATE POLICY "Anyone can read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can read hero_content" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Anyone can read hero_images" ON public.hero_images FOR SELECT USING (true);
CREATE POLICY "Anyone can read about_content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Anyone can read about_stats" ON public.about_stats FOR SELECT USING (true);
CREATE POLICY "Anyone can read founder_content" ON public.founder_content FOR SELECT USING (true);
CREATE POLICY "Anyone can read learner_tracks" ON public.learner_tracks FOR SELECT USING (true);
CREATE POLICY "Anyone can read youtube_channels" ON public.youtube_channels FOR SELECT USING (true);
CREATE POLICY "Anyone can read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Anyone can read testimonials_settings" ON public.testimonials_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can read differentiators" ON public.differentiators FOR SELECT USING (true);
CREATE POLICY "Anyone can read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Anyone can read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Anyone can read cta_content" ON public.cta_content FOR SELECT USING (true);
CREATE POLICY "Anyone can read footer_content" ON public.footer_content FOR SELECT USING (true);
CREATE POLICY "Anyone can read social_links" ON public.social_links FOR SELECT USING (true);

-- Create policies for write access (admin only - using service role key in admin panel)
CREATE POLICY "Service role can manage site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage hero_content" ON public.hero_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage hero_images" ON public.hero_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage about_content" ON public.about_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage about_stats" ON public.about_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage founder_content" ON public.founder_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage learner_tracks" ON public.learner_tracks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage youtube_channels" ON public.youtube_channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage testimonials" ON public.testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage testimonials_settings" ON public.testimonials_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage differentiators" ON public.differentiators FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage blogs" ON public.blogs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage faqs" ON public.faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage cta_content" ON public.cta_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage footer_content" ON public.footer_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage social_links" ON public.social_links FOR ALL USING (true) WITH CHECK (true);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON public.hero_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_founder_content_updated_at BEFORE UPDATE ON public.founder_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_settings_updated_at BEFORE UPDATE ON public.testimonials_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cta_content_updated_at BEFORE UPDATE ON public.cta_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_footer_content_updated_at BEFORE UPDATE ON public.footer_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
