import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Leaf, Sprout, TreeDeciduous } from "lucide-react";
import { Link } from "react-router";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to GetGardening</h1>
            <p className="text-xl text-green-100">
              We're passionate about helping you grow your dream garden with premium kits and expert guidance.
            </p>
            <Link to="/products">
              <Button className="mt-6 bg-white text-green-600 hover:bg-green-50">
                Explore Our Kits
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Company Highlights */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Why We're Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800">Organic Seeds</h3>
                <p className="text-gray-600 mt-2">
                  All our kits include 100% organic, non-GMO seeds for healthy, natural growth.
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800">Easy to Grow</h3>
                <p className="text-gray-600 mt-2">
                  Perfect for beginners! Our kits come with everything you need to get started.
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreeDeciduous className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800">Eco-Friendly</h3>
                <p className="text-gray-600 mt-2">
                  Sustainable packaging and eco-conscious products for a greener planet.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="bg-green-200" />

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Meet Our Garden Experts</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: "Priya Sharma", role: "Founder & Horticulturist", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
              { name: "Raj Patel", role: "Garden Specialist", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Raj" },
              { name: "Anita Gupta", role: "Customer Success", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita" },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <Avatar className="w-24 h-24 mx-auto ring-4 ring-green-200">
                  <AvatarImage src={member.img} alt={member.name} />
                  <AvatarFallback className="bg-green-600 text-white">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="mt-3 text-lg font-bold text-green-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="bg-green-200" />

        {/* Why Choose Us */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Why Choose GetGardening?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-green-800">10,000+ Happy Gardeners</h3>
                <p className="text-gray-600 mt-2">
                  Join our growing community of gardening enthusiasts across India who trust our kits.
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-green-800">Expert Support</h3>
                <p className="text-gray-600 mt-2">
                  Get tips, guidance, and answers from our team of experienced horticulturists.
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-green-800">Fast Delivery</h3>
                <p className="text-gray-600 mt-2">
                  Quick and safe delivery to your doorstep with eco-friendly packaging.
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-green-800">100% Satisfaction</h3>
                <p className="text-gray-600 mt-2">
                  Not happy? We offer hassle-free returns and dedicated customer support.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="bg-green-200" />

        {/* Call to Action */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-bold text-green-800">Ready to Start Your Garden?</h2>
          <p className="text-lg text-gray-600 mt-2">Browse our premium gardening kits and start growing today!</p>
          <Link to="/products">
            <Button className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-3">
              Shop Now
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
