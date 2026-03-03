import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Home, ArrowLeft, ExternalLink, Youtube, Lightbulb, BookOpen } from "lucide-react";
import { OPEN_TRACK_FULL_COLUMNS, useOpenLearningTracks } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isValidYoutubeId } from "@/lib/validation";
import { sanitizeHtml } from "@/lib/sanitize";
import TableOfContents, { generateTOCItems } from "@/components/track/TableOfContents";
const FALLBACK_YOUTUBE_ID = "dQw4w9WgXcQ";

// Simple markdown-like bold text parser
const parseText = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>;
    }
    return part;
  });
};
const TrackDetail = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const {
    data: tracks,
    isLoading
  } = useOpenLearningTracks({ includeFullContent: true });
  const [trackData, setTrackData] = useState<any>(null);

  // Find track by slug from fetched tracks
  const trackFromList = tracks?.find((t: any) => t.slug === slug);

  // Fallback to fetch by ID if slug doesn't work
  useEffect(() => {
    const fetchTrackById = async () => {
      if (!trackFromList && slug && !isLoading) {
        const {
          data
        } = await supabase
          .from("open_learning_tracks")
          .select(OPEN_TRACK_FULL_COLUMNS)
          .eq("id", slug)
          .single();
        if (data) setTrackData(data);
      }
    };
    fetchTrackById();
  }, [trackFromList, slug, isLoading]);
  const currentTrack = trackFromList || trackData;
  const getSafeYoutubeId = (id: string): string => {
    return isValidYoutubeId(id) ? id : FALLBACK_YOUTUBE_ID;
  };
  if (isLoading) {
    return <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>;
  }
  if (!currentTrack) {
    return <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Track Not Found</h1>
          <p className="text-muted-foreground mb-8">The learning track you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/#tracks">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tracks
            </Link>
          </Button>
        </div>
        <Footer />
      </div>;
  }
  return <div className="min-h-screen flex flex-col">
      <SEO 
        title={`${currentTrack.title} - TESTvaliant Learning Tracks`}
        description={currentTrack.intro_text || `Learn about ${currentTrack.title} with TESTvaliant's free learning resources.`}
        keywords={`${currentTrack.title}, free learning, TESTvaliant, online education`}
        url={`https://pathway-guide-hero.lovable.app/track/${currentTrack.slug || currentTrack.id}`}
        image={currentTrack.image_url}
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
            <Link to="/#tracks" className="hover:text-foreground transition-colors">
              Tracks
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium line-clamp-1">{currentTrack.title}</span>
          </nav>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">{currentTrack.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-grow">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="max-w-5xl mx-auto">
            {/* Table of Contents */}
            <TableOfContents items={generateTOCItems(currentTrack)} />

            {/* Video Section - full width */}
            <div id="video" className="w-full scroll-mt-24">
              <div className="aspect-video rounded-xl overflow-hidden shadow-xl shadow-[0_0_40px_-15px_hsl(var(--primary)/0.3)]">
                <iframe src={`https://www.youtube.com/embed/${getSafeYoutubeId(currentTrack.youtube_id)}`} title={currentTrack.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
              </div>
            </div>

            {/* YouTube Channel Button - Right below video */}
            {currentTrack.channel_name && currentTrack.channel_url && <div className="w-full mt-4 mb-10">
                <a href={currentTrack.channel_url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 hover:bg-accent transition-all duration-300 shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Watch on</p>
                    <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                      {currentTrack.channel_name}
                    </h3>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
                </a>
              </div>}

            {/* Spacing when no channel */}
            {(!currentTrack.channel_name || !currentTrack.channel_url) && <div className="mb-10" />}

            {/* Intro Text - Always show if available */}
            {currentTrack.intro_text && <div id="intro" className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line mb-10 scroll-mt-24">
                {currentTrack.intro_text}
              </div>}

            {/* Why it matters - Always show if available */}
            {currentTrack.why_matters_title && currentTrack.why_matters_content && <div id="why-matters" className="bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-primary/10 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{currentTrack.why_matters_title}</h2>
                </div>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line pl-[52px]">
                  {currentTrack.why_matters_content?.split("\n").map((line: string, i: number) => <p key={i} className="mb-2">
                      {parseText(line)}
                    </p>)}
                </div>
              </div>}

            {/* How we learn / What we cover - Always show if available */}
            {currentTrack.how_we_learn_title && currentTrack.how_we_learn_content && <div id="how-we-learn" className="bg-gradient-to-br from-secondary/5 to-primary/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-secondary/10 scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{currentTrack.how_we_learn_title}</h2>
                </div>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line pl-[52px]">
                  {currentTrack.how_we_learn_content?.split("\n").map((line: string, i: number) => <p key={i} className="mb-2">
                      {parseText(line)}
                    </p>)}
                </div>
              </div>}

            {/* Bottom text - Always show if available */}
            {currentTrack.bottom_text && <p id="takeaway" className="text-foreground font-medium italic border-l-4 border-primary pl-6 py-2 text-lg mb-8 scroll-mt-24">
                {currentTrack.bottom_text}
              </p>}

            {/* CTA */}
            {currentTrack.cta_text && currentTrack.cta_link && <div id="cta" className="flex justify-center pt-4 scroll-mt-24">
                <a href={currentTrack.cta_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-lg shadow-lg">
                  {currentTrack.cta_text}
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>}

            {/* Rich HTML Content (like Blog) */}
            {currentTrack.content && <div 
              id="content" 
              className="blog-content max-w-none mb-10 scroll-mt-24"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(currentTrack.content)
              }} 
            />}

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t">
              <Button variant="outline" asChild>
                <Link to="/#tracks">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Tracks
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default TrackDetail;
