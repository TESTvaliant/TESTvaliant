// website for testvaliant
import { memo } from "react";
import { motion } from "framer-motion";
import { useHeroContent } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const ExplainerSection = () => {
  const { data: heroContent } = useHeroContent();
  const explainerLine = (heroContent as any)?.explainer_line || "";

  if (!explainerLine) return null;

  return (
    <section className="bg-gradient-to-b from-background to-muted/30 bg-muted py-0">
      <div className="container border-none bg-primary-foreground py-[20px]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="relative">
            <div 
              className="text-lg md:text-xl text-foreground/80 leading-relaxed italic px-8"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(explainerLine) }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ExplainerSection);

