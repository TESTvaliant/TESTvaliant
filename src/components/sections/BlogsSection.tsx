// website for testvaliant
import { forwardRef, memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import { useBlogs } from "@/hooks/useSiteContent";
import { Link } from "react-router-dom";

const BlogsSection = forwardRef<HTMLElement>((_, ref) => {
  const { data: blogsData } = useBlogs(3);
  const blogs = blogsData || [];

  return (
    <section ref={ref} id="blogs" className="bg-section-accent relative py-[30px]">
      {/* Simplified decorative elements - reduced blur for performance */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-35 pointer-events-none" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              Latest Insights
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              From Our <span className="text-gradient">Blog</span>
            </h2>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/blogs">
              View All Articles
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any, index: number) => (
            <motion.article
              key={blog.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              {/* Image with optimized hover */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  loading="lazy"
                  className="w-full h-full object-cover will-change-transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-foreground text-xl mb-3 group-hover:text-secondary transition-colors duration-200 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{blog.excerpt}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{blog.read_time}</span>
                  </div>
                </div>

                <Button variant="link" className="p-0 h-auto text-secondary" asChild>
                  <Link to={`/blog/${blog.slug || blog.id}`}>
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
});

BlogsSection.displayName = "BlogsSection";

export default memo(BlogsSection);

