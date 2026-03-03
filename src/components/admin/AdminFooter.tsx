// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useFooterContent, useUpdateFooterContent, useSocialLinks, useUpdateSocialLink } from "@/hooks/useSiteContent";
import RichTextEditor from "./RichTextEditor";

const AdminFooter = () => {
  const { data: footerContent, isLoading } = useFooterContent();
  const { data: socialLinks, isLoading: socialLoading } = useSocialLinks();
  const updateContent = useUpdateFooterContent();
  const updateSocial = useUpdateSocialLink();

  const [content, setContent] = useState({
    id: "",
    tagline: "",
    email: "",
    phone: "",
    address: "",
    copyright_text: "",
  });

  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    if (footerContent) {
      setContent({
        id: footerContent.id,
        tagline: footerContent.tagline,
        email: footerContent.email,
        phone: footerContent.phone,
        address: footerContent.address,
        copyright_text: footerContent.copyright_text,
      });
    }
  }, [footerContent]);

  useEffect(() => {
    if (socialLinks) {
      setLinks(socialLinks);
    }
  }, [socialLinks]);

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync(content);
      toast.success("Footer content saved!");
    } catch (error) {
      toast.error("Failed to save footer content");
    }
  };

  const handleSaveSocialLink = async (link: any) => {
    try {
      await updateSocial.mutateAsync(link);
      toast.success("Social link saved!");
    } catch (error) {
      toast.error("Failed to save social link");
    }
  };

  if (isLoading || socialLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Footer Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tagline</label>
            <RichTextEditor
              value={content.tagline}
              onChange={(value) => setContent({ ...content, tagline: value })}
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                value={content.email}
                onChange={(e) => setContent({ ...content, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={content.phone}
                onChange={(e) => setContent({ ...content, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                value={content.address}
                onChange={(e) => setContent({ ...content, address: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Copyright Text</label>
            <Input
              value={content.copyright_text}
              onChange={(e) => setContent({ ...content, copyright_text: e.target.value })}
            />
          </div>
          <Button onClick={handleSave} disabled={updateContent.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {updateContent.isPending ? "Saving..." : "Save Footer"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {links.map((link, index) => (
            <div key={link.id} className="flex gap-4 items-end">
              <div className="w-32">
                <label className="text-sm font-medium capitalize">{link.platform}</label>
                <Input value={link.platform} disabled className="bg-muted" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...links];
                    updated[index] = { ...link, url: e.target.value };
                    setLinks(updated);
                  }}
                  placeholder="https://..."
                />
              </div>
              <Button size="sm" onClick={() => handleSaveSocialLink(links[index])}>
                <Save className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFooter;

