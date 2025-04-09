// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router";
import { CreateOder, GetProductById } from "@/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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
  // handler: (response: any) => void;
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
  const location = useLocation(); // Hook to access the current URL
  const dispatch = useAppDispatch(); // Hook to dispatch actions to Redux
  console.log("the data in refreal id", referral_data);

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
  // return
  const options: RazorpayOptions = {
    key: data.key_id,
    order_id: data.razorpayOrder.id,
    amount:data.razorpayOrder.amount, // Amount in paisa
    currency: "INR",
    name: customerData.name,
    description: (product?.description || "No description available").substring(0, 255),
    image:product.images[0],
    callback_url:`${ import.meta.env.VITE_SERVER_URI}payment/PaymentVerification`,
    // handler: function (response){
    //     console.log("the response data we get:", response);
        
    //     alert(response.razorpay_payment_id);
    //     alert(response.razorpay_order_id);
    //     alert(response.razorpay_signature)
    // },
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

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Image Carousel */}
      <Carousel className="w-full max-w-lg">
        <CarouselContent>
          {product?.images.map((img, index) => (
            <CarouselItem key={index}>
              <img src={img} alt={product?.name} className="rounded-lg w-full" />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold">{product?.name}</h1>
        <p className="text-gray-600 mt-2">{product?.description}</p>
        <p className="text-2xl font-semibold text-blue-600 mt-4">₹{product?.price}</p>

        {/* Buy Now Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full">Buy Now</Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-xl font-semibold mb-2">Enter Your Details</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" },
                  })}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address", { required: "Address is required" })} />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>
              <Button type="submit" className="mt-4 w-full">Proceed to Pay</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductDetailPage;


   {/* Buy Now Button (Opens Checkout Form) */}
//    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//    <DialogTrigger asChild>
//      <Button className="mt-4 w-full">Buy Now</Button>
//    </DialogTrigger>
//    <DialogContent>
//      <h2 className="text-xl font-semibold mb-2">Enter Your Details</h2>
//      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//        <div>
//          <Label htmlFor="name">Name</Label>
//          <Input id="name" {...register("name", { required: "Name is required" })} />
//          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//        </div>
//        <div>
//          <Label htmlFor="email">Email</Label>
//          <Input
//            id="email"
//            {...register("email", {
//              required: "Email is required",
//              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
//            })}
//          />
//          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//        </div>
//        <div>
//          <Label htmlFor="phone">Phone</Label>
//          <Input
//            id="phone"
//            {...register("phone", {
//              required: "Phone number is required",
//              pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" },
//            })}
//          />
//          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
//        </div>
//        <div>
//          <Label htmlFor="address">Address</Label>
//          <Input id="address" {...register("address", { required: "Address is required" })} />
//          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
//        </div>
//        <Button type="submit" className="mt-4 w-full">
//          Proceed to Pay
//        </Button>
//      </form>
//    </DialogContent>
//  </Dialog>