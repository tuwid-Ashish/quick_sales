 import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProductImage } from "@/types";
import { AddProduct, EditProduct, GetProductById } from "@/api";
import { OctagonX, Star, Upload, Plus, ChevronUp, ChevronDown, GripVertical } from "lucide-react";

// Validation Schema using zod for form fields (excluding images)
const productSchema = zod.object({
  name: zod.string().min(1, "Product name is required"),
  price: zod.number({ invalid_type_error: "Price is required" })
    .positive("Price must be positive")
    .min(0.01, "Price must be at least 0.01"),
  description: zod.string().optional(),
  category: zod.string().min(1, "Category is required"),
  stock: zod.number({ invalid_type_error: "Stock is required" })
    .int("Stock must be an integer")
    .positive("Stock must be positive")
    .min(1, "At least one unit is required"),
  bulkDiscountPercentage: zod.number({ invalid_type_error: "Discount must be a number" })
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional(),
});

// Define a type for what is controlled by the form (without images)
type ProductFormInput = zod.infer<typeof productSchema>;

interface AddProductFormProps {
  onAddProduct: () => void;
  productId?: string; // Add this prop
  isEditing?: boolean; // Add this to control form behavior
}

export default function AddProductForm({ onAddProduct, productId, isEditing = false  }: AddProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "quick",
      bulkDiscountPercentage: 0,
    },
  });

  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(null);
  const MAX_IMAGES = 8;

  // Update button text based on mode
  const buttonText = isEditing ? "Edit Product" : "+ Add Product";
  console.log("the status of button", isEditing, buttonText);

  // Fetch product data when editing
  useEffect(() => {
    if (productId) {
      GetProductById(productId)
        .then((response) => {
          const productData = response.data.data;
          // Set form defaults
          reset({
            name: productData.name,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            stock: productData.stock,
            bulkDiscountPercentage: productData.bulkDiscountPercentage || 0,
          });
          // Set images
          // Convert existing images to ProductImage format
          const existingImages: ProductImage[] = productData.images.map((url: string) => ({
            id: crypto.randomUUID(),
            url,
            isExisting: true
          }));
          setImages(existingImages);
          // Set featured image
          if (productData.featuredImage) {
            const featuredId = existingImages.find(img => img.url === productData.featuredImage)?.id;
            setFeaturedImageId(featuredId || null);
          }
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
        });
    }
  }, [productId]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (!image.isExisting) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, []);

  // Allow multiple file selection but limit to 8 images
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; 
    if (!files) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    const newFiles = Array.from(files).slice(0, remainingSlots);
    
    const newImages: ProductImage[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
      isExisting: false
    }));

    setImages(prev => [...prev, ...newImages]);
    // Auto-set first image as featured if not already set
    if (!featuredImageId && newImages.length > 0) {
      setFeaturedImageId(newImages[0].id);
    }
  }

  // Handle featured image selection
  const handleSetFeatured = (imageId: string) => {
    setFeaturedImageId(imageId);
  };

  // Handle move image up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setImages(newImages);
  };

  // Handle move image down
  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setImages(newImages);
  };

  // Update handleRemoveFile to handle both types of images
  const handleRemoveFile = (imageToRemove: ProductImage) => {
    if (!imageToRemove.isExisting) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setImages(prev => prev.filter(img => img.id !== imageToRemove.id));
    
    // Clear featured image if the removed image was featured
    if (featuredImageId === imageToRemove.id) {
      setFeaturedImageId(images.length > 1 ? images[0].id : null);
    }
  };

  const onSubmit: SubmitHandler<ProductFormInput> = (data) => {
    // Validate at least one image is added
    if (images.length === 0) {
      alert("Please add at least one product image");
      return;
    }

    // Validate featured image is set
    if (!featuredImageId) {
      alert("Please select a featured image");
      return;
    }

    const featuredImage = images.find(img => img.id === featuredImageId) || null;
    const featuredImageIndex = featuredImage
      ? images.findIndex(img => img.id === featuredImage.id)
      : -1;

    // Create a FormData object for file upload
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.description || "");
    formData.append("category", data.category);
    formData.append("stock", data.stock.toString());
    formData.append("bulkDiscountPercentage", (data.bulkDiscountPercentage || 0).toString());
    formData.append(
      "featuredImage",
      featuredImage && !featuredImage.url.startsWith("blob:") ? featuredImage.url : ""
    );
    formData.append("featuredImageIndex", featuredImageIndex.toString());
    formData.append(
      "imageOrder",
      JSON.stringify(images.map((image) => ({ isExisting: image.isExisting })))
    );

    if (productId) {
      formData.append("_id", productId);
    }

    // Handle images
    const existingImages = images.filter(img => img.isExisting).map(img => img.url);
    const newFiles = images.filter(img => !img.isExisting).map(img => img.file!);

    newFiles.forEach(file => {
      formData.append("images", file);
    });

    existingImages.forEach(url => {
      formData.append("existingImages", url);
    });

    const apiCall = isEditing ? EditProduct : AddProduct;

    console.log("the detail of method:", apiCall);
    
    apiCall(formData as any)
      .then((response) => {
        onAddProduct();
        console.log("The response is:", response);
        setOpen(false);
        reset();
        setImages([]);
        setFeaturedImageId(null);
      })
      .catch((error) => {
        console.error("Error adding product:", error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex justify-end p-4">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <Input 
                {...register("name")} 
                placeholder="Enter product name" 
                className="w-full"
              />
              {errors.name && 
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              }
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full"
                />
                {errors.price && 
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                }
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <Input
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
                  placeholder="0"
                  className="w-full"
                />
                {errors.stock && 
                  <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                }
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <Input 
                  {...register("category")} 
                  placeholder="Enter category" 
                  className="w-full"
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bulk Discount (%)</label>
                <Input
                  type="number"
                  {...register("bulkDiscountPercentage", { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full"
                />
                {errors.bulkDiscountPercentage && 
                  <p className="text-red-500 text-sm mt-1">{errors.bulkDiscountPercentage.message}</p>
                }
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea 
                {...register("description")} 
                placeholder="Enter product description" 
                className="w-full"
                rows={4}
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Product Images</h3>
              <span className="text-sm text-gray-600">{images.length}/{MAX_IMAGES}</span>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-white hover:bg-blue-50 transition">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-blue-500" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB (Max {MAX_IMAGES} images)
                  </p>
                </div>
                <Input 
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={images.length >= MAX_IMAGES}
                  className="hidden"
                />
              </label>
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Manage Images - Drag to reorder or use arrow buttons</p>
                <div className="space-y-3">
                  {images.map((img, index) => (
                    <div 
                      key={img.id}
                      className={`flex gap-3 p-3 rounded-lg border-2 transition-all ${
                        featuredImageId === img.id 
                          ? 'border-yellow-400 bg-yellow-50 ring-1 ring-yellow-300' 
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      {/* Grip Handle */}
                      <div className="flex items-center justify-center">
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                      </div>

                      {/* Image Preview */}
                      <img
                        src={img.url}
                        alt="Product preview"
                        className="h-24 w-24 object-cover rounded"
                      />

                      {/* Image Info and Actions */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Image #{index + 1}</p>
                          {featuredImageId === img.id && (
                            <div className="flex items-center gap-1 text-yellow-600 text-xs">
                              <Star className="w-3 h-3 fill-yellow-600" />
                              <span>Featured Image</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 rounded bg-gray-100 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition"
                          title="Move up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === images.length - 1}
                          className="p-1.5 rounded bg-gray-100 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition"
                          title="Move down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Feature and Delete Buttons */}
                      <div className="flex flex-col gap-2 justify-center">
                        {featuredImageId !== img.id && (
                          <button
                            type="button"
                            onClick={() => handleSetFeatured(img.id)}
                            className="p-1.5 rounded bg-yellow-100 hover:bg-yellow-400 text-yellow-600 hover:text-white transition"
                            title="Set as featured"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        {featuredImageId === img.id && (
                          <div className="p-1.5 rounded bg-yellow-400 text-white">
                            <Star className="w-4 h-4 fill-white" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(img)}
                          className="p-1.5 rounded bg-red-100 hover:bg-red-500 text-red-600 hover:text-white transition"
                          title="Remove image"
                        >
                          <OctagonX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add more button */}
                {images.length < MAX_IMAGES && (
                  <label className="mt-4 flex gap-2 p-4 border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-lg bg-blue-50 hover:bg-blue-100 transition cursor-pointer items-center justify-center">
                    <Plus className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">Add more images ({images.length}/{MAX_IMAGES})</span>
                    <Input 
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={images.length >= MAX_IMAGES}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {images.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No images added yet</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="px-6 bg-green-600 hover:bg-green-700"
            >
              {isEditing ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}