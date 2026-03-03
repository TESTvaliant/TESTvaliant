// website for testvaliant
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BLOG_LIST_COLUMNS = "id,title,excerpt,image_url,date,read_time,author,category,slug,created_at";
const BLOG_FULL_COLUMNS = `${BLOG_LIST_COLUMNS},content,sort_order`;
const OPEN_TRACK_LIST_COLUMNS = "id,slug,title,intro_text,image_url,channel_name,channel_url";
const OPEN_TRACK_FULL_COLUMNS =
  "id,slug,title,intro_text,image_url,channel_name,channel_url,youtube_id,why_matters_title,why_matters_content,how_we_learn_title,how_we_learn_content,bottom_text,cta_text,cta_link,content,sort_order,created_at,updated_at";
const HERO_CONTENT_COLUMNS =
  "id,badge_text,description,explainer_line,heading_highlight,heading_line1,heading_line2,micro_text,subline,created_at,updated_at";
const HERO_IMAGES_COLUMNS = "id,src,alt,sort_order,created_at";
const ABOUT_CONTENT_COLUMNS =
  "id,heading_line1,heading_highlight,heading_line2,paragraph1,paragraph2,paragraph3,paragraph4,paragraph5,youtube_url,created_at,updated_at";
const ABOUT_STATS_COLUMNS = "id,label,value,sort_order,created_at";
const FOUNDER_CONTENT_COLUMNS =
  "id,name,title,image_url,quote,bio_paragraph1,bio_paragraph2,created_at,updated_at";
const LEARNER_TRACK_COLUMNS = "id,youtube_id,title,sort_order,created_at";
const YOUTUBE_CHANNEL_COLUMNS = "id,name,url,description,thumbnail,color_from,color_to,sort_order,created_at";
const TESTIMONIAL_COLUMNS = "id,name,role,role_color,image_url,story,sort_order,created_at";
const TESTIMONIAL_SETTINGS_COLUMNS = "id,youtube_url,created_at,updated_at";
const DIFFERENTIATOR_COLUMNS = "id,title,description,sort_order,created_at";
const FAQ_COLUMNS = "id,question,answer,sort_order,created_at";
const CTA_CONTENT_COLUMNS = "id,heading_line1,heading_highlight,description,created_at,updated_at";
const FOOTER_CONTENT_COLUMNS = "id,tagline,address,phone,email,copyright_text,created_at,updated_at";
const SOCIAL_LINK_COLUMNS = "id,platform,url,sort_order,created_at";
const GOOGLE_REVIEW_COLUMNS =
  "id,reviewer_name,reviewer_image_url,review_date,rating,review_text,sort_order,is_visible,created_at,updated_at";
const GOOGLE_REVIEW_SETTINGS_COLUMNS = "id,section_title,total_reviews_count,google_place_id,embed_code,created_at,updated_at";
const GALLERY_IMAGE_COLUMNS = "id,image_url,alt_text,sort_order,created_at,updated_at";

export { BLOG_FULL_COLUMNS, OPEN_TRACK_FULL_COLUMNS };

// Hero Content
export const useHeroContent = () => {
  return useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_content")
        .select(HERO_CONTENT_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateHeroContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: any) => {
      const { data, error } = await supabase
        .from("hero_content")
        .update(content)
        .eq("id", content.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-content"] });
    },
  });
};

// Hero Images
export const useHeroImages = () => {
  return useQuery({
    queryKey: ["hero-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_images")
        .select(HERO_IMAGES_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateHeroImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image: any) => {
      const { data, error } = await supabase
        .from("hero_images")
        .update(image)
        .eq("id", image.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-images"] });
    },
  });
};

export const useAddHeroImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image: { src: string; alt: string; sort_order: number }) => {
      const { data, error } = await supabase
        .from("hero_images")
        .insert(image)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-images"] });
    },
  });
};

export const useDeleteHeroImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hero_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-images"] });
    },
  });
};

// About Content
export const useAboutContent = () => {
  return useQuery({
    queryKey: ["about-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select(ABOUT_CONTENT_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateAboutContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: any) => {
      const { data, error } = await supabase
        .from("about_content")
        .update(content)
        .eq("id", content.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-content"] });
    },
  });
};

// About Stats
export const useAboutStats = () => {
  return useQuery({
    queryKey: ["about-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_stats")
        .select(ABOUT_STATS_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateAboutStat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stat: any) => {
      const { data, error } = await supabase
        .from("about_stats")
        .update(stat)
        .eq("id", stat.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-stats"] });
    },
  });
};

// Founder Content
export const useFounderContent = () => {
  return useQuery({
    queryKey: ["founder-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("founder_content")
        .select(FOUNDER_CONTENT_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateFounderContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: any) => {
      const { data, error } = await supabase
        .from("founder_content")
        .update(content)
        .eq("id", content.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["founder-content"] });
    },
  });
};

// Learner Tracks
export const useLearnerTracks = () => {
  return useQuery({
    queryKey: ["learner-tracks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learner_tracks")
        .select(LEARNER_TRACK_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateLearnerTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (track: any) => {
      const { data, error } = await supabase
        .from("learner_tracks")
        .update(track)
        .eq("id", track.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner-tracks"] });
    },
  });
};

export const useAddLearnerTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (track: { youtube_id: string; title: string; sort_order: number }) => {
      const { data, error } = await supabase
        .from("learner_tracks")
        .insert(track)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner-tracks"] });
    },
  });
};

export const useDeleteLearnerTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("learner_tracks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner-tracks"] });
    },
  });
};

// Open Learning Tracks
export const useOpenLearningTracks = (options?: { includeFullContent?: boolean }) => {
  return useQuery({
    queryKey: ["open-learning-tracks"],
    queryFn: async () => {
      const columns = options?.includeFullContent ? OPEN_TRACK_FULL_COLUMNS : OPEN_TRACK_LIST_COLUMNS;
      const { data, error } = await supabase
        .from("open_learning_tracks")
        .select(columns)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateOpenLearningTrack = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (track: any) => {
      const { data, error } = await supabase
        .from("open_learning_tracks")
        .update(track)
        .eq("id", track.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["open-learning-tracks"] });
    },
  });
};

// YouTube Channels
export const useYoutubeChannels = () => {
  return useQuery({
    queryKey: ["youtube-channels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("youtube_channels")
        .select(YOUTUBE_CHANNEL_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateYoutubeChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (channel: any) => {
      const { data, error } = await supabase
        .from("youtube_channels")
        .update(channel)
        .eq("id", channel.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-channels"] });
    },
  });
};

export const useAddYoutubeChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (channel: any) => {
      const { data, error } = await supabase
        .from("youtube_channels")
        .insert(channel)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-channels"] });
    },
  });
};

export const useDeleteYoutubeChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("youtube_channels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtube-channels"] });
    },
  });
};

// Testimonials
export const useTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select(TESTIMONIAL_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (testimonial: any) => {
      const { data, error } = await supabase
        .from("testimonials")
        .update(testimonial)
        .eq("id", testimonial.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
};

export const useAddTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (testimonial: any) => {
      const { data, error } = await supabase
        .from("testimonials")
        .insert(testimonial)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
};

// Testimonials Settings
export const useTestimonialsSettings = () => {
  return useQuery({
    queryKey: ["testimonials-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials_settings")
        .select(TESTIMONIAL_SETTINGS_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateTestimonialsSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from("testimonials_settings")
        .update(settings)
        .eq("id", settings.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials-settings"] });
    },
  });
};

// Differentiators
export const useDifferentiators = () => {
  return useQuery({
    queryKey: ["differentiators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("differentiators")
        .select(DIFFERENTIATOR_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateDifferentiator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (diff: any) => {
      const { data, error } = await supabase
        .from("differentiators")
        .update(diff)
        .eq("id", diff.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["differentiators"] });
    },
  });
};

export const useAddDifferentiator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (diff: any) => {
      const { data, error } = await supabase
        .from("differentiators")
        .insert(diff)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["differentiators"] });
    },
  });
};

export const useDeleteDifferentiator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("differentiators").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["differentiators"] });
    },
  });
};

// Blogs
export const useBlogs = (limit?: number, options?: { includeContent?: boolean }) => {
  return useQuery({
    queryKey: ["blogs", limit, options?.includeContent ?? false],
    queryFn: async () => {
      const columns = options?.includeContent ? BLOG_FULL_COLUMNS : BLOG_LIST_COLUMNS;
      let query = supabase
        .from("blogs")
        .select(columns)
        .order("created_at", { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select(BLOG_FULL_COLUMNS)
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("category");
      if (error) throw error;
      const categoryRows = (data ?? []) as Array<{ category: string | null }>;
      const categories = [
        ...new Set(categoryRows.map((blog) => blog.category).filter((category): category is string => Boolean(category))),
      ];
      return categories;
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blog: any) => {
      const { data, error } = await supabase
        .from("blogs")
        .update(blog)
        .eq("id", blog.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useAddBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blog: any) => {
      const { data, error } = await supabase
        .from("blogs")
        .insert(blog)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
};

// FAQs
export const useFaqs = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select(FAQ_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (faq: any) => {
      const { data, error } = await supabase
        .from("faqs")
        .update(faq)
        .eq("id", faq.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

export const useAddFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (faq: any) => {
      const { data, error } = await supabase
        .from("faqs")
        .insert(faq)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

// CTA Content
export const useCtaContent = () => {
  return useQuery({
    queryKey: ["cta-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cta_content")
        .select(CTA_CONTENT_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateCtaContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: any) => {
      const { data, error } = await supabase
        .from("cta_content")
        .update(content)
        .eq("id", content.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cta-content"] });
    },
  });
};

// Footer Content
export const useFooterContent = () => {
  return useQuery({
    queryKey: ["footer-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("footer_content")
        .select(FOOTER_CONTENT_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateFooterContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: any) => {
      const { data, error } = await supabase
        .from("footer_content")
        .update(content)
        .eq("id", content.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footer-content"] });
    },
  });
};

// Social Links
export const useSocialLinks = () => {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select(SOCIAL_LINK_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateSocialLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (link: any) => {
      const { data, error } = await supabase
        .from("social_links")
        .update(link)
        .eq("id", link.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    },
  });
};

// Google Reviews
export const useGoogleReviews = () => {
  return useQuery({
    queryKey: ["google-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_reviews")
        .select(GOOGLE_REVIEW_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useAddGoogleReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: {
      reviewer_name: string;
      reviewer_image_url: string | null;
      review_date: string;
      rating: number;
      review_text: string;
      sort_order: number;
      is_visible: boolean;
    }) => {
      const { data, error } = await supabase
        .from("google_reviews")
        .insert(review)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-reviews"] });
    },
  });
};

export const useUpdateGoogleReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: any) => {
      const { data, error } = await supabase
        .from("google_reviews")
        .update(review)
        .eq("id", review.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-reviews"] });
    },
  });
};

export const useDeleteGoogleReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("google_reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-reviews"] });
    },
  });
};

// Google Reviews Settings
export const useGoogleReviewsSettings = () => {
  return useQuery({
    queryKey: ["google-reviews-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_reviews_settings")
        .select(GOOGLE_REVIEW_SETTINGS_COLUMNS)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateGoogleReviewsSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from("google_reviews_settings")
        .update(settings)
        .eq("id", settings.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-reviews-settings"] });
    },
  });
};

// Gallery Images
export const useGalleryImages = () => {
  return useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select(GALLERY_IMAGE_COLUMNS)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
};

export const useAddGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image: { image_url: string; alt_text: string; sort_order: number }) => {
      const { data, error } = await supabase
        .from("gallery_images")
        .insert(image)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
    },
  });
};

export const useUpdateGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (image: any) => {
      const { data, error } = await supabase
        .from("gallery_images")
        .update(image)
        .eq("id", image.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
    },
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
    },
  });
};
