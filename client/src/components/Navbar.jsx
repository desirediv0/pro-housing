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
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

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
          ? "glass-navbar-scrolled shadow-premium-lg border-b border-gray-200/50"
          : "glass-navbar shadow-premium border-b border-gray-100/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Premium Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-premium group-hover:shadow-glow transition-all duration-300 group-hover:scale-105 animate-glow">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-warning to-orange-500 rounded-full border-2 border-white animate-pulse">
                  <Sparkles className="h-2 w-2 text-white absolute top-0.5 left-0.5" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-black font-display text-primary">
                  Pro Housing
                </h1>
                <p className="text-xs text-text-secondary font-medium">
                  Premium Real Estate
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Home */}
            <Link
              href="/"
              className="text-text-primary hover:text-primary font-semibold transition-all duration-300 flex items-center space-x-2 group relative"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Home</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-primary group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Properties Dropdown */}
            <div className="relative group">
              <button className="text-text-primary hover:text-primary font-semibold transition-all duration-300 flex items-center space-x-2 relative">
                <Building className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Properties</span>
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-primary group-hover:w-full transition-all duration-300"></div>
              </button>

              {/* Premium Dropdown Menu */}
              <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-premium-lg border border-gray-200/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="p-4">
                  <Link
                    href="/properties"
                    className="flex items-center px-4 py-3 text-text-primary hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 font-semibold group"
                  >
                    <Building className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <div>All Properties</div>
                      <div className="text-xs text-text-secondary">
                        Browse complete catalog
                      </div>
                    </div>
                  </Link>

                  <div className="border-t border-gray-200/40 my-3"></div>

                  {propertyTypes.map((type) => (
                    <Link
                      key={type.name}
                      href={type.href}
                      className="flex items-center px-4 py-3 text-text-primary hover:bg-primary/10 hover:text-primary rounded-xl transition-all duration-200 group"
                    >
                      <type.icon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                      <span>{type.name}</span>
                    </Link>
                  ))}

                  <div className="border-t border-gray-200/40 my-3"></div>

                  <Link
                    href="/properties?featured=true"
                    className="flex items-center px-4 py-3 text-warning hover:bg-warning/10 rounded-xl transition-all duration-200 font-semibold group"
                  >
                    <Star className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <div>Featured Properties</div>
                      <div className="text-xs text-warning/70">
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
              className="text-text-primary hover:text-primary font-semibold transition-all duration-300 relative group"
            >
              <span>About</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-primary group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className="text-text-primary hover:text-primary font-semibold transition-all duration-300 flex items-center space-x-2 group relative"
            >
              <Phone className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Contact</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-primary group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-text-primary hover:text-primary transition-all duration-300 p-3 hover:bg-primary/10 rounded-xl group"
            >
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            </button>

            {/* Admin Dashboard - Only show to authenticated admins */}
            {isAuthenticated && admin && (
              <Link
                href="/admin/dashboard"
                className="text-primary hover:text-primary-dark font-semibold transition-all duration-300 flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-xl hover:bg-primary/20 border border-primary/20 hover:border-primary/30"
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
              className="text-text-primary hover:text-primary transition-all duration-300 p-2 hover:bg-primary/10 rounded-lg"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary p-2 rounded-lg transition-all duration-300"
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
          <div className="lg:hidden border-t border-gray-200/30 glass-navbar rounded-b-2xl animate-fade-in">
            <div className="px-4 py-6 space-y-3">
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 text-text-primary hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>

              <Link
                href="/properties"
                className="flex items-center space-x-3 px-4 py-3 text-text-primary hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building className="h-5 w-5" />
                <span>All Properties</span>
              </Link>

              {propertyTypes.map((type) => (
                <Link
                  key={type.name}
                  href={type.href}
                  className="flex items-center space-x-3 px-4 py-3 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 ml-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <type.icon className="h-4 w-4" />
                  <span>{type.name}</span>
                </Link>
              ))}

              <Link
                href="/about"
                className="flex items-center space-x-3 px-4 py-3 text-text-primary hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>About</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center space-x-3 px-4 py-3 text-text-primary hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="h-5 w-5" />
                <span>Contact</span>
              </Link>

              {/* Admin Panel - Mobile (Only for authenticated admins) */}
              {isAuthenticated && admin && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 text-primary bg-primary/10 rounded-xl transition-all duration-300 font-semibold border border-primary/20"
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
          <div className="absolute top-full left-0 right-0 glass-navbar border-t border-gray-200/30 shadow-premium-lg animate-fade-in">
            <div className="max-w-4xl mx-auto p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search properties, locations, or keywords..."
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm shadow-premium transition-all duration-300 text-text-primary placeholder-text-secondary"
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick search suggestions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-text-secondary font-medium">
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
                    className="px-4 py-2 bg-white/70 hover:bg-primary/20 text-text-primary hover:text-primary rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm border border-gray-200/40 hover:border-primary/40 shadow-sm hover:shadow-md"
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
