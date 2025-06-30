"use client";

import {
  Home,
  Building,
  Phone,
  Star,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const Navbar = () => {
  const { admin, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const propertyTypes = [
    { name: "Apartments", href: "/properties?type=apartment", icon: Building },
    { name: "Houses", href: "/properties?type=house", icon: Home },
    { name: "Villas", href: "/properties?type=villa", icon: Star },
    { name: "Commercial", href: "/properties?type=commercial", icon: Building },
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
          : "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Premium Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
             <Image src="/logo.png" alt="Pro Housing Logo" width={40} height={40} className="h-16 w-full transition-transform duration-300 group-hover:scale-110" />

            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Home */}
            <Link
              href="/"
              className="text-gray-800 hover:text-[#1A3B4C] font-semibold transition-all duration-300 flex items-center space-x-2 group relative"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Home</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Properties Dropdown */}
            <div className="relative group">
              <button className="text-gray-800 hover:text-[#1A3B4C] font-semibold transition-all duration-300 flex items-center space-x-2 relative">
                <Building className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Properties</span>
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] group-hover:w-full transition-all duration-300"></div>
              </button>

              {/* Premium Dropdown Menu */}
              <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-200/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="p-4">
                  <Link
                    href="/properties"
                    className="flex items-center px-4 py-3 text-gray-800 hover:bg-[#1A3B4C]/10 hover:text-[#1A3B4C] rounded-xl transition-all duration-200 font-semibold group"
                  >
                    <Building className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <div>All Properties</div>
                      <div className="text-xs text-gray-600">
                        Browse complete catalog
                      </div>
                    </div>
                  </Link>
                  <div className="border-t border-gray-200/40 my-3"></div>
                  {propertyTypes.map((type) => (
                    <Link
                      key={type.name}
                      href={type.href}
                      className="flex items-center px-4 py-3 text-gray-800 hover:bg-[#1A3B4C]/10 hover:text-[#1A3B4C] rounded-xl transition-all duration-200 group"
                    >
                      <type.icon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                      <span>{type.name}</span>
                    </Link>
                  ))}
                  <div className="border-t border-gray-200/40 my-3"></div>
                  <Link
                    href="/properties?featured=true"
                    className="flex items-center px-4 py-3 text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all duration-200 font-semibold group"
                  >
                    <Star className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <div>Featured Properties</div>
                      <div className="text-xs text-yellow-600/70">
                        Premium selections
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* About */}
            <Link
              href="/about"
              className="text-gray-800 hover:text-[#1A3B4C] font-semibold transition-all duration-300 relative group"
            >
              <span>About</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="text-gray-800 hover:text-[#1A3B4C] font-semibold transition-all duration-300 flex items-center space-x-2 group relative"
            >
              <Phone className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Contact</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-800 hover:text-[#1A3B4C] transition-all duration-300 p-3 hover:bg-[#1A3B4C]/10 rounded-xl group"
            >
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            </button>

            {/* Admin Dashboard - Only show to authenticated admins */}
            {isAuthenticated && admin && (
              <Link
                href="/admin/dashboard"
                className="text-[#1A3B4C] hover:text-[#0A2B3C] font-semibold transition-all duration-300 flex items-center space-x-2 px-4 py-2 bg-[#1A3B4C]/10 rounded-xl hover:bg-[#1A3B4C]/20 border border-[#1A3B4C]/20 hover:border-[#1A3B4C]/30"
              >
                <User className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Mobile Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-800 hover:text-[#1A3B4C] transition-all duration-300 p-2 hover:bg-[#1A3B4C]/10 rounded-lg"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-800 hover:text-[#1A3B4C] focus:outline-none focus:ring-[#1A3B4C] p-2 rounded-lg transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Premium Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/30 bg-white/95 backdrop-blur-lg rounded-b-2xl">
            <div className="px-4 py-6 space-y-3">
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 text-gray-800 hover:text-[#1A3B4C] hover:bg-[#1A3B4C]/10 rounded-xl transition-all duration-300 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              <Link
                href="/properties"
                className="flex items-center space-x-3 px-4 py-3 text-gray-800 hover:text-[#1A3B4C] hover:bg-[#1A3B4C]/10 rounded-xl transition-all duration-300 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building className="h-5 w-5" />
                <span>All Properties</span>
              </Link>

              {propertyTypes.map((type) => (
                <Link
                  key={type.name}
                  href={type.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-[#1A3B4C] hover:bg-[#1A3B4C]/10 rounded-xl transition-all duration-300 ml-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <type.icon className="h-4 w-4" />
                  <span>{type.name}</span>
                </Link>
              ))}

              <Link
                href="/about"
                className="flex items-center space-x-3 px-4 py-3 text-gray-800 hover:text-[#1A3B4C] hover:bg-[#1A3B4C]/10 rounded-xl transition-all duration-300 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>About</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center space-x-3 px-4 py-3 text-gray-800 hover:text-[#1A3B4C] hover:bg-[#1A3B4C]/10 rounded-xl transition-all duration-300 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="h-5 w-5" />
                <span>Contact</span>
              </Link>

              {/* Admin Panel - Mobile (Only for authenticated admins) */}
              {isAuthenticated && admin && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 text-[#1A3B4C] bg-[#1A3B4C]/10 rounded-xl transition-all duration-300 font-semibold border border-[#1A3B4C]/20"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Premium Search Overlay */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/30 shadow-xl">
            <div className="max-w-4xl mx-auto p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search properties, locations, or keywords..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-[#1A3B4C] focus:border-[#1A3B4C] bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-600"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const query = e.target.value;
                      if (query.trim()) {
                        window.location.href = `/properties?search=${encodeURIComponent(
                          query
                        )}`;
                      }
                    }
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick search suggestions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  Popular searches:
                </span>
                {[
                  "2 BHK Mumbai",
                  "3 BHK Delhi",
                  "Villa Bangalore",
                  "Office Space",
                ].map((term) => (
                  <button
                    key={term}
                    className="px-4 py-2 bg-white/70 hover:bg-[#1A3B4C]/20 text-gray-800 hover:text-[#1A3B4C] rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-gray-200/40 hover:border-[#1A3B4C]/40 shadow-sm hover:shadow-md"
                    onClick={() => {
                      window.location.href = `/properties?search=${encodeURIComponent(
                        term
                      )}`;
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
