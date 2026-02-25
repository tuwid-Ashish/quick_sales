import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Leaf, Star, Shield, Truck, Package, Sprout,
  Sun, Droplets, Flower2, Scissors, CloudRain,
  ThumbsUp, Quote, Shovel, Timer, Heart
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { GetProducts } from "@/api";
import { ProductFormData } from "@/types";
import { useAppDispatch } from "@/Store/Store";
import { addrefreral } from "@/Store/ReferalSlice";

const gardenCategories = [
  { name: "Seed Kits", icon: Sprout, color: "from-green-500 to-emerald-600", desc: "Organic vegetable & flower seeds" },
  { name: "Garden Tools", icon: Scissors, color: "from-amber-500 to-orange-600", desc: "Pruners, trowels & cultivators" },
  { name: "Planters & Pots", icon: Flower2, color: "from-teal-500 to-cyan-600", desc: "Ceramic, terracotta & fabric pots" },
  { name: "Soil & Fertilizer", icon: Shovel, color: "from-yellow-600 to-amber-700", desc: "Potting mix, compost & manure" },
  { name: "Watering", icon: Droplets, color: "from-blue-500 to-sky-600", desc: "Cans, sprayers & drip systems" },
  { name: "Plant Care", icon: Sun, color: "from-rose-500 to-pink-600", desc: "Neem oil, growth boosters & more" },
];

const gardeningTips = [
  {
    title: "Best Time to Water Your Plants",
    excerpt: "Early morning watering helps plants absorb moisture before the heat of the day. Avoid watering at night to prevent fungal growth.",
    icon: CloudRain,
    tag: "Watering",
    image: "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
  },
  {
    title: "How to Prepare Soil for Monsoon",
    excerpt: "Add cocopeat and perlite to improve drainage. Raised beds work best in heavy-rain areas to prevent root rot.",
    icon: Shovel,
    tag: "Soil Care",
    image: "https://images.pexels.com/photos/1214394/pexels-photo-1214394.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
  },
  {
    title: "Growing Tomatoes in Containers",
    excerpt: "Choose a 15-inch pot, use well-draining soil, and ensure 6-8 hours of sunlight. Stake the plant once it reaches 12 inches.",
    icon: Sun,
    tag: "Vegetables",
    image: "https://images.pexels.com/photos/1084542/pexels-photo-1084542.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
  },
];

const testimonials = [
  {
    name: "Meera Joshi",
    location: "Mumbai",
    text: "The herb garden kit was incredible! Fresh basil and coriander in just 3 weeks. My kitchen has never smelled better.",
    rating: 5,
    product: "Kitchen Herb Kit",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
  {
    name: "Arjun Reddy",
    location: "Hyderabad",
    text: "As a first-time gardener, the starter kit made it so easy. The seeds, soil, and pots - everything was perfect quality.",
    rating: 5,
    product: "Beginner Starter Kit",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
  {
    name: "Sneha Kulkarni",
    location: "Pune",
    text: "I ordered the terrace garden combo and my balcony is now full of marigolds and petunias. Delivery was super fast too!",
    rating: 5,
    product: "Terrace Garden Combo",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [featuredProducts, setFeaturedProducts] = useState<ProductFormData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral_id = params.get("referral_id");

    if (referral_id) {
      dispatch(addrefreral({ referralCode: referral_id }));
      console.log("Referral ID captured and saved:", referral_id);
    }
  }, [location.search, dispatch]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await GetProducts(6, 1);
        setFeaturedProducts(response.data.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafdf7]">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Beautiful garden"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c0a]/90 via-[#2d5016]/25 to-[#1a3c0a]/10" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Sprout className="h-4 w-4 text-lime-300" />
                <span className="text-sm font-medium text-lime-100">Spring Collection 2026 is here!</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                Nurture Your
                <br />
                <span className="text-lime-300 italic">Green Paradise</span>
              </h1>
              <p className="text-xl text-green-100/90 max-w-lg leading-relaxed">
                From organic heirloom seeds to premium garden tools everything a gardener needs, delivered to your doorstep with love and care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/products')}
                  className="bg-lime-400 text-green-900 hover:bg-lime-300 shadow-xl hover:shadow-2xl transition-all h-14 px-8 text-lg font-bold"
                >
                  <Sprout className="mr-2 h-5 w-5" />
                  Shop Garden Kits
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="border-2 border-white/40 text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm h-14 px-8 text-lg"
                >
                  Our Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <p className="text-3xl font-bold text-lime-300">15K+</p>
                  <p className="text-green-200 text-sm">Happy Gardeners</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-lime-300">500+</p>
                  <p className="text-green-200 text-sm">Plant Varieties</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-lime-300">98%</p>
                  <p className="text-green-200 text-sm">Germination Rate</p>
                </div>
              </div>
            </div>
            {/* <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-400/20 rounded-3xl blur-3xl scale-105"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <img
                    src="https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop"
                    alt="Person holding fresh plants in garden"
                    className="w-[380px] h-[440px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-white font-bold text-lg">Start Growing Today</p>
                    <p className="text-white/80 text-sm">Fresh from your own garden</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        {/* Organic wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#fafdf7"
              fillOpacity="1"
              d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="py-6 bg-[#fafdf7] border-b border-green-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center gap-3 py-3">
              <div className="bg-green-100 rounded-full p-2.5">
                <Truck className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Free Delivery</p>
                <p className="text-xs text-gray-500">On orders above ₹499</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 py-3">
              <div className="bg-emerald-100 rounded-full p-2.5">
                <Leaf className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">100% Organic</p>
                <p className="text-xs text-gray-500">Non-GMO heirloom seeds</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 py-3">
              <div className="bg-amber-100 rounded-full p-2.5">
                <Timer className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Grow in 2-4 Weeks</p>
                <p className="text-xs text-gray-500">Fast germination seeds</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 py-3">
              <div className="bg-lime-100 rounded-full p-2.5">
                <Shield className="h-5 w-5 text-lime-700" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Growth Guarantee</p>
                <p className="text-xs text-gray-500">Or we replace free</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY ===== */}
      <section className="py-16 bg-[#fafdf7]">
        <div className="container mx-auto px-4">
          {/* Category Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-12 h-48 md:h-56">
            <img
              src="https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=1400&h=400&fit=crop"
              alt="Colorful garden display"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2d5016]/80 to-transparent flex items-center">
              <div className="px-8 md:px-12">
                <p className="text-lime-300 font-semibold mb-1 tracking-wide uppercase text-sm flex items-center gap-2">
                  <Leaf className="h-4 w-4" /> Browse by Category
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Shop for Your Garden</h2>
                <p className="text-green-100/80 max-w-md">
                  Whether you're starting a kitchen herb garden or landscaping your backyard, we have everything you need.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {gardenCategories.map((cat) => (
              <Card
                key={cat.name}
                className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                onClick={() => navigate('/products')}
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className={`bg-gradient-to-br ${cat.color} rounded-2xl p-4 mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <cat.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-800 mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500 leading-snug">{cat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEASONAL BANNER ===== */}
      {/* <section className="py-12 bg-gradient-to-r from-amber-50 via-lime-50 to-green-50 border-y border-green-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-stretch overflow-hidden bg-white rounded-2xl shadow-lg border border-green-100">
            {/* Image side 
            <div className="md:w-2/5 h-48 md:h-auto flex-shrink-0">
              <img
                src="https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Spring flowers blooming in garden"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Content side 
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 flex-1">
              <div>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 mb-2">Spring Special</Badge>
                <h3 className="text-2xl font-bold text-gray-900">Spring Planting Season is Here!</h3>
                <p className="text-gray-600 mt-1">
                  Get 15% off on all flower seed kits and summer vegetable starters. Perfect time to sow tomatoes, marigolds, and sunflowers.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg h-12 px-8 whitespace-nowrap"
              >
                Shop Spring Deals
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-green-700 font-semibold mb-2 tracking-wide uppercase text-sm flex items-center justify-center gap-2">
              <Heart className="h-4 w-4" /> Customer Favorites
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Best-Selling Garden Kits</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Hand-picked by our gardening experts and loved by thousands of home gardeners across India
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-56 bg-green-100 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-6 bg-green-100 rounded"></div>
                    <div className="h-4 bg-green-50 rounded w-3/4"></div>
                    <div className="h-8 bg-green-50 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="group hover:shadow-2xl transition-all duration-300 border border-green-100 bg-white overflow-hidden cursor-pointer transform hover:-translate-y-2"
                  onClick={() => navigate(`/products/${product._id}${location.search}`)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-green-700 shadow-md border-0 backdrop-blur-sm">
                        <Leaf className="h-3 w-3 mr-1" />
                        Organic
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-700 text-white shadow-lg">
                        <Package className="h-3 w-3 mr-1" />
                        In Stock
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-green-700 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                      {product.description && product.description.length > 60
                        ? `${product.description.slice(0, 60)}...`
                        : product.description}
                    </p>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-sm text-gray-400 ml-1">(4.8)</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-bold text-green-800">
                        ₹{product.price}
                      </p>
                      <Button
                        className="bg-green-700 hover:bg-green-800 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/products/${product._id}${location.search}`);
                        }}
                      >
                        View Kit
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/products')}
              className="bg-green-700 hover:bg-green-800 h-14 px-8 text-lg"
            >
              Explore All Garden Kits
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== GARDENING TIPS ===== */}
      <section className="py-16 bg-[#fafdf7]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-green-700 font-semibold mb-2 tracking-wide uppercase text-sm flex items-center justify-center gap-2">
              <Sprout className="h-4 w-4" /> From the Garden Journal
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Gardening Tips & Guides</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Practical advice from our horticulturists to help your garden thrive
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gardeningTips.map((tip, i) => (
              <Card key={i} className="border border-green-100 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={tip.image}
                      alt={tip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-green-800 border-0 backdrop-blur-sm shadow-sm">{tip.tag}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-3">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{tip.excerpt}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 bg-white border-t border-green-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-green-700 font-semibold mb-2 tracking-wide uppercase text-sm">Simple as 1-2-3</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-40 h-40 rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" alt="Choosing a gardening kit" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">1</div>
              </div>
              <h3 className="font-bold text-lg text-gray-900">Pick Your Kit</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Choose from our curated range of gardening kits - herbs, vegetables, flowers, or succulents.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-40 h-40 rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.pexels.com/photos/6913423/pexels-photo-6913423.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" alt="Person planting seeds" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">2</div>
              </div>
              <h3 className="font-bold text-lg text-gray-900">Plant & Water</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Follow our easy step-by-step guide included in every kit. Just add water and sunlight!</p>
            </div>
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-40 h-40 rounded-2xl overflow-hidden shadow-lg">
                <img src="https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop" alt="Fresh plants growing" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-lime-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">3</div>
              </div>
              <h3 className="font-bold text-lg text-gray-900">Watch It Grow</h3>
              <p className="text-gray-500 text-sm leading-relaxed">See your first sprouts in 7-14 days. Harvest fresh vegetables and herbs from your own garden!</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-green-700 font-semibold mb-2 tracking-wide uppercase text-sm flex items-center justify-center gap-2">
              <ThumbsUp className="h-4 w-4" /> Happy Gardeners
            </p>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">What Our Gardeners Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <Quote className="h-8 w-8 text-green-200" />
                  <p className="text-gray-700 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-green-200" />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.location} · <span className="text-green-700 font-medium">{t.product}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER / CTA ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/4503267/pexels-photo-4503267.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop"
            alt="Lush garden background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#243124]/85" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <Sprout className="h-12 w-12 text-lime-300 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Grow Something Beautiful?
          </h2>
          <p className="text-xl text-green-200 mb-8 max-w-2xl mx-auto">
            Join 15,000+ home gardeners who started their green journey with our kits. Your garden is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/products')}
              className="bg-lime-400 text-green-900 hover:bg-lime-300 shadow-xl hover:shadow-2xl transition-all h-14 px-10 text-lg font-bold"
            >
              <Sprout className="mr-2 h-5 w-5" />
              Start My Garden
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="border-2 border-white/40 text-white bg-white/5 hover:bg-white/15 backdrop-blur-sm h-14 px-10 text-lg"
            >
              Learn About Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
