// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useCtaContent, useUpdateCtaContent } from "@/hooks/useSiteContent";
import RichTextEditor from "./RichTextEditor";

const AdminCTA = () => {
  const { data: ctaContent, isLoading } = useCtaContent();
  const updateContent = useUpdateCtaContent();

  const [content, setContent] = useState({
    id: "",
    heading_line1: "",
    heading_highlight: "",
    description: "",
  });

  useEffect(() => {
    if (ctaContent) {
      setContent({
        id: ctaContent.id,
        heading_line1: ctaContent.heading_line1,
        heading_highlight: ctaContent.heading_highlight,
        description: ctaContent.description,
      });
    }
  }, [ctaContent]);

  const handleSave = async () => {
    try {
      await updateContent.mutateAsync(content);
      toast.success("CTA content saved!");
    } catch (error) {
      toast.error("Failed to save CTA content");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call to Action Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Heading Line 1</label>
            <Input
              value={content.heading_line1}
              onChange={(e) => setContent({ ...content, heading_line1: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Heading Highlight (colored)</label>
            <Input
              value={content.heading_highlight}
              onChange={(e) => setContent({ ...content, heading_highlight: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <RichTextEditor
            value={content.description}
            onChange={(value) => setContent({ ...content, description: value })}
          />
        </div>
        <Button onClick={handleSave} disabled={updateContent.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {updateContent.isPending ? "Saving..." : "Save"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminCTA;

