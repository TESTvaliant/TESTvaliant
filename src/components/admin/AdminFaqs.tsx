// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Plus, Trash2, HelpCircle, Loader2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { useFaqs, useUpdateFaq, useAddFaq, useDeleteFaq } from "@/hooks/useSiteContent";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import RichTextEditor from "./RichTextEditor";

const AdminFaqs = () => {
  const { data: faqs, isLoading } = useFaqs();
  const updateFaq = useUpdateFaq();
  const addFaq = useAddFaq();
  const deleteFaq = useDeleteFaq();

  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ question: "", answer: "" });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (faqs) {
      setItems(faqs);
    }
  }, [faqs]);

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
      await updateFaq.mutateAsync(item);
      toast.success("FAQ updated!");
    } catch (error) {
      toast.error("Failed to update FAQ");
    }
  };

  const handleAdd = async () => {
    if (!newItem.question || !newItem.answer) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addFaq.mutateAsync({ ...newItem, sort_order: items.length });
      setNewItem({ question: "", answer: "" });
      setShowAddForm(false);
      toast.success("FAQ added!");
    } catch (error) {
      toast.error("Failed to add FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFaq.mutateAsync(id);
      toast.success("FAQ deleted!");
    } catch (error) {
      toast.error("Failed to delete FAQ");
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
                <HelpCircle className="w-4 h-4" />
              </span>
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Manage the FAQ section that helps visitors find quick answers
            </CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "outline" : "default"}>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New FAQ Form */}
        {showAddForm && (
          <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 space-y-4">
            <h4 className="font-medium text-primary">New FAQ</h4>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={newItem.question}
                  onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
                  placeholder="What would you like to ask?"
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <RichTextEditor
                  value={newItem.answer}
                  onChange={(value) => setNewItem({ ...newItem, answer: value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
                <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ List */}
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
            <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No FAQs yet</p>
            <p className="text-sm">Click "Add FAQ" to create your first question</p>
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
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate pr-4">
                        {item.question || "Untitled Question"}
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
                          <Label className="text-xs text-muted-foreground">Question</Label>
                          <Input
                            value={item.question}
                            onChange={(e) => {
                              const updated = [...items];
                              updated[index] = { ...item, question: e.target.value };
                              setItems(updated);
                            }}
                            placeholder="Question"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Answer</Label>
                          <RichTextEditor
                            value={item.answer}
                            onChange={(value) => {
                              const updated = [...items];
                              updated[index] = { ...item, answer: value };
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

        {/* Summary */}
        {items.length > 0 && (
          <p className="text-sm text-muted-foreground text-center pt-4">
            {items.length} FAQ{items.length !== 1 ? 's' : ''} total
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminFaqs;

