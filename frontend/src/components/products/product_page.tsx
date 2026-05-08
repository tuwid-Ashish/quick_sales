import { ProductFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { CreateOder, GetProductById, GetProducts } from "@/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  BookOpen,
  CheckCircle2,
  Droplets,
  Gift,
  Leaf,
  Package,
  ShieldCheck,
  ShoppingCart,
  Shovel,
  Sprout,
  Truck,
  Star,
  PlayCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useQuery } from "@tanstack/react-query";

interface RazorpayOptions {
  key: string;
  order_id: string;
  callback_url: string;
  image: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const productImage = (fileName: string) => `/images/product-sample-image/${encodeURIComponent(fileName)}`;

const contents = [
  { image: productImage("tools.png"), title: "Kid-Safe Tools", text: "Miniature trowel and fork designed for small hands." },
  { image: productImage("coco pots.png"), title: "Eco-Friendly Pots", text: "Biodegradable starter pots perfect for windowsills.." },
  { image: productImage("spray bottle.png"), title: "Mist Bottle", text: "Gentle watering spray to keep sprouts happy." },
  { image: productImage("seed image.png"), title: "Organic Seeds", text: "Fast-growing seeds guaranteed to sprout in days." },
  { image: productImage("soil-mixtures.png"), title: "Premium Soil Mixture", text: "Biodegradable starter pots perfect for windowsills." },
  { image: productImage("featurimage.png"), title: "Storybook Guide", text: "A fun, illustrated manual for parents and kids." },
  ];


const reviews = [
  {
    name: "Aarush Kumar",
    image: "/images/review1.png",
    text: "My 5-year-old daughter wakes up every morning just to check her plants. It's the best screen-free activity we've found!",
    rating: 5
  },
  {
    name: "Sumit Kumar",
    image: "/images/review2.png",
    text: "Brilliant kit! Everything is perfectly sized for kids. We planted the seeds on Sunday and saw sprouts by Wednesday.",
    rating: 5
  },
  {
    name: "Meenakshi kumari",
    image: "/images/review3.png",
    text: "Gifted this to my nephew for his 6th birthday. He loved getting his hands dirty and learning how plants grow.",
    rating: 5
  }
];

const faqs = [
  { q: "What age is this kit suitable for?", a: "It's perfect for ages 4-10 with adult supervision. The tools are sized for little hands and the instructions are easy to follow." },
  { q: "Do I need to buy extra soil or pots?", a: "No! Everything you need is included: coco peat (soil substitute), biodegradable pots, seeds, tools, and a spray bottle." },
  { q: "Can we use this if we live in an apartment?", a: "Absolutely. The kit is designed for indoor or balcony use. Just place the pots near a window that gets some sunlight." },
  { q: "How long does it take for the seeds to sprout?", a: "Depending on the included seed variety, you should see the first tiny sprouts in 3 to 7 days if watered correctly." },
  { q: "Is the payment secure?", a: "Yes, we use Razorpay for 100% secure, encrypted payments via UPI, Credit/Debit Cards, and Netbanking." },
];

// Authentic Kids Gardening Images from Unsplash
const fallbackImages = [
  "https://images.unsplash.com/photo-1599824247547-8cfb62e4f0be?q=80&w=2069&auto=format&fit=crop", // Child holding soil
  "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=2028&auto=format&fit=crop", // Child watering plants
  "https://images.unsplash.com/photo-1591122601956-61dc572c6767?q=80&w=2070&auto=format&fit=crop", // Little hands with trowel
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const referral_data = useAppSelector((state) => state.referal.referal_id);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showStickyBuy, setShowStickyBuy] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBuy(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: productData, isLoading, isError } = useQuery({
    queryKey: ["product", id, referral_data],
    queryFn: () => {
      if (!id) return Promise.reject(new Error("Product ID is not defined"));
      const ref = referral_data ? referral_data : "";
      return GetProductById(id, ref);
    },
    enabled: !!id,
  });

  const product: ProductFormData | undefined = productData?.data?.data;

  // Fetch all products to see if we need the "You Might Also Like" section
  const { data: allProductsData } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => GetProducts(10, 1),
  });

  const otherProducts = allProductsData?.data?.data?.products?.filter((p: ProductFormData) => p._id !== id) || [];
  const showBrowseMore = otherProducts.length > 0;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral_id = params.get("referral_id");

    if (referral_id) {
      dispatch(addrefreral({ referralCode: referral_id }));
    }
  }, [location.search, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Dynamic price calculation
  const getCalculatedPrice = (qty: number) => {
    if (!product) return { total: 0, originalTotal: 0, discountAmount: 0 };
    const originalTotal = product.price * qty;
    let total = originalTotal;
    
    if (product.bulkDiscountPercentage && product.bulkDiscountPercentage > 0 && qty > 1) {
      total = Math.round(originalTotal * (1 - (product.bulkDiscountPercentage / 100)));
    }
    
    return {
      total,
      originalTotal,
      discountAmount: originalTotal - total
    };
  };

  const { total: finalAmount, originalTotal, discountAmount } = getCalculatedPrice(quantity);

  const onSubmit: SubmitHandler<Customer> = (data) => {
    setIsDialogOpen(false);
    handlePayment(data);
  };

  const handlePayment = (customerData: Customer) => {
    if (!product) return;
    const orderdetails = {
      ...customerData,
      id: product._id,
      referral: referral_data,
      quantity, // Add quantity
    };

    CreateOder(orderdetails as any)
      .then((response) => {
        const data = response.data;
        const options: RazorpayOptions = {
          key: data.key_id,
          order_id: data.razorpayOrder.id,
          amount: data.razorpayOrder.amount,
          currency: "INR",
          name: customerData.name,
          description: "Get Gardening Kids Starter Kit",
          image: imageList[0],
          callback_url: `${import.meta.env.VITE_SERVER_URI}/payment/PaymentVerification`,
          prefill: {
            name: customerData.name,
            email: customerData.email,
            contact: customerData.phone,
          },
          theme: {
            color: "#3A8B3C", // Leaf green
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      })
      .catch((error) => {
        console.log(error);
        alert("An error happened while creating the payment. Please try again.");
      });
  };

  const imageList = product
    ? product.thumbnails?.length
      ? product.thumbnails
      : product.images?.length
        ? product.images
        : fallbackImages
    : fallbackImages;

  if (isLoading) return null;

  if (isError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-red-600 font-bold">Error fetching product details.</p>
      </div>
    );
  }

  const renderBuyButton = (triggerClass?: string, text?: string) => (
    <Button type="button" onClick={() => setIsDialogOpen(true)} className={triggerClass || "h-14 w-full rounded-full bg-sun text-lg font-extrabold text-soil hover:bg-sun-light shadow-lg hover:shadow-xl transition-all animate-bounce-in"}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      {text || "Buy Now — Just ₹749"}
    </Button>
  );

  const checkoutModal = (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-md rounded-[2rem] bg-cream border-4 border-white shadow-2xl p-0 overflow-hidden">
        <div className="bg-sky p-6 text-soil relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-display font-bold text-soil">Where should we send it?</DialogTitle>
            <DialogDescription className="text-soil/70 font-medium">
              Enter delivery details. Secure payment via Razorpay next.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-2">
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border-2 border-cream-dark shadow-sm mb-6 mt-[-20px] relative z-20">
            <img src={imageList[0]} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-bold text-soil leading-tight">{product.name}</p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <p className="font-extrabold text-leaf">₹{product.price}</p>
                  <p className="text-xs text-soil/50 line-through">₹1499</p>
                </div>
                
                {/* Quantity Selector */}
                <div className="flex items-center gap-3 bg-cream rounded-full px-2 py-1">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 h-6 rounded-full bg-white text-soil font-bold shadow-sm hover:bg-cream-dark">-</button>
                  <span className="font-bold text-soil text-sm w-4 text-center">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-6 h-6 rounded-full bg-leaf text-white font-bold shadow-sm hover:bg-leaf-light">+</button>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto px-1 scrollbar-hide">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-soil font-bold">Full Name</Label>
              <Input id="name" autoComplete="name" placeholder="E.g. Jane Doe" className="h-12 bg-white border-2 border-cream-dark rounded-xl focus-visible:ring-leaf text-soil" {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-soil font-bold">Phone</Label>
                <Input
                  id="phone"
                  autoComplete="tel"
                  inputMode="numeric"
                  placeholder="10 digits"
                  className="h-12 bg-white border-2 border-cream-dark rounded-xl focus-visible:ring-leaf text-soil"
                  {...register("phone", {
                    required: "Phone required",
                    pattern: { value: /^[0-9]{10}$/, message: "Invalid number" },
                  })}
                />
                {errors.phone && <p className="text-xs text-red-500 font-bold">{errors.phone.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-soil font-bold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane@email.com"
                  className="h-12 bg-white border-2 border-cream-dark rounded-xl focus-visible:ring-leaf text-soil"
                  {...register("email", {
                    required: "Email required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                  })}
                />
                {errors.email && <p className="text-xs text-red-500 font-bold">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-soil font-bold">Street Address</Label>
              <Textarea
                id="address"
                autoComplete="street-address"
                placeholder="House no, street, landmark..."
                className="min-h-[60px] resize-none bg-white border-2 border-cream-dark rounded-xl focus-visible:ring-leaf text-soil"
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && <p className="text-xs text-red-500 font-bold">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-soil font-bold">City</Label>
                <Input id="city" placeholder="City" className="h-12 bg-white border-2 border-cream-dark rounded-xl focus-visible:ring-leaf text-soil" {...register("city", { required: "City required" })} />
                {errors.city && <p className="text-xs text-red-500 font-bold">{errors.city.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state" className="text-soil font-bold">State</Label>
                <Input id="state" placeholder="State" className="h-12 bg-white border-2 border-cream-dark rounded-xl focus-visible:ring-leaf text-soil" {...register("state", { required: "State required" })} />
                {errors.state && <p className="text-xs text-red-500 font-bold">{errors.state.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pincode" className="text-soil font-bold">Pincode</Label>
              <Input
                id="pincode"
                inputMode="numeric"
                placeholder="6 digits"
                className="h-12 bg-white border-2 border-cream-dark rounded-xl focus-visible:ring-leaf text-soil"
                {...register("pincode", {
                  required: "Pincode is required",
                  pattern: { value: /^[1-9][0-9]{5}$/, message: "Must be a valid 6-digit Indian pincode" },
                })}
              />
              {errors.pincode && <p className="text-xs text-red-500 font-bold">{errors.pincode.message}</p>}
            </div>

            {discountAmount > 0 && (
              <div className="bg-leaf/10 border-2 border-leaf/20 rounded-xl p-3 mb-2 mt-4 space-y-1 relative z-10">
                <div className="flex justify-between text-soil/70 text-sm font-bold">
                  <span>Total Amount</span>
                  <span>₹{originalTotal}</span>
                </div>
                <div className="flex justify-between text-leaf text-sm font-black">
                  <span>Bulk Discount ({product.bulkDiscountPercentage}%)</span>
                  <span>- ₹{discountAmount}</span>
                </div>
                <div className="flex justify-between text-soil text-lg font-black border-t-2 border-leaf/20 pt-1 mt-1">
                  <span>Amount to Pay</span>
                  <span>₹{finalAmount}</span>
                </div>
              </div>
            )}

            <Button type="submit" className={`w-full h-14 rounded-xl bg-leaf text-white font-bold hover:bg-leaf-light transition-all shadow-md sticky bottom-0 z-10 flex items-center justify-center ${discountAmount === 0 ? 'mt-4' : 'mt-2'}`}>
              <ShieldCheck className="h-5 w-5 mr-2" />
              <span className="text-lg">Pay ₹{finalAmount} Securely</span>
            </Button>
            <p className="text-center text-[11px] font-bold text-soil/50 mt-2 uppercase tracking-wider pb-4">
              100% SECURE CHECKOUT VIA RAZORPAY
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-cream font-nunito text-soil selection:bg-sun/40 selection:text-soil">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-sky pt-12 sm:pt-20 pb-16">
        {/* Playful blobs */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-sun/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-leaf-light/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & simple CTA */}
            <div className="max-w-2xl animate-slide-left">
              <Badge className="mb-6 bg-white text-leaf hover:bg-white border-2 border-leaf-light/20 font-bold px-4 py-1.5 rounded-full shadow-sm">
                <Star className="w-4 h-4 mr-1.5 inline fill-sun text-sun" />
                Loved by 5,000+ Happy Parents
              </Badge>
              
              <h1 className="text-5xl sm:text-7xl font-display font-bold text-soil leading-[1.1] mb-6">
                Give your child <br/>
                <span className="text-gradient-leaf">the magic of growing</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-soil/80 leading-relaxed mb-8 max-w-xl font-medium">
                The perfect screen-free activity to help your child discover nature and learn patience.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className="flex -space-x-3">
                  {reviews.map((r, i) => (
                    <img key={i} src={r.image} className="w-10 h-10 rounded-full border-2 border-white bg-cream object-cover" alt="Parent" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-leaf text-white flex items-center justify-center text-xs font-bold">+5k</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-soil/80 font-bold">
                <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-leaf" /> Secure Payment</div>
                <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-leaf" /> Free Shipping</div>
                <div className="flex items-center gap-2"><Leaf className="w-5 h-5 text-leaf" /> 100% Natural</div>
              </div>
            </div>

            {/* Right Column: Prominent Product Image Carousel */}
            <div className="relative animate-slide-right order-first lg:order-last mb-8 lg:mb-0">
               <div className="absolute inset-0 bg-white/40 rounded-[3rem] blur-xl transform rotate-3" />
               <div className="relative bg-white p-2 rounded-[2.5rem] shadow-2xl border-4 border-white/50">
                 <Carousel className="w-full rounded-[2rem] overflow-hidden">
                   <CarouselContent>
                     {imageList.map((img, idx) => (
                       <CarouselItem key={idx}>
                         <img src={img} alt={`Product view ${idx + 1}`} className="w-full h-auto max-h-[450px] object-cover" />
                       </CarouselItem>
                     ))}
                   </CarouselContent>
                   <CarouselPrevious className="left-4 bg-white text-leaf hover:bg-cream-dark border-0 shadow-md h-10 w-10" />
                   <CarouselNext className="right-4 bg-white text-leaf hover:bg-cream-dark border-0 shadow-md h-10 w-10" />
                 </Carousel>
                 
                 <div className="mt-4 px-2 pb-2">
                   {renderBuyButton("w-full h-14 rounded-2xl bg-sun text-soil font-extrabold text-lg hover:bg-sun-light shadow-md hover:shadow-lg transition-all animate-bounce-in", "Buy Now — ₹749")}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* High Impact Pricing Card placed directly after Hero */}
      <section className="bg-cream pt-12 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-center animate-fade-up">
            <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-8 sm:p-10 border-4 border-white shadow-xl text-center max-w-xl w-full transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-3xl font-display font-bold text-soil mb-6">Start growing today!</h3>
              
              {/* Dynamic Bulk Offer Banner */}
              {product.bulkDiscountPercentage && product.bulkDiscountPercentage > 0 ? (
                <div className="bg-sun/20 border-2 border-sun text-soil rounded-xl p-3 mb-6 font-bold flex items-center justify-center gap-2">
                  <Gift className="w-5 h-5 text-leaf" />
                  Special Offer: Buy more than 1 and get {product.bulkDiscountPercentage}% OFF!
                </div>
              ) : null}

              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-6xl font-extrabold text-leaf">₹{product.price}</span>
                <span className="text-2xl text-soil/40 line-through decoration-red-500/50 font-bold">₹1499</span>
                <Badge className="bg-sun text-soil border-0 font-bold text-sm px-3 py-1">53% OFF</Badge>
              </div>
              <div className="flex justify-center items-center gap-2 text-sm text-red-500 font-bold mb-8 animate-pulse">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Only 14 kits left in stock!
              </div>
              
              {renderBuyButton("w-full h-16 rounded-full bg-sun text-soil font-extrabold text-xl hover:bg-sun-light shadow-[0_4px_14px_0_rgba(255,193,7,0.39)] transition-all animate-bounce-in")}
            </div>
          </div>
        </div>
      </section>

      {/* 3. VIDEO / HOW IT WORKS SECTION */}
      <section className="py-24 bg-leaf text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sun/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-leaf-light/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 animate-slide-left">
              <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6 text-cream">Joy in every step.</h2>
              <p className="text-cream/90 text-lg leading-relaxed mb-10 font-medium">
                It's not just a kit; it's a weekend project, a bonding experience, and a lesson in patience. Watch your child's eyes light up when the first green shoot breaks through the soil.
              </p>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-cream/20">
                {[
                  { num: "1", title: "Unpack & Prepare", desc: "Open the box together. Expand the coco peat with water." },
                  { num: "2", title: "Plant the Seeds", desc: "Fill the pots, gently place the seeds, and cover lightly." },
                  { num: "3", title: "Care & Watch", desc: "Use the misting bottle daily. See sprouts in just days!" }
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center gap-6">
                    <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-sun text-soil font-extrabold text-xl shadow-lg flex-shrink-0 border-4 border-leaf">
                      {step.num}
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex-1 border border-white/20">
                      <h4 className="text-xl font-bold text-cream">{step.title}</h4>
                      <p className="text-cream/80 text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Authentic Kids Video Placeholder */}
            <div className="order-1 md:order-2 animate-slide-right relative group rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/20 bg-leaf-dark aspect-[4/5] sm:aspect-video flex items-center justify-center">
              <img src="https://images.pexels.com/photos/16850736/pexels-photo-16850736.jpeg" className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" alt="Video placeholder" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 w-24 h-24 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-sun hover:text-soil transition-all text-white shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                <PlayCircle className="w-12 h-12" />
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-display font-bold text-2xl drop-shadow-md">See it in action</p>
                <p className="text-white/90 font-medium drop-shadow-md">Watch kids planting their first seeds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT'S INSIDE GRID */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-soil mb-4">Everything you need.</h2>
            <p className="text-leaf text-lg font-bold">No extra trips to the nursery. Open the box and start.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {contents.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-5 sm:p-6 border-2 border-cream-dark shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden">
                <div className="relative w-full aspect-[4/3] rounded-[1.5rem] bg-cream-dark/40 overflow-hidden mb-6 border border-white/70">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-bold text-soil mb-2 font-display leading-tight">{item.title}</h3>
                <p className="text-soil/70 font-medium leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF (REVIEWS) */}
      <section className="py-24 bg-soil text-cream overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sun/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-center mb-20 text-cream">Loved by parents & kids</h2>
          
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="min-w-[300px] sm:min-w-[380px] w-full max-w-sm snap-center bg-white rounded-[2rem] p-8 shadow-xl relative mt-8 border-4 border-leaf/20">
                <div className="absolute -top-12 left-8">
                  <img src={review.image} alt={review.name} className="w-24 h-24 rounded-full border-4 border-white object-cover bg-cream shadow-md" />
                </div>
                <div className="flex gap-1 mb-4 mt-8">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-sun text-sun" />
                  ))}
                </div>
                <p className="text-soil/80 text-lg leading-relaxed mb-6 font-medium italic">"{review.text}"</p>
                <div className="flex items-center gap-2 border-t border-cream-dark pt-4">
                  <CheckCircle2 className="w-5 h-5 text-leaf" />
                  <span className="text-base font-bold text-soil">{review.name}</span>
                  <span className="text-xs text-soil/50 font-bold uppercase tracking-wider ml-auto">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-soil text-center mb-12">Got questions?</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-white border-2 border-cream-dark rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm hover:shadow-md transition-shadow">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-soil text-lg font-display">
                  {faq.q}
                  <span className="transition duration-300 group-open:rotate-180 bg-sun/20 text-sun-dark rounded-full p-2">
                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-soil/80 font-medium leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. "YOU MIGHT ALSO LIKE" CAROUSEL (SHOWN IF MULTIPLE PRODUCTS EXIST) */}
      {showBrowseMore && (
        <section className="py-24 bg-cream-dark border-t-2 border-cream">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-4xl font-display font-bold text-soil text-center mb-12">You might also like...</h2>
            
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {otherProducts.map((prod: ProductFormData) => (
                  <CarouselItem key={prod._id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <div 
                      className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-cream-dark group cursor-pointer h-full flex flex-col"
                      onClick={() => navigate(`/products/${prod._id}${location.search}`)}
                    >
                      <div className="relative aspect-square overflow-hidden bg-cream-dark">
                        <img 
                          src={prod.thumbnails?.[0] || prod.images?.[0] || fallbackImages[0]} 
                          alt={prod.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 text-center flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-display font-bold text-soil mb-2">{prod.name}</h3>
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-xl font-extrabold text-leaf">₹{prod.price}</span>
                          </div>
                        </div>
                        <Button className="w-full rounded-full bg-sun text-soil hover:bg-sun-light font-bold">
                          View Kit
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white text-leaf hover:bg-cream border-2 border-cream-dark shadow-md h-12 w-12" />
              <CarouselNext className="hidden md:flex -right-12 bg-white text-leaf hover:bg-cream border-2 border-cream-dark shadow-md h-12 w-12" />
            </Carousel>
          </div>
        </section>
      )}

      {/* 8. BOTTOM CTA */}
      <section className="py-32 bg-sky relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-full">
          <img src="https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=2028&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky via-sky/90 to-sky/50" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/40 rounded-full blur-3xl" />

        <div className="container relative z-10 mx-auto px-4 max-w-2xl">
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-soil mb-6">Ready to get your hands dirty?</h2>
          <p className="text-xl text-soil/80 font-medium mb-10">Order now and we'll ship your kit within 24 hours.</p>
          
          <div className="bg-white/90 backdrop-blur-md rounded-[3rem] p-8 border-4 border-white inline-flex flex-col items-center shadow-2xl">
            <div className="flex items-end justify-center gap-3 mb-6">
              <span className="text-6xl font-extrabold text-leaf">₹{product.price}</span>
              <span className="text-2xl text-soil/40 line-through font-bold mb-1">₹1499</span>
            </div>
            {renderBuyButton("h-16 px-12 rounded-full bg-sun text-soil font-extrabold text-xl hover:bg-sun-light shadow-xl transition-all animate-bounce-in w-full")}
            <p className="text-soil/60 text-sm mt-4 font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Secure Razorpay Checkout
            </p>
          </div>
        </div>
      </section>

      {/* STICKY BOTTOM BUY BAR (MOBILE FOCUS) */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-4 border-sun shadow-[0_-10px_30px_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-out ${showStickyBuy ? "translate-y-0" : "translate-y-full"}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 max-w-5xl">
          <div className="hidden sm:flex items-center gap-3">
            <img src={imageList[0]} alt="Kit" className="w-12 h-12 rounded-xl object-cover border-2 border-cream-dark" />
            <div>
              <p className="font-bold text-soil leading-none font-display">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-extrabold text-leaf text-sm">₹{product.price}</p>
                <p className="text-xs text-soil/50 line-through font-bold">₹1499</p>
              </div>
            </div>
          </div>
          
          {/* Mobile minimal price display */}
          <div className="sm:hidden flex flex-col justify-center">
            <p className="text-[10px] font-bold text-soil/70 uppercase tracking-wider">Total Price</p>
            <div className="flex items-center gap-2">
              <p className="font-extrabold text-leaf text-lg">₹{product.price}</p>
              <p className="text-xs text-soil/50 line-through font-bold">₹1499</p>
            </div>
          </div>

          <div className="flex-1 sm:flex-none flex justify-end">
             {renderBuyButton("h-12 w-full sm:w-auto px-8 rounded-full bg-sun text-soil font-extrabold hover:bg-sun-light shadow-md", "Buy Now")}
          </div>
        </div>
      </div>

      {checkoutModal}
    </div>
  );
};

export default ProductDetailPage;
