import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Facebook,
  MapPin,
  Youtube,
  Heart,
  Sparkles,
  ChevronRight,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFooterContent, useSocialLinks, useAboutStats } from "@/hooks/useSiteContent";

// WhatsApp SVG icon component
const WhatsAppIcon = forwardRef<SVGSVGElement, { className?: string }>(({ className }, ref) => (
  <svg ref={ref} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
));
WhatsAppIcon.displayName = "WhatsAppIcon";

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
  whatsapp: WhatsAppIcon,
};

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Learner's Track", href: "/tracks" },
  { label: "All Blogs", href: "/blogs" },
  //{ label: "About Us", href: "/#about" },
  //{ label: "Testimonials", href: "/#testimonials" },
  //{ label: "FAQ", href: "/#faqs" },
];

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const navigate = useNavigate();
  const [blogSearch, setBlogSearch] = useState("");
  const { data: footerContentData } = useFooterContent();
  const { data: socialLinksData } = useSocialLinks();
  const { data: statsData } = useAboutStats();

  const footerContent = footerContentData || {
    tagline:
      "Empowering students for academic excellence through comprehensive learning resources and expert guidance.",
    email: "test.ieltschandigarh@gmail.com",
    phone: "+91 9815488394",
    address: "Delhi, India",
    copyright_text: "© 2025 TESTvaliant. All rights reserved.",
  };

  const allowedPlatforms = ["instagram", "linkedin", "facebook", "youtube", "whatsapp"];
  
  // Helper to check if URL is valid (not empty, not "#", not placeholder)
  const isValidUrl = (url: string) => {
    return url && url.trim() !== "" && url.trim() !== "#";
  };
  
  const socialLinks = (socialLinksData || [])
    .filter((s: any) => allowedPlatforms.includes(s.platform) && isValidUrl(s.url));

  const handleNavClick = (href: string) => {
    if (href.startsWith("/") && !href.startsWith("/#")) {
      navigate(href);
      return;
    }
    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (href.startsWith("/#")) {
      const elementId = href.replace("/#", "");
      const element = document.getElementById(elementId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBlogSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (blogSearch.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(blogSearch.trim())}`);
      setBlogSearch("");
    }
  };

  return (
    <footer
      ref={ref}
      className="relative text-white overflow-hidden bg-gradient-to-b from-[#081426] via-[#060f1e] to-[#040913]"
    >
      {/* STRONG SEPARATOR (Hero -> Footer) */}
      <div className="absolute top-0 left-0 w-full">
        <div className="h-[5px] bg-gradient-to-r from-transparent via-[#f5c66a] to-transparent opacity-90" />
      </div>

      {/* Soft Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-[#f5c66a]/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -right-32 w-[520px] h-[520px] bg-[#2b7fff]/10 blur-3xl rounded-full" />
      </div>

      <div className="container relative z-10 pt-16 pb-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="space-y-6"
          >
            <a href="/" onClick={() => handleNavClick("/")}>
              <img
                src="/testvaliant-logo-footer.png"
                alt="TESTvaliant"
                width={192}
                height={48}
                loading="lazy"
                decoding="async"
                className="h-12 w-auto object-contain"
              />
            </a>

            <p className="text-white/65 text-sm leading-relaxed max-w-sm">{footerContent.tagline}</p>

            {/* Social Proof Stats */}
            {statsData && statsData.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {statsData.slice(0, 4).map((stat: any, index: number) => (
                  <motion.div
                    key={stat.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="text-center p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="text-xl font-bold text-[#f5c66a]">{stat.value}</div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              {socialLinks.map((social: any, index: number) => {
                const Icon = socialIconMap[social.platform];
                if (!Icon) return null;

                return (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/30 transition"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Explore Pages */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-semibold tracking-wide">
              Explore Pages
              <span className="block mt-2 h-[2px] w-10 bg-[#f5c66a]/70 rounded-full" />
            </h4>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition group"
                  >
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#f5c66a] transition" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Blog Search */}
            <div className="space-y-2">
              <label className="text-sm text-white/60">Search Blogs</label>
              <form onSubmit={handleBlogSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/40 pr-10 focus:border-[#f5c66a]/50 focus:ring-[#f5c66a]/20"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/50 hover:text-[#f5c66a] transition"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* CTA */}
            <button
              onClick={() => handleNavClick("/#learning-tracks")}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium
              border border-[#f5c66a]/70 bg-[#f5c66a]/10
              shadow-[0_0_25px_rgba(245,198,106,0.25)]
              hover:shadow-[0_0_40px_rgba(245,198,106,0.45)]
              hover:bg-[#f5c66a]/15 transition"
            >
              <Sparkles className="w-4 h-4 text-[#f5c66a]" />
              Free Learning Initiative
            </button>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-semibold tracking-wide">
              Get in Touch
              <span className="block mt-2 h-[2px] w-10 bg-[#f5c66a]/70 rounded-full" />
            </h4>

            <div className="space-y-4 text-sm text-white/75">
              <a href={`mailto:${footerContent.email}`} className="flex items-start gap-3 hover:text-white transition">
                <Mail className="w-5 h-5 text-[#f5c66a]" />
                <span>{footerContent.email}</span>
              </a>

              <a href={`tel:${footerContent.phone}`} className="flex items-start gap-3 hover:text-white transition">
                <Phone className="w-5 h-5 text-[#f5c66a]" />
                <span>{footerContent.phone}</span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#f5c66a]" />
                <span>{footerContent.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/55 text-sm pt-3">
              Made with <Heart className="w-4 h-4 fill-[#f5c66a] text-[#f5c66a]" /> for learners worldwide
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/45">{footerContent.copyright_text}</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
