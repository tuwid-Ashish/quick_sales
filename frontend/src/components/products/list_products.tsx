import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { GetProducts } from "@/api";
import { ProductFormData } from "@/types";
import { useAppDispatch } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";
import { useQuery } from "@tanstack/react-query";

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

  const productPath = product ? `/products/${product._id}${location.search}` : null;

  useEffect(() => {
    if (!isLoading && productPath) {
      navigate(productPath, { replace: true });
    }
  }, [isLoading, productPath, navigate]);

  if (isError || (!isLoading && !product)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4 text-center">
        <div>
          <p className="text-xl font-display font-extrabold text-forest">The kit is not available right now.</p>
          <p className="mt-2 text-sage font-medium">Please check again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest">
      {/* Radial glow behind logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-sage/10 blur-[100px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="Get Gardening"
          className="h-24 w-auto object-contain brightness-0 invert drop-shadow-2xl sm:h-28"
        />

        {/* Animated loader */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        <p className="text-sm font-medium tracking-widest uppercase text-sage font-nunito">
          Preparing your kit...
        </p>
      </div>
    </div>
  );
};

export default ProductsPage;
