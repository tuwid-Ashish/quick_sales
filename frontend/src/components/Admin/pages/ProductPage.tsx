import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddProductForm from "./AddProductForm";
import { ProductFormData } from "@/types";
import { GetProducts, DeleteProductById } from "@/api";
import { useAppSelector } from "@/Store/Store";

interface ProductsPageState {
  products: ProductFormData[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  // Add state for editing
  // const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [state, setState] = useState<ProductsPageState>({
    products: [],
    currentPage: 1,
    totalPages: 1,
    loading: true,
  });

  const userRole = useAppSelector ((state) => state.Auth.user?.role);

  const fetchProducts = async (page: number) => {
    try {
      const response = await GetProducts(ITEMS_PER_PAGE, page);
      const { products, pagination } = response.data.data;
      setState(prev => ({
        ...prev,
        products,
        currentPage: pagination.currentPage,
        totalPages: pagination.totalPages,
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchProducts(state.currentPage);
  }, [state.currentPage]);

  const handleAddProduct = () => {
    fetchProducts(1); // Refresh the product list
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?"))
    try {
      await DeleteProductById(productId);
      fetchProducts(state.currentPage);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

    
  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        {userRole === "admin" && (<AddProductForm onAddProduct={handleAddProduct} />
          
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.products.map((product) => (
          <Card
            key={product._id}
            className="flex flex-col w-full max-w-sm overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-[1.02]"
          >
            <div className="w-full h-52">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <CardContent className="p-4 flex-grow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm font-semibold mt-2">Price: ${product.price}</p>
              <p className="text-sm">Stock: {product.stock}</p>
            </CardContent>

            {userRole === "admin" && (
              <CardFooter className="flex justify-between p-4">
                <AddProductForm 
                onAddProduct={handleAddProduct} 
                productId={product._id}
                isEditing={true}
                />
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-2">
        <Button
          variant="outline"
          disabled={state.currentPage === 1}
          onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
        >
          Previous
        </Button>
        <span className="py-2 px-4">
          Page {state.currentPage} of {state.totalPages}
        </span>
        <Button
          variant="outline"
          disabled={state.currentPage === state.totalPages}
          onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
