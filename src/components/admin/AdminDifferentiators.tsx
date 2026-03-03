// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Plus, Trash2, Settings, Loader2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { useDifferentiators, useUpdateDifferentiator, useAddDifferentiator, useDeleteDifferentiator } from "@/hooks/useSiteContent";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import RichTextEditor from "./RichTextEditor";

const AdminDifferentiators = () => {
  const { data: differentiators, isLoading } = useDifferentiators();
  const updateDiff = useUpdateDifferentiator();
  const addDiff = useAddDifferentiator();
  const deleteDiff = useDeleteDifferentiator();

  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ title: "", description: "" });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (differentiators) {
      setItems(differentiators);
    }
  }, [differentiators]);

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
      await updateDiff.mutateAsync(item);
      toast.success("Differentiator updated!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleAdd = async () => {
    if (!newItem.title || !newItem.description) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addDiff.mutateAsync({ ...newItem, sort_order: items.length });
      setNewItem({ title: "", description: "" });
      setShowAddForm(false);
      toast.success("Differentiator added!");
    } catch (error) {
      toast.error("Failed to add");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDiff.mutateAsync(id);
      toast.success("Differentiator deleted!");
    } catch (error) {
      toast.error("Failed to delete");
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
                <Settings className="w-4 h-4" />
              </span>
              Why Choose Us
            </CardTitle>
            <CardDescription>
              Highlight unique features that differentiate your offering
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "outline" : "default"}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Form */}
        {showAddForm && (
          <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 space-y-4">
            <h4 className="font-medium text-primary">New Differentiator</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g., Personalized Learning Paths"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <RichTextEditor
                  value={newItem.description}
                  onChange={(value) => setNewItem({ ...newItem, description: value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Items List */}
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
            <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No differentiators yet</p>
            <p className="text-sm">Add reasons why students should choose you</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <Collapsible
                key={item.id}
                open={expandedItems.has(item.id)}
                onOpenChange={() => toggleExpanded(item.id)}
              >
                <div className="rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3 p-4">
                    <div className="text-muted-foreground cursor-grab">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {item.title || "Untitled"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description}
                      </p>
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
                      <div className="pt-4 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[index] = { ...item, title: e.target.value };
                              setItems(updated);
                            }}
                            placeholder="Title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Description</Label>
                          <RichTextEditor
                            value={item.description}
                            onChange={(value) => {
                              const updated = [...items];
                              updated[index] = { ...item, description: value };
                              setItems(updated);
                            }}
                          />
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
            {items.length} item{items.length !== 1 ? 's' : ''} total
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDifferentiators;

