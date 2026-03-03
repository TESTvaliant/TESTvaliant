// website for testvaliant
import { memo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHeroContent, useHeroImages } from "@/hooks/useSiteContent";
import { sanitizeHtml } from "@/lib/sanitize";

const HeroSection = () => {
  const { data: heroContent } = useHeroContent();
  const { data: heroImages } = useHeroImages();
  const [currentImage, setCurrentImage] = useState(0);

  const images = (heroImages as Array<{ src: string; alt: string }> | undefined) || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const fallbackImages = [
    {
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=800&fit=crop",
      alt: "Students studying",
    },
  ];

  const displayImages = images.length > 0 ? images : fallbackImages;

  const microTextItems = (heroContent as any)?.micro_text
    ? (heroContent as any).micro_text.split(" • ").filter(Boolean)
    : ["Public learning initiative", "Built from real classroom experience", "No paid services"];

  const headingLine1 = heroContent?.heading_line1 || "";
  const headingHighlight = heroContent?.heading_highlight || "";
  const headingLine2 = heroContent?.heading_line2 || "";
  const subline = (heroContent as any)?.subline || "";

  const handleImageChange = useCallback((index: number) => {
    setCurrentImage(index);
  }, []);

  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden w-full">
      {/* Left side gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 via-40% to-primary/0 z-10" />

      {/* Background images - optimized transitions */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={displayImages[currentImage]?.src}
              alt={displayImages[currentImage]?.alt}
              className="w-full h-full object-cover"
              loading={currentImage === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-primary/50" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-10" />

      <div className="container relative z-20 pt-28 pb-24 min-h-screen flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl space-y-6"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight"
          >
            {headingLine1}
            <br />
            <span className="text-gradient">{headingHighlight}</span> <br />
            {headingLine2}
          </motion.h1>

          {/* Subline */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-primary-foreground/90 max-w-md leading-relaxed hero-subline"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(subline) }}
          />

          {/* Micro-text pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
            className="flex flex-wrap gap-3"
          >
            {microTextItems.map((item: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-full px-4 py-1.5"
              >
                <span className="w-1.5 h-1.5 bg-secondary/80 rounded-full" />
                {item}
              </span>
            ))}
          </motion.div>

          {/* Image indicators */}
          {displayImages.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
              className="flex gap-2 pt-4"
            >
              {displayImages.map((_: { src: string; alt: string }, index: number) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImage
                      ? "w-10 bg-secondary"
                      : "w-6 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute -bottom-1 left-0 right-0 z-20">
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 180L48 165C96 150 192 120 288 105C384 90 480 90 576 97.5C672 105 768 120 864 127.5C960 135 1056 135 1152 120C1248 105 1344 75 1392 60L1440 45V180H1392C1344 180 1248 180 1152 180C1056 180 960 180 864 180C768 180 672 180 576 180C480 180 384 180 288 180C192 180 96 180 48 180H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default memo(HeroSection);
