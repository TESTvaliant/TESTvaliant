// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Plus, Trash2, Quote, Loader2, ChevronDown, ChevronUp, Youtube } from "lucide-react";
import { useTestimonials, useUpdateTestimonial, useAddTestimonial, useDeleteTestimonial, useTestimonialsSettings, useUpdateTestimonialsSettings } from "@/hooks/useSiteContent";
import ImageUpload from "./ImageUpload";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import RichTextEditor from "./RichTextEditor";

const AdminTestimonials = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const { data: settings, isLoading: settingsLoading } = useTestimonialsSettings();
  const updateTestimonial = useUpdateTestimonial();
  const addTestimonial = useAddTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const updateSettings = useUpdateTestimonialsSettings();

  const [items, setItems] = useState<any[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [settingsId, setSettingsId] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", role: "", image_url: "", story: "", role_color: "#f59e0b" });

  useEffect(() => {
    if (testimonials) {
      setItems(testimonials);
    }
  }, [testimonials]);

  useEffect(() => {
    if (settings) {
      setYoutubeUrl(settings.youtube_url);
      setSettingsId(settings.id);
    }
  }, [settings]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleUpdate = async (item: any) => {
    try {
      await updateTestimonial.mutateAsync(item);
      toast.success("Testimonial updated!");
    } catch (error) {
      toast.error("Failed to update testimonial");
    }
  };

  const handleAdd = async () => {
    if (!newItem.name || !newItem.story) {
      toast.error("Please fill in name and story");
      return;
    }
    try {
      await addTestimonial.mutateAsync({ ...newItem, sort_order: items.length });
      setNewItem({ name: "", role: "", image_url: "", story: "", role_color: "#f59e0b" });
      setShowAddForm(false);
      toast.success("Testimonial added!");
    } catch (error) {
      toast.error("Failed to add testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success("Testimonial deleted!");
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync({ id: settingsId, youtube_url: youtubeUrl });
      toast.success("Settings saved!");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  if (isLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* YouTube Video Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Youtube className="w-4 h-4 text-red-500" />
            </span>
            Success Stories Video
          </CardTitle>
          <CardDescription>
            Featured YouTube video shown in the testimonials section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>YouTube Embed URL</Label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
            />
            <p className="text-xs text-muted-foreground">
              Use the embed URL format: https://www.youtube.com/embed/VIDEO_ID
            </p>
          </div>
          <Button onClick={handleSaveSettings} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Video Settings
          </Button>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Quote className="w-4 h-4" />
                </span>
                Student Testimonials
              </CardTitle>
              <CardDescription>
                Success stories from your students
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "outline" : "default"}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Form */}
          {showAddForm && (
            <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 space-y-4">
              <h4 className="font-medium text-primary">New Testimonial</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Student name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role / Achievement</Label>
                  <Input
                    value={newItem.role}
                    onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
                    placeholder="e.g., IELTS Band 8.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role Text Color</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={newItem.role_color}
                      onChange={(e) => setNewItem({ ...newItem, role_color: e.target.value })}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={newItem.role_color}
                      onChange={(e) => setNewItem({ ...newItem, role_color: e.target.value })}
                      placeholder="#f59e0b"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <ImageUpload
                value={newItem.image_url}
                onChange={(url) => setNewItem({ ...newItem, image_url: url })}
                folder="testimonials"
                label="Photo"
              />
              <div className="space-y-2">
                <Label>Story / Quote *</Label>
                <RichTextEditor
                  value={newItem.story}
                  onChange={(value) => setNewItem({ ...newItem, story: value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* List */}
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
              <Quote className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-medium">No testimonials yet</p>
              <p className="text-sm">Add your first student success story</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <Collapsible
                  key={item.id}
                  open={expandedItems.has(item.id)}
                  onOpenChange={() => toggleExpanded(item.id)}
                >
                  <div className="rounded-lg border bg-card hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4 p-4">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-semibold">
                            {item.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{item.name || "Unnamed"}</h4>
                        <p className="text-sm text-muted-foreground truncate">{item.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(items[index]);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            {expandedItems.has(item.id) ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-0 space-y-4 border-t">
                        <div className="pt-4 grid md:grid-cols-[120px_1fr] gap-4">
                          <ImageUpload
                            value={item.image_url}
                            onChange={(url) => {
                              const updated = [...items];
                              updated[index] = { ...item, image_url: url };
                              setItems(updated);
                            }}
                            folder="testimonials"
                            label="Photo"
                          />
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Name</Label>
                                <Input
                                  value={item.name}
                                  onChange={(e) => {
                                    const updated = [...items];
                                    updated[index] = { ...item, name: e.target.value };
                                    setItems(updated);
                                  }}
                                  placeholder="Name"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Role / Achievement</Label>
                                <Input
                                  value={item.role}
                                  onChange={(e) => {
                                    const updated = [...items];
                                    updated[index] = { ...item, role: e.target.value };
                                    setItems(updated);
                                  }}
                                  placeholder="Role"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">Role Text Color</Label>
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="color"
                                    value={item.role_color || "#f59e0b"}
                                    onChange={(e) => {
                                      const updated = [...items];
                                      updated[index] = { ...item, role_color: e.target.value };
                                      setItems(updated);
                                    }}
                                    className="w-10 h-10 rounded border cursor-pointer"
                                  />
                                  <Input
                                    value={item.role_color || "#f59e0b"}
                                    onChange={(e) => {
                                      const updated = [...items];
                                      updated[index] = { ...item, role_color: e.target.value };
                                      setItems(updated);
                                    }}
                                    placeholder="#f59e0b"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Story</Label>
                              <RichTextEditor
                                value={item.story}
                                onChange={(value) => {
                                  const updated = [...items];
                                  updated[index] = { ...item, story: value };
                                  setItems(updated);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <p className="text-sm text-muted-foreground text-center pt-4">
              {items.length} testimonial{items.length !== 1 ? 's' : ''} total
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestimonials;

