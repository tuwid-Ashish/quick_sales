import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, ArrowRight, Package } from "lucide-react";
import {  useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react";
import { GetProducts } from "@/api";
import { ProductFormData } from "@/types";
import { useAppDispatch } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";
import { Badge } from "@/components/ui/badge";

interface ProductsPageState {
  products: ProductFormData[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const ITEMS_PER_PAGE = 10;

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
   const [state, setState] = useState<ProductsPageState>({
      products: [],
      currentPage: 1,
      totalPages: 1,
      loading: true,
    });
  const fetchProducts = async (page: number) => {
    try {
      const response = await GetProducts(ITEMS_PER_PAGE, page);
      console.log(response);
      
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

    // Capture referral_id from the URL and save it in Redux
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const referral_id = params.get("referral_id");
  
      if (referral_id) {
        dispatch(addrefreral({ referralCode: referral_id }));
        console.log("Referral ID captured and saved:", referral_id);
      }
    }, [location.search, dispatch]);
  
  useEffect(() => {
    fetchProducts(state.currentPage);
  }, [state.currentPage]);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Discover Our Products</h1>
            <p className="text-xl text-blue-100">Find the perfect items for you with amazing deals</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.products.map((product) => (
            <Card 
              key={product._id} 
              className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden cursor-pointer transform hover:-translate-y-2"
              onClick={() => navigate(`/products/${product._id}${location.search}`)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-blue-600 text-white shadow-lg">
                    <Package className="h-3 w-3 mr-1" />
                    In Stock
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <CardContent className="p-5">
                <CardTitle className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </CardTitle>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                  {product.description && product.description.length > 80
                    ? `${product.description.slice(0, 80)}...`
                    : product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(4.8)</span>
                </div>

                {/* Price & Button */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ₹{product.price}
                    </p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md group-hover:shadow-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product._id}${location.search}`);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    View
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {state.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button
              variant="outline"
              disabled={state.currentPage === 1}
              onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
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
                  : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"}
              >
                {index + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              disabled={state.currentPage === state.totalPages}
              onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
