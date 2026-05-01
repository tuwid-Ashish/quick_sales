import { Link } from "react-router";
import { Sprout, Mail, Phone, MapPin, ShieldCheck, Truck, CreditCard } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#17381f] font-nunito text-white">
      <div className="border-b border-white/10 bg-[#1f5b2b]">
        <div className="container mx-auto grid grid-cols-1 gap-4 px-4 py-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Secure checkout", text: "Payments handled by Razorpay" },
            { icon: Truck, title: "Fast dispatch", text: "Packed carefully for gifting" },
            { icon: CreditCard, title: "UPI and cards", text: "Simple online payment flow" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="rounded-md bg-white/10 p-3">
                <item.icon className="h-5 w-5 text-[#f1c24b]" />
              </div>
              <div>
                <p className="font-extrabold">{item.title}</p>
                <p className="text-sm text-white/70">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f1c24b]">
                <Sprout className="h-6 w-6 text-[#17381f]" />
              </div>
              <div className="leading-none">
                <span className="block text-2xl font-extrabold">Get Gardening</span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-white/55">
                  Kids starter kit
                </span>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/70">
              A premium children&apos;s gardening kit for screen-free learning, parent-child bonding, and first plant care.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#f1c24b]">The Kit</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="text-white/70 transition-colors hover:text-white">Get Gardening Starter Kit</Link></li>
              <li><Link to="/#inside-kit" className="text-white/70 transition-colors hover:text-white">What&apos;s inside</Link></li>
              <li><Link to="/#faq" className="text-white/70 transition-colors hover:text-white">Parent FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#f1c24b]">Help</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-white/70 transition-colors hover:text-white">About the brand</Link></li>
              <li><a href="mailto:hello@getgardening.in" className="text-white/70 transition-colors hover:text-white">Contact support</a></li>
              <li><a href="tel:+91915132631" className="text-white/70 transition-colors hover:text-white">Order help</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#f1c24b]">Contact</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f1c24b]" />
                <span>Get Gardening, Pune, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#f1c24b]" />
                <a href="tel:+91915132631" className="transition-colors hover:text-white">+91 911 513 2631</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#f1c24b]" />
                <a href="mailto:hello@getgardening.in" className="transition-colors hover:text-white">hello@getgardening.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row md:items-center">
          <p>Copyright {new Date().getFullYear()} Get Gardening. All rights reserved.</p>
          <div className="flex gap-5">
            <span>Secure payments through Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
