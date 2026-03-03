// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Star, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGoogleReviews,
  useGoogleReviewsSettings,
  useAddGoogleReview,
  useUpdateGoogleReview,
  useDeleteGoogleReview,
  useUpdateGoogleReviewsSettings,
} from "@/hooks/useSiteContent";
import ImageUpload from "./ImageUpload";

interface GoogleReview {
  id: string;
  reviewer_name: string;
  reviewer_image_url: string | null;
  review_date: string;
  rating: number;
  review_text: string;
  sort_order: number;
  is_visible: boolean;
}

const AdminGoogleReviews = () => {
  const { toast } = useToast();
  const { data: reviewsData, isLoading: reviewsLoading } = useGoogleReviews();
  const { data: settingsData, isLoading: settingsLoading } = useGoogleReviewsSettings();
  const addReview = useAddGoogleReview();
  const updateReview = useUpdateGoogleReview();
  const deleteReview = useDeleteGoogleReview();
  const updateSettings = useUpdateGoogleReviewsSettings();

  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [newReview, setNewReview] = useState({
    reviewer_name: "",
    reviewer_image_url: "",
    review_date: new Date().toISOString().split("T")[0],
    rating: 5,
    review_text: "",
  });
  const [settings, setSettings] = useState({
    id: "",
    section_title: "What Our Students Say on Google",
    total_reviews_count: 111,
    google_place_id: "",
    embed_code: "",
  });

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData as GoogleReview[]);
    }
  }, [reviewsData]);

  useEffect(() => {
    if (settingsData) {
      setSettings({
        id: settingsData.id,
        section_title: settingsData.section_title || "What Our Students Say on Google",
        total_reviews_count: settingsData.total_reviews_count || 111,
        google_place_id: settingsData.google_place_id || "",
        embed_code: settingsData.embed_code || "",
      });
    }
  }, [settingsData]);

  const handleUpdateReview = async (review: GoogleReview) => {
    try {
      await updateReview.mutateAsync(review);
      toast({ title: "Success", description: "Review updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update review", variant: "destructive" });
    }
  };

  const handleToggleVisibility = async (review: GoogleReview) => {
    const updatedReview = { ...review, is_visible: !review.is_visible };
    try {
      await updateReview.mutateAsync(updatedReview);
      setReviews(reviews.map((r) => (r.id === review.id ? updatedReview : r)));
      toast({ 
        title: "Success", 
        description: `Review ${updatedReview.is_visible ? 'shown' : 'hidden'} on website` 
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update visibility", variant: "destructive" });
    }
  };

  const handleAddReview = async () => {
    if (!newReview.reviewer_name || !newReview.review_text) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    try {
      await addReview.mutateAsync({
        ...newReview,
        reviewer_image_url: newReview.reviewer_image_url || null,
        sort_order: reviews.length,
        is_visible: true,
      });
      setNewReview({
        reviewer_name: "",
        reviewer_image_url: "",
        review_date: new Date().toISOString().split("T")[0],
        rating: 5,
        review_text: "",
      });
      toast({ title: "Success", description: "Review added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add review", variant: "destructive" });
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview.mutateAsync(id);
      toast({ title: "Success", description: "Review deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete review", variant: "destructive" });
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync(settings);
      toast({ title: "Success", description: "Settings saved successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    }
  };

  const renderStarSelector = (rating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-0.5 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const visibleCount = reviews.filter(r => r.is_visible).length;

  if (reviewsLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Google Reviews Section Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={settings.section_title}
                onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Reviews Count (displayed)</Label>
              <Input
                type="number"
                value={settings.total_reviews_count}
                onChange={(e) =>
                  setSettings({ ...settings, total_reviews_count: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Elfsight Embed Code (paste from Elfsight dashboard)</Label>
            <Textarea
              value={settings.embed_code}
              onChange={(e) => setSettings({ ...settings, embed_code: e.target.value })}
              placeholder="<!-- Elfsight Google Reviews --> <script src=..."
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Paste your Elfsight widget embed code here. The widget will display automatically.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Google Place ID (optional fallback)</Label>
            <Input
              value={settings.google_place_id}
              onChange={(e) => setSettings({ ...settings, google_place_id: e.target.value })}
              placeholder="ChIJ..."
            />
          </div>
          <Button onClick={handleSaveSettings} disabled={updateSettings.isPending}>
            {updateSettings.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Add New Review */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Manual Review</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add reviews manually to display alongside the Elfsight widget
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Reviewer Name *</Label>
              <Input
                value={newReview.reviewer_name}
                onChange={(e) => setNewReview({ ...newReview, reviewer_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Review Date</Label>
              <Input
                type="date"
                value={newReview.review_date}
                onChange={(e) => setNewReview({ ...newReview, review_date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reviewer Image (optional)</Label>
            <ImageUpload
              value={newReview.reviewer_image_url}
              onChange={(url) => setNewReview({ ...newReview, reviewer_image_url: url })}
            />
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            {renderStarSelector(newReview.rating, (rating) => setNewReview({ ...newReview, rating }))}
          </div>
          <div className="space-y-2">
            <Label>Review Text *</Label>
            <Textarea
              value={newReview.review_text}
              onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
              placeholder="Write the review text here..."
              rows={3}
            />
          </div>
          <Button onClick={handleAddReview} disabled={addReview.isPending}>
            {addReview.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Review
          </Button>
        </CardContent>
      </Card>

      {/* Existing Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Existing Reviews ({reviews.length})</span>
            <span className="text-sm font-normal text-muted-foreground">
              {visibleCount} visible on website
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className={`border rounded-lg p-4 space-y-4 transition-colors ${
                review.is_visible ? 'border-border bg-card' : 'border-muted bg-muted/30'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">Review #{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={review.is_visible}
                      onCheckedChange={() => handleToggleVisibility(review)}
                    />
                    <span className="text-sm flex items-center gap-1">
                      {review.is_visible ? (
                        <>
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Hidden</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reviewer Name</Label>
                  <Input
                    value={review.reviewer_name}
                    onChange={(e) => {
                      const updated = reviews.map((r) =>
                        r.id === review.id ? { ...r, reviewer_name: e.target.value } : r
                      );
                      setReviews(updated);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Review Date</Label>
                  <Input
                    type="date"
                    value={review.review_date}
                    onChange={(e) => {
                      const updated = reviews.map((r) =>
                        r.id === review.id ? { ...r, review_date: e.target.value } : r
                      );
                      setReviews(updated);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reviewer Image</Label>
                <ImageUpload
                  value={review.reviewer_image_url || ""}
                  onChange={(url) => {
                    const updated = reviews.map((r) =>
                      r.id === review.id ? { ...r, reviewer_image_url: url } : r
                    );
                    setReviews(updated);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                {renderStarSelector(review.rating, (rating) => {
                  const updated = reviews.map((r) => (r.id === review.id ? { ...r, rating } : r));
                  setReviews(updated);
                })}
              </div>

              <div className="space-y-2">
                <Label>Review Text</Label>
                <Textarea
                  value={review.review_text}
                  onChange={(e) => {
                    const updated = reviews.map((r) =>
                      r.id === review.id ? { ...r, review_text: e.target.value } : r
                    );
                    setReviews(updated);
                  }}
                  rows={3}
                />
              </div>

              <Button onClick={() => handleUpdateReview(review)} disabled={updateReview.isPending} size="sm">
                Save Changes
              </Button>
            </div>
          ))}

          {reviews.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No reviews yet. Add your first review above!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGoogleReviews;

