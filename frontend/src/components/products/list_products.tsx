import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GetProducts } from "@/api";
import { ProductFormData } from "@/types";
import { useAppDispatch } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Gift, Leaf, ShieldCheck, ShoppingCart, Sprout, Truck } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const fallbackImage = "/images/product-sample-image/WhatsApp%20Image%202026-05-01%20at%209.59.59%20AM.jpeg";

const getProductImage = (product: ProductFormData) =>
  product.thumbnails?.[0] || product.images?.[0] || fallbackImage;

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["single-product-entry"],
    queryFn: () => GetProducts(1, 1),
  });

  const product: ProductFormData | undefined = data?.data?.data?.products?.[0];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral_id = params.get("referral_id");

    if (referral_id) {
      dispatch(addrefreral({ referralCode: referral_id }));
    }
  }, [location.search, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fffaf0] py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 lg:grid-cols-2">
          <Skeleton className="h-[520px] rounded-xl" />
          <div className="space-y-5">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-16 w-4/5" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-14 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf0] px-4 text-center">
        <div>
          <p className="text-lg font-extrabold text-[#17381f]">The kit is not available right now.</p>
          <p className="mt-2 text-[#60705f]">Please check again later or contact support.</p>
        </div>
      </div>
    );
  }

  const productPath = `/products/${product._id}${location.search}`;

  return (
    <div className="min-h-screen bg-[#fffaf0] font-nunito text-[#17381f]">
      <section className="bg-[#f8f1df] py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-xl border border-[#e4d8ba] bg-white shadow-xl">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="h-[420px] w-full object-cover sm:h-[560px]"
            />
          </div>

          <div>
            <Badge className="mb-4 border-[#b8d9b7] bg-white text-[#2d6a3a]">
              <Sprout className="mr-2 h-3.5 w-3.5" />
              One complete starter kit
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight text-[#17381f] sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#60705f]">
              {product.description || "A complete hands-on gardening kit designed to help children learn nature through play."}
            </p>

            <div className="mt-6 rounded-lg border border-[#e4d8ba] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wider text-[#60705f]">Current price</p>
              <p className="mt-1 text-5xl font-extrabold text-[#1f5b2b]">Rs. {product.price}</p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {["Complete kit", "Screen-free activity", "Gift-ready", "Secure payment"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-bold text-[#425442]">
                    <CheckCircle2 className="h-4 w-4 text-[#2d6a3a]" />
                    {item}
                  </div>
                ))}
              </div>
              <Button
                onClick={() => navigate(productPath)}
                className="mt-6 h-14 w-full rounded-md bg-[#1f5b2b] text-base font-extrabold text-white hover:bg-[#174621] sm:w-auto sm:px-8"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                View Details and Buy
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Parent-focused", text: "Clear age, safety, and contents information." },
            { icon: Gift, title: "Gift-ready", text: "A useful activity instead of another passive toy." },
            { icon: Truck, title: "Fast dispatch", text: "Packed carefully for home delivery." },
            { icon: Leaf, title: "Nature learning", text: "Hands-on plant care for curious children." },
          ].map((item) => (
            <Card key={item.title} className="border-[#e7dfca] bg-white shadow-sm">
              <CardContent className="p-5">
                <item.icon className="mb-4 h-6 w-6 text-[#2d6a3a]" />
                <h2 className="font-extrabold text-[#17381f]">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#60705f]">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-[#17381f] p-8 text-white">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold">Ready to start your child&apos;s first plant?</h2>
              <p className="mt-2 text-white/75">The next page shows the full product gallery, kit contents, FAQ, and checkout.</p>
            </div>
            <Button onClick={() => navigate(productPath)} className="h-12 rounded-md bg-[#f1c24b] px-6 font-extrabold text-[#17381f] hover:bg-[#ffd66a]">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
