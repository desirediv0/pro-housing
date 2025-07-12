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
  MessageCircle,
  ExternalLink,
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
  const [whatsappBannerVisible, setWhatsappBannerVisible] = useState(true);
  const [bannerManuallyClosed, setBannerManuallyClosed] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Only show/hide banner if not manually closed
      if (!bannerManuallyClosed) {
        if (window.scrollY === 0) {
          setWhatsappBannerVisible(true);
        } else if (window.scrollY > 100) {
          setWhatsappBannerVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bannerManuallyClosed]);

  const propertyTypes = [
    { name: "Apartments", href: "/properties?type=apartment", icon: Building },
    { name: "Houses", href: "/properties?type=house", icon: Home },
    { name: "Villas", href: "/properties?type=villa", icon: Star },
    { name: "Commercial", href: "/properties?type=commercial", icon: Building },
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = "9090908081";
    const message =
      "Hello! I'm interested in exploring properties with Pro Housing. Can you please help me find the right property?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* WhatsApp Promotion Banner */}
      {whatsappBannerVisible && (
        <div className="z-50 bg-gradient-to-r from-[#1A3B4C] via-[#2A4B5C] to-[#3A5B6C] text-white py-2.5 px-4 transform transition-transform duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {/* <Image
                  src="/logo.png"
                  alt="Pro Housing"
                  width={24}
                  height={24}
                  className="h-auto w-12 rounded"
                /> */}
                <span className="text-sm font-semibold capitalize">
                  Trusted by millions
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleWhatsAppClick}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg "
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386" />
                </svg>
                <span className="hidden sm:inline">+91 9090908081</span>
                <span className="sm:hidden">+91 9090908081</span>
              </button>

              <button
                onClick={() => {
                  setWhatsappBannerVisible(false);
                  setBannerManuallyClosed(true);
                }}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <nav
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
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
                <Image
                  src="/logo.png"
                  alt="Pro Housing Logo"
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                />
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
    </>
  );
};

export default Navbar;
