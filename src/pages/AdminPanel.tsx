import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  LogOut, Home, Loader2, ShieldAlert, RefreshCw,
  LayoutDashboard, Users, FileText,
  Youtube, Star, Settings, ChevronLeft, ChevronRight,
  BookOpen, HelpCircle, Megaphone, Mail, ImageIcon, Quote, Inbox
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const AdminHeroSection = lazy(() => import("@/components/admin/AdminHeroSection"));
const AdminAboutSection = lazy(() => import("@/components/admin/AdminAboutSection"));
const AdminFounderSection = lazy(() => import("@/components/admin/AdminFounderSection"));
const AdminOpenLearningTracks = lazy(() => import("@/components/admin/AdminOpenLearningTracks"));
const AdminYoutubeChannels = lazy(() => import("@/components/admin/AdminYoutubeChannels"));
const AdminTestimonials = lazy(() => import("@/components/admin/AdminTestimonials"));
const AdminGoogleReviews = lazy(() => import("@/components/admin/AdminGoogleReviews"));
const AdminGallery = lazy(() => import("@/components/admin/AdminGallery"));
const AdminDifferentiators = lazy(() => import("@/components/admin/AdminDifferentiators"));
const AdminBlogs = lazy(() => import("@/components/admin/AdminBlogs"));
const AdminFaqs = lazy(() => import("@/components/admin/AdminFaqs"));
const AdminCTA = lazy(() => import("@/components/admin/AdminCTA"));
const AdminFooter = lazy(() => import("@/components/admin/AdminFooter"));
const AdminInquiries = lazy(() => import("@/components/admin/AdminInquiries"));

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
};

const navSections = [
  {
    title: "Homepage",
    items: [
      { id: "hero", label: "Hero Banner", icon: LayoutDashboard, description: "Main banner content and images" },
      { id: "about", label: "About Section", icon: FileText, description: "About the initiative" },
      { id: "founder", label: "Founder", icon: Users, description: "Founder profile and bio" },
    ]
  },
  {
    title: "Content",
    items: [
      { id: "tracks", label: "Learning Tracks", icon: BookOpen, description: "Open learning resources" },
      { id: "youtube", label: "YouTube Channels", icon: Youtube, description: "Channel links and descriptions" },
      { id: "blogs", label: "Blog Posts", icon: FileText, description: "Articles and blog content" },
    ]
  },
  {
    title: "Social Proof",
    items: [
      { id: "testimonials", label: "Testimonials", icon: Quote, description: "Student success stories" },
      { id: "google-reviews", label: "Google Reviews", icon: Star, description: "Review widget settings" },
      { id: "gallery", label: "Gallery", icon: ImageIcon, description: "Photo gallery images" },
    ]
  },
  {
    title: "Other Sections",
    items: [
      { id: "differentiators", label: "Why Choose Us", icon: Settings, description: "Unique selling points" },
      { id: "faqs", label: "FAQs", icon: HelpCircle, description: "Frequently asked questions" },
      { id: "cta", label: "Call to Action", icon: Megaphone, description: "CTA section content" },
      { id: "footer", label: "Footer", icon: Mail, description: "Footer links and info" },
    ]
  },
  {
    title: "Leads",
    items: [
      { id: "inquiries", label: "Inquiries", icon: Inbox, description: "View and export form submissions" },
    ]
  }
];

const adminComponents = {
  hero: AdminHeroSection,
  about: AdminAboutSection,
  founder: AdminFounderSection,
  tracks: AdminOpenLearningTracks,
  youtube: AdminYoutubeChannels,
  testimonials: AdminTestimonials,
  "google-reviews": AdminGoogleReviews,
  gallery: AdminGallery,
  differentiators: AdminDifferentiators,
  blogs: AdminBlogs,
  faqs: AdminFaqs,
  cta: AdminCTA,
  footer: AdminFooter,
  inquiries: AdminInquiries,
} as const;

const SectionLoader = () => (
  <div className="py-12 flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const AdminPanel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isLoading, isAdmin, signOut, user, refreshAdminStatus } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const activeTab = searchParams.get("section") || "hero";

  const setActiveTab = (tab: string) => {
    setSearchParams({ section: tab });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    await refreshAdminStatus();
    setIsRefreshing(false);
  };

  // Find active item details
  const findActiveItem = (): NavItem | undefined => {
    for (const section of navSections) {
      const item = section.items.find(i => i.id === activeTab);
      if (item) return item;
    }
    return undefined;
  };

  const activeItem = findActiveItem();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-card rounded-2xl shadow-lg p-8 border">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have admin privileges. Please contact an administrator to request access.
            </p>
            <p className="text-sm text-muted-foreground mb-6 bg-muted px-3 py-2 rounded-lg">
              {user?.email}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button variant="default" onClick={handleRefreshStatus} disabled={isRefreshing}>
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh Status
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Go Home</Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ActiveSection = adminComponents[activeTab as keyof typeof adminComponents] ?? AdminHeroSection;

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border z-40 transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-xl">T</span>
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-foreground truncate">Admin Panel</h1>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-4">
              {!sidebarCollapsed && (
                <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        sidebarCollapsed && "justify-center px-2"
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("w-full", sidebarCollapsed && "px-2")} 
            asChild
          >
            <Link to="/" target="_blank">
              <Home className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-2">View Site</span>}
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("w-full text-muted-foreground", sidebarCollapsed && "px-2")}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Page Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {activeItem?.label || "Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {activeItem?.description || "Manage your website content"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`/#${activeTab === 'hero' ? '' : activeTab}`} target="_blank" rel="noopener noreferrer">
                  Preview Section
                </a>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <div className="max-w-5xl">
            <Suspense fallback={<SectionLoader />}>
              <ActiveSection />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
