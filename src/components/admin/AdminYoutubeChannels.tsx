// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import { useYoutubeChannels, useUpdateYoutubeChannel, useAddYoutubeChannel, useDeleteYoutubeChannel } from "@/hooks/useSiteContent";
import ImageUpload from "./ImageUpload";

const AdminYoutubeChannels = () => {
  const { data: channels, isLoading } = useYoutubeChannels();
  const updateChannel = useUpdateYoutubeChannel();
  const addChannel = useAddYoutubeChannel();
  const deleteChannel = useDeleteYoutubeChannel();

  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ name: "", thumbnail: "", description: "", url: "", color_from: "red-500", color_to: "rose-600" });

  useEffect(() => {
    if (channels) {
      setItems(channels);
    }
  }, [channels]);

  const handleUpdate = async (item: any) => {
    try {
      await updateChannel.mutateAsync(item);
      toast.success("Channel updated!");
    } catch (error) {
      toast.error("Failed to update channel");
    }
  };

  const handleAdd = async () => {
    if (!newItem.name || !newItem.url) {
      toast.error("Please fill in required fields");
      return;
    }
    try {
      await addChannel.mutateAsync({ ...newItem, sort_order: items.length });
      setNewItem({ name: "", thumbnail: "", description: "", url: "", color_from: "red-500", color_to: "rose-600" });
      toast.success("Channel added!");
    } catch (error) {
      toast.error("Failed to add channel");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteChannel.mutateAsync(id);
      toast.success("Channel deleted!");
    } catch (error) {
      toast.error("Failed to delete channel");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>YouTube Channels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="p-4 bg-muted rounded-lg space-y-3">
            <div className="grid md:grid-cols-[1fr_2fr_auto] gap-4">
              <ImageUpload
                value={item.thumbnail}
                onChange={(url) => {
                  const updated = [...items];
                  updated[index] = { ...item, thumbnail: url };
                  setItems(updated);
                }}
                folder="youtube"
                label="Thumbnail"
              />
              <div className="space-y-2">
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[index] = { ...item, name: e.target.value };
                      setItems(updated);
                    }}
                    placeholder="Channel Name"
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[index] = { ...item, url: e.target.value };
                      setItems(updated);
                    }}
                    placeholder="Channel URL"
                  />
                </div>
                <Input
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index] = { ...item, description: e.target.value };
                    setItems(updated);
                  }}
                  placeholder="Description"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleUpdate(items[index])}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium">Add New Channel</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <Input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Channel Name"
            />
            <Input
              value={newItem.url}
              onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
              placeholder="Channel URL"
            />
          </div>
          <ImageUpload
            value={newItem.thumbnail}
            onChange={(url) => setNewItem({ ...newItem, thumbnail: url })}
            folder="youtube"
            label="Thumbnail"
          />
          <Input
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            placeholder="Description"
          />
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Channel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminYoutubeChannels;

