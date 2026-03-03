// website for testvaliant
import { Play, Lightbulb, BookOpen, MessageSquareQuote } from "lucide-react";
import { motion } from "framer-motion";

interface TOCItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

const TableOfContents = ({ items }: TableOfContentsProps) => {
  if (items.length === 0) return null;

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-10"
    >
      <nav className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScrollTo(item.id)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-center bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 text-muted-foreground hover:text-foreground transition-all duration-200 group"
          >
            <span className="flex-shrink-0 text-primary/70 group-hover:text-primary transition-colors">
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </motion.div>
  );
};

export default TableOfContents;

// Helper to generate TOC items - only the 4 main sections
export const generateTOCItems = (track: any): TOCItem[] => {
  const items: TOCItem[] = [];

  // Watch Video
  items.push({
    id: "video",
    label: "Watch Video",
    icon: <Play className="w-4 h-4" />,
  });

  // Why it matters
  items.push({
    id: "why-matters",
    label: "Why It Matters",
    icon: <Lightbulb className="w-4 h-4" />,
  });

  // How we learn
  items.push({
    id: "how-we-learn",
    label: "How We Learn",
    icon: <BookOpen className="w-4 h-4" />,
  });

  // Key Takeaway
  items.push({
    id: "takeaway",
    label: "Key Takeaway",
    icon: <MessageSquareQuote className="w-4 h-4" />,
  });

  return items;
};

