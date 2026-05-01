import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, CheckCircle2, Gift, HeartHandshake, Leaf, ShieldCheck, Sprout, Users } from "lucide-react";
import { Link } from "react-router";

const values = [
  { icon: Leaf, title: "Nature first", text: "We make gardening approachable for families who may only have a balcony, windowsill, or small outdoor corner." },
  { icon: BookOpen, title: "Learning through touch", text: "Children understand responsibility better when they can see, water, and care for a living thing." },
  { icon: HeartHandshake, title: "Shared family time", text: "The kit is designed to be opened and used together, not handed off as another passive toy." },
  { icon: Gift, title: "Meaningful gifting", text: "Every box should feel thoughtful, useful, and memorable for children and parents." },
];

const standards = [
  "Clear beginner instructions for first-time gardeners.",
  "Simple tools and materials selected for supervised child use.",
  "Premium packaging that works for birthdays, school activities, and family weekends.",
  "Parent-focused support through product pages, FAQs, and contact channels.",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fffaf0] font-nunito text-[#17381f]">
      <section className="relative overflow-hidden bg-[#f8f1df]">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <Badge className="mb-4 border-[#b8d9b7] bg-white text-[#2d6a3a]">
              <Sprout className="mr-2 h-3.5 w-3.5" />
              Our story
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight text-[#17381f] sm:text-6xl">
              We help children grow their first plant.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#60705f]">
              Get Gardening exists for parents who want a richer alternative to screens: a guided, hands-on activity where children plant, observe, water, and learn patience through nature.
            </p>
            <Link to="/products">
              <Button className="mt-8 h-14 rounded-md bg-[#1f5b2b] px-7 text-base font-extrabold text-white hover:bg-[#174621]">
                Shop the starter kit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-[#e4d8ba] bg-white shadow-xl">
            <img
              src="/images/product-sample-image/WhatsApp%20Image%202026-05-01%20at%209.59.59%20AM.jpeg"
              alt="Get Gardening kit contents"
              className="h-[430px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">Brand promise</p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#17381f] sm:text-4xl">
            Help children learn about nature in a fun, guided, hands-on way.
          </h2>
          <p className="mt-4 leading-7 text-[#60705f]">
            The product is not just gardening tools. It is a small experience: opening the kit, preparing the soil, planting seeds, checking progress, and celebrating the first sign of growth.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card key={value.title} className="border-[#e7dfca] bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-md bg-[#eef7eb] p-3 text-[#2d6a3a]">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-[#17381f]">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#60705f]">{value.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#2d6a3a]">Built for trust</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#17381f] sm:text-4xl">
              We design for parents first.
            </h2>
            <p className="mt-4 leading-7 text-[#60705f]">
              Parents need clarity before they buy. That is why our site and kit focus on contents, age guidance, safe supervised use, fast checkout, and simple care instructions.
            </p>
          </div>
          <div className="grid gap-4">
            {standards.map((standard) => (
              <div key={standard} className="flex items-start gap-3 rounded-lg border border-[#e7dfca] bg-[#fffaf0] p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2d6a3a]" />
                <p className="leading-6 text-[#425442]">{standard}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icon: Users, title: "For families", text: "Weekend projects, screen-free routines, and shared memories." },
            { icon: ShieldCheck, title: "For confident buying", text: "Clear product information, payment trust, and support contact." },
            { icon: Sprout, title: "For first growers", text: "A gentle path from seed to sprout for curious children." },
          ].map((item) => (
            <Card key={item.title} className="border-[#e7dfca] bg-white shadow-sm">
              <CardContent className="p-6">
                <item.icon className="mb-4 h-7 w-7 text-[#2d6a3a]" />
                <h3 className="text-xl font-extrabold text-[#17381f]">{item.title}</h3>
                <p className="mt-2 leading-6 text-[#60705f]">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-[#17381f] p-8 text-center text-white">
          <h2 className="text-3xl font-extrabold">Ready to make plant care your child&apos;s next activity?</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/75">
            Start with a complete kit built for learning, bonding, and simple home growing.
          </p>
          <Link to="/products">
            <Button className="mt-7 h-14 rounded-md bg-[#f1c24b] px-7 text-base font-extrabold text-[#17381f] hover:bg-[#ffd66a]">
              Start growing today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
