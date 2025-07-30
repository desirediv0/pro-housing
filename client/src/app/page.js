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
  Calendar,
  CreditCard,
  Crown,
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  b1,
  b2,
  b3,
  b4,
  b5,
  card1,
  card2,
  card3,
  card4,
  card5,
  card6,
  card7,
  card8,
  card9,
  dlfcamellias,
  glfcyberhub,
  m3m,
  trumptower,
} from "@/assets";
import { useRouter } from "next/navigation";
import ExpertiseSection from "@/components/ExpertiseSection";
import LogoSlider from "@/components/LogoSlider";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [listingType, setListingType] = useState("");
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [sidebarContent, setSidebarContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("apartment");

  const router = useRouter();

  // Category-specific states
  const [categoryProperties, setCategoryProperties] = useState({});
  const [categoryStats, setCategoryStats] = useState({});
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  const [carouselIndex, setCarouselIndex] = useState(0);

  // Hero carousel states
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Hero carousel data
  const heroSlides = [
    {
      image: b1,
    },
    {
      image: b2,
    },
    {
      image: b3,
    },
    {
      image: b4,
    },
    {
      image: b5,
    },
  ];

  useEffect(() => {
    fetchFeaturedProperties();
    fetchSidebarContent();
    fetchCategoryData();
  }, []);

  // Auto-change hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change every 5 seconds

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

  const fetchCategoryData = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError(null);

      // Fetch category stats
      const statsResponse = await publicAPI.getCategoryStats();
      const stats = statsResponse.data.data || statsResponse.data || {};

      setCategoryStats(stats);

      // Fetch properties for each category
      const categories = [
        "apartment",
        "house",
        "commercial",
        "plot",
        "pg",
        "invest",
      ];
      const propertiesData = {};

      await Promise.all(
        categories.map(async (category) => {
          try {
            const response = await publicAPI.getPropertiesByCategory(
              category,
              6
            );
            // Ensure we get proper array from API response
            let categoryData = response.data.data || response.data || [];
            if (categoryData.data && Array.isArray(categoryData.data)) {
              categoryData = categoryData.data;
            }

            propertiesData[category] = Array.isArray(categoryData)
              ? categoryData
              : [];
          } catch (error) {
            console.error(`Error fetching ${category} properties:`, error);
            propertiesData[category] = [];
          }
        })
      );

      setCategoryProperties(propertiesData);
    } catch (error) {
      console.error("Error fetching category data:", error);
      setCategoryError("Failed to load properties. Please try again.");
    } finally {
      setCategoryLoading(false);
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
      name: "Arun Sharma",
      role: "Property Buyer",
      content:
        "Found my dream apartment in Sector 48, Gurugram through Pro Housing. Their team was extremely professional and helped me negotiate the best price. The entire process from property viewing to documentation was seamless.",
      rating: 5,
      location: "Sector 48, Gurugram",
      date: "2 weeks ago",
      propertyType: "3 BHK Apartment",
    },
    {
      name: "Priya Malhotra",
      role: "Home Owner",
      content:
        "Pro Housing helped me sell my property in DLF Phase 5 at the best market price. Their market analysis and property valuation was spot on. The team's dedication and regular updates made the selling process stress-free.",
      rating: 5,
      location: "DLF Phase 5, Gurugram",
      date: "1 month ago",
      propertyType: "4 BHK Villa",
    },
    {
      name: "Rajat Verma",
      role: "First-time Buyer",
      content:
        "As a first-time homebuyer in Gurugram, I was quite nervous. Pro Housing's team guided me through every step, from shortlisting properties in Golf Course Road to handling all the paperwork. Highly recommend their services!",
      rating: 5,
      location: "Golf Course Road, Gurugram",
      date: "3 weeks ago",
      propertyType: "2 BHK Apartment",
    },
    {
      name: "Neha Gupta",
      role: "Property Investor",
      content:
        "Pro Housing has been instrumental in building my property portfolio in Gurugram. Their investment advice and market insights for Sohna Road properties were invaluable. The rental management services are excellent too.",
      rating: 5,
      location: "Sohna Road, Gurugram",
      date: "1 week ago",
      propertyType: "Commercial Space",
    },
    {
      name: "Vikram Singh",
      role: "NRI Investor",
      content:
        "Managing property investment from abroad was made easy by Pro Housing. They helped me acquire a premium property in Sector 60 and are managing it perfectly. Their virtual tours and detailed reports are excellent.",
      rating: 5,
      location: "Sector 60, Gurugram",
      date: "2 months ago",
      propertyType: "Luxury Apartment",
    },
  ];

  // Get properties for active category
  const getPropertiesForCategory = (category) => {
    const properties = categoryProperties[category];
    return Array.isArray(properties) ? properties : [];
  };

  // Get formatted count for category stats
  const getCategoryCount = (category) => {
    const count = categoryStats[category] || 0;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K+`;
    }
    return `${count}+`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Auto-Changing Hero Carousel Background */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentHeroSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>
          ))}
        </div>

        {/* Floating Property Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Icons */}
          <div className="absolute top-1/4 left-1/6 opacity-20">
            <div className="w-16 h-16 bg-white/30 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <Home className="w-8 h-8 text-white/60" />
            </div>
          </div>

          <div className="absolute top-2/3 right-1/5 opacity-20">
            <div className="w-12 h-12 bg-yellow-300/40 rounded-xl backdrop-blur-sm flex items-center justify-center">
              <Building className="w-6 h-6 text-white/70" />
            </div>
          </div>

          <div className="absolute top-1/2 left-3/4 opacity-20">
            <div className="w-14 h-14 bg-blue-300/30 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white/60" />
            </div>
          </div>

          {/* Geometric Patterns */}
          <div className="absolute top-1/5 right-1/3 opacity-10">
            <div className="w-32 h-32 border border-white/30 rounded-full"></div>
          </div>

          <div className="absolute bottom-1/4 left-1/3 opacity-10">
            <div className="w-24 h-24 border border-yellow-300/30 rotate-45"></div>
          </div>

          {/* Additional Floating Property Cards */}
          <div className="absolute top-3/4 left-1/5 opacity-15">
            <div className="w-20 h-16 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex flex-col items-center justify-center">
              <Home className="w-4 h-4 text-white/60 mb-1" />
              <div className="w-8 h-1 bg-white/40 rounded"></div>
            </div>
          </div>

          <div className="absolute top-1/6 right-1/6 opacity-15">
            <div className="w-18 h-14 bg-yellow-300/25 rounded-lg backdrop-blur-sm border border-yellow-300/40 flex flex-col items-center justify-center">
              <Building className="w-4 h-4 text-white/70 mb-1" />
              <div className="w-6 h-0.5 bg-white/50 rounded"></div>
            </div>
          </div>

          {/* Floating Particles */}
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}

          {/* Property Stats Floating Elements */}
          <div className="absolute top-1/3 right-1/4 opacity-12">
            <div className="w-16 h-12 bg-blue-400/20 rounded-lg backdrop-blur-sm border border-blue-300/30 flex flex-col items-center justify-center">
              <div className="text-xs text-white/60 font-bold">9K+</div>
              <div className="w-8 h-0.5 bg-white/40 rounded mt-1"></div>
            </div>
          </div>
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
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 w-full">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="text-white space-y-4 sm:space-y-5 lg:space-y-6">
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
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative mt-4 lg:mt-0 hidden sm:block">
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
                <div className="absolute -top-2 -right-2 w-8 sm:w-10 lg:w-16 h-8 sm:h-10 lg:h-16 bg-yellow-300 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <Home className="h-4 sm:h-5 lg:h-8 w-4 sm:w-5 lg:w-8 text-[#1A3B4C]" />
                </div>

                <div className="absolute -bottom-2 -left-2 w-6 sm:w-8 lg:w-14 h-6 sm:h-8 lg:h-14 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <MapPin className="h-3 sm:h-4 lg:h-7 w-3 sm:w-4 lg:w-7 text-[#1A3B4C]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentHeroSlide
                    ? "bg-yellow-300 scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() =>
            setCurrentHeroSlide(
              currentHeroSlide === 0
                ? heroSlides.length - 1
                : currentHeroSlide - 1
            )
          }
          className="absolute left-4 top-1/4 md:top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        >
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
        <button
          onClick={() =>
            setCurrentHeroSlide(
              currentHeroSlide === heroSlides.length - 1
                ? 0
                : currentHeroSlide + 1
            )
          }
          className="absolute right-4 top-1/4 md:top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Expertise Section */}
      <ExpertiseSection />

      {/* Housing Edge Services Section */}
      <div className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h2 className="md:text-4xl text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">
                Top Development Projects
              </h2>
              <p className="text-gray-600 text-lg md:text-left text-center">
                Premium developments shaping Gurugram&apos;s skyline
              </p>
            </div>
          </div>

          {/* Development Sectors Statistics */}
          <div className="bg-white  p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                {
                  sector: "Golf Course Road",
                  properties: "850+",
                  type: "Ultra Luxury",
                  growth: "+15%",
                  icon: Crown,
                },
                {
                  sector: "Sector 54",
                  properties: "1.2K+",
                  type: "Premium",
                  growth: "+12%",
                  icon: Building,
                },
                {
                  sector: "DLF Phase 5",
                  properties: "650+",
                  type: "Luxury",
                  growth: "+18%",
                  icon: Star,
                },
                {
                  sector: "Sector 65",
                  properties: "950+",
                  type: "Modern",
                  growth: "+20%",
                  icon: Home,
                },
                {
                  sector: "Sohna Road",
                  properties: "1.5K+",
                  type: "Emerging",
                  growth: "+25%",
                  icon: MapPin,
                },
                {
                  sector: "New Gurgaon",
                  properties: "800+",
                  type: "Developing",
                  growth: "+30%",
                  icon: Square,
                },
              ].map((sector, index) => (
                <div
                  key={index}
                  className="text-center group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-lg p-4"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("search", sector.sector);
                    router.push(`/properties?${params.toString()}`);
                  }}
                  title={`See properties in ${sector.sector}`}
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <sector.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-800 text-sm line-clamp-1">
                        {sector.sector}
                      </h4>
                      <div className="text-lg font-bold text-[#1A3B4C]">
                        {sector.properties}
                      </div>
                      <div className="text-xs text-gray-600">{sector.type}</div>
                      <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        {sector.growth}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Image Carousel Section */}
      <div className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A3B4C] mb-3">
              Explore Top Localities
            </h2>
            <p className="text-gray-600">
              Click any image to view properties in that area
            </p>
          </div>
          <Carousel
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
              slidesToScroll: 1,
            }}
            className="w-full"
            setApi={(api) => {
              if (!api) return;
              api.on("select", () => {
                setCarouselIndex(api.selectedScrollSnap());
              });
            }}
          >
            <CarouselContent className="flex">
              {[
                {
                  src: card1,
                  alt: "Smartworld One DXP",
                  search: "Smartworld One DXP",
                },
                {
                  src: card2,
                  alt: "Cloverdale SPR",
                  search: "Cloverdale SPR",
                },
                {
                  src: card3,
                  alt: "DLF Privana North",
                  search: "DLF Privana North",
                },
                {
                  src: card4,
                  alt: "Signature Global City 93",
                  search: "Signature Global City 93",
                },
                {
                  src: card5,
                  alt: "Signature Global City 93",
                  search: "Signature Global City 93",
                },
                {
                  src: card6,
                  alt: "Ultra Luxurious",
                  search: "ultra luxurious",
                },
                {
                  src: card7,
                  alt: "M3M Soulitude",
                  search: "M3M Soulitude",
                },
                {
                  src: card8,
                  alt: "M3M Soulitude",
                  search: "M3M Soulitude",
                },
                {
                  src: card9,
                  alt: "Vista Casa Luxuries",
                  search: "Vista Casa Luxuries",
                },
              ].map((img) => (
                <CarouselItem
                  key={img.alt}
                  className="group px-2 md:basis-1/3 lg:basis-1/3 cursor-pointer"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("search", img.search);
                    router.push(`/properties?${params.toString()}`);
                  }}
                >
                  <div className="relative w-full  min-h-[650px] lg:min-h-[450px] max-w-5xl mx-auto flex items-center justify-center">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-fill rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300 border-4 border-white"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white flex items-center justify-center text-nowrap px-4 py-2 rounded-full text-lg font-semibold shadow">
                      {img.alt}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 bg-white hover:bg-gray-100 border-2 border-gray-200 shadow-lg" />
            <CarouselNext className="-right-4 bg-white hover:bg-gray-100 border-2 border-gray-200 shadow-lg" />
          </Carousel>
        </div>
      </div>

      {/* Housing's Top Picks Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#1A3B4C] font-medium text-sm uppercase tracking-wider mb-2 block">
              DISCOVER EXCELLENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A3B4C] mb-3">
              Premium Properties in Gurugram
            </h2>
            <p className="text-gray-600 text-base">
              Experience luxury living in the heart of Millennium City
            </p>
          </div>

          {/* Featured Property Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Main Featured Property */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border-0">
                <div className="relative">
                  <div className="h-[500px] md:h-[750px] relative overflow-hidden">
                    <Image
                      src={glfcyberhub}
                      alt="DLF Cyber Hub"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      width={1000}
                      height={1000}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-semibold rounded-full">
                        FEATURED
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        DLF Cyber Hub
                      </h3>
                      <p className="text-white/90 text-sm mb-4">
                        DLF Cyber City, Gurugram
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-white/90 text-sm mb-6">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>Premium Office Spaces</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Prime Business District</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          <span>World-class Amenities</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          <span>5-Star Facilities</span>
                        </div>
                      </div>

                      <div className="space-y-4 text-center sm:text-left">
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            Ready to Find Your Dream Home?
                          </h3>
                          <p className="text-white/80 text-sm sm:text-base">
                            Join thousands of happy customers who found their
                            perfect property with Pro Housing
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link href="/properties" className="flex-1">
                            <Button className="w-full bg-[#1A3B4C] hover:bg-[#2A4B5C] text-white px-6 py-2.5 rounded-lg font-medium text-sm">
                              Start Searching
                            </Button>
                          </Link>
                          <Link href="/contact" className="flex-1">
                            <Button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/40 px-6 py-2.5 rounded-lg font-medium text-sm">
                              Talk to Expert
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Side Property Cards */}
            <div className="space-y-4">
              {[
                {
                  title: "DLF The Camellias",
                  location: "Golf Course Road",
                  image: dlfcamellias,
                  tag: "ULTRA LUXURY",
                },
                {
                  title: "Trump Towers",
                  location: "Golf Course Road Ext.",
                  image: trumptower,
                  tag: "PREMIUM",
                },
                {
                  title: "M3M Golf Estate",
                  location: "Sector 65, Gurugram",
                  image: m3m,
                  tag: "FEATURED",
                },
              ].map((property, index) => (
                <Card
                  key={index}
                  className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group border-0 cursor-pointer"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("search", property.title);
                    router.push(`/properties?${params.toString()}`);
                  }}
                  title={`See properties for ${property.title}`}
                >
                  <div className="relative">
                    <div className="h-56 md:h-44 relative overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        width={400}
                        height={300}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 bg-yellow-400 text-black text-xs font-semibold rounded-full">
                          {property.tag}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-[#1A3B4C] mb-1">
                        {property.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.location}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* LOGO LOOPS */}
          <LogoSlider />
        </div>
      </div>

      {/* Premium Featured Properties Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold font-display text-gray-800 mb-4">
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
          </div>

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
                <div key={property.id} className="group">
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
                </div>
              ))}
            </div>
          ) : (
            <div>
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
                    <Button className="bg-gradient-to-r  from-[#1A3B4C] to-[#2A4B5C] text-white px-8 py-3 rounded-xl  font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      Browse All Properties
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Property Categories Carousel Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="h-1 w-16 bg-[#1A3B4C] rounded-full mr-4"></div>
              <h2 className="text-3xl md:text-5xl font-bold font-display text-gray-800">
                Explore by Category
              </h2>
              <div className="h-1 w-16 bg-[#1A3B4C] rounded-full ml-4"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover properties tailored to your specific needs and
              preferences
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-12">
            {/* Mobile: Dropdown */}
            <div className="sm:hidden">
              <Select value={activeCategory} onValueChange={setActiveCategory}>
                <SelectTrigger className="w-full bg-white border-2 border-[#1A3B4C]/20 rounded-xl shadow-sm">
                  <SelectValue placeholder="Select Property Category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-[#1A3B4C]/20 shadow-xl rounded-xl">
                  <SelectGroup>
                    <SelectLabel className="text-[#1A3B4C] font-semibold">
                      Property Types
                    </SelectLabel>
                    <SelectItem value="apartment">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Apartments
                      </div>
                    </SelectItem>
                    <SelectItem value="house">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2" />
                        Houses & Villas
                      </div>
                    </SelectItem>
                    <SelectItem value="commercial">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Commercial
                      </div>
                    </SelectItem>
                    <SelectItem value="plot">
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-2" />
                        Plots & Land
                      </div>
                    </SelectItem>
                    <SelectItem value="pg">
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-2" />
                        PG & Hostels
                      </div>
                    </SelectItem>
                    <SelectItem value="invest">
                      <div className="flex items-center">
                        <Crown className="h-4 w-4 mr-2" />
                        Investment
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop: Tab Navigation */}
            <div className="hidden sm:flex justify-center">
              <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                <div className="flex space-x-2">
                  {[
                    {
                      key: "apartment",
                      label: "Apartments",
                      icon: Building,
                      count: getCategoryCount("apartment"),
                    },
                    {
                      key: "house",
                      label: "Houses & Villas",
                      icon: Home,
                      count: getCategoryCount("house"),
                    },
                    {
                      key: "commercial",
                      label: "Commercial",
                      icon: Building,
                      count: getCategoryCount("commercial"),
                    },
                    {
                      key: "plot",
                      label: "Plots & Land",
                      icon: Square,
                      count: getCategoryCount("plot"),
                    },
                    {
                      key: "pg",
                      label: "PG & Hostels",
                      icon: Home,
                      count: getCategoryCount("pg"),
                    },
                    {
                      key: "invest",
                      label: "Investment",
                      icon: Crown,
                      count: getCategoryCount("invest"),
                    },
                  ].map((category) => (
                    <button
                      key={category.key}
                      onClick={() => setActiveCategory(category.key)}
                      className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all duration-300 group min-w-[120px] ${
                        activeCategory === category.key
                          ? "bg-[#1A3B4C] text-white"
                          : "hover:bg-[#1A3B4C] hover:text-white"
                      }`}
                    >
                      <category.icon
                        className={`h-6 w-6 mb-2 transition-colors ${
                          activeCategory === category.key
                            ? "text-white"
                            : "text-[#1A3B4C] group-hover:text-white"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          activeCategory === category.key
                            ? "text-white"
                            : "text-gray-800 group-hover:text-white"
                        }`}
                      >
                        {category.label}
                      </span>
                      <span
                        className={`text-xs transition-colors ${
                          activeCategory === category.key
                            ? "text-white/80"
                            : "text-gray-500 group-hover:text-white/80"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Properties Carousel */}
          <div className="px-4 sm:px-8">
            {categoryLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse border-0 shadow-lg">
                    <div className="aspect-video bg-gray-200 rounded-t-xl"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : categoryError ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Failed to Load Properties
                </h3>
                <p className="text-gray-600 mb-4">{categoryError}</p>
                <Button
                  onClick={fetchCategoryData}
                  className="bg-[#1A3B4C] hover:bg-[#2A4B5C] text-white"
                >
                  Try Again
                </Button>
              </div>
            ) : getPropertiesForCategory(activeCategory).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Properties Available
                </h3>
                <p className="text-gray-600 mb-4">
                  No properties found in this category. Check back later!
                </p>
                <Link href="/properties">
                  <Button className="bg-[#1A3B4C] hover:bg-[#2A4B5C] text-white">
                    View All Properties
                  </Button>
                </Link>
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  skipSnaps: false,
                  slidesToScroll: 1,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {/* Properties for Active Category */}
                  {getPropertiesForCategory(activeCategory).map(
                    (property, index) => (
                      <CarouselItem
                        key={property.id}
                        className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="h-full">
                          <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group h-full"
                          >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                              <div className="relative">
                                <div className="aspect-video relative overflow-hidden">
                                  <Image
                                    src={
                                      property.mainImage ||
                                      property.images?.[0]?.url ||
                                      "/placeholder.svg"
                                    }
                                    alt={property.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    width={400}
                                    height={300}
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
                                    <h3 className="text-xl font-bold font-display text-gray-800 line-clamp-2 group-hover:text-[#1A3B4C] transition-colors duration-300">
                                      {property.title}
                                    </h3>
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
                                        {property.propertyType === "PG" ||
                                        property.propertyType === "HOSTEL"
                                          ? "Per Month"
                                          : property.listingType === "RENT"
                                          ? "For Rent"
                                          : property.listingType === "LEASE"
                                          ? "For Lease"
                                          : "For Sale"}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-gray-600">
                                        {property.propertyType}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2">
                                    <Link
                                      href={`/properties/${
                                        property.slug || property.id
                                      }`}
                                      className="flex-1"
                                    >
                                      <Button
                                        size="sm"
                                        className="w-full bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] hover:shadow-lg text-white"
                                      >
                                        <Calendar className="h-4 w-4 mr-1" />
                                        View Details
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      </CarouselItem>
                    )
                  )}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="-left-4 bg-white hover:bg-gray-100 border-2 border-gray-200 shadow-lg" />
                  <CarouselNext className="-right-4 bg-white hover:bg-gray-100 border-2 border-gray-200 shadow-lg" />
                </div>
              </Carousel>
            )}
          </div>

          {/* Category Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-6 gap-6">
            {[
              {
                category: "Apartments",
                key: "apartment",
                icon: Building,
                color: "from-blue-500 to-blue-600",
              },
              {
                category: "Houses & Villas",
                key: "house",
                icon: Home,
                color: "from-green-500 to-green-600",
              },
              {
                category: "Commercial",
                key: "commercial",
                icon: Building,
                color: "from-purple-500 to-purple-600",
              },
              {
                category: "Plots & Land",
                key: "plot",
                icon: Square,
                color: "from-orange-500 to-orange-600",
              },
              {
                category: "PG & Hostels",
                key: "pg",
                icon: Home,
                color: "from-pink-500 to-pink-600",
              },
              {
                category: "Investment",
                key: "invest",
                icon: Crown,
                color: "from-yellow-500 to-yellow-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {getCategoryCount(stat.key)}
                  </div>
                  <div className="text-sm text-gray-600">{stat.category}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Testimonials testimonials={testimonials} />

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
