// website for testvaliant
import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGalleryImages } from "@/hooks/useSiteContent";

const GallerySection = () => {
  const { data: images } = useGalleryImages();
  const [startIndex, setStartIndex] = useState(0);
  const galleryImages = images || [];

  const visibleCount = 4;
  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex + visibleCount < galleryImages.length;

  const handlePrev = useCallback(() => {
    if (canGoLeft) {
      setStartIndex(prev => Math.max(0, prev - 1));
    }
  }, [canGoLeft]);

  const handleNext = useCallback(() => {
    if (canGoRight) {
      setStartIndex(prev => Math.min(galleryImages.length - visibleCount, prev + 1));
    }
  }, [canGoRight, galleryImages.length]);

  const handleDotClick = useCallback((idx: number) => {
    setStartIndex(idx * visibleCount);
  }, []);

  if (galleryImages.length === 0) {
    return null;
  }

  const visibleImages = galleryImages.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="bg-section-cool relative overflow-hidden py-[20px]">
      {/* Simplified decorative effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-bold text-foreground"
          >
            <span className="text-gradient">Gallery</span>
          </motion.h2>

          {galleryImages.length > visibleCount && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrev}
                disabled={!canGoLeft}
                className="rounded-full w-10 h-10 border-border/50 hover:bg-primary/10 hover:border-primary/50 disabled:opacity-30 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={!canGoRight}
                className="rounded-full w-10 h-10 border-border/50 hover:bg-primary/10 hover:border-primary/50 disabled:opacity-30 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visibleImages.map((image: any, index: number) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              <img
                src={image.image_url}
                alt={image.alt_text || "Gallery image"}
                loading="lazy"
                className="w-full h-full object-cover will-change-transform transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Pagination dots for mobile */}
        {galleryImages.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {Array.from({ length: Math.ceil(galleryImages.length / visibleCount) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  Math.floor(startIndex / visibleCount) === idx
                    ? "w-6 bg-secondary"
                    : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(GallerySection);

