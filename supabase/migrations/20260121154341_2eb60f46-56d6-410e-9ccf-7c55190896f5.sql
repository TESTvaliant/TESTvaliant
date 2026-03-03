-- website for testvaliant
-- Add new fields to hero_content for the redesigned hero section
ALTER TABLE public.hero_content 
ADD COLUMN IF NOT EXISTS subline text NOT NULL DEFAULT 'Free learning and insights on English, exams such as IELTS and TOEFL, and education pathways — built from 4.5+ years of teaching experience.',
ADD COLUMN IF NOT EXISTS micro_text text NOT NULL DEFAULT 'Public learning initiative • Built from real classroom experience • No paid services',
ADD COLUMN IF NOT EXISTS explainer_line text NOT NULL DEFAULT 'Many capable students struggle not because of ability, but because language barriers, exam systems, and missing information block their progress. This initiative exists to help make those systems clearer.';
