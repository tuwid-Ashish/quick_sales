import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { GetProducts } from "@/api";
import { ProductFormData } from "@/types";
import { useAppDispatch } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Sparkles, ShoppingBag, Truck } from "lucide-react";
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
    <div className="min-h-screen bg-cream font-nunito">
      
      {/* Premium Hero Section */}
      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#e2f4fb_0%,#b7e2f3_30%,#FFF9E6_100%)] pt-10 pb-16 sm:pt-12 sm:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(255,193,7,0.28),_transparent_24%),radial-gradient(circle_at_15%_80%,_rgba(58,139,60,0.16),_transparent_22%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream to-transparent" />

        <div className="absolute -top-10 right-8 hidden h-28 w-28 rounded-full bg-white/50 blur-3xl sm:block" />
        <div className="absolute bottom-6 left-6 hidden h-36 w-36 rounded-full bg-leaf/20 blur-3xl sm:block" />

        <div className="container relative z-10 mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
          <div className="animate-fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-bold text-soil shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-leaf" />
              Premium kids gardening kits
            </div>

            <h1 className="max-w-2xl text-5xl font-display font-bold leading-[1.02] text-soil sm:text-6xl lg:text-7xl">
              Turn playtime into <span className="text-leaf-dark">garden time.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-soil/85 sm:text-xl">
              Beautifully packed starter kits that make kids curious, hands-on, and excited to grow their first plants.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button 
                onClick={() => {
                  document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-14 rounded-full bg-sun px-8 text-base font-extrabold text-soil shadow-xl transition-all hover:bg-sun-light hover:shadow-2xl sm:h-16 sm:px-10 sm:text-lg"
              >
                Shop the kit <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                className="h-14 rounded-full border-white/80 bg-white/70 px-8 text-base font-extrabold text-soil shadow-sm backdrop-blur-md transition-all hover:bg-white sm:h-16 sm:px-10 sm:text-lg"
                onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View products
              </Button>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Kid-safe tools", text: "Thoughtful kit design" },
                { icon: Truck, title: "Fast shipping", text: "Delivered ready to gift" },
                { icon: Sparkles, title: "Premium feel", text: "Gift-worthy packaging" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf/10 text-leaf">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-soil">{item.title}</p>
                    <p className="text-xs text-soil/70">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up lg:justify-self-end">
            <div className="absolute -left-6 top-10 hidden rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-lg backdrop-blur-md sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Limited drop</p>
              <p className="mt-1 text-lg font-display font-bold text-soil">Just ₹749</p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-3 shadow-[0_30px_80px_rgba(45,64,38,0.18)] backdrop-blur-md sm:p-4 lg:ml-auto lg:max-w-[560px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_38%)]" />
              <div className="relative overflow-hidden rounded-[1.75rem] bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1599824247547-8cfb62e4f0be?q=80&w=2069&auto=format&fit=crop" 
                  alt="Kids gardening" 
                  className="h-[420px] w-full object-cover sm:h-[520px]"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/70 to-transparent" />

                <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                  <div className="rounded-full bg-white/85 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-soil shadow-sm backdrop-blur-md">
                    Best seller
                  </div>
                  <div className="rounded-full bg-leaf/90 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-white shadow-sm">
                    Gift ready
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Tools", "Mini kit included"],
                    ["Seeds", "Fast-growing varieties"],
                    ["Bonus", "Parent guide + spray"],
                  ].map(([title, text]) => (
                    <div key={title} className="rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-left shadow-lg backdrop-blur-md">
                      <p className="text-sm font-extrabold text-soil">{title}</p>
                      <p className="text-xs text-soil/70">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
              {featuredProducts.map((prod, index) => (
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
                      loading={index < 2 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
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
