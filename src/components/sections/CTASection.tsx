// website for testvaliant
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { useCtaContent } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const CTASection = forwardRef<HTMLElement>((_, ref) => {
  const { data: ctaContent } = useCtaContent();

  // Fallback content
  const content = ctaContent || {
    heading_line1: "Ready to Start Your",
    heading_highlight: "Success Journey?",
    description:
      "Join 50,000+ students who have transformed their careers with TESTvaliant. Get access to expert mentors, comprehensive courses, and a supportive community.",
  };

  return (
    <section ref={ref} className="py-10 bg-hero-gradient relative overflow-hidden">
      {/* Enhanced animated grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-secondary/25 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary-foreground/5 rounded-full blur-[80px]" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            {content.heading_line1} <span className="text-secondary">{content.heading_highlight}</span>
          </h2>
          <div 
            className="text-primary-foreground/50 text-lg leading-relaxed blog-content"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.description) }}
          />
        </motion.div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default CTASection;

