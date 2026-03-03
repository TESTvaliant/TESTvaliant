import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, ChevronRight, Home, Youtube, ExternalLink, BookOpen } from "lucide-react";
import { useOpenLearningTracks } from "@/hooks/useSiteContent";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Tracks = () => {
  const { data: tracks, isLoading } = useOpenLearningTracks();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTracks = useMemo(() => {
    if (!tracks) return [];
    
    return tracks.filter((track: any) => {
      const matchesSearch = 
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.intro_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.why_matters_content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [tracks, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Open Learning Tracks - TESTvaliant | Free Learning Resources"
        description="Explore comprehensive free learning tracks for IELTS, English, and exam preparation. Expert curated content with YouTube video lessons."
        keywords="free learning resources, IELTS preparation, English learning tracks, online courses, TESTvaliant tracks"
        url="https://pathway-guide-hero.lovable.app/tracks"
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
            <span className="text-foreground font-medium">Learning Tracks</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              Free Resources
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Open Learning <span className="text-gradient">Tracks</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our comprehensive learning tracks designed to help you master English, exams, and education pathways.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 flex-grow">
        <div className="container">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search learning tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-full border-2 focus:border-primary"
              />
            </div>
          </motion.div>

          {/* Tracks Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          ) : filteredTracks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">No tracks found matching your search.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTracks.map((track: any, index: number) => (
                <motion.article
                  key={track.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    {track.image_url ? (
                      <img
                        src={track.image_url}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Youtube className="w-16 h-16 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-foreground text-xl mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                      {track.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{track.intro_text}</p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Subscribe/Channel Button */}
                      {track.channel_url && (
                        <a
                          href={track.channel_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                          <Youtube className="w-4 h-4" />
                          Subscribe
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      
                      {/* Read More Button */}
                      <Button variant="link" className="p-0 h-auto text-secondary" asChild>
                        <Link to={`/track/${track.slug || track.id}`}>
                          Read More <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {/* Stats */}
          {!isLoading && filteredTracks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 text-center text-muted-foreground"
            >
              Showing {filteredTracks.length} of {tracks?.length || 0} learning tracks
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tracks;

