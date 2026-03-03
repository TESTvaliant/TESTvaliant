import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ExplainerSection from "@/components/sections/ExplainerSection";
import AboutSection from "@/components/sections/AboutSection";
import OpenLearningTracksSection from "@/components/sections/OpenLearningTracksSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import GoogleReviewsSection from "@/components/sections/GoogleReviewsSection";
import InquiryFormSection from "@/components/sections/InquiryFormSection";
import GallerySection from "@/components/sections/GallerySection";
import DifferentiatorSection from "@/components/sections/DifferentiatorSection";
import BlogsSection from "@/components/sections/BlogsSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <main className="min-h-screen">
      <SEO 
        title="TESTvaliant - Master Your Learning Journey | Expert Coaching & Free Resources"
        description="Join TESTvaliant for expert coaching, free learning resources, and personalized mentorship. IELTS preparation, English learning, and career guidance with 95% success rate."
        keywords="IELTS preparation, English learning, competitive exams, online education, TESTvaliant, free learning resources, IELTS coaching, English grammar"
        url="https://pathway-guide-hero.lovable.app"
      />
      <Navbar />
      <HeroSection />
      <ExplainerSection />
      <AboutSection />
      <OpenLearningTracksSection />
      <TestimonialsSection />
      <GoogleReviewsSection />
      <GallerySection />
      <DifferentiatorSection />
      <BlogsSection />
      <FAQSection />
      <InquiryFormSection />
      <CTASection />
      <Footer />
    </main>
  );
};
export default Index;

