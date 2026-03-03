// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Plus, Trash2, Image, Loader2, GripVertical } from "lucide-react";
import { useHeroContent, useUpdateHeroContent, useHeroImages, useUpdateHeroImage, useAddHeroImage, useDeleteHeroImage } from "@/hooks/useSiteContent";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";

const AdminHeroSection = () => {
  const { data: heroContent, isLoading: contentLoading } = useHeroContent();
  const { data: heroImages, isLoading: imagesLoading } = useHeroImages();
  const updateContent = useUpdateHeroContent();
  const updateImage = useUpdateHeroImage();
  const addImage = useAddHeroImage();
  const deleteImage = useDeleteHeroImage();

  const [content, setContent] = useState({
    id: "",
    badge_text: "",
    heading_line1: "",
    heading_highlight: "",
    heading_line2: "",
    description: "",
    subline: "",
    micro_text: "",
    explainer_line: "",
  });

  const [images, setImages] = useState<any[]>([]);
  const [newImage, setNewImage] = useState({ src: "", alt: "" });

  useEffect(() => {
    if (heroContent) {
      setContent({
        id: heroContent.id,
        badge_text: heroContent.badge_text,
        heading_line1: heroContent.heading_line1,
        heading_highlight: heroContent.heading_highlight,
        heading_line2: heroContent.heading_line2,
        description: heroContent.description,
        subline: (heroContent as any).subline || "",
        micro_text: (heroContent as any).micro_text || "",
        explainer_line: (heroContent as any).explainer_line || "",
      });
    }
  }, [heroContent]);

  useEffect(() => {
    if (heroImages) {
      setImages(heroImages);
    }
  }, [heroImages]);

  const handleSaveContent = async () => {
    try {
      await updateContent.mutateAsync(content);
      toast.success("Hero content saved!");
    } catch (error) {
      toast.error("Failed to save hero content");
    }
  };

  const handleUpdateImage = async (image: any) => {
    try {
      await updateImage.mutateAsync(image);
      toast.success("Image updated!");
    } catch (error) {
      toast.error("Failed to update image");
    }
  };

  const handleAddImage = async () => {
    if (!newImage.src || !newImage.alt) {
      toast.error("Please fill in image URL and alt text");
      return;
    }
    try {
      await addImage.mutateAsync({ ...newImage, sort_order: images.length });
      setNewImage({ src: "", alt: "" });
      toast.success("Image added!");
    } catch (error) {
      toast.error("Failed to add image");
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImage.mutateAsync(id);
      toast.success("Image deleted!");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  if (contentLoading || imagesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Text Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              📝
            </span>
            Hero Content
          </CardTitle>
          <CardDescription>
            Edit the main hero banner text that appears at the top of your homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Badge Text */}
          <div className="space-y-2">
            <Label htmlFor="badge">Badge Text</Label>
            <p className="text-xs text-muted-foreground">Short tagline shown above the headline</p>
            <Input
              id="badge"
              value={content.badge_text}
              onChange={(e) => setContent({ ...content, badge_text: e.target.value })}
              placeholder="English. Exams. Information."
            />
          </div>

          {/* Headline Section */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm">Headline Structure</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="line1">Line 1</Label>
                <Input
                  id="line1"
                  value={content.heading_line1}
                  onChange={(e) => setContent({ ...content, heading_line1: e.target.value })}
                  placeholder="Helping students navigate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highlight" className="text-secondary">Highlighted Text</Label>
                <Input
                  id="highlight"
                  value={content.heading_highlight}
                  onChange={(e) => setContent({ ...content, heading_highlight: e.target.value })}
                  placeholder="education opportunities"
                  className="border-secondary/50 focus:border-secondary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="line2">Line 2</Label>
                <Input
                  id="line2"
                  value={content.heading_line2}
                  onChange={(e) => setContent({ ...content, heading_line2: e.target.value })}
                  placeholder="- in India and globally."
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-background/50 p-2 rounded">
              Preview: {content.heading_line1} <span className="text-secondary font-medium">{content.heading_highlight}</span> {content.heading_line2}
            </p>
          </div>

          {/* Subline */}
          <div className="space-y-2">
            <Label htmlFor="subline">Subline</Label>
            <p className="text-xs text-muted-foreground">Main description below the headline</p>
            <RichTextEditor
              value={content.subline}
              onChange={(value) => setContent({ ...content, subline: value })}
            />
          </div>

          {/* Micro Text */}
          <div className="space-y-2">
            <Label htmlFor="micro">Micro Text Pills</Label>
            <p className="text-xs text-muted-foreground">Separate items with " • " (bullet with spaces)</p>
            <Input
              id="micro"
              value={content.micro_text}
              onChange={(e) => setContent({ ...content, micro_text: e.target.value })}
              placeholder="Public initiative • Real experience • No paid services"
            />
          </div>

          {/* Explainer Line */}
          <div className="space-y-2">
            <Label htmlFor="explainer">Explainer Line</Label>
            <p className="text-xs text-muted-foreground">Italic quote explaining the mission</p>
            <RichTextEditor
              value={content.explainer_line}
              onChange={(value) => setContent({ ...content, explainer_line: value })}
            />
          </div>

          <Button onClick={handleSaveContent} disabled={updateContent.isPending} className="w-full sm:w-auto">
            {updateContent.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Hero Content
          </Button>
        </CardContent>
      </Card>

      {/* Background Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Image className="w-4 h-4" />
            </span>
            Background Images
          </CardTitle>
          <CardDescription>
            Manage the rotating background images for the hero section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Images */}
          {images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
              <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No background images yet</p>
              <p className="text-sm">Add your first image below</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="flex gap-4 items-start p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center text-muted-foreground">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <img 
                    src={img.src} 
                    alt={img.alt} 
                    className="w-32 h-20 object-cover rounded-lg border" 
                  />
                  <div className="flex-1 space-y-3">
                    <ImageUpload
                      value={img.src}
                      onChange={(url) => {
                        const updated = [...images];
                        updated[index] = { ...img, src: url };
                        setImages(updated);
                      }}
                      folder="hero"
                      label="Image URL"
                    />
                    <div className="space-y-1">
                      <Label className="text-xs">Alt Text</Label>
                      <Input
                        value={img.alt}
                        onChange={(e) => {
                          const updated = [...images];
                          updated[index] = { ...img, alt: e.target.value };
                          setImages(updated);
                        }}
                        placeholder="Describe the image"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdateImage(images[index])}
                      className="h-9"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDeleteImage(img.id)}
                      className="h-9"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Image */}
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium">Add New Background Image</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <ImageUpload
                value={newImage.src}
                onChange={(url) => setNewImage({ ...newImage, src: url })}
                folder="hero"
                label="Upload or Enter URL"
              />
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  value={newImage.alt}
                  onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                  placeholder="Describe the image for accessibility"
                />
              </div>
            </div>
            <Button onClick={handleAddImage} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHeroSection;

