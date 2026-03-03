import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Calendar, Clock, User, Search, ChevronRight, Home } from "lucide-react";
import { useBlogs, useBlogCategories } from "@/hooks/useSiteContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Blogs = () => {
  const { data: blogs, isLoading } = useBlogs();
  const { data: categories } = useBlogCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sync search query from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
      // Clear the URL param after applying
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    
    return blogs.filter((blog: any) => {
      const matchesSearch = 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || blog.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Blog - TESTvaliant | Latest Tips & Learning Strategies"
        description="Stay updated with the latest tips, strategies, and success stories from TESTvaliant experts. Learn about IELTS, English grammar, and exam preparation."
        keywords="IELTS tips, English learning blog, exam preparation strategies, TESTvaliant blog, study tips"
        url="https://pathway-guide-hero.lovable.app/blogs"
      />
      <Navbar />
      
      {/* Hero Banner */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Blog</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              Our Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Latest <span className="text-gradient">Insights</span> & Articles
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest tips, strategies, and success stories from our experts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 flex-grow">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Blog List */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                      <div className="aspect-[16/10] bg-muted" />
                      <div className="p-6 space-y-4">
                        <div className="h-6 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-full" />
                        <div className="h-4 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No blogs found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {filteredBlogs.map((blog: any, index: number) => (
                    <motion.article
                      key={blog.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={blog.image_url}
                          alt={blog.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                            {blog.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-foreground text-xl mb-3 group-hover:text-secondary transition-colors line-clamp-2">
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
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Search */}
              <div className="bg-card rounded-2xl p-6 shadow-card shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
                <h3 className="font-bold text-lg mb-4">Search</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-card rounded-2xl p-6 shadow-card shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center gap-2 w-full text-left p-2 rounded-lg transition-colors ${
                      !selectedCategory 
                        ? "bg-secondary text-secondary-foreground" 
                        : "hover:bg-muted"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                    All Categories
                  </button>
                  {categories?.map((category: string) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center gap-2 w-full text-left p-2 rounded-lg transition-colors ${
                        selectedCategory === category 
                          ? "bg-secondary text-secondary-foreground" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                      {category}
                    </button>
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

export default Blogs;
