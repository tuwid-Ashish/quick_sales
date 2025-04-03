 import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProductFormData, ProductImage } from "@/types";
import { AddProduct, EditProduct, GetProductById } from "@/api";
import {OctagonX} from "lucide-react"
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
});

// Define a type for what is controlled by the form (without images)
type ProductFormInput = zod.infer<typeof productSchema>;

interface AddProductFormProps {
  onAddProduct: (product: ProductFormData) => void;
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
    },
  });

  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const MAX_IMAGES = 4;

  // Add state for product data
  // const [product, setProduct] = useState<ProductFormData | null>(null);
  // Update button text based on mode
  const buttonText = isEditing ? "Edit Product" : "+ Add Product";
  console.log("the status of button",isEditing,buttonText);
  // Fetch product data when editing
  useEffect(() => {
    if (productId) {
      GetProductById(productId)
        .then((response) => {
          const productData = response.data.data;
          // setProduct(productData);
          // Set form defaults
          reset({
            name: productData.name,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            stock: productData.stock,
          });
          // Set images
          // Convert existing images to ProductImage format
          const existingImages: ProductImage[] = productData.images.map((url: string) => ({
            id: crypto.randomUUID(),
            url,
            isExisting: true
          }));
          setImages(existingImages);
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

  // Allow multiple file selection but limit to 4 images
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
  }

  // Update handleRemoveFile to handle both types of images
   const handleRemoveFile = (imageToRemove: ProductImage) => {
    if (!imageToRemove.isExisting) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setImages(prev => prev.filter(img => img.id !== imageToRemove.id));
  };

  const onSubmit: SubmitHandler<ProductFormInput> = (data) => {
    // Create a FormData object for file upload
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.description || "");
    formData.append("category", data.category);
    formData.append("stock", data.stock.toString());

    if (productId) {
      formData.append("id", productId);
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

    const productData: ProductFormData = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      stock: parseInt(formData.get("stock") as string, 10),
      images: formData.getAll("images") as string[],
      existingImages: formData.getAll("existingImages") as string[],
      description: formData.get("description") as string,
      _id :formData.get("id") as string,

  };
    console.log("my formdata",productData);
    // return
    const apiCall = isEditing ? EditProduct : AddProduct;

    // Call API with formData
    console.log("the detail of method:",apiCall);
    
    apiCall(productData)
      .then((response) => {
        // Construct complete product data (including images URLs if needed)
        // Here, for onAddProduct you can merge form input with extra data
        onAddProduct({
          ...data, images: previewImages,
          _id: ""
        });
        console.log("The response is:", response);
        setOpen(false);
        reset();
        setPreviewImages([]);
        setSelectedImages([]);
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
      <DialogContent className="max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("name")} placeholder="Product Name" />
          {errors.name && 
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          }

          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Price"
          />
          {errors.price && 
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          }

          <Textarea {...register("description")} placeholder="Description (optional)" />

          <Input {...register("category")} placeholder="Category" />
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}

          <Input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            placeholder="Stock"
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}

          <Input 
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-2" />
          {images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {images.map((img) => (
                   <div key={img.id} className="relative">
                   <OctagonX 
                     className="absolute -right-2 -top-2 z-10 cursor-pointer text-red-500 bg-white rounded-full" 
                     size={20}
                     onClick={() => handleRemoveFile(img)}
                   />
                   <img
                    src={img.url}
                    alt="Product preview"
                    className="h-24 w-24 object-cover rounded"
                    />
                   </div>
                  ))}
                </div>
                )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}