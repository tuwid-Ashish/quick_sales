import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="p-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Our Platform</h1>
        <p className="text-lg text-gray-600 mt-2">
          We are dedicated to delivering the best solutions for your needs.
        </p>
        <Button className="mt-4">Explore Our Services</Button>
      </section>

      <Separator />

      {/* Company Highlights */}
      <section>
        <h2 className="text-2xl font-semibold text-center mb-6">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold">Innovation</h3>
              <p className="text-gray-500 mt-2">
                We leverage cutting-edge technology to bring you the best solutions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold">Customer Focus</h3>
              <p className="text-gray-500 mt-2">
                Your satisfaction is our priority. We tailor solutions to your needs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold">Trust & Transparency</h3>
              <p className="text-gray-500 mt-2">
                We operate with integrity and ensure clarity in all our services.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Team Section */}
      <section>
        <h2 className="text-2xl font-semibold text-center mb-6">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: "John Doe", role: "CEO", img: "https://via.placeholder.com/100" },
            { name: "Jane Smith", role: "CTO", img: "https://via.placeholder.com/100" },
            { name: "Robert Brown", role: "Lead Developer", img: "https://via.placeholder.com/100" },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={member.img} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="mt-2 text-lg font-bold">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Why Choose Us */}
      <section>
        <h2 className="text-2xl font-semibold text-center mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold">Proven Track Record</h3>
              <p className="text-gray-500 mt-2">
                We have successfully served numerous clients across industries.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold">24/7 Customer Support</h3>
              <p className="text-gray-500 mt-2">
                Our dedicated team is available round the clock to assist you.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold">Ready to Work with Us?</h2>
        <p className="text-lg text-gray-600 mt-2">Get in touch and let's build something great together.</p>
        <Button className="mt-4">Contact Us</Button>
      </section>
    </div>
  );
}
