// website for testvaliant
import { useEffect, useRef, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink, Quote } from "lucide-react";
import { useGoogleReviewsSettings, useGoogleReviews } from "@/hooks/useSiteContent";
import { format } from "date-fns";

// Hardcoded Elfsight widget ID for instant loading
const ELFSIGHT_APP_ID = "elfsight-app-4fc1f901-438a-41d7-a97d-39a0f932ac99";

const GoogleReviewsSection = () => {
  const { data: settings } = useGoogleReviewsSettings();
  const { data: allReviews } = useGoogleReviews();
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  const visibleReviews = allReviews?.filter((review: any) => review.is_visible) || [];

  const hideWatermark = useCallback(() => {
    if (!document.getElementById('hide-elfsight-watermark')) {
      const style = document.createElement('style');
      style.id = 'hide-elfsight-watermark';
      style.textContent = `
        .elfsight-app-common-link,
        .eapps-link,
        a.eapps-link[href*="elfsight"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Load Elfsight script on mount (no database dependency)
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    
    const existingScript = document.querySelector('script[src*="elfsight"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://static.elfsight.com/platform/platform.js';
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        setTimeout(() => {
          if ((window as any).eapps?.Platform) {
            (window as any).eapps.Platform.init();
          }
          hideWatermark();
        }, 100);
      };
      document.body.appendChild(script);
    } else {
      scriptLoadedRef.current = true;
      setTimeout(() => {
        if ((window as any).eapps?.Platform) {
          (window as any).eapps.Platform.init();
        }
        hideWatermark();
      }, 100);
    }
  }, [hideWatermark]);

  return (
    <section id="google-reviews" className="py-16 md:py-24 relative overflow-hidden">
      {/* Simplified background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
              alt="Google" 
              className="h-8 object-contain"
              loading="lazy"
            />
            <span className="text-muted-foreground text-lg">Reviews</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {settings?.section_title || "What Our Students Say on Google"}
          </h2>
          
          {settings?.total_reviews_count && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-muted-foreground">
                Based on {settings.total_reviews_count}+ reviews
              </span>
            </div>
          )}
        </motion.div>

        {/* Hardcoded Elfsight Widget - loads instantly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className={ELFSIGHT_APP_ID} data-elfsight-app-lazy />
        </motion.div>

        {/* Manual Reviews Grid */}
        {visibleReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {visibleReviews.map((review: any, index: number) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  {review.reviewer_image_url ? (
                    <img
                      src={review.reviewer_image_url}
                      alt={review.reviewer_name}
                      className="w-12 h-12 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{review.reviewer_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(review.review_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <img 
                    src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                    alt="Google" 
                    className="h-5 object-contain opacity-70"
                    loading="lazy"
                  />
                </div>
                
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                
                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 w-6 h-6 text-primary/20" />
                  <p className="text-muted-foreground text-sm leading-relaxed pl-4">
                    {review.review_text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Fallback link - only if no manual reviews and google place ID exists */}
        {visibleReviews.length === 0 && settings?.google_place_id && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center"
          >
            <div className="bg-card rounded-xl p-8 shadow-lg border border-border max-w-md mx-auto">
              <img 
                src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" 
                alt="Google" 
                className="h-12 mx-auto mb-4 object-contain"
                loading="lazy"
              />
              <p className="text-muted-foreground mb-6">
                See what our students are saying about us on Google
              </p>
              <a
                href={`https://search.google.com/local/reviews?placeid=${settings.google_place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
              >
                Read Our Google Reviews
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default memo(GoogleReviewsSection);

