-- website for testvaliant
-- Create inquiries table to store form submissions
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow the edge function (service role) to insert
CREATE POLICY "Service role can insert inquiries"
ON public.inquiries
FOR INSERT
WITH CHECK (true);

-- Admins can view all inquiries
CREATE POLICY "Admins can view inquiries"
ON public.inquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete inquiries
CREATE POLICY "Admins can delete inquiries"
ON public.inquiries
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
