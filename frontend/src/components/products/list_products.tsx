import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {  useLocation, useNavigate } from "react-router"
import { useEffect, useState } from "react";
import { GetProducts } from "@/api";
import { ProductFormData } from "@/types";
import { useAppDispatch } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";

interface ProductsPageState {
  products: ProductFormData[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const ITEMS_PER_PAGE = 10;

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the current URL
  const dispatch = useAppDispatch(); // Hook to dispatch actions to Redux
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
      const params = new URLSearchParams(location.search); // Parse query parameters
      const referral_id = params.get("referral_id"); // Extract referral_id from the URL
  
      if (referral_id) {
        dispatch(addrefreral({ referralCode: referral_id })); // Dispatch the referral_id to Redux
        console.log("Referral ID captured and saved:", referral_id);
      }
    }, [location.search, dispatch]); // Run this effect when the URL changes
  
  useEffect(() => {
    fetchProducts(state.currentPage);
  }, [state.currentPage]);



  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.products.map((product) => (
          <Card key={product._id} className="shadow-lg rounded-xl">
            <CardHeader>
              <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded-t-xl" />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
              <p className="text-gray-500 mt-2">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold">₹{product.price}</span>
                <Button
                onClick={() =>navigate(`/products/${product._id}${location.search}`)} className="flex items-center gap-2">
                  <ShoppingCart size={16} /> show now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
