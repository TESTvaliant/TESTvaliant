// website for testvaliant
import { memo } from "react";
import { motion } from "framer-motion";
import { useAboutContent } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const AboutSection = () => {
  const { data: aboutContent } = useAboutContent();

  const content = aboutContent || {
    heading_line1: "Transforming",
    heading_highlight: "Education",
    heading_line2: "One Student at a Time",
    paragraph1:
      "TESTvaliant is more than just an education platform – we're a movement dedicated to revolutionizing how students prepare for competitive exams.",
    paragraph2: "Our unique methodology combines traditional teaching wisdom with modern technology.",
    paragraph3:
      "With a team of experienced educators and industry experts, we provide comprehensive coaching that goes beyond textbooks.",
    paragraph4: "",
    paragraph5: "",
    youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  };

  return (
    <section id="about" className="bg-section-secondary relative py-[50px]">
      {/* Simplified decorative effects */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/12 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left content - Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h5 className="inline-block text-secondary font-semibold text-base md:text-lg uppercase tracking-wider mb-3">
              ABOUT THE INITIATIVE
            </h5>
            <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
              {content.heading_line1}
              <br />
              <span className="text-gradient">{content.heading_highlight}</span>
              {content.heading_line2}
            </h4>
            <div
              className="text-muted-foreground text-base mb-3 leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.paragraph1) }}
            />
            <div
              className="text-muted-foreground text-base mb-3 leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.paragraph2) }}
            />
            <div
              className="text-muted-foreground text-base mb-3 leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.paragraph3) }}
            />
            {content.paragraph4 && (
              <div
                className="text-muted-foreground text-base mb-3 leading-relaxed blog-content"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.paragraph4) }}
              />
            )}
            {content.paragraph5 && (
              <div
                className="text-muted-foreground text-base leading-relaxed blog-content"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.paragraph5) }}
              />
            )}
          </motion.div>

          {/* Right content - YouTube Video */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
              <iframe
                src={content.youtube_url}
                title="About TESTvaliant"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutSection);

