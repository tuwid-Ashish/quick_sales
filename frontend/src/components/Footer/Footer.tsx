import { Link } from "react-router";
import { Mail, Phone, MapPin, ShieldCheck, Truck, Leaf } from "lucide-react";
import { CONTACT } from "@/constants";
function Footer() {
  return (
    <footer className="relative bg-soil text-cream overflow-hidden border-t-8 border-leaf">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sun/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-leaf/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Trust strip */}
      <div className="relative z-10 border-b border-cream/10 bg-soil/50 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-bold text-cream">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sun-light" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-sun-light" />
              <span>Pan-India Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-sun-light" />
              <span>100% Natural Kit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo */}
          <Link to="/">
            <img
              src="/images/logo.png"
              alt="Get Gardening"
              className="h-14 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>

          {/* Tagline */}
          <p className="max-w-md text-base leading-relaxed font-medium text-cream/80 font-nunito">
            Helping kids grow their first plant one kit at a time. A premium screen-free activity for curious young minds.
          </p>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-cream/80 font-bold">
            <a href={`tel:${CONTACT.PHONE}`} className="flex items-center gap-2 hover:text-sun-light transition-colors">
              <Phone className="h-4 w-4 text-sun-light" />
              {CONTACT.PHONE}
            </a>
            <a href={`mailto:${CONTACT.EMAIL}`} className="flex items-center gap-2 hover:text-sun-light transition-colors">
              <Mail className="h-4 w-4 text-sun-light" />
              {CONTACT.EMAIL}
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sun-light" />
             {CONTACT.address}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-cream/10 pt-8 text-center text-sm font-medium text-cream/50">
          <p>© {new Date().getFullYear()} Get Gardening. All rights reserved. Payments secured by Razorpay.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
