-- website for testvaliant
-- Create open_learning_tracks table for the 3 main tracks
CREATE TABLE public.open_learning_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  intro_text TEXT NOT NULL,
  why_matters_title TEXT NOT NULL DEFAULT 'Why it matters',
  why_matters_content TEXT NOT NULL,
  how_we_learn_title TEXT NOT NULL DEFAULT 'What we cover',
  how_we_learn_content TEXT NOT NULL,
  bottom_text TEXT,
  cta_text TEXT,
  cta_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.open_learning_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read open_learning_tracks" 
ON public.open_learning_tracks 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage open_learning_tracks" 
ON public.open_learning_tracks 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert the 3 tracks with the provided content
INSERT INTO public.open_learning_tracks (sort_order, title, youtube_id, intro_text, why_matters_title, why_matters_content, how_we_learn_title, how_we_learn_content, bottom_text) VALUES
(1, 'English and Communication Skills', 'dQw4w9WgXcQ', 
'In many fields, English acts as a gatekeeper. You may be capable and hardworking, but language barriers can still limit access to education, careers, and confidence.

This track focuses on English as a practical life skill — not memorized rules. The goal is to help learners use English clearly and confidently in real situations.',
'Why it matters',
'**Education:** Much of global learning and research happens in English.

**Careers:** Your technical skills get you the interview, but your communication skills get you the job. Clear English helps in interviews, meetings, and professional growth.

**Confidence:** Clear language helps you be understood in everyday and professional settings.',
'How we learn',
'Resources are built from real classroom experience and support all levels:

**Foundational:** For learners starting out

**Advanced:** For academic and professional communication',
'The aim is simple: make sure ability and effort aren''t held back by language gaps.'),

(2, 'Global English Proficiency Exams', 'dQw4w9WgXcQ',
'For many students and professionals, exams like IELTS or TOEFL are the final gate to studying, working, or migrating abroad. These tests don''t just measure English — they measure how well you understand the exam system itself.

This track helps you make sense of global English exams and prepare with clarity, not confusion.',
'Why it matters',
'Taking the wrong test or misunderstanding the format can cost you time and money. We use real teaching experience to help you approach your exam informed and confident—not overwhelmed.

**Exams covered:** IELTS • TOEFL • PTE • CELPIP • UKVI',
'What we cover',
'**Choosing the Right Exam:** Identifying which test fits your goal (study, work, or migration). We provide detailed guides on our channel to help you decide.

**Focused Preparation:** Learning the exam format and logic so you can perform under pressure without relying on shortcuts.

**Understanding Scores:** Breaking down what a "Band 7" or a "PTE 65" actually means for your application.',
NULL),

(3, 'TESTvaliant - Be Informed', 'dQw4w9WgXcQ',
'Many education and career decisions are made without clear or complete information.

People often know what they want — a better career, a good college, or global exposure — but struggle to understand how these systems actually work and what different paths lead to over time.

The Be Informed series focuses on explaining education, careers, and global pathways beyond surface-level advice.',
'Why this matters',
'With more options than ever, it''s easy to prepare for the wrong exams, choose misaligned paths, or misunderstand long-term outcomes.

This series exists to make these systems clearer — so decisions are based on understanding, not assumptions.',
'What we cover',
'**Know Thy Career:** Understanding career paths beyond job titles and short-term outcomes

**Know Thy College:** Looking past rankings to understand real value and results

**Know Thy Country:** Making sense of education, work, and opportunity structures across countries',
NULL);
