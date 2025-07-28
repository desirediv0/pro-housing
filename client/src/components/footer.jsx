"use client";

import {
  Facebook,
  Home,
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  Twitter,
  Building,
  Star,
  TrendingUp,
  Sparkles,
  ArrowUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-[#1A3B4C] via-[#2A4B5C] to-[#3A5B6C] text-white relative overflow-hidden">
      {/* Premium background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full bg-repeat animate-float"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Premium floating elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-16">
          {/* Premium Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <Link href="/" className="flex items-center group">
                  <Image
                    src="/logo.png"
                    alt="Pro Housing Logo"
                    width={40}
                    height={40}
                    className="h-16 w-full transition-transform duration-300 group-hover:scale-110"
                  />
                </Link>
              </div>
            </div>

            <p className="text-white/80 mb-8 leading-relaxed text-lg">
              Your trusted partner in finding the perfect property. We make real
              estate simple, transparent, and accessible for everyone.
            </p>

            <div className="flex space-x-4">
              {/* WhatsApp */}
              <button
                onClick={() => {
                  const phoneNumber = "9090908081";
                  const message =
                    "Hello! I'm interested in exploring properties with Pro Housing. Can you please help me find the right property?";
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                    message
                  )}`;
                  window.open(whatsappUrl, "_blank");
                }}
                className="w-12 h-12 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 group"
                aria-label="Chat on WhatsApp"
              >
                <svg
                  className="h-5 w-5 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386" />
                </svg>
              </button>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/prohousing_india?igsh=dTc3YzV6MjNuZ2Qz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 group"
                aria-label="Follow us on Instagram"
              >
                <svg
                  className="h-5 w-5 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@PROHOUSINGINDIA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 group"
                aria-label="Subscribe to our YouTube channel"
              >
                <svg
                  className="h-5 w-5 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold font-display mb-8 text-white">
              Quick Links
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/properties"
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <Building className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                  All Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?featured=true"
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <Star className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                  Featured Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <Phone className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-all duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-all duration-300"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-xl font-bold font-display mb-8 text-white">
              Property Types
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/properties?type=apartment"
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <Building className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=house"
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <Home className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                  Houses
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=villa"
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <Star className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                  Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?type=commercial"
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <TrendingUp className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                  Commercial
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-all duration-300 flex items-center group"
                >
                  <Sparkles className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                  Luxury Homes
                </a>
              </li>
            </ul>
          </div>

          {/* Premium Contact Info */}
          <div>
            <h4 className="text-xl font-bold font-display mb-8 text-white">
              Contact Info
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start group">
                <div className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/80 leading-relaxed">
                    B205 Jindal Global City Sector 35, Sonipat, India
                  </p>
                </div>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <button
                  onClick={() => {
                    if (confirm("Do you want to call +91 90909 08081?")) {
                      window.open("tel:+919090908081");
                    }
                  }}
                  className="text-white/80 hover:text-white transition-all duration-300 text-left"
                >
                  +91 90909 08081
                </button>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <a
                  href="mailto:Founder.prohousing@gmail.com"
                  className="text-white/80 hover:text-white transition-all duration-300"
                >
                  Founder.prohousing@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Premium Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-white/70 text-sm">
                © {new Date().getFullYear()} Pro Housing. All rights reserved.
              </p>
              <div className="text-white/50 text-xs mt-1">
                Made with{" "}
                <a
                  href="https://desirediv.com"
                  target="_blank"
                  className="text-red-500 hover:text-white transition-colors duration-300 font-semibold"
                  aria-label="Desire Div"
                  rel="noreferrer"
                >
                  Desire Div
                </a>
                ❤️ for your dream home
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-white/70 hover:text-white text-sm transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white text-sm transition-colors duration-300"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white text-sm transition-colors duration-300"
                >
                  Cookie Policy
                </a>
              </div>

              {/* Premium Scroll to top button */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg border border-white/20 hover:border-white/40 group"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
