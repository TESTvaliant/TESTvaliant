// website for testvaliant
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { useOpenLearningTracks, useUpdateOpenLearningTrack } from "@/hooks/useSiteContent";
import { toast } from "sonner";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";

const AdminOpenLearningTracks = () => {
  const { data: tracks, isLoading } = useOpenLearningTracks({ includeFullContent: true });
  const updateTrack = useUpdateOpenLearningTrack();
  const [items, setItems] = useState<any[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (tracks) {
      setItems(tracks);
    }
  }, [tracks]);

  const handleUpdate = async (item: any) => {
    setSavingId(item.id);
    try {
      await updateTrack.mutateAsync(item);
      toast.success("Track updated successfully");
    } catch (error) {
      toast.error("Failed to update track");
    } finally {
      setSavingId(null);
    }
  };

  const handleChange = (id: string, field: string, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-lg">Track {index + 1}: {item.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={item.title || ""}
                  onChange={(e) => handleChange(item.id, "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>YouTube Video ID</Label>
                <Input
                  value={item.youtube_id || ""}
                  onChange={(e) => handleChange(item.id, "youtube_id", e.target.value)}
                  placeholder="e.g., dQw4w9WgXcQ"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              <ImageUpload
                value={item.image_url || ""}
                onChange={(url) => handleChange(item.id, "image_url", url)}
                folder="tracks"
              />
            </div>

            <div className="space-y-2">
              <Label>Intro Text (shown on card)</Label>
              <Textarea
                value={item.intro_text || ""}
                onChange={(e) => handleChange(item.id, "intro_text", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Track Content (HTML - shown on detail page)</Label>
              <RichTextEditor
                value={item.content || ""}
                onChange={(value) => handleChange(item.id, "content", value)}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Why It Matters Title</Label>
                <Input
                  value={item.why_matters_title || ""}
                  onChange={(e) => handleChange(item.id, "why_matters_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>How We Learn Title</Label>
                <Input
                  value={item.how_we_learn_title || ""}
                  onChange={(e) => handleChange(item.id, "how_we_learn_title", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Why It Matters Content (use **text** for bold) - Fallback if no HTML content</Label>
              <Textarea
                value={item.why_matters_content || ""}
                onChange={(e) => handleChange(item.id, "why_matters_content", e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>How We Learn Content (use **text** for bold) - Fallback if no HTML content</Label>
              <Textarea
                value={item.how_we_learn_content || ""}
                onChange={(e) => handleChange(item.id, "how_we_learn_content", e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Bottom Text (optional)</Label>
              <Textarea
                value={item.bottom_text || ""}
                onChange={(e) => handleChange(item.id, "bottom_text", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>YouTube Channel Name</Label>
                <Input
                  value={item.channel_name || ""}
                  onChange={(e) => handleChange(item.id, "channel_name", e.target.value)}
                  placeholder="e.g., TESTvaliant English"
                />
              </div>
              <div className="space-y-2">
                <Label>YouTube Channel URL</Label>
                <Input
                  value={item.channel_url || ""}
                  onChange={(e) => handleChange(item.id, "channel_url", e.target.value)}
                  placeholder="e.g., https://youtube.com/@channel"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Text (optional)</Label>
                <Input
                  value={item.cta_text || ""}
                  onChange={(e) => handleChange(item.id, "cta_text", e.target.value)}
                  placeholder="e.g., Explore Resources"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Link (optional)</Label>
                <Input
                  value={item.cta_link || ""}
                  onChange={(e) => handleChange(item.id, "cta_link", e.target.value)}
                  placeholder="e.g., /resources"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Slug (auto-generated, leave empty for auto)</Label>
              <Input
                value={item.slug || ""}
                onChange={(e) => handleChange(item.id, "slug", e.target.value)}
                placeholder="e.g., english-communication"
              />
            </div>

            <Button
              onClick={() => handleUpdate(item)}
              disabled={savingId === item.id}
              className="w-full md:w-auto"
            >
              {savingId === item.id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Track
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminOpenLearningTracks;

