import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sprout, Heart, Shield, Truck, Award, Users, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const milestones = [
  { year: "2022", event: "Started with 10 DIY seed kits from a home garden in Pune" },
  { year: "2023", event: "Reached 5,000 customers across 15 Indian cities" },
  { year: "2024", event: "Launched premium tool line & eco-friendly packaging" },
  { year: "2025", event: "15,000+ happy gardeners, 500+ product varieties" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafdf7]">
      {/* Hero Section */}
      <div className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop"
            alt="Beautiful garden with flowers and greenery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a3c0a]/90 via-[#2d5016]/85 to-[#1a3c0a]/80" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-lime-400/20 text-lime-200 border-lime-400/30 mb-4">
              <Sprout className="h-3 w-3 mr-1" />
              Our Story
            </Badge>
            <h1 className="text-5xl font-bold mb-6">We Believe Every Home<br />Deserves a Garden</h1>
            <p className="text-xl text-green-200/80 leading-relaxed max-w-2xl mx-auto">
              What started as a passion project in a small Pune balcony has grown into India's most loved gardening kit brand - helping thousands discover the joy of growing their own food and flowers.
            </p>
            <Link to="/products">
              <Button className="mt-8 bg-lime-400 text-green-900 hover:bg-lime-300 font-bold h-12 px-8">
                <Sprout className="mr-2 h-5 w-5" />
                Explore Our Kits
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Our Mission */}
        <section className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-green-700 font-semibold mb-2 tracking-wide uppercase text-sm flex items-center gap-2">
                <Heart className="h-4 w-4" /> Our Mission
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Making Gardening Easy, Accessible & Joyful</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We noticed that many people wanted to grow plants but felt intimidated - where to start, what soil to use, which seeds work best for Indian climates. That's why we created complete, ready-to-grow kits that take the guesswork out of gardening.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every kit includes organic heirloom seeds, nutrient-rich soil mix, biodegradable pots, and a step-by-step growing guide. Whether you have a large terrace or just a windowsill, you can grow fresh herbs, vegetables, and flowers right at home.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-green-100">
              <img
                src="https://images.pexels.com/photos/6913423/pexels-photo-6913423.jpeg?auto=compress&cs=tinysrgb&w=600&h=500&fit=crop"
                alt="Person potting plants in a sunny garden"
                className="w-full h-64 object-cover"
              />
              <div className="bg-gradient-to-br from-green-50 to-lime-50 p-8 border-t border-green-100">
                <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-800">15K+</p>
                  <p className="text-sm text-gray-600 mt-1">Home Gardeners</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-800">500+</p>
                  <p className="text-sm text-gray-600 mt-1">Plant Varieties</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-800">98%</p>
                  <p className="text-sm text-gray-600 mt-1">Germination Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-800">25+</p>
                  <p className="text-sm text-gray-600 mt-1">Cities Served</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        <Separator className="bg-green-100" />

        <section>
          <div className="text-center mb-12">
            <p className="text-green-700 font-semibold mb-2 tracking-wide uppercase text-sm flex items-center justify-center gap-2">
              <Award className="h-4 w-4" /> What Sets Us Apart
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Gardeners Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-green-100 hover:shadow-lg transition-shadow bg-white overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img src="https://images.pexels.com/photos/1084542/pexels-photo-1084542.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop" alt="Organic seeds sprouting" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Organic Seeds</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  All our kits include pure, non-GMO heirloom seeds sourced from certified organic farms. No chemicals, no shortcuts - just nature.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-green-100 hover:shadow-lg transition-shadow bg-white overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img src="https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop" alt="Sunflowers growing in sunlight" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Indian Climate Ready</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Our seeds and soil mixes are specially curated for Indian weather conditions - from humid monsoons to dry summers.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-green-100 hover:shadow-lg transition-shadow bg-white overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img src="https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop" alt="Beginner gardener with a small kit" className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Beginner Friendly</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Never gardened before? No problem. Each kit has illustrated guides, QR-code video tutorials, and our expert support via WhatsApp.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="bg-green-100" />

        {/* Our Journey Timeline */}
        <section>
          <div className="text-center mb-12">
            <p className="text-green-700 font-semibold mb-2 tracking-wide uppercase text-sm">From Seed to Story</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Growing Journey</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-0">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="bg-green-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shadow-md">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 h-12 bg-green-200 mt-2"></div>}
                </div>
                <div className="pt-2.5 pb-6">
                  <p className="text-gray-700 leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="bg-green-100" />

        {/* Team Section */}
        <section>
          <div className="text-center mb-12">
            <p className="text-green-700 font-semibold mb-2 tracking-wide uppercase text-sm flex items-center justify-center gap-2">
              <Users className="h-4 w-4" /> The Green Team
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet Our Garden Experts</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Passionate horticulturists and plant-lovers who test every product before it reaches your doorstep
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { name: "Nitin", role: "Founder & Process Lead", img: "/images/Suminder Singh.png?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", bio: "10+ years growing organic vegetables" },
              { name: "Raj Patel", role: "Marketing & Growth", img: "/images/nitin.png?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", bio: "Soil scientist & seed specialist" },
              { name: "Ashish kumar", role: "Technology & Operations", img: "/images/Ashish.png?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", bio: "Helps 100+ gardeners weekly" },
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <Avatar className="w-24 h-24 mx-auto ring-4 ring-green-200 group-hover:ring-lime-300 transition-all">
                  <AvatarImage src={member.img} alt={member.name} />
                  <AvatarFallback className="bg-green-700 text-white">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mt-3 text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-green-700 font-medium text-sm">{member.role}</p>
                <p className="text-gray-500 text-xs mt-1">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="bg-green-100" />

        {/* Trust Badges */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-green-100 bg-white">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="bg-green-100 rounded-xl p-2.5 flex-shrink-0">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">15,000+ Gardeners</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Trusted by home gardeners across India</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-green-100 bg-white">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="bg-amber-100 rounded-xl p-2.5 flex-shrink-0">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Expert Guidance</h3>
                  <p className="text-gray-500 text-sm mt-0.5">WhatsApp support from real horticulturists</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-green-100 bg-white">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="bg-sky-100 rounded-xl p-2.5 flex-shrink-0">
                  <Truck className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Eco Delivery</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Plastic-free, biodegradable packaging</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-green-100 bg-white">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="bg-lime-100 rounded-xl p-2.5 flex-shrink-0">
                  <Shield className="h-6 w-6 text-lime-700" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Growth Guarantee</h3>
                  <p className="text-gray-500 text-sm mt-0.5">If it doesn't sprout, we replace it free</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-8">
          <div className="relative bg-gradient-to-br from-green-50 to-lime-50 rounded-2xl overflow-hidden border border-green-100">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300&fit=crop"
                alt="Beautiful blooming garden"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#2d5016]/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sprout className="h-12 w-12 text-lime-300" />
              </div>
            </div>
            <div className="p-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Start Your Garden?</h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Browse our hand-curated gardening kits and start growing fresh herbs, vegetables, and flowers at home today.
              </p>
              <Link to="/products">
                <Button className="bg-[#2d5016] hover:bg-[#3a6b1e] text-white text-lg px-8 h-12 font-bold">
                  <Package className="mr-2 h-5 w-5" />
                  Shop Garden Kits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
