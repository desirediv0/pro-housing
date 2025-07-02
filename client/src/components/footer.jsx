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
              <a
                href="#"
                className="w-12 h-12 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 group"
              >
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="w-12 h-12 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 group"
              >
                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="w-12 h-12 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 group"
              >
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="w-12 h-12 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 group"
              >
                <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
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
                    89/2 sector 39 gurugram, haryana,
                    India
                  </p>
                </div>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <a
                  href="tel:+919876543210"
                  className="text-white/80 hover:text-white transition-all duration-300"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center group">
                <div className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/20 transition-all duration-300 border border-white/20">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <a
                  href="mailto:info@prohousing.com"
                  className="text-white/80 hover:text-white transition-all duration-300"
                >
                  info@prohousing.com
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
