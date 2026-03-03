// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Save, Plus, Trash2, ChevronDown, ChevronUp, ExternalLink, FileText, Loader2, Calendar, User, Clock } from "lucide-react";
import { useBlogs, useUpdateBlog, useAddBlog, useDeleteBlog } from "@/hooks/useSiteContent";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const AdminBlogs = () => {
  const { data: blogs, isLoading } = useBlogs(undefined, { includeContent: true });
  const updateBlog = useUpdateBlog();
  const addBlog = useAddBlog();
  const deleteBlog = useDeleteBlog();

  const [items, setItems] = useState<any[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ 
    title: "", 
    excerpt: "", 
    image_url: "", 
    author: "", 
    date: "", 
    read_time: "", 
    category: "",
    slug: "",
    content: ""
  });

  useEffect(() => {
    if (blogs) {
      setItems(blogs);
    }
  }, [blogs]);

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
      const updatedItem = {
        ...item,
        slug: item.slug || generateSlug(item.title)
      };
      await updateBlog.mutateAsync(updatedItem);
      toast.success("Blog updated!");
    } catch (error) {
      toast.error("Failed to update blog");
    }
  };

  const handleAdd = async () => {
    if (!newItem.title || !newItem.excerpt) {
      toast.error("Please fill in title and excerpt");
      return;
    }
    try {
      const blogToAdd = {
        ...newItem,
        slug: newItem.slug || generateSlug(newItem.title),
        sort_order: items.length
      };
      await addBlog.mutateAsync(blogToAdd);
      setNewItem({ 
        title: "", excerpt: "", image_url: "", author: "", 
        date: "", read_time: "", category: "", slug: "", content: ""
      });
      setShowAddForm(false);
      toast.success("Blog added!");
    } catch (error) {
      toast.error("Failed to add blog");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog.mutateAsync(id);
      toast.success("Blog deleted!");
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </span>
              Blog Posts
            </CardTitle>
            <CardDescription>
              Create and manage blog articles for your website
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "outline" : "default"}>
            <Plus className="w-4 h-4 mr-2" />
            New Blog
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Blog Form */}
        {showAddForm && (
          <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 space-y-4">
            <h4 className="font-medium text-primary">Create New Blog Post</h4>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Blog title"
                />
              </div>
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input
                  value={newItem.slug}
                  onChange={(e) => setNewItem({ ...newItem, slug: e.target.value })}
                  placeholder="Auto-generated from title"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <User className="w-3 h-3" /> Author
                </Label>
                <Input
                  value={newItem.author}
                  onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date
                </Label>
                <Input
                  value={newItem.date}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                  placeholder="Jan 1, 2025"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Read Time
                </Label>
                <Input
                  value={newItem.read_time}
                  onChange={(e) => setNewItem({ ...newItem, read_time: e.target.value })}
                  placeholder="5 min read"
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Input
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="IELTS, Tips, etc."
                />
              </div>
            </div>

            <ImageUpload
              value={newItem.image_url}
              onChange={(url) => setNewItem({ ...newItem, image_url: url })}
              folder="blogs"
              label="Cover Image"
            />

            <div className="space-y-2">
              <Label>Excerpt (Short Description) *</Label>
              <Textarea
                value={newItem.excerpt}
                onChange={(e) => setNewItem({ ...newItem, excerpt: e.target.value })}
                placeholder="A brief summary shown on blog cards..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Full Content</Label>
              <RichTextEditor
                value={newItem.content}
                onChange={(content) => setNewItem({ ...newItem, content })}
                placeholder="Write the full blog content here..."
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Publish Blog
              </Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Blog List */}
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No blog posts yet</p>
            <p className="text-sm">Click "New Blog" to write your first article</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <Collapsible
                key={item.id}
                open={expandedItems.has(item.id)}
                onOpenChange={() => toggleExpanded(item.id)}
              >
                <div className="rounded-lg border bg-card hover:shadow-sm transition-shadow overflow-hidden">
                  <div className="flex items-center gap-4 p-4">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.title || "Untitled Blog"}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded">
                          {item.category || "Uncategorized"}
                        </span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.slug && (
                        <a 
                          href={`/blog/${item.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                      )}
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
                      <div className="pt-4 grid md:grid-cols-[180px_1fr] gap-4">
                        <ImageUpload
                          value={item.image_url}
                          onChange={(url) => {
                            const updated = [...items];
                            updated[index] = { ...item, image_url: url };
                            setItems(updated);
                          }}
                          folder="blogs"
                          label="Cover Image"
                        />
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Title</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[index] = { ...item, title: e.target.value };
                                  setItems(updated);
                                }}
                                placeholder="Blog title"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">URL Slug</Label>
                              <Input
                                value={item.slug || ""}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[index] = { ...item, slug: e.target.value };
                                  setItems(updated);
                                }}
                                placeholder="url-friendly-slug"
                              />
                            </div>
                          </div>

                          <div className="grid md:grid-cols-4 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Author</Label>
                              <Input
                                value={item.author}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[index] = { ...item, author: e.target.value };
                                  setItems(updated);
                                }}
                                placeholder="Author"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Date</Label>
                              <Input
                                value={item.date}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[index] = { ...item, date: e.target.value };
                                  setItems(updated);
                                }}
                                placeholder="Date"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Read Time</Label>
                              <Input
                                value={item.read_time}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[index] = { ...item, read_time: e.target.value };
                                  setItems(updated);
                                }}
                                placeholder="5 min"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Category</Label>
                              <Input
                                value={item.category}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[index] = { ...item, category: e.target.value };
                                  setItems(updated);
                                }}
                                placeholder="Category"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Excerpt</Label>
                            <Textarea
                              value={item.excerpt}
                              onChange={(e) => {
                                const updated = [...items];
                                updated[index] = { ...item, excerpt: e.target.value };
                                setItems(updated);
                              }}
                              placeholder="Short description..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Full Content</Label>
                        <RichTextEditor
                          value={item.content || ""}
                          onChange={(content) => {
                            const updated = [...items];
                            updated[index] = { ...item, content };
                            setItems(updated);
                          }}
                          placeholder="Write blog content..."
                        />
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
            {items.length} blog post{items.length !== 1 ? 's' : ''} total
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBlogs;

