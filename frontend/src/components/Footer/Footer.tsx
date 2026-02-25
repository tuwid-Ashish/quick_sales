import { Link } from "react-router";
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Sprout, TreeDeciduous, Flower2 } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#1a2e0a] text-white">
      {/* Newsletter Strip */}
      {/* <div className="bg-gradient-to-r from-[#2d5016] to-[#3a6b1e] border-b border-green-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-lime-400/20 rounded-full p-3">
                <Sprout className="h-6 w-6 text-lime-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Get Weekly Gardening Tips</h3>
                <p className="text-green-200 text-sm">Seasonal planting guides, care tips & exclusive deals</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-green-300/50 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-lime-400/50"
              />
              <button className="bg-lime-400 text-green-900 font-bold px-6 py-2.5 rounded-lg hover:bg-lime-300 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-[#2d5016] to-[#3a6b1e] p-2 rounded-xl">
                <Leaf className="h-5 w-5 text-lime-300" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  GetGardening
                </span>
                <span className="text-[9px] text-green-400/70 font-medium tracking-widest uppercase">
                  Grow · Nurture · Bloom
                </span>
              </div>
            </div>
            <p className="text-green-300/70 text-sm leading-relaxed">
              India's trusted destination for premium gardening kits, organic seeds, and garden supplies. Helping over 15,000 home gardeners grow their dream gardens since 2022.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="bg-white/5 hover:bg-green-600 p-2.5 rounded-lg transition-colors border border-white/10">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-white/5 hover:bg-green-500 p-2.5 rounded-lg transition-colors border border-white/10">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="bg-white/5 hover:bg-pink-600 p-2.5 rounded-lg transition-colors border border-white/10">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="bg-white/5 hover:bg-red-600 p-2.5 rounded-lg transition-colors border border-white/10">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">Shop by Category</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/products" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm flex items-center gap-2">
                  <Sprout className="h-3 w-3" /> Seed Kits
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm flex items-center gap-2">
                  <TreeDeciduous className="h-3 w-3" /> Garden Tools
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm flex items-center gap-2">
                  <Flower2 className="h-3 w-3" /> Planters & Pots
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm flex items-center gap-2">
                  <Leaf className="h-3 w-3" /> Soil & Fertilizers
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm flex items-center gap-2">
                  <Sprout className="h-3 w-3" /> Plant Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">Help & Support</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm">
                  Gardening Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm">
                  Track Your Order
                </a>
              </li>
              <li>
                <a href="#" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-green-300/70 hover:text-lime-300 transition-colors text-sm">
                  Shipping Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-400">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-green-300/70">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-500" />
                <span className="text-sm">123 Garden Lane, Green Valley, Pune 411001</span>
              </li>
              <li className="flex items-center gap-3 text-green-300/70">
                <Phone className="h-4 w-4 flex-shrink-0 text-green-500" />
                <a href="tel:+911234567890" className="hover:text-lime-300 transition-colors text-sm">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3 text-green-300/70">
                <Mail className="h-4 w-4 flex-shrink-0 text-green-500" />
                <a href="mailto:hello@getgardening.in" className="hover:text-lime-300 transition-colors text-sm">
                  hello@getgardening.in
                </a>
              </li>
            </ul>
            <div className="pt-3 border-t border-green-800/50">
              <p className="text-xs text-green-400/60">Mon - Sat: 9am to 7pm IST</p>
              <p className="text-xs text-green-400/60">Sunday: Closed (we're gardening!)</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-800/50 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-green-400/60 text-xs">
            © {new Date().getFullYear()} GetGardening. All rights reserved. Made with <Leaf className="inline h-3 w-3 text-green-500" /> in India.
          </p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="text-green-400/60 hover:text-lime-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-green-400/60 hover:text-lime-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-green-400/60 hover:text-lime-300 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;