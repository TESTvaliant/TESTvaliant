// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useAboutContent, useUpdateAboutContent, useAboutStats, useUpdateAboutStat } from "@/hooks/useSiteContent";
import RichTextEditor from "./RichTextEditor";

const AdminAboutSection = () => {
  const { data: aboutContent, isLoading: contentLoading } = useAboutContent();
  const { data: aboutStats, isLoading: statsLoading } = useAboutStats();
  const updateContent = useUpdateAboutContent();
  const updateStat = useUpdateAboutStat();

  const [content, setContent] = useState({
    id: "",
    heading_line1: "",
    heading_highlight: "",
    heading_line2: "",
    paragraph1: "",
    paragraph2: "",
    paragraph3: "",
    paragraph4: "",
    paragraph5: "",
    youtube_url: "",
  });

  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    if (aboutContent) {
      setContent({
        id: aboutContent.id,
        heading_line1: aboutContent.heading_line1,
        heading_highlight: aboutContent.heading_highlight,
        heading_line2: aboutContent.heading_line2,
        paragraph1: aboutContent.paragraph1,
        paragraph2: aboutContent.paragraph2,
        paragraph3: aboutContent.paragraph3,
        paragraph4: (aboutContent as any).paragraph4 || "",
        paragraph5: (aboutContent as any).paragraph5 || "",
        youtube_url: aboutContent.youtube_url,
      });
    }
  }, [aboutContent]);

  useEffect(() => {
    if (aboutStats) {
      setStats(aboutStats);
    }
  }, [aboutStats]);

  const handleSaveContent = async () => {
    try {
      await updateContent.mutateAsync(content);
      toast.success("About content saved!");
    } catch (error) {
      toast.error("Failed to save about content");
    }
  };

  const handleSaveStat = async (stat: any) => {
    try {
      await updateStat.mutateAsync(stat);
      toast.success("Stat saved!");
    } catch (error) {
      toast.error("Failed to save stat");
    }
  };

  if (contentLoading || statsLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Heading Line 1</label>
              <Input
                value={content.heading_line1}
                onChange={(e) => setContent({ ...content, heading_line1: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Heading Highlight</label>
              <Input
                value={content.heading_highlight}
                onChange={(e) => setContent({ ...content, heading_highlight: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Heading Line 2</label>
              <Input
                value={content.heading_line2}
                onChange={(e) => setContent({ ...content, heading_line2: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Paragraph 1</label>
            <RichTextEditor
              value={content.paragraph1}
              onChange={(value) => setContent({ ...content, paragraph1: value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Paragraph 2</label>
            <RichTextEditor
              value={content.paragraph2}
              onChange={(value) => setContent({ ...content, paragraph2: value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Paragraph 3</label>
            <RichTextEditor
              value={content.paragraph3}
              onChange={(value) => setContent({ ...content, paragraph3: value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Paragraph 4 (optional)</label>
            <RichTextEditor
              value={content.paragraph4}
              onChange={(value) => setContent({ ...content, paragraph4: value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Paragraph 5 (optional)</label>
            <RichTextEditor
              value={content.paragraph5}
              onChange={(value) => setContent({ ...content, paragraph5: value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">YouTube Video URL (embed format)</label>
            <Input
              value={content.youtube_url}
              onChange={(e) => setContent({ ...content, youtube_url: e.target.value })}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
            />
          </div>
          <Button onClick={handleSaveContent} disabled={updateContent.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {updateContent.isPending ? "Saving..." : "Save Content"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stats Bar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={stat.id} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium">Value</label>
                <Input
                  value={stat.value}
                  onChange={(e) => {
                    const updated = [...stats];
                    updated[index] = { ...stat, value: e.target.value };
                    setStats(updated);
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Label</label>
                <Input
                  value={stat.label}
                  onChange={(e) => {
                    const updated = [...stats];
                    updated[index] = { ...stat, label: e.target.value };
                    setStats(updated);
                  }}
                />
              </div>
              <Button size="sm" onClick={() => handleSaveStat(stats[index])}>
                <Save className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAboutSection;

