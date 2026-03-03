// website for testvaliant
import { memo } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useFounderContent } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const FounderSection = () => {
  const { data: founderContent } = useFounderContent();

  const content = founderContent || {
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=750&fit=crop",
    quote: "Education is not just about passing exams – it's about building confident, capable individuals who can take on any challenge life throws at them.",
    name: "Dr. Rajesh Kumar",
    title: "Founder & Chief Mentor",
    bio_paragraph1: "With over 15 years of experience in competitive exam preparation, Dr. Kumar has mentored more than 25,000 students to success.",
    bio_paragraph2: "A gold medalist from IIT Delhi, Dr. Kumar left a lucrative corporate career to pursue his passion for teaching.",
  };

  return (
    <section id="founder" className="py-24 bg-section-secondary relative">
      {/* Simplified decorative effects */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-primary/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
              <img
                src={content.image_url}
                alt={content.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -z-10 top-10 -left-10 w-full h-full bg-primary/10 rounded-3xl" />
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              Meet the Founder
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              The Vision Behind{" "}
              <span className="text-gradient">TESTvaliant</span>
            </h2>

            <div className="relative mb-8">
              <Quote className="absolute -top-4 -left-4 w-12 h-12 text-secondary/20" />
              <blockquote 
                className="text-xl text-foreground/90 italic pl-8 border-l-4 border-secondary blog-content"
                dangerouslySetInnerHTML={{ __html: `"${sanitizeHtml(content.quote)}"` }}
              />
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-2">{content.name}</h3>
            <p className="text-secondary font-medium mb-4">{content.title}</p>

            <div 
              className="text-muted-foreground mb-4 leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.bio_paragraph1) }}
            />

            <div 
              className="text-muted-foreground leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.bio_paragraph2) }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(FounderSection);

