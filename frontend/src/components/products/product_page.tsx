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
import {
  BookOpen,
  CheckCircle2,
  CreditCard,
  Droplets,
  Gift,
  Leaf,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Shovel,
  Sprout,
  Truck,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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
}

const highlights = [
  "Complete starter kit",
  "Screen-free activity",
  "Parent-child bonding",
  "Beginner friendly",
  "Gift-ready experience",
  "Nature learning",
];

const contents = [
  { icon: Shovel, title: "Gardening tools", text: "Sized for guided use by young beginners." },
  { icon: Package, title: "Coco peat / soil", text: "Ready medium for planting at home." },
  { icon: Droplets, title: "Spray bottle", text: "Gentle misting for daily care." },
  { icon: Sprout, title: "Seeds", text: "A simple first growing project." },
  { icon: Leaf, title: "Pots", text: "Starter containers for indoor or balcony use." },
  { icon: BookOpen, title: "Instructions", text: "Clear steps parents can follow with children." },
];

const steps = [
  "Open the kit and arrange the contents with your child.",
  "Add soil, place the seeds, and cover them lightly.",
  "Mist daily, keep near light, and watch for growth.",
];

const faqs = [
  { q: "What age is this for?", a: "Recommended for ages 4 and up with adult supervision." },
  { q: "Do I need extra supplies?", a: "No. The kit is designed to include the essentials for getting started." },
  { q: "Can this be used indoors?", a: "Yes. A bright window, balcony, or patio works well." },
  { q: "How long does it take to grow?", a: "Sprouting time depends on the included seed variety, sunlight, and watering consistency." },
  { q: "Is this good for gifting?", a: "Yes. It is designed as a thoughtful educational gift for children." },
];

const fallbackImages = [
  "/images/product-sample-image/WhatsApp%20Image%202026-05-01%20at%209.59.59%20AM.jpeg",
  "/images/product-sample-image/WhatsApp%20Image%202026-05-01%20at%2010.00.01%20AM.jpeg",
  "/images/product-sample-image/WhatsApp%20Image%202026-05-01%20at%2010.00.00%20AM.jpeg",
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const referral_data = useAppSelector((state) => state.referal.referal_id);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id, referral_data],
    queryFn: () => {
      if (!id) return Promise.reject(new Error("Product ID is not defined"));
      const ref = referral_data ? referral_data : "";
      return GetProductById(id, ref);
    },
    enabled: !!id,
  });

  const product: ProductFormData | undefined = data?.data?.data;

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
    };

    CreateOder(orderdetails)
      .then((response) => {
        const data = response.data;
        const options: RazorpayOptions = {
          key: data.key_id,
          order_id: data.razorpayOrder.id,
          amount: data.razorpayOrder.amount,
          currency: "INR",
          name: customerData.name,
          description: (product.description || "Get Gardening Kids Starter Kit").substring(0, 255),
          image: imageList[0],
          callback_url: `${import.meta.env.VITE_SERVER_URI}/payment/PaymentVerification`,
          prefill: {
            name: customerData.name,
            email: customerData.email,
            contact: customerData.phone,
          },
          theme: {
            color: "#1f5b2b",
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fffaf0] py-12 font-nunito">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Skeleton className="h-[540px] rounded-xl" />
            <div className="space-y-5">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-14 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf0]">
        <p className="text-red-600">Error fetching product details.</p>
      </div>
    );
  }

  const BuyDialog = ({ compact = false }: { compact?: boolean }) => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-14 w-full rounded-md bg-[#1f5b2b] text-base font-extrabold text-white hover:bg-[#174621]">
          <ShoppingCart className="mr-2 h-5 w-5" />
          {compact ? "Buy Now" : "Buy Now"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-[#17381f]">Complete Your Order</DialogTitle>
          <DialogDescription>
            Enter delivery details. Payment opens securely through Razorpay.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-[#e4d8ba] bg-[#fffaf0] p-4">
          <div className="flex gap-3">
            <img src={imageList[0]} alt={product.name} className="h-16 w-16 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-extrabold text-[#17381f]">{product.name}</p>
              <p className="mt-1 text-sm text-[#60705f]">Complete kids gardening starter kit</p>
            </div>
            <p className="font-extrabold text-[#1f5b2b]">Rs. {product.price}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-[#425442]">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input id="name" autoComplete="name" placeholder="Jane Doe" className="h-11 rounded-md" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-[#425442]">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              className="h-11 rounded-md"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
              })}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2 text-[#425442]">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              autoComplete="tel"
              inputMode="numeric"
              placeholder="9876543210"
              className="h-11 rounded-md"
              {...register("phone", {
                required: "Phone number is required",
                pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" },
              })}
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2 text-[#425442]">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </Label>
            <Textarea
              id="address"
              autoComplete="street-address"
              placeholder="House, street, city, state, PIN code"
              className="min-h-24 resize-none rounded-md"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
          </div>

          <Button type="submit" className="h-12 w-full rounded-md bg-[#1f5b2b] text-base font-extrabold text-white hover:bg-[#174621]">
            <CreditCard className="mr-2 h-5 w-5" />
            Proceed to Secure Payment
          </Button>
          <p className="text-center text-xs font-bold text-[#60705f]">
            You will review and pay securely in Razorpay.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-[#fffaf0] pb-24 font-nunito text-[#17381f] lg:pb-0">
      <section className="bg-[#f8f1df] py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="space-y-5">
            <Carousel className="w-full overflow-hidden rounded-xl border border-[#e4d8ba] bg-white shadow-xl">
              <CarouselContent>
                {imageList.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={img}
                      alt={`${product.name} image ${index + 1}`}
                      loading="lazy"
                      className="h-[420px] w-full object-cover sm:h-[560px]"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/90 hover:bg-white" />
              <CarouselNext className="right-4 bg-white/90 hover:bg-white" />
            </Carousel>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, text: "Secure checkout" },
                { icon: Truck, text: "Fast delivery" },
                { icon: Gift, text: "Gift-ready" },
              ].map((badge) => (
                <div key={badge.text} className="rounded-lg bg-white p-4 text-center shadow-sm">
                  <badge.icon className="mx-auto mb-2 h-6 w-6 text-[#2d6a3a]" />
                  <p className="text-xs font-extrabold text-[#17381f]">{badge.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Badge className="mb-4 border-0 bg-[#1f5b2b] text-white">In Stock</Badge>
            <h1 className="text-4xl font-extrabold leading-tight text-[#17381f] sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-[#60705f]">
              {product.description || "A complete hands-on gardening kit designed to help children learn nature through play."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Screen-free", "Ages 4+", "Gift-ready", "Secure payment"].map((item) => (
                <span key={item} className="rounded-md bg-white px-3 py-2 text-sm font-bold text-[#425442] shadow-sm">
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-[#e4d8ba] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#60705f]">Special price</p>
              <p className="mt-1 text-5xl font-extrabold text-[#1f5b2b]">Rs. {product.price}</p>
              <p className="mt-2 text-sm text-[#60705f]">Inclusive of all taxes. Shipping calculated at checkout if applicable.</p>
              <Separator className="my-5" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-bold text-[#425442]">
                    <CheckCircle2 className="h-4 w-4 text-[#2d6a3a]" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6"><BuyDialog /></div>
              <p className="mt-3 text-center text-xs font-bold text-[#60705f]">Razorpay secure payment. UPI, cards, and supported wallets.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">What's inside</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#17381f]">A complete kit for the first planting moment.</h2>
            <p className="mt-4 leading-7 text-[#60705f]">
              Each item supports a simple, guided activity parents can do with children at home.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contents.map((item) => (
              <Card key={item.title} className="border-[#e7dfca] bg-white shadow-sm">
                <CardContent className="flex gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#eef7eb] text-[#2d6a3a]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#17381f]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#60705f]">{item.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">How to use it</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#17381f]">Three steps from unboxing to care routine.</h2>
            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-lg bg-[#fffaf0] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f5b2b] font-extrabold text-white">
                    {index + 1}
                  </div>
                  <p className="pt-2 leading-6 text-[#425442]">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">Age and safety</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#17381f]">Simple guidance for confident parents.</h2>
            <div className="mt-6 grid gap-4">
              {[
                "Recommended for ages 4 and up.",
                "Adult supervision is recommended during planting and tool use.",
                "Suitable for indoor, balcony, or outdoor use with adequate light.",
                "Keep seeds, soil, and tools away from unsupervised toddlers.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-[#e7dfca] bg-[#fffaf0] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2d6a3a]" />
                  <p className="text-[#425442]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">Questions</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#17381f]">Everything parents ask before buying.</h2>
            <div className="mt-6 divide-y divide-[#e2d8bf] rounded-lg border border-[#e2d8bf] bg-white">
              {faqs.map((faq) => (
                <details key={faq.q} className="p-5">
                  <summary className="cursor-pointer list-none font-extrabold text-[#17381f]">{faq.q}</summary>
                  <p className="mt-3 leading-6 text-[#60705f]">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-[#17381f] p-8 text-white">
            <h2 className="text-3xl font-extrabold">A thoughtful gift that grows beyond the box.</h2>
            <p className="mt-4 leading-7 text-white/80">
              The real product is the experience: a child noticing the first sprout, remembering to water, and sharing the progress with family.
            </p>
            <div className="mt-6 space-y-3">
              {["Meaningful birthday gift", "Weekend activity at home", "School and activity-center friendly"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-white/10 p-3">
                  <CheckCircle2 className="h-5 w-5 text-[#f1c24b]" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e4d8ba] bg-white p-3 shadow-2xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-[#17381f]">{product.name}</p>
            <p className="text-lg font-extrabold text-[#1f5b2b]">Rs. {product.price}</p>
          </div>
          <div className="w-40"><BuyDialog compact /></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
