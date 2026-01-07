import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddProductForm from "./AddProductForm";
import { ProductFormData } from "@/types";
import { GetProducts, DeleteProductById } from "@/api";
import { useAppSelector } from "@/Store/Store";
import { Package, Edit, Trash2, Plus } from "lucide-react";

interface ProductsPageState {
  products: ProductFormData[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
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
    fetchProducts(1);
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
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-600">Manage your product inventory</p>
          </div>
        </div>
        {userRole === "admin" && (
          <AddProductForm onAddProduct={handleAddProduct} />
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.products.map((product) => (
          <Card
            key={product._id}
            className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative w-full h-52 overflow-hidden bg-gray-100">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <Badge className={`${product.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </div>
            </div>

            <CardContent className="p-5 space-y-3">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 h-10">
                {product.description}
              </p>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ₹{product.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Stock</p>
                  <p className="text-xl font-semibold text-gray-900">{product.stock}</p>
                </div>
              </div>
            </CardContent>

            {userRole === "admin" && (
              <CardFooter className="flex gap-2 p-4 bg-gray-50 border-t">
                <AddProductForm 
                  onAddProduct={handleAddProduct} 
                  productId={product._id}
                  isEditing={true}
                />
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {state.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 bg-white p-4 rounded-lg shadow-sm">
          <Button
            variant="outline"
            disabled={state.currentPage === 1}
            onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            Previous
          </Button>
          
          {[...Array(state.totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              variant={state.currentPage === index + 1 ? "default" : "outline"}
              onClick={() => setState(prev => ({ ...prev, currentPage: index + 1 }))}
              className={state.currentPage === index + 1 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600" 
                : "hover:bg-blue-50 hover:text-blue-600"}
            >
              {index + 1}
            </Button>
          ))}
          
          <Button
            variant="outline"
            disabled={state.currentPage === state.totalPages}
            onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
