import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ChevronRight, Home, ArrowLeft } from "lucide-react";
import { useBlogBySlug, useBlogCategories } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useBlogBySlug(slug || "");
  const { data: categories } = useBlogCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [blogData, setBlogData] = useState<any>(null);

  // Fallback to fetch by ID if slug doesn't work
  useEffect(() => {
    const fetchBlogById = async () => {
      if (error && slug) {
        const { data } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", slug)
          .single();
        if (data) setBlogData(data);
      }
    };
    fetchBlogById();
  }, [error, slug]);

  const currentBlog = blog || blogData;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blogs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={`${currentBlog.title} - TESTvaliant Blog`}
        description={currentBlog.excerpt}
        keywords={`${currentBlog.category}, TESTvaliant blog, ${currentBlog.title}`}
        url={`https://pathway-guide-hero.lovable.app/blog/${currentBlog.slug || currentBlog.id}`}
        type="article"
        author={currentBlog.author}
        publishedTime={currentBlog.date}
        section={currentBlog.category}
        image={currentBlog.image_url}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blogs" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium line-clamp-1">{currentBlog.title}</span>
          </nav>

          {/* Category Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block bg-secondary text-secondary-foreground text-sm font-semibold px-4 py-1 rounded-full mb-4 border-b-2 border-secondary">
              {currentBlog.category}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 flex-grow">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Blog Content */}
            <article className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {currentBlog.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{currentBlog.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{currentBlog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{currentBlog.read_time}</span>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.4)]">
                  <img
                    src={currentBlog.image_url}
                    alt={currentBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Blog Content */}
                <div 
                  className="blog-content max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeHtml(currentBlog.content || `<p>${currentBlog.excerpt}</p>`) 
                  }}
                />

                {/* Back Button */}
                <div className="mt-12 pt-8 border-t">
                  <Button variant="outline" asChild>
                    <Link to="/blogs">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to All Blogs
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Search */}
              <div className="bg-card rounded-2xl p-6 shadow-card shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
                <h3 className="font-bold text-lg mb-4">Search</h3>
                <div className="relative">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery) {
                        window.location.href = `/blogs?search=${encodeURIComponent(searchQuery)}`;
                      }
                    }}
                  />
                  <Button 
                    size="sm" 
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      if (searchQuery) {
                        window.location.href = `/blogs?search=${encodeURIComponent(searchQuery)}`;
                      }
                    }}
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-card rounded-2xl p-6 shadow-card shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories?.map((category: string) => (
                    <Link
                      key={category}
                      to={`/blogs?category=${encodeURIComponent(category)}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-secondary" />
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogDetail;

