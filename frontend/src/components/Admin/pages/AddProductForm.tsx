 import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProductFormData } from "@/types";
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
          setSelectedImages([]); // Reset existing images
          setPreviewImages(productData.images); // Set existing image URLs
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
        });
    }
  }, [productId]);

  // Allow multiple file selection but limit to 4 images
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;   
    if (files) {
      const fileArray = Array.from(files);
      console.log(fileArray);
      
      if(selectedImages.length>4){
        alert("only add max 4 images")
        return
      }
      setSelectedImages((prevFiles) => {
        const newFiles = [...fileArray, ...prevFiles];
        const previews = newFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
        console.log("the data of this method:",URL.createObjectURL(newFiles[0]),previews);
        
        return newFiles;
      });
    } 
  };
  const handleRemoveFile = (index: number): void => {
    console.log("the reomve method is called");
    setSelectedImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewImages((prev => prev.filter((_, i) => i !== index)))
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

    // Append each selected file under the key "images"
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

     // If editing, include existing images that weren't removed
     console.log(`the data of each privew url`,previewImages);


     if (isEditing && previewImages.length > 0) {
      previewImages.forEach((url) => {
        console.log(`the data of each privew url`,url);
        
        if(url.includes("res.cloudinary.com")){
          formData.append("existingImages", url);
        }
      });
    }

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
          {previewImages.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {previewImages.map((src, idx) => (
                   <div key={idx} className="relative">
                   <OctagonX 
                     className="absolute -right-2 -top-2 z-10 cursor-pointer text-red-500 bg-white rounded-full" 
                     size={20}
                     onClick={() => handleRemoveFile(idx)}
                   />
                   <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="h-24 w-24 object-cover rounded"
                    />
                   </div>
                  ))}
                </div>
                )}
          {/* <ul className="mb-2">
          {selectedImages.map((file, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-white p-2 rounded mb-1"
            >
              <span className="text-sm">{file.name}</span>
              <button
                type="button"
                // onClick={() => handleRemoveFile(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul> */}
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