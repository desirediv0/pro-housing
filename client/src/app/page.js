"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Home,
  Building,
  Star,
  ArrowRight,
  Bed,
  Bath,
  Square,
  Clock,
  CheckCircle,
  Calendar,
  CreditCard,
  Crown,
  Shield,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { publicAPI } from "@/lib/api-functions";
import Link from "next/link";
import { SimpleAreaDisplay } from "@/components/ui/area-converter";
import CTA from "@/components/CTA";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [listingType, setListingType] = useState("");
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [sidebarContent, setSidebarContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    fetchFeaturedProperties();
    fetchSidebarContent();
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await publicAPI.getFeaturedProperties();
      // Handle both old and new response formats
      const properties = response.data.data || response.data || [];
      setFeaturedProperties(properties);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      setFeaturedProperties([]); // Set empty array on error
    }
  };

  const fetchSidebarContent = async () => {
    try {
      const response = await publicAPI.getSidebarContent();
      // Handle both old and new response formats
      const content = response.data.data || response.data || [];
      setSidebarContent(content);
    } catch (error) {
      console.error("Error fetching sidebar content:", error);
      setSidebarContent([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (location.trim()) params.set("location", location.trim());
    if (propertyType) params.set("type", propertyType);
    if (priceRange) params.set("price", priceRange);
    if (listingType) params.set("listingType", listingType);
    const searchUrl = `/properties?${params.toString()}`;
    // Use Next.js router for better navigation
    window.location.href = searchUrl;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getHighlightColor = (highlight) => {
    const colors = {
      FEATURED: "bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C]",
      TRENDING: "bg-gradient-to-r from-red-500 to-red-600",
      NEW: "bg-gradient-to-r from-green-500 to-green-600",
      HOT_DEAL: "bg-gradient-to-r from-orange-500 to-orange-600",
      PREMIUM: "bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C]",
    };
    return colors[highlight] || "bg-[#1A3B4C]";
  };

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: "bg-green-100 text-green-800 border-green-200",
      SOLD: "bg-red-100 text-red-800 border-red-200",
      RENTED: "bg-[#1A3B4C]/10 text-[#1A3B4C] border-[#1A3B4C]/20",
      UNDER_NEGOTIATION: "bg-orange-100 text-orange-800 border-orange-200",
      WITHDRAWN: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Property Buyer",
      content:
        "Pro Housing helped me find my dream home in Mumbai. Their service was exceptional and the process was smooth.",
      rating: 5,
      image: "/user1.jpg",
      location: "Mumbai",
    },
    {
      name: "Priya Sharma",
      role: "First-time Buyer",
      content:
        "Amazing experience! The team guided me through every step of buying my first property. Highly recommended!",
      rating: 5,
      image: "/user3.jpg",
      location: "Delhi",
    },
    {
      name: "Amit Patel",
      role: "Investor",
      content:
        "Professional service and great property options. Found the perfect investment property through Pro Housing.",
      rating: 5,
      image: "/user2.jpg",
      location: "Bangalore",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A3B4C] via-[#2A4B5C] to-[#3A5B6C]">
          <div className="absolute inset-0 backdrop-blur-[100px]">
            {/* Animated Circles */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-[#1A3B4C]/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-[#2A4B5C]/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#3A5B6C]/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>

            {/* Additional Dynamic Circles */}
            <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse animation-delay-3000"></div>
          </div>
        </div>

        {/* Floating Property Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Icons */}
          <motion.div
            className="absolute top-1/4 left-1/6 opacity-20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-16 bg-white/30 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <Home className="w-8 h-8 text-white/60" />
            </div>
          </motion.div>

          <motion.div
            className="absolute top-2/3 right-1/5 opacity-20"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <div className="w-12 h-12 bg-yellow-300/40 rounded-xl backdrop-blur-sm flex items-center justify-center">
              <Building className="w-6 h-6 text-white/70" />
            </div>
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-3/4 opacity-20"
            animate={{
              y: [0, -25, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div className="w-14 h-14 bg-blue-300/30 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white/60" />
            </div>
          </motion.div>

          {/* Geometric Patterns */}
          <motion.div
            className="absolute top-1/5 right-1/3 opacity-10"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="w-32 h-32 border border-white/30 rounded-full"></div>
          </motion.div>

          <motion.div
            className="absolute bottom-1/4 left-1/3 opacity-10"
            animate={{
              rotate: [360, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="w-24 h-24 border border-yellow-300/30 rotate-45"></div>
          </motion.div>

          {/* Additional Floating Property Cards */}
          <motion.div
            className="absolute top-3/4 left-1/5 opacity-15"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 9,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="w-20 h-16 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex flex-col items-center justify-center">
              <Home className="w-4 h-4 text-white/60 mb-1" />
              <div className="w-8 h-1 bg-white/40 rounded"></div>
            </div>
          </motion.div>

          <motion.div
            className="absolute top-1/6 right-1/6 opacity-15"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 11,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <div className="w-18 h-14 bg-yellow-300/25 rounded-lg backdrop-blur-sm border border-yellow-300/40 flex flex-col items-center justify-center">
              <Building className="w-4 h-4 text-white/70 mb-1" />
              <div className="w-6 h-0.5 bg-white/50 rounded"></div>
            </div>
          </motion.div>

          {/* Floating Particles */}
          {[...Array(8)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Property Stats Floating Elements */}
          <motion.div
            className="absolute top-1/3 right-1/4 opacity-12"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -2, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2.5,
            }}
          >
            <div className="w-16 h-12 bg-blue-400/20 rounded-lg backdrop-blur-sm border border-blue-300/30 flex flex-col items-center justify-center">
              <div className="text-xs text-white/60 font-bold">9K+</div>
              <div className="w-8 h-0.5 bg-white/40 rounded mt-1"></div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Buildings Silhouette */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/30 to-transparent"></div>

          {/* Multiple Building Layers */}
          <div className="absolute bottom-0 left-0 opacity-20">
            <svg
              width="400"
              height="250"
              viewBox="0 0 400 250"
              className="text-white/30 fill-current"
            >
              <rect x="20" y="100" width="45" height="150" />
              <rect x="75" y="80" width="40" height="170" />
              <rect x="125" y="110" width="35" height="140" />
              <rect x="170" y="70" width="50" height="180" />
              <rect x="230" y="90" width="40" height="160" />
              <rect x="280" y="60" width="45" height="190" />
              <rect x="335" y="85" width="35" height="165" />
            </svg>
          </div>

          <div className="absolute bottom-0 right-0 opacity-15">
            <svg
              width="350"
              height="200"
              viewBox="0 0 350 200"
              className="text-white/25 fill-current"
            >
              <rect x="30" y="90" width="35" height="110" />
              <rect x="75" y="70" width="40" height="130" />
              <rect x="125" y="85" width="30" height="115" />
              <rect x="165" y="60" width="45" height="140" />
              <rect x="220" y="80" width="35" height="120" />
              <rect x="265" y="50" width="40" height="150" />
            </svg>
          </div>

          {/* Animated Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{
              backgroundPosition: ["0px 0px", "50px 50px"],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 w-full">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              className="text-white space-y-4 sm:space-y-5 lg:space-y-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-display leading-tight text-white drop-shadow-lg">
                  Properties to buy in{" "}
                  <span className="text-yellow-300 drop-shadow-lg">
                    Gurugram
                  </span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-white leading-relaxed drop-shadow">
                  <span className="font-semibold">700+</span> listings added
                  daily and <span className="font-semibold">9K+</span> total
                  verified
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white/95 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-2xl">
                <form
                  onSubmit={handleSearch}
                  className="space-y-3 sm:space-y-4"
                >
                  {/* Enhanced Filter Tabs */}
                  <div className="bg-[#1A3B4C]/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-1.5 mb-3 sm:mb-4 border border-[#1A3B4C]/20">
                    {/* Mobile: Dropdown */}
                    <div className="sm:hidden w-full">
                      <Select
                        value={listingType || "SALE"}
                        onValueChange={setListingType}
                      >
                        <SelectTrigger className="w-full h-10 bg-white/50 hover:bg-white/60 border border-[#1A3B4C]/20 rounded-lg focus:ring-1 focus:ring-[#1A3B4C] focus:ring-offset-0 text-[#1A3B4C] font-semibold">
                          <div className="flex items-center">
                            {listingType === "SALE" && (
                              <Home className="h-4 w-4 mr-2" />
                            )}
                            {listingType === "RENT" && (
                              <Building className="h-4 w-4 mr-2" />
                            )}
                            {listingType === "COMMERCIAL" && (
                              <Building className="h-4 w-4 mr-2" />
                            )}
                            {listingType === "INVEST" && (
                              <Square className="h-4 w-4 mr-2" />
                            )}
                            {listingType === "PG" && (
                              <Home className="h-4 w-4 mr-2" />
                            )}
                            <SelectValue placeholder="Select Property Type" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#1A3B4C]/20 shadow-lg rounded-lg">
                          <SelectGroup>
                            {[
                              { key: "SALE", label: "Buy", icon: Home },
                              { key: "RENT", label: "Rent", icon: Building },
                              {
                                key: "COMMERCIAL",
                                label: "Commercial",
                                icon: Building,
                              },
                              { key: "INVEST", label: "Invest", icon: Square },
                              { key: "PG", label: "PG", icon: Home },
                            ].map((tab) => (
                              <SelectItem
                                key={tab.key}
                                value={tab.key}
                                className="flex items-center py-2.5 px-3 hover:bg-[#1A3B4C]/5 cursor-pointer font-medium"
                              >
                                <div className="flex items-center">
                                  <tab.icon className="h-4 w-4 mr-2 text-[#1A3B4C]" />
                                  {tab.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Desktop: Full width tabs */}
                    <div className="hidden sm:flex">
                      {[
                        { key: "SALE", label: "Buy", icon: Home },
                        { key: "RENT", label: "Rent", icon: Building },
                        {
                          key: "COMMERCIAL",
                          label: "Commercial",
                          icon: Building,
                        },
                        { key: "INVEST", label: "Invest", icon: Square },
                        { key: "PG", label: "PG", icon: Home },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setListingType(tab.key)}
                          className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-lg font-bold transition-all duration-300 text-sm ${
                            listingType === tab.key ||
                            (!listingType && tab.key === "SALE")
                              ? "bg-[#1A3B4C] text-white shadow-lg"
                              : "text-[#1A3B4C] hover:bg-[#1A3B4C]/10"
                          }`}
                        >
                          <tab.icon className="h-4 w-4 inline mr-1.5" />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Integrated Search Section */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Combined Search Bar - Housing.com Style */}
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {/* City Selector */}
                        <div className="sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-200">
                          <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger className="w-full h-12 sm:h-12 lg:h-12 bg-transparent border-0 hover:bg-gray-50 focus:ring-0 focus:ring-offset-0 rounded-none font-medium text-gray-800 transition-all duration-300 text-sm">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                                <SelectValue
                                  placeholder="Gurugram"
                                  className="text-gray-800"
                                />
                              </div>
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-xl rounded-lg">
                              <SelectGroup>
                                <SelectLabel className="text-[#1A3B4C] font-semibold px-3 py-2 text-sm">
                                  Popular Cities
                                </SelectLabel>
                                {["Gurugram"].map((city) => (
                                  <SelectItem
                                    key={city}
                                    value={city}
                                    className="hover:bg-[#1A3B4C]/5 focus:bg-[#1A3B4C]/5 cursor-pointer font-medium data-[state=checked]:bg-[#1A3B4C]/10 data-[state=checked]:text-[#1A3B4C] mx-2 my-1 rounded-lg text-sm"
                                  >
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Search Input */}
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="Search locality, landmark, project..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 sm:h-12 lg:h-12 px-4 bg-transparent border-0 focus:ring-0 focus:ring-offset-0 text-gray-800 placeholder-gray-500 font-medium transition-all duration-300 text-sm rounded-none"
                          />
                        </div>

                        {/* Search Button */}
                        <div className="sm:w-auto">
                          <Button
                            type="submit"
                            className="w-full sm:w-auto h-12 sm:h-12 lg:h-12 px-6 bg-[#1A3B4C] hover:bg-[#2A4B5C] text-white font-bold rounded-none sm:rounded-r-xl shadow-none border-0 transition-all duration-300 text-sm flex items-center justify-center"
                          >
                            <Building className="h-4 w-4 mr-2 sm:mr-0 sm:hidden" />
                            <span>Search</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Quick Search & Budget Filters */}
                <div className="mt-4 space-y-3">
                  {/* Budget Range Filter */}
                  <div>
                    <p className="text-sm font-bold text-[#1A3B4C] mb-2 hidden sm:block">
                      Budget Range:
                    </p>
                    {/* Mobile: Budget Dropdown */}
                    <div className="sm:hidden w-full">
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="w-full h-10 bg-white/50 hover:bg-white/60 border border-[#1A3B4C]/20 rounded-lg focus:ring-1 focus:ring-[#1A3B4C] focus:ring-offset-0 text-[#1A3B4C] font-semibold">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Select Budget Range" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#1A3B4C]/20 shadow-lg rounded-lg">
                          <SelectGroup>
                            <SelectLabel className="px-3 py-2 text-sm font-semibold text-[#1A3B4C]">
                              Budget Range
                            </SelectLabel>
                            {[
                              { value: "0-25", label: "Under ₹25L" },
                              { value: "25-50", label: "₹25-50L" },
                              { value: "50-100", label: "₹50L-1Cr" },
                              { value: "100+", label: "Above ₹1Cr" },
                            ].map((range) => (
                              <SelectItem
                                key={range.value}
                                value={range.value}
                                className="flex items-center py-2.5 px-3 hover:bg-[#1A3B4C]/5 cursor-pointer font-medium"
                              >
                                {range.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Desktop: Budget Buttons */}
                    <div className="hidden sm:flex flex-wrap gap-1.5 sm:gap-2">
                      {[
                        { value: "0-25", label: "Under ₹25L" },
                        { value: "25-50", label: "₹25-50L" },
                        { value: "50-100", label: "₹50L-1Cr" },
                        { value: "100+", label: "Above ₹1Cr" },
                      ].map((range, index) => (
                        <button
                          key={index}
                          onClick={() => setPriceRange(range.value)}
                          className={`px-3 sm:px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium border ${
                            priceRange === range.value
                              ? "bg-[#1A3B4C] text-white border-[#1A3B4C]"
                              : "bg-[#1A3B4C]/5 text-[#1A3B4C] border-[#1A3B4C]/20 hover:bg-[#1A3B4C]/10"
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Search */}
                  <div>
                    <p className="text-sm font-bold text-[#1A3B4C] mb-2 hidden sm:block">
                      Quick Search:
                    </p>
                    {/* Mobile: Location Dropdown */}
                    <div className="sm:hidden w-full">
                      <Select
                        value={searchQuery}
                        onValueChange={(value) => {
                          const selected = [
                            { label: "Golf Course Road", location: "Gurugram" },
                            {
                              label: "Golf Course Extension",
                              location: "Gurugram",
                            },
                            { label: "SPR Road", location: "Gurugram" },
                            {
                              label: "NH8 Delhi Jaipur Highway",
                              location: "Gurugram",
                            },
                            {
                              label: "Dwarka Expressway",
                              location: "Gurugram",
                            },
                          ].find((item) => item.label === value);
                          if (selected) {
                            setSearchQuery(selected.label);
                            setLocation(selected.location);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full h-10 bg-white/50 hover:bg-white/60 border border-[#1A3B4C]/20 rounded-lg focus:ring-1 focus:ring-[#1A3B4C] focus:ring-offset-0 text-[#1A3B4C] font-semibold">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Quick Search Location" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-[#1A3B4C]/20 shadow-lg rounded-lg">
                          <SelectGroup>
                            <SelectLabel className="px-3 py-2 text-sm font-semibold text-[#1A3B4C]">
                              Popular Locations
                            </SelectLabel>
                            {[
                              {
                                label: "Golf Course Road",
                                location: "Gurugram",
                              },
                              {
                                label: "Golf Course Extension",
                                location: "Gurugram",
                              },
                              { label: "SPR Road", location: "Gurugram" },
                              {
                                label: "NH8 Delhi Jaipur Highway",
                                location: "Gurugram",
                              },
                              {
                                label: "Dwarka Expressway",
                                location: "Gurugram",
                              },
                            ].map((location) => (
                              <SelectItem
                                key={location.label}
                                value={location.label}
                                className="flex items-center py-2.5 px-3 hover:bg-[#1A3B4C]/5 cursor-pointer font-medium"
                              >
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-[#1A3B4C]" />
                                  {location.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Desktop: Quick Search Buttons */}
                    <div className="hidden sm:flex flex-wrap gap-1.5 sm:gap-2">
                      {[
                        { label: "Golf Course Road", location: "Gurugram" },
                        {
                          label: "Golf Course Extension",
                          location: "Gurugram",
                        },
                        { label: "SPR Road", location: "Gurugram" },
                        {
                          label: "NH8 Delhi Jaipur Highway",
                          location: "Gurugram",
                        },
                        { label: "Dwarka Expressway", location: "Gurugram" },
                      ].map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(tag.label);
                            setLocation(tag.location);
                          }}
                          className="px-3 sm:px-4 py-2 bg-[#1A3B4C]/5 text-[#1A3B4C] rounded-lg hover:bg-[#1A3B4C]/10 transition-all duration-300 text-sm font-medium border border-[#1A3B4C]/20 shadow hover:shadow-lg"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              className="relative mt-4 lg:mt-0 hidden sm:block"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                {/* Main hero image placeholder */}
                <div className="w-full h-32 sm:h-40 lg:h-72 bg-gradient-to-br from-white/20 to-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="text-white/70 text-center">
                    <Building className="h-8 sm:h-10 lg:h-18 w-8 sm:w-10 lg:w-18 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-medium">
                      Premium Properties
                    </p>
                  </div>
                </div>

                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-8 sm:w-10 lg:w-16 h-8 sm:h-10 lg:h-16 bg-yellow-300 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Home className="h-4 sm:h-5 lg:h-8 w-4 sm:w-5 lg:w-8 text-[#1A3B4C]" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 -left-2 w-6 sm:w-8 lg:w-14 h-6 sm:h-8 lg:h-14 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg"
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                >
                  <MapPin className="h-3 sm:h-4 lg:h-7 w-3 sm:w-4 lg:w-7 text-[#1A3B4C]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Housing Edge Services Section */}
      <motion.section
        className="py-20 bg-gray-50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Housing Edge
              </h2>
              <p className="text-gray-600 text-lg">
                Explore property related services
              </p>
            </div>
            <Button className="bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl text-nowrap transition-all duration-300 mt-6 md:mt-0">
              Explore Services →
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Crown,
                title: "Housing Premium",
                description: "Instant access to zero brokerage properties",
              },
              {
                icon: Calculator,
                title: "Home Loans",
                description: "Lowest interest rate offers",
              },
              {
                icon: Shield,
                title: "Housing Protect",
                description: "Protection against cyber frauds",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="h-8 w-8 text-[#1A3B4C]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Housing's Top Picks Section */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Housing&apos;s top picks
            </h2>
            <p className="text-gray-600 text-lg">
              Explore top living options with us
            </p>
          </div>

          {/* Featured Property Showcase */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Main Featured Property */}
            <motion.div
              className="lg:col-span-2"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden shadow-xl rounded-3xl bg-gradient-to-br from-[#1A3B4C]/10 via-[#1A3B4C]/5 to-white">
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#1A3B4C] to-[#2A4B5C] rounded-2xl flex items-center justify-center">
                          <Building className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Homes
                      </h3>
                    </div>
                    <div className="w-full sm:w-auto">
                      <Button className="bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white px-8 text-nowrap py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6 md:mt-0 text-sm w-full sm:w-auto">
                        View Projects
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-3xl font-bold text-gray-800">
                      Lavish Floors
                    </h4>
                    <p className="text-gray-600">
                      Dwarka Mor, South West Delhi, New Delhi
                    </p>
                    <div className="flex items-center gap-4 text-2xl font-bold text-gray-800">
                      <span>₹70.0 L - 1.5 Cr</span>
                    </div>
                    <p className="text-gray-600">4 BHK Builder Floor</p>
                    <Button className="bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-lg text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6 md:mt-0 w-full">
                      Contact
                    </Button>
                  </div>
                </div>

                {/* Property Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/main.jpg"
                      alt="Property Image"
                      className="h-64 w-full object-cover object-center"
                      width={400}
                      height={400}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Side Property Cards */}
            <motion.div
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                {
                  title: "Innovative Homes",
                  description: "Premium Location",
                  image: "/1.jpg",
                },
                {
                  title: "Lavish Floors",
                  description: "Premium Location",
                  image: "/2.jpg",
                },
                {
                  title: "Home Luxury",
                  description: "Premium Location",
                  image: "/3.jpg",
                },
              ].map((property, index) => (
                <Card
                  key={index}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="h-40 w-full object-cover object-top"
                        width={300}
                        height={300}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 my-1">
                      {property.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {property.description}
                    </p>
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>

          {/* Property Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: "10K+",
                label: "Properties",
                icon: Building,
              },
              {
                number: "50+",
                label: "Cities",
                icon: MapPin,
              },
              {
                number: "98%",
                label: "Satisfaction",
                icon: Star,
              },
              {
                number: "24/7",
                label: "Support",
                icon: Clock,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-8 w-8 text-[#1A3B4C]" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Premium Featured Properties Section */}
      <motion.section
        className="py-24 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row md:justify-between md:items-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-5xl font-bold font-display text-gray-800 mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked premium properties just for you
              </p>
            </div>
            <Link href="/properties">
              <Button className="bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6 md:mt-0">
                View All Properties
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse border-0 shadow-lg">
                  <div className="h-64 bg-gray-200 rounded-t-xl"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.slice(0, 6).map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="relative">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={
                            property.mainImage ||
                            property.images?.[0]?.url ||
                            "/placeholder-property.jpg" ||
                            "/placeholder.svg"
                          }
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={400}
                          height={400}
                        />
                        {/* Highlight Badge */}
                        {property.highlight && (
                          <div
                            className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white rounded-full ${getHighlightColor(
                              property.highlight
                            )}`}
                          >
                            {property.highlight}
                          </div>
                        )}
                        {/* Status Badge */}
                        <div
                          className={`absolute top-4 right-4 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {property.status?.replace("_", " ")}
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Title and Location */}
                        <div>
                          <Link
                            href={`/properties/${property.slug || property.id}`}
                          >
                            <h3 className="text-xl font-bold font-display text-gray-800 line-clamp-2 group-hover:text-[#1A3B4C] transition-colors duration-300 cursor-pointer">
                              {property.title}
                            </h3>
                          </Link>
                          <div className="flex items-center text-sm text-gray-600 mt-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="line-clamp-1">
                              {property.location ||
                                `${
                                  property.locality
                                    ? property.locality + ", "
                                    : ""
                                }${property.city}, ${property.state}`}
                            </span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {property.bedrooms && (
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1" />
                              <span>{property.bedrooms} Bed</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1" />
                              <span>{property.bathrooms} Bath</span>
                            </div>
                          )}
                          {property.area && (
                            <div className="flex items-center">
                              <Square className="h-4 w-4 mr-1" />
                              <SimpleAreaDisplay
                                value={property.area}
                                unit="sq_feet"
                                className="text-sm text-gray-600"
                              />
                            </div>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-[#1A3B4C]">
                              {formatPrice(property.price)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {property.listingType === "SALE"
                                ? "For Sale"
                                : property.listingType === "RENT"
                                ? "For Rent"
                                : "For Lease"}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-600">
                              {property.propertyType}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {/* Call Button - Show number from sidebar content if available */}
                          <Link
                            href={`/properties/${property.slug || property.id}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] hover:shadow-lg text-white"
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Visit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-16 text-center">
                  <div className="w-24 h-24 bg-[#1A3B4C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building className="h-12 w-12 text-[#1A3B4C]" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-gray-800 mb-4">
                    No Featured Properties Available
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Check back soon for amazing property listings!
                  </p>
                  <Link href="/properties">
                    <Button className="bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      Browse All Properties
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Premium Testimonials Section */}
      <motion.section
        className="py-24 bg-gradient-to-br from-[#1A3B4C]/5 to-[#2A4B5C]/5 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-0 w-72 h-72 bg-[#1A3B4C]/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-[#2A4B5C]/5 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            className="mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-[#1A3B4C] font-semibold mb-4 block">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-display py-4 bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] bg-clip-text text-transparent">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600/80">
              Real experiences from real people who found their dream homes
            </p>
          </motion.div>

          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 relative z-10 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1A3B4C]/10 rounded-full filter blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#2A4B5C]/10 rounded-full filter blur-2xl"></div>

              <div className="relative">
                <div className="flex justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-7 w-7 text-yellow-400 fill-current mx-1 animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-gray-800 mb-10 italic leading-relaxed relative">
                  <span className="absolute -top-6 -left-4 text-6xl text-[#1A3B4C]/20">
                    &ldquo;
                  </span>
                  <span className="relative z-10">
                    {testimonials[currentTestimonial].content}
                  </span>
                  <span className="absolute -bottom-6 -right-4 text-6xl text-[#1A3B4C]/20">
                    &rdquo;
                  </span>
                </blockquote>

                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Image
                      src={
                        testimonials[currentTestimonial].image ||
                        "/placeholder.svg"
                      }
                      alt={testimonials[currentTestimonial].name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-[#1A3B4C]/20"
                      width={80}
                      height={80}
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-left ml-6">
                    <h4 className="font-bold text-xl text-gray-800">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-[#1A3B4C]/80 font-medium mb-1">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-[#1A3B4C]/60" />
                      {testimonials[currentTestimonial].location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center z-20 pointer-events-none">
              <button
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) =>
                      (prev - 1 + testimonials.length) % testimonials.length
                  )
                }
                className="p-3 rounded-full bg-white/80 shadow-lg backdrop-blur-sm border border-white/20 text-[#1A3B4C] hover:bg-white transition-all duration-300 pointer-events-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={() =>
                  setCurrentTestimonial(
                    (prev) => (prev + 1) % testimonials.length
                  )
                }
                className="p-3 rounded-full bg-white/80 shadow-lg backdrop-blur-sm border border-white/20 text-[#1A3B4C] hover:bg-white transition-all duration-300 pointer-events-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Testimonial indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-[#1A3B4C] w-20"
                    : "bg-gray-300 hover:bg-[#1A3B4C]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
