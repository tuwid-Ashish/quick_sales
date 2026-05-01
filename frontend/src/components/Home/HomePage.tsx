import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Droplets,
  Gift,
  HeartHandshake,
  Leaf,
  Package,
  ShieldCheck,
  Shovel,
  Sparkles,
  Sprout,
  Sun,
  Timer,
  Truck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { GetProducts } from "@/api";
import { ProductFormData } from "@/types";
import { useAppDispatch } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";

const productImages = {
  hero: "/images/product-sample-image/WhatsApp%20Image%202026-05-01%20at%209.59.59%20AM.jpeg",
  tools: "/images/product-sample-image/WhatsApp%20Image%202026-05-01%20at%2010.00.01%20AM.jpeg",
  soil: "/images/product-sample-image/WhatsApp%20Image%202026-05-01%20at%2010.00.00%20AM.jpeg",
};

const trustBadges = [
  { icon: ShieldCheck, title: "Parent-approved", text: "Designed for guided, screen-free play" },
  { icon: Truck, title: "Fast shipping", text: "Packed carefully for gifting" },
  { icon: CheckCircle2, title: "Complete kit", text: "No extra supplies needed to start" },
  { icon: Leaf, title: "Beginner friendly", text: "Simple steps for first-time growers" },
];

const benefits = [
  { icon: BookOpen, title: "Learn by doing", text: "Children discover seeds, soil, watering, patience, and daily care." },
  { icon: Timer, title: "Screen-free activity", text: "A meaningful weekend project that keeps little hands engaged." },
  { icon: HeartHandshake, title: "Bond as a family", text: "Planting becomes a shared ritual between parents and children." },
  { icon: Gift, title: "Gift-worthy", text: "A thoughtful alternative to another toy, gadget, or plastic activity." },
  { icon: Sprout, title: "Builds responsibility", text: "Daily watering teaches care through a tiny living routine." },
  { icon: Sparkles, title: "Easy for beginners", text: "Clear instructions make the first gardening attempt feel simple." },
];

const kitContents = [
  { icon: Shovel, title: "Gardening tools", text: "Small hand tools for scooping, loosening, and planting soil." },
  { icon: Package, title: "Coco peat / soil", text: "Ready growing medium packed for easy home use." },
  { icon: Droplets, title: "Spray bottle", text: "Gentle watering so kids can care without over-pouring." },
  { icon: Sprout, title: "Seeds", text: "Beginner-friendly seeds for a first growing experience." },
  { icon: Leaf, title: "Pots", text: "Starter containers for planting and watching progress." },
  { icon: BookOpen, title: "Simple guide", text: "Step-by-step instructions for parents and kids." },
];

const steps = [
  { title: "Open the kit", text: "Unpack the tools, growing medium, seeds, and guide together." },
  { title: "Plant the seeds", text: "Fill the pot, add seeds, cover lightly, and mist with water." },
  { title: "Water and watch", text: "Keep it in a bright spot and check for sprouts each day." },
];

const reviews = [
  "My child loved planting with me. It became our Sunday morning activity.",
  "A perfect gift for curious kids. Simple, beautiful, and educational.",
  "The kit made gardening feel easy even though we live in an apartment.",
];

const faqs = [
  { q: "What age is this for?", a: "It is best for children ages 4 and up with adult supervision." },
  { q: "Do I need extra supplies?", a: "No. The starter kit includes the essentials needed to begin planting." },
  { q: "Can it be used indoors?", a: "Yes. Keep the pot near a bright window or balcony with gentle sunlight." },
  { q: "Is adult supervision needed?", a: "Yes. A parent or adult should guide planting, watering, and tool use." },
];

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [featuredProducts, setFeaturedProducts] = useState<ProductFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const primaryProduct = featuredProducts[0];
  const productPath = primaryProduct ? `/products/${primaryProduct._id}${location.search}` : `/products${location.search}`;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral_id = params.get("referral_id");

    if (referral_id) {
      dispatch(addrefreral({ referralCode: referral_id }));
    }
  }, [location.search, dispatch]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await GetProducts(6, 1);
        setFeaturedProducts(response.data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffaf0] font-nunito text-[#17381f]">
      <section className="relative overflow-hidden bg-[#f8f1df]">
        <div className="container mx-auto grid min-h-[calc(100vh-80px)] grid-cols-1 items-center gap-10 px-4 py-12 md:py-16 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <Badge className="mb-5 border-[#b8d9b7] bg-white text-[#2d6a3a]">
              <Leaf className="mr-2 h-3.5 w-3.5" />
              Screen-free nature learning
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-normal text-[#15351d] sm:text-5xl lg:text-7xl">
              Grow your child's first plant.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#526252]">
              A complete screen-free gardening kit that helps kids learn nature through fun, guided, hands-on play.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate(productPath)}
                className="h-14 rounded-md bg-[#1f5b2b] px-7 text-base font-bold text-white hover:bg-[#174621]"
              >
                Start Growing Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("inside-kit")?.scrollIntoView({ behavior: "smooth" })}
                className="h-14 rounded-md border-[#8eb68b] bg-white px-7 text-base font-bold text-[#1f5b2b] hover:bg-[#eef7eb]"
              >
                See What's Inside
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              {["Ages 4+", "Beginner friendly", "Secure checkout"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-md bg-white px-3 py-3 text-[#425442] shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-[#2d6a3a]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-[#e4d8ba] bg-white shadow-2xl">
              <img
                src={productImages.hero}
                alt="Get Gardening kit contents with seeds, spray bottle, and soil"
                className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[560px]"
              />
            </div>
            <div className="absolute bottom-5 left-5 max-w-[260px] rounded-lg bg-white/95 p-4 shadow-xl backdrop-blur">
              <p className="text-sm font-bold text-[#17381f]">Everything in one starter kit</p>
              <p className="mt-1 text-xs leading-5 text-[#62705f]">
                Soil, seeds, tools, misting bottle, and simple guidance for the first planting moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e7dfca] bg-white">
        <div className="container mx-auto grid grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex items-start gap-3 rounded-lg bg-[#fbf8ee] p-4">
              <badge.icon className="mt-0.5 h-5 w-5 text-[#2d6a3a]" />
              <div>
                <p className="font-bold text-[#17381f]">{badge.title}</p>
                <p className="mt-1 text-sm text-[#687265]">{badge.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">Designed for modern parents</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#17381f] sm:text-4xl">
                Less scrolling. More planting, observing, and caring.
              </h2>
              <p className="mt-4 leading-7 text-[#60705f]">
                In a world full of screens, this kit gives children a chance to slow down, get their hands dirty, and discover the joy of growing something by themselves.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-[#e7dfca] bg-[#fffaf0] shadow-sm">
                  <CardContent className="p-5">
                    <div className="mb-4 inline-flex rounded-md bg-white p-3 text-[#2d6a3a] shadow-sm">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-[#17381f]">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#61705f]">{benefit.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="inside-kit" className="bg-[#f8f1df] py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">What's inside</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#17381f] sm:text-4xl">
              Clear contents, no guesswork.
            </h2>
            <p className="mt-4 text-[#60705f]">
              Every item is chosen to make the first growing experience simple, tactile, and confidence-building.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="grid grid-cols-2 gap-3">
              <img src={productImages.tools} alt="Kid-sized gardening tools" className="h-64 w-full rounded-lg object-cover shadow-md" />
              <img src={productImages.soil} alt="Get Gardening soil pouches" className="h-64 w-full rounded-lg object-cover shadow-md" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {kitContents.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-lg border border-[#e0d4b8] bg-white p-4 shadow-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#eef7eb] text-[#2d6a3a]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#17381f]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#61705f]">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">How it works</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#17381f] sm:text-4xl">
                A three-step ritual kids can understand.
              </h2>
              <p className="mt-4 leading-7 text-[#60705f]">
                The kit turns planting into a clear story: open, plant, care, and watch nature respond.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-lg border border-[#e7dfca] bg-[#fffaf0] p-5">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#1f5b2b] text-lg font-extrabold text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-extrabold text-[#17381f]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#61705f]">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eaf5ee] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-xl shadow-xl">
              <img
                src="https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=1000&h=760&fit=crop"
                alt="Parent and child planting together"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">Why parents love it</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#17381f] sm:text-4xl">
                It feels like play, but teaches patience and care.
              </h2>
              <div className="mt-6 grid gap-3">
                {[
                  "Keeps children engaged without screens.",
                  "Easy to use at home, balcony, or school activity corner.",
                  "Creates shared family time around a simple daily routine.",
                  "Makes a meaningful birthday or return gift.",
                  "Helps children see that living things need consistent care.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-md bg-white p-4 shadow-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2d6a3a]" />
                    <p className="text-[#425442]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-xl border border-[#e7dfca] bg-[#fffaf0] shadow-sm lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">The kit we sell</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#17381f] sm:text-4xl">
                Get Gardening Kids Starter Kit
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#60705f]">
                We are focused on one complete starter kit, not a crowded catalog. The product detail page has the current price, product photos, contents, safety notes, and checkout.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {["Complete kit", "Gift-ready", "Secure payment"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-md bg-white px-3 py-3 text-sm font-bold text-[#425442]">
                    <CheckCircle2 className="h-4 w-4 text-[#2d6a3a]" />
                    {item}
                  </div>
                ))}
              </div>
              <Button
                disabled={loading}
                onClick={() => navigate(productPath)}
                className="mt-7 h-14 rounded-md bg-[#1f5b2b] px-7 text-base font-extrabold text-white hover:bg-[#174621]"
              >
                {loading ? "Loading kit..." : "View Kit and Buy"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <img
              src={productImages.hero}
              alt="Get Gardening starter kit"
              className="h-80 w-full object-cover lg:h-full"
            />
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#fffaf0] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">Parent notes</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#17381f] sm:text-4xl">Short answers before you buy.</h2>
              <div className="mt-6 divide-y divide-[#e2d8bf] rounded-lg border border-[#e2d8bf] bg-white">
                {faqs.map((faq) => (
                  <details key={faq.q} className="group p-5">
                    <summary className="cursor-pointer list-none font-extrabold text-[#17381f] marker:hidden">
                      {faq.q}
                    </summary>
                    <p className="mt-3 leading-6 text-[#61705f]">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
            <div id="reviews" className="rounded-xl bg-[#17381f] p-8 text-white">
              <h2 className="text-3xl font-extrabold">Early parent feedback</h2>
              <div className="mt-6 space-y-4">
                {reviews.map((review) => (
                  <div key={review} className="rounded-lg bg-white/10 p-4">
                    <p className="leading-7 text-white/90">"{review}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1f5b2b] py-16">
        <div className="container mx-auto px-4 text-center">
          <Sun className="mx-auto mb-5 h-12 w-12 text-[#f1c24b]" />
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
            Start your child's gardening journey today.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/80">
            Give them a plant to care for, a reason to observe, and a memory you can grow together.
          </p>
          <Button
            size="lg"
            onClick={() => navigate(productPath)}
            className="mt-8 h-14 rounded-md bg-[#f1c24b] px-8 text-base font-extrabold text-[#17381f] hover:bg-[#ffd66a]"
          >
            Add to Cart
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
