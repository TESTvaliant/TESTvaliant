import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  author?: string;
  publishedTime?: string;
  section?: string;
  jsonLd?: Record<string, unknown>;
}

const SEO = ({
  title = "TESTvaliant - Master Your Learning Journey",
  description = "Join TESTvaliant for expert coaching, free learning resources, and personalized mentorship. IELTS, English learning, and competitive exam preparation.",
  keywords = "IELTS preparation, English learning, competitive exams, online education, TESTvaliant, free learning resources",
  image = "https://pathway-guide-hero.lovable.app/og-image.png",
  url = "https://pathway-guide-hero.lovable.app",
  type = "website",
  author,
  publishedTime,
  section,
  jsonLd,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    setMetaTag("description", description);
    setMetaTag("keywords", keywords);
    setMetaTag("author", author || "TESTvaliant");

    // Open Graph tags
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:image", image, true);
    setMetaTag("og:url", url, true);
    setMetaTag("og:type", type, true);
    setMetaTag("og:site_name", "TESTvaliant", true);

    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);

    // Article-specific tags
    if (type === "article") {
      if (author) setMetaTag("article:author", author, true);
      if (publishedTime) setMetaTag("article:published_time", publishedTime, true);
      if (section) setMetaTag("article:section", section, true);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // JSON-LD structured data
    const existingJsonLd = document.querySelector('script[data-seo="jsonld"]');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    const defaultJsonLd = {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "Organization",
      ...(type === "website" ? {
        name: "TESTvaliant",
        url: "https://pathway-guide-hero.lovable.app",
        logo: "https://pathway-guide-hero.lovable.app/favicon.ico",
        description: description,
        sameAs: [
          "https://www.youtube.com/@TESTvaliant",
          "https://www.instagram.com/testinstitute/",
          "https://www.linkedin.com/company/105349343/"
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-9815488394",
          contactType: "customer service",
          email: "test.ieltschandigarh@gmail.com"
        }
      } : {}),
      ...(type === "article" ? {
        headline: title,
        description: description,
        image: image,
        author: {
          "@type": "Person",
          name: author || "TESTvaliant"
        },
        publisher: {
          "@type": "Organization",
          name: "TESTvaliant",
          logo: {
            "@type": "ImageObject",
            url: "https://pathway-guide-hero.lovable.app/favicon.ico"
          }
        },
        datePublished: publishedTime
      } : {}),
      ...jsonLd
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "jsonld");
    script.textContent = JSON.stringify(defaultJsonLd);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const jsonLdScript = document.querySelector('script[data-seo="jsonld"]');
      if (jsonLdScript) {
        jsonLdScript.remove();
      }
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, section, jsonLd]);

  return null;
};

export default SEO;

