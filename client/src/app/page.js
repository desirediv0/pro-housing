"use client";

import React, { useState, useEffect } from "react";
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
  Eye,
  Phone,
  Clock,
  CheckCircle,
  Calendar,
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
      FEATURED: "gradient-primary",
      TRENDING: "bg-gradient-to-r from-red-500 to-red-600",
      NEW: "bg-gradient-to-r from-success to-green-600",
      HOT_DEAL: "bg-gradient-to-r from-warning to-orange-600",
      PREMIUM: "gradient-primary",
    };
    return colors[highlight] || "bg-primary";
  };

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: "bg-success/10 text-success border-success/20",
      SOLD: "bg-red-100 text-red-800 border-red-200",
      RENTED: "bg-primary/10 text-primary border-primary/20",
      UNDER_NEGOTIATION: "bg-warning/10 text-warning border-warning/20",
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
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background with Blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#493AB1] via-[#6B5FC7] to-[#8A79DD]">
          <div className="absolute inset-0 backdrop-blur-[100px]">
            {/* Animated Circles */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-fuchsia-500/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Background Buildings Silhouette with enhanced opacity */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/30 to-transparent"></div>
          {/* Geometric buildings pattern with enhanced visibility */}
          <div className="absolute bottom-0 left-0 opacity-30">
            <svg
              width="300"
              height="200"
              viewBox="0 0 300 200"
              className="text-white/40 fill-current"
            >
              <rect x="20" y="80" width="40" height="120" />
              <rect x="70" y="60" width="35" height="140" />
              <rect x="115" y="90" width="30" height="110" />
              <rect x="155" y="50" width="45" height="150" />
              <rect x="210" y="70" width="35" height="130" />
              <rect x="255" y="40" width="40" height="160" />
            </svg>
          </div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              className="text-white space-y-8"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold font-display leading-tight">
                  Properties to buy in{" "}
                  <span className="text-yellow-300">Delhi</span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  <span className="font-semibold">9K+</span> listings added
                  daily and <span className="font-semibold">65K+</span> total
                  verified
                </p>
              </div>

              {/* Search Bar */}
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Main Search Row */}
                  <div className="flex gap-4">
                    <div className="w-48">
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-primary ring-offset-2 ring-offset-white font-medium text-gray-800">
                          <SelectValue
                            placeholder="Select City"
                            className="placeholder:text-gray-500"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-xl">
                          <SelectGroup>
                            <SelectLabel className="text-primary font-semibold">
                              Popular Cities
                            </SelectLabel>
                            <SelectItem
                              value="Delhi"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Delhi
                            </SelectItem>
                            <SelectItem
                              value="Mumbai"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Mumbai
                            </SelectItem>
                            <SelectItem
                              value="Bangalore"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Bangalore
                            </SelectItem>
                            <SelectItem
                              value="Pune"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Pune
                            </SelectItem>
                            <SelectItem
                              value="Chennai"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Chennai
                            </SelectItem>
                            <SelectItem
                              value="Hyderabad"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Hyderabad
                            </SelectItem>
                            <SelectItem
                              value="Kolkata"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Kolkata
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Search for locality, landmark, project, or builder"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 px-4 bg-gray-50/50 rounded-xl border text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-primary ring-offset-2 ring-offset-white"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="h-12 px-8 bg-gradient-to-r from-primary to-primary/90 hover:to-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Search
                    </Button>
                  </div>

                  {/* Filters Row */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Select
                        value={propertyType}
                        onValueChange={setPropertyType}
                      >
                        <SelectTrigger className="w-full h-10 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-primary ring-offset-2 ring-offset-white font-medium text-gray-800">
                          <SelectValue
                            placeholder="Property Type"
                            className="placeholder:text-gray-500"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-xl">
                          <SelectGroup>
                            <SelectLabel className="text-primary font-semibold">
                              Property Types
                            </SelectLabel>
                            <SelectItem
                              value="apartment"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Apartment
                            </SelectItem>
                            <SelectItem
                              value="house"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              House
                            </SelectItem>
                            <SelectItem
                              value="villa"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Villa
                            </SelectItem>
                            <SelectItem
                              value="commercial"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Commercial
                            </SelectItem>
                            <SelectItem
                              value="plot"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Plot
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1">
                      <Select value={priceRange} onValueChange={setPriceRange}>
                        <SelectTrigger className="w-full h-10 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-primary ring-offset-2 ring-offset-white font-medium text-gray-800">
                          <SelectValue
                            placeholder="Budget Range"
                            className="placeholder:text-gray-500"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-xl">
                          <SelectGroup>
                            <SelectLabel className="text-primary font-semibold">
                              Budget Range
                            </SelectLabel>
                            <SelectItem
                              value="0-25"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Under ₹25 Lakhs
                            </SelectItem>
                            <SelectItem
                              value="25-50"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              ₹25-50 Lakhs
                            </SelectItem>
                            <SelectItem
                              value="50-100"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              ₹50 Lakhs - ₹1 Crore
                            </SelectItem>
                            <SelectItem
                              value="100+"
                              className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer font-medium data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                            >
                              Above ₹1 Crore
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>
              </div>

              {/* Continue Last Search */}
              <div className="space-y-4">
                <p className="text-white/80 font-medium">
                  Continue last search
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setSearchQuery("Dwarka Mor");
                      setLocation("Delhi");
                    }}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
                  >
                    Dwarka Mor, Any BHK...
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery("Dwarka");
                      setLocation("Delhi");
                    }}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all"
                  >
                    Dwarka Delhi, New Delhi...
                  </button>
                </div>
              </div>

              {/* Property Owner CTA */}
              <div className="flex items-center gap-3 text-white/90">
                <Star className="h-5 w-5 text-yellow-300" />
                <span>Are you a Property Owner?</span>
                <button className="text-yellow-300 hover:text-yellow-400 font-semibold underline">
                  Sell / Rent for FREE
                </button>
              </div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div
              className="relative"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                {/* Main hero image placeholder */}
                <div className="w-full h-96 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="text-white/70 text-center">
                    <Building className="h-24 w-24 mx-auto mb-4" />
                    <p className="text-lg font-medium">Premium Properties</p>
                  </div>
                </div>

                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300 rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Home className="h-12 w-12 text-primary" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <MapPin className="h-10 w-10 text-primary" />
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
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                Housing Edge
              </h2>
              <p className="text-gray-600 text-lg">
                Explore property related services
              </p>
            </div>
            <Button className="gradient-primary  text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300 mt-6 md:mt-0">
              Explore Services →
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "💳",
                title: "Pay on Credit",
                description: "Pay your rent using Credit Card",
                bgColor: "bg-blue-100",
                iconBg: "bg-blue-500",
              },
              {
                icon: "💎",
                title: "Housing Premium",
                description: "Instant access to zero brokerage properties",
                bgColor: "bg-purple-100",
                iconBg: "bg-purple-500",
              },
              {
                icon: "🏠",
                title: "Home Loans",
                description: "Lowest interest rate offers",
                bgColor: "bg-green-100",
                iconBg: "bg-green-500",
              },
              {
                icon: "🛡️",
                title: "Housing Protect",
                description: "Protection against cyber frauds",
                bgColor: "bg-orange-100",
                iconBg: "bg-orange-500",
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
                <Card
                  className={`${service.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full`}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-2xl">{service.icon}</span>
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

      {/* Housing&apos;s Top Picks Section */}
      <motion.section
        className="py-20 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Card className="overflow-hidden shadow-xl rounded-3xl bg-gradient-to-br from-pink-100 via-pink-50 to-white">
                <div className="p-8">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <Building className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Homes
                      </h3>
                      <Button className="gradient-primary  text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300 mt-6 md:mt-0 text-sm">
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

                    <Button className="gradient-primary text-lg text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300 mt-6 md:mt-0 w-full">
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
                        src={property.image}
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
                color: "bg-blue-500",
              },
              {
                number: "50+",
                label: "Cities",
                icon: MapPin,
                color: "bg-green-500",
              },
              {
                number: "98%",
                label: "Satisfaction",
                icon: Star,
                color: "bg-yellow-500",
              },
              {
                number: "24/7",
                label: "Support",
                icon: Clock,
                color: "bg-purple-500",
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
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="h-8 w-8 text-white" />
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
              <h2 className="text-5xl font-bold font-display text-text-primary mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-text-secondary">
                Handpicked premium properties just for you
              </p>
            </div>
            <Link href="/properties">
              <Button className="gradient-primary  text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300 mt-6 md:mt-0">
                View All Properties
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse border-0 shadow-premium">
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
                  <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-500 overflow-hidden">
                    <div className="relative">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={
                            property.mainImage ||
                            property.images?.[0]?.url ||
                            "/placeholder-property.jpg"
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
                            <h3 className="text-xl font-bold font-display text-text-primary line-clamp-2 group-hover:text-primary transition-colors duration-300 cursor-pointer">
                              {property.title}
                            </h3>
                          </Link>
                          <div className="flex items-center text-sm text-text-secondary mt-2">
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
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
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
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(property.price)}
                            </div>
                            <div className="text-sm text-text-secondary">
                              {property.listingType === "SALE"
                                ? "For Sale"
                                : property.listingType === "RENT"
                                ? "For Rent"
                                : "For Lease"}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-text-secondary">
                              {property.propertyType}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => {
                              window.open(
                                `tel:${property.phoneNumber}`,
                                "_blank"
                              );
                            }}
                            size="sm"
                            className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border-0"
                            variant="outline"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Link
                            href={`/properties/${property.slug || property.id}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full gradient-primary hover:shadow-glow text-white"
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
              <Card className="border-0 shadow-premium">
                <CardContent className="p-16 text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-text-primary mb-4">
                    No Featured Properties Available
                  </h3>
                  <p className="text-text-secondary mb-8">
                    Check back soon for amazing property listings!
                  </p>
                  <Link href="/properties">
                    <Button className="gradient-primary  text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300">
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
        className="py-24 bg-gradient-to-br from-accent/5 to-primary/5 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-accent/5 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            className="mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold mb-4 block">
              TESTIMONIALS
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold font-display   py-4 bg-gradient-to-r from-primary to-purple-500
             bg-clip-text text-transparent"
            >
              What Our Clients Say
            </h2>
            <p className="text-xl text-text-secondary/80">
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
            <div className="glass backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 relative z-10 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full filter blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full filter blur-2xl"></div>

              <div className="relative">
                <div className="flex justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-7 w-7 text-warning fill-current mx-1 animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-text-primary mb-10 italic leading-relaxed relative">
                  <span className="absolute -top-6 -left-4 text-6xl text-primary/20">
                    &ldquo;
                  </span>
                  <span className="relative z-10">
                    {testimonials[currentTestimonial].content}
                  </span>
                  <span className="absolute -bottom-6 -right-4 text-6xl text-primary/20">
                    &rdquo;
                  </span>
                </blockquote>

                <div className="flex items-center justify-center">
                  <div className="relative">
                    <Image
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
                      width={80}
                      height={80}
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center ring-4 ring-white">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-left ml-6">
                    <h4 className="font-bold text-xl text-text-primary">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-primary/80 font-medium mb-1">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <p className="text-text-secondary text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-primary/60" />
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
                className="p-3 rounded-full bg-white/80 shadow-lg backdrop-blur-sm border border-white/20 text-primary hover:bg-white transition-all duration-300 pointer-events-auto"
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
                className="p-3 rounded-full bg-white/80 shadow-lg backdrop-blur-sm border border-white/20 text-primary hover:bg-white transition-all duration-300 pointer-events-auto"
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
                    ? "bg-primary w-20"
                    : "bg-gray-300 hover:bg-primary/50"
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
