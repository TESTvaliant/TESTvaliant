-- website for testvaliant
-- Step 1: Create the app_role enum type
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Step 2: Create user_roles table to store role assignments
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Step 3: Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Policy for admins to view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Step 5: Policy for users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Step 6: Create the security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 7: Drop existing permissive "Service role can manage" policies and replace with admin-only policies

-- hero_content
DROP POLICY IF EXISTS "Service role can manage hero_content" ON public.hero_content;
CREATE POLICY "Admins can manage hero_content"
ON public.hero_content
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- hero_images
DROP POLICY IF EXISTS "Service role can manage hero_images" ON public.hero_images;
CREATE POLICY "Admins can manage hero_images"
ON public.hero_images
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- about_content
DROP POLICY IF EXISTS "Service role can manage about_content" ON public.about_content;
CREATE POLICY "Admins can manage about_content"
ON public.about_content
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- about_stats
DROP POLICY IF EXISTS "Service role can manage about_stats" ON public.about_stats;
CREATE POLICY "Admins can manage about_stats"
ON public.about_stats
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- founder_content
DROP POLICY IF EXISTS "Service role can manage founder_content" ON public.founder_content;
CREATE POLICY "Admins can manage founder_content"
ON public.founder_content
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- testimonials
DROP POLICY IF EXISTS "Service role can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- testimonials_settings
DROP POLICY IF EXISTS "Service role can manage testimonials_settings" ON public.testimonials_settings;
CREATE POLICY "Admins can manage testimonials_settings"
ON public.testimonials_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- differentiators
DROP POLICY IF EXISTS "Service role can manage differentiators" ON public.differentiators;
CREATE POLICY "Admins can manage differentiators"
ON public.differentiators
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- learner_tracks
DROP POLICY IF EXISTS "Service role can manage learner_tracks" ON public.learner_tracks;
CREATE POLICY "Admins can manage learner_tracks"
ON public.learner_tracks
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- faqs
DROP POLICY IF EXISTS "Service role can manage faqs" ON public.faqs;
CREATE POLICY "Admins can manage faqs"
ON public.faqs
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- blogs
DROP POLICY IF EXISTS "Service role can manage blogs" ON public.blogs;
CREATE POLICY "Admins can manage blogs"
ON public.blogs
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- youtube_channels
DROP POLICY IF EXISTS "Service role can manage youtube_channels" ON public.youtube_channels;
CREATE POLICY "Admins can manage youtube_channels"
ON public.youtube_channels
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- social_links
DROP POLICY IF EXISTS "Service role can manage social_links" ON public.social_links;
CREATE POLICY "Admins can manage social_links"
ON public.social_links
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- footer_content
DROP POLICY IF EXISTS "Service role can manage footer_content" ON public.footer_content;
CREATE POLICY "Admins can manage footer_content"
ON public.footer_content
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- cta_content
DROP POLICY IF EXISTS "Service role can manage cta_content" ON public.cta_content;
CREATE POLICY "Admins can manage cta_content"
ON public.cta_content
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings
DROP POLICY IF EXISTS "Service role can manage site_settings" ON public.site_settings;
CREATE POLICY "Admins can manage site_settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
