import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, ArrowRight, Package, Leaf, Sprout } from "lucide-react";
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
      <div className="min-h-screen bg-[#fafdf7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading garden collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafdf7]">
      {/* Hero Section */}
      <div className="text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=1920&h=500&fit=crop"
            alt="Garden collection display"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c0a]/90 via-[#2d5016]/80 to-[#1a3c0a]/70" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-lime-400/20 text-lime-200 border-lime-400/30 mb-4">
              <Sprout className="h-3 w-3 mr-1" />
              Premium Collection
            </Badge>
            <h1 className="text-5xl font-bold mb-4">Our Garden Collection</h1>
            <p className="text-xl text-green-200/80">
              Hand-picked gardening kits, organic seeds, and supplies crafted for Indian gardens
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.products.map((product) => (
            <Card 
              key={product._id} 
              className="group hover:shadow-2xl transition-all duration-300 border border-green-100 bg-white overflow-hidden cursor-pointer transform hover:-translate-y-2"
              onClick={() => navigate(`/products/${product._id}${location.search}`)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-green-700 shadow-md border-0 backdrop-blur-sm">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-700 text-white shadow-lg">
                    <Package className="h-3 w-3 mr-1" />
                    In Stock
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <CardContent className="p-5">
                <CardTitle className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-green-700 transition-colors">
                  {product.name}
                </CardTitle>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                  {product.description && product.description.length > 80
                    ? `${product.description.slice(0, 80)}...`
                    : product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 fill-amber-400 text-amber-400" 
                    />
                  ))}
                  <span className="text-sm text-gray-400 ml-1">(4.8)</span>
                </div>

                {/* Price & Button */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-green-800">
                      ₹{product.price}
                    </p>
                  </div>
                  <Button 
                    className="bg-green-700 hover:bg-green-800 shadow-md group-hover:shadow-lg transition-all"
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
              className="hover:bg-green-50 hover:text-green-700 hover:border-green-700"
            >
              Previous
            </Button>
            
            {[...Array(state.totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                variant={state.currentPage === index + 1 ? "default" : "outline"}
                onClick={() => setState(prev => ({ ...prev, currentPage: index + 1 }))}
                className={state.currentPage === index + 1 
                  ? "bg-green-700 hover:bg-green-800" 
                  : "hover:bg-green-50 hover:text-green-700 hover:border-green-700"}
              >
                {index + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              disabled={state.currentPage === state.totalPages}
              onClick={() => setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              className="hover:bg-green-50 hover:text-green-700 hover:border-green-700"
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
