import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { GetProducts } from "@/api";
import { ProductFormData } from "@/types";
import { useAppDispatch } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { ProductGridSkeleton } from "@/components/Skeletons/ProductSkeleton";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [featuredProducts, setFeaturedProducts] = useState<ProductFormData[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const redirectAttempted = useRef(false);

  // E-commerce Mode Toggle State
  const isEcommerceMode = localStorage.getItem('ecommerce_mode_toggle') === 'true';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral_id = params.get("referral_id");

    if (referral_id) {
      dispatch(addrefreral({ referralCode: referral_id }));
    }
  }, [location.search, dispatch]);

  // Fetch products in background - non-blocking
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await GetProducts(12, 1);
        setFeaturedProducts(response.data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const primaryProduct = featuredProducts[0];
  const productPath = primaryProduct ? `/products/${primaryProduct._id}${location.search}` : `/products${location.search}`;

  // Funnel logic: If not in e-commerce mode, redirect after products load
  useEffect(() => {
    if (!isLoadingProducts && !isEcommerceMode && primaryProduct && !redirectAttempted.current) {
      redirectAttempted.current = true;
      navigate(productPath, { replace: true });
    }
  }, [isLoadingProducts, isEcommerceMode, primaryProduct, navigate, productPath]);

  // Full E-commerce Mode Render - Show immediately with skeleton while loading
  return (
    <div className="min-h-screen bg-cream font-nunito pt-16">
      
      {/* Playful Hero Section for Storefront */}
      <section className="relative overflow-hidden bg-sky pt-16 pb-24 sm:py-32">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1599824247547-8cfb62e4f0be?q=80&w=2069&auto=format&fit=crop" 
            alt="Kids gardening" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay" 
            loading="lazy"
          />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-sun rounded-full blur-2xl opacity-60 animate-float" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-leaf-light rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }} />

        <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
          <div className="animate-fade-up">
            <h1 className="text-5xl sm:text-7xl font-display font-bold text-soil leading-tight mb-6">
              Let's grow <br/>
              <span className="text-white drop-shadow-md">something fun!</span>
            </h1>
            
            <p className="text-lg sm:text-2xl text-soil/90 font-medium mb-10 max-w-2xl mx-auto">
              Explore our collection of kid-friendly gardening kits, tools, and seeds designed to spark joy and curiosity.
            </p>

            <Button 
              onClick={() => {
                document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="h-16 px-10 rounded-full bg-sun text-soil font-extrabold text-xl hover:bg-sun-light shadow-xl hover:shadow-2xl transition-all animate-bounce-in border-4 border-white/50"
            >
              Shop All Kits <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products-grid" className="py-24 bg-cream">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-soil mb-4">Our Growing Kits</h2>
            <div className="h-1 w-24 bg-leaf mx-auto rounded-full" />
          </div>

          {isLoadingProducts ? (
            // Show skeleton while loading
            <ProductGridSkeleton count={12} />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-cream-dark">
              <p className="text-2xl font-display font-bold text-soil mb-2">No kits available yet!</p>
              <p className="text-soil/70">Check back soon for new gardening adventures.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((prod) => (
                <div 
                  key={prod._id} 
                  className="bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-cream-dark group cursor-pointer animate-fade-up"
                  onClick={() => navigate(`/products/${prod._id}${location.search}`)}
                >
                  <div className="relative aspect-square overflow-hidden bg-cream-dark">
                    <img 
                      src={prod.thumbnails?.[0] || prod.images?.[0] || "/images/product-sample-image/WhatsApp Image 2026-05-01 at 9.59.59 AM.jpeg"} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-leaf font-bold text-sm shadow-sm">
                      Kids Favorite
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-display font-bold text-soil mb-2">{prod.name}</h3>
                    <p className="text-soil/70 text-sm mb-6 line-clamp-2">
                      {prod.description || "The perfect starter kit for little green thumbs."}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-extrabold text-leaf">₹{prod.price}</span>
                      <Button className="rounded-full bg-sun text-soil hover:bg-sun-light shadow-sm">
                        <ShoppingBag className="w-4 h-4 mr-2" /> View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
                  
}
export default HomePage;
