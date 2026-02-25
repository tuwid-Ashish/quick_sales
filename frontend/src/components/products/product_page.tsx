import { ProductFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { CreateOder, GetProductById } from "@/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ShoppingCart, MapPin, Mail, Phone, User, CreditCard, Package, Star, Shield, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Define types for Product and Customer
interface RazorpayOptions {
  key: string;
  order_id:string;
  callback_url:string;
  image:string;
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
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const referral_data = useAppSelector((state)=>state.referal.referal_id)
  const location = useLocation();
  const dispatch = useAppDispatch();
  console.log("the data in refreal id", referral_data);

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
    // Fetch product data using the ID
    const fetchProduct = async () => {
      try {
        if(!id) return
        const ref = referral_data ? referral_data : ""
        const response = await GetProductById(id,ref)
        setProduct(response.data.data);
        console.log("the data :" ,response.data.data.images);
        
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);


    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Customer> = (data) => {
    setIsDialogOpen(false);
    handlePayment(data);
  };

  const handlePayment = (customerData: Customer) => {
    if(!product) return
    const orderdetails = {
      ...customerData,
      id :product._id,
      referral: referral_data

    }
    
CreateOder(orderdetails).then((response)=>{
  console.log(response.data,response);
  const data = response.data
  const options: RazorpayOptions = {
    key: data.key_id,
    order_id: data.razorpayOrder.id,
    amount:data.razorpayOrder.amount,
    currency: "INR",
    name: customerData.name,
    description: (product?.description || "No description available").substring(0, 255),
    image:product.images[0],
    callback_url:`${ import.meta.env.VITE_SERVER_URI}/payment/PaymentVerification`,
    prefill: {
      name: customerData.name,
      email: customerData.email,
      contact: customerData.phone,
    },
    theme: {
      color: "#6366F1",
    },
  };
  console.log("the build optons are :", options);
  
  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();

    })
    .catch((error)=>{
      console.log(error);
      alert("the error happen on making payment")
    })
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fafdf7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading garden product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafdf7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image Carousel */}
            <div className="space-y-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {product?.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <div className="rounded-xl overflow-hidden bg-gray-100">
                        <img 
                          src={img} 
                          alt={product?.name} 
                          className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <Card className="border border-green-100 bg-green-50/50">
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <Shield className="h-8 w-8 text-green-700 mb-2" />
                    <p className="text-xs text-center font-medium text-green-800">Secure Payment</p>
                  </CardContent>
                </Card>
                <Card className="border border-green-100 bg-green-50/50">
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <Truck className="h-8 w-8 text-green-700 mb-2" />
                    <p className="text-xs text-center font-medium text-green-800">Fast Delivery</p>
                  </CardContent>
                </Card>
                <Card className="border border-green-100 bg-green-50/50">
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <Package className="h-8 w-8 text-green-700 mb-2" />
                    <p className="text-xs text-center font-medium text-green-800">Easy Returns</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div>
                <Badge className="mb-4 bg-green-700">In Stock</Badge>
                <h1 className="text-4xl font-bold mb-4 text-gray-900">{product?.name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-600">(4.8 / 127 reviews)</span>
                </div>

                <Separator className="my-6" />

                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {product?.description}
                </p>

                <div className="bg-gradient-to-br from-[#2d5016] to-[#3a6b1e] rounded-xl p-6 mb-6">
                  <p className="text-lime-200 text-sm mb-2">Special Garden Price</p>
                  <p className="text-5xl font-bold text-white">₹{product?.price}</p>
                  <p className="text-green-200 text-sm mt-2">Inclusive of all taxes · Free seeds with every order</p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-green-100 rounded-full p-2">
                      <Shield className="h-4 w-4 text-green-700" />
                    </div>
                    <span>100% Organic & Genuine</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-green-100 rounded-full p-2">
                      <Truck className="h-4 w-4 text-green-700" />
                    </div>
                    <span>Free Delivery · Eco-Friendly Packaging</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-green-100 rounded-full p-2">
                      <CreditCard className="h-4 w-4 text-green-700" />
                    </div>
                    <span>Secure Payment Gateway</span>
                  </div>
                </div>
              </div>

              {/* Buy Now Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg bg-[#2d5016] hover:bg-[#3a6b1e] shadow-lg hover:shadow-xl transition-all"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Complete Your Order</DialogTitle>
                    <DialogDescription>
                      Enter your shipping details to proceed with the purchase
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe"
                        className="h-11"
                        {...register("name", { required: "Name is required" })} 
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="h-11"
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                        })}
                      />
                      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="9876543210"
                        className="h-11"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" },
                        })}
                      />
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Shipping Address
                      </Label>
                      <Textarea 
                        id="address" 
                        placeholder="House no., Street, City, State, PIN Code"
                        className="min-h-24 resize-none"
                        {...register("address", { required: "Address is required" })} 
                      />
                      {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base bg-[#2d5016] hover:bg-[#3a6b1e]"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Payment
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
