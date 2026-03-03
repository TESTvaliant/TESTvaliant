// website for testvaliant
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Plus, Trash2, ImageIcon, Loader2, GripVertical } from "lucide-react";
import { useGalleryImages, useAddGalleryImage, useUpdateGalleryImage, useDeleteGalleryImage } from "@/hooks/useSiteContent";
import ImageUpload from "./ImageUpload";

const AdminGallery = () => {
  const { data: galleryImages, isLoading } = useGalleryImages();
  const addImage = useAddGalleryImage();
  const updateImage = useUpdateGalleryImage();
  const deleteImage = useDeleteGalleryImage();

  const [images, setImages] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ image_url: "", alt_text: "" });

  useEffect(() => {
    if (galleryImages) {
      setImages(galleryImages);
    }
  }, [galleryImages]);

  const handleUpdate = async (item: any) => {
    try {
      await updateImage.mutateAsync(item);
      toast.success("Image updated!");
    } catch (error) {
      toast.error("Failed to update image");
    }
  };

  const handleAdd = async () => {
    if (!newItem.image_url) {
      toast.error("Please add an image");
      return;
    }
    try {
      await addImage.mutateAsync({ 
        image_url: newItem.image_url, 
        alt_text: newItem.alt_text,
        sort_order: images.length 
      });
      setNewItem({ image_url: "", alt_text: "" });
      toast.success("Image added!");
    } catch (error) {
      toast.error("Failed to add image");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteImage.mutateAsync(id);
      toast.success("Image deleted!");
    } catch (error) {
      toast.error("Failed to delete image");
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
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </span>
          Photo Gallery
        </CardTitle>
        <CardDescription>
          Manage images displayed in the gallery section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Image */}
        <div className="p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg space-y-4">
          <h4 className="font-medium">Add New Image</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUpload
              value={newItem.image_url}
              onChange={(url) => setNewItem({ ...newItem, image_url: url })}
              folder="gallery"
              label="Upload Image"
            />
            <div className="space-y-2">
              <Label>Alt Text (for accessibility)</Label>
              <Input
                value={newItem.alt_text}
                onChange={(e) => setNewItem({ ...newItem, alt_text: e.target.value })}
                placeholder="Describe the image"
              />
            </div>
          </div>
          <Button onClick={handleAdd} disabled={addImage.isPending}>
            {addImage.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add to Gallery
          </Button>
        </div>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No gallery images yet</p>
            <p className="text-sm">Upload images to display in your gallery</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
              >
                <img 
                  src={item.image_url} 
                  alt={item.alt_text || "Gallery image"} 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => handleUpdate(images[index])}
                      className="h-8 w-8 p-0"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={item.alt_text || ""}
                    onChange={(e) => {
                      const updated = [...images];
                      updated[index] = { ...item, alt_text: e.target.value };
                      setImages(updated);
                    }}
                    placeholder="Alt text"
                    className="h-8 text-xs bg-white/90"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Position badge */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 rounded bg-white/90 flex items-center justify-center">
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            {images.length} image{images.length !== 1 ? 's' : ''} in gallery • Hover to edit
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminGallery;

