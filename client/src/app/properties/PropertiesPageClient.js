"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Home,
  Bed,
  Bath,
  Square,
  Eye,
  SlidersHorizontal,
  Grid,
  List,
  X,
  MessageCircle,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { publicAPI } from "@/lib/api-functions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SimpleAreaDisplay } from "@/components/ui/area-converter";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function PropertiesPageClient({ searchParams }) {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Search filters with proper initialization
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    listingType: "",
    price: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    furnished: "",
    parking: "",
    page: 1,
    limit: 12,
  });

  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const searchTimeoutRef = useRef(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 12,
        ...filters,
      };

      // Remove empty filters and "all" values
      Object.keys(params).forEach((key) => {
        if (!params[key] || params[key] === "" || params[key] === "all") {
          delete params[key];
        }
      });

      const response = await publicAPI.getAllProperties(params);

      // Handle API response
      const data = response.data.data || response.data || {};

      setProperties(data.data || data || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalProperties(data.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching properties:", error);
      console.error("Error details:", error.response?.data);
      setProperties([]);
      toast.error("Failed to fetch properties. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initialize filters from searchParams
  useEffect(() => {
    const newFilters = {
      search: searchParams?.search || "",
      location: searchParams?.location || "",
      type: searchParams?.type || "",
      listingType: searchParams?.listingType || "",
      price: searchParams?.price || "",
      minPrice: searchParams?.minPrice || "",
      maxPrice: searchParams?.maxPrice || "",
      bedrooms: searchParams?.bedrooms || "",
      bathrooms: searchParams?.bathrooms || "",
      furnished: searchParams?.furnished || "",
      parking: searchParams?.parking || "",
      page: Number.parseInt(searchParams?.page) || 1,
      limit: 12,
    };
    setFilters(newFilters);
    setCurrentPage(newFilters.page);
    setFiltersInitialized(true);
  }, [searchParams]);

  // Debounced search effect
  useEffect(() => {
    if (filtersInitialized) {
      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set new timeout for search
      searchTimeoutRef.current = setTimeout(() => {
        fetchProperties();
      }, 500); // 500ms debounce

      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }
  }, [filters, filtersInitialized, fetchProperties]);

  const updateURL = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "" && value !== "all" && key !== "limit") {
          params.set(key, value);
        }
      });
      const queryString = params.toString();
      const newURL = queryString ? `/properties?${queryString}` : "/properties";
      router.push(newURL, { scroll: false });
    },
    [router]
  );

  const handleFilterChange = useCallback(
    (filterName, value) => {
      const newFilters = {
        ...filters,
        [filterName]: value,
        page: filterName === "page" ? value : 1, // Reset to page 1 for new searches
      };

      setFilters(newFilters);
      setCurrentPage(newFilters.page);
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const newFilters = { ...filters, page: 1 };
      setFilters(newFilters);
      setCurrentPage(1);
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const handleSearchInputChange = useCallback((e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  }, []);

  const handleInquiry = (property) => {
    setSelectedProperty(property);
    setInquiryForm({
      name: "",
      email: "",
      phone: "",
      message: `I'm interested in ${property.title}. Please provide more details.`,
    });
    setShowInquiryModal(true);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmittingInquiry(true);
      await publicAPI.submitInquiry({
        ...inquiryForm,
        propertyId: selectedProperty.id,
        propertyTitle: selectedProperty.title,
      });
      toast.success("Inquiry sent successfully! We will contact you soon.");
      setShowInquiryModal(false);
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
      setSelectedProperty(null);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const clearAllFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      type: "",
      listingType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      furnished: "",
      parking: "",
      location: "",
      page: 1,
      limit: 12,
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateURL(clearedFilters);
  }, [updateURL]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Enhanced Search */}
      <div className="bg-gradient-to-br from-[#1A3B4C] via-[#2A4B5C] to-[#3A5B6C] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-white/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-white/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Find Your Dream Property
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover premium properties in prime locations with advanced
              search and filtering
            </p>
          </motion.div>

          {/* Enhanced Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by title, location, or property type..."
                    value={filters.search}
                    onChange={handleSearchInputChange}
                    className="h-14 pl-12 pr-6 text-lg rounded-2xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C] bg-white shadow-sm"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-14 px-8 bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] hover:from-[#0A2B3C] hover:to-[#1A3B4C] text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="h-14 px-6 bg-gray-100 border-white/30 text-black hover:bg-white/30 hover:text-black/90 rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm"
                >
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Quick Filter Chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "For Sale",
                  "For Rent",
                  "Invest",
                  "1 BHK",
                  "2 BHK",
                  "3 BHK",
                  "Furnished",
                ].map((chip) => (
                  <motion.button
                    key={chip}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (chip === "For Sale")
                        handleFilterChange("listingType", "SALE");
                      else if (chip === "For Rent")
                        handleFilterChange("listingType", "RENT");
                      else if (chip === "Invest")
                        handleFilterChange("listingType", "INVEST");
                      else if (chip.includes("BHK"))
                        handleFilterChange("bedrooms", chip.charAt(0));
                      else if (chip === "Furnished")
                        handleFilterChange("furnished", "true");
                    }}
                    className="px-4 py-2 bg-white/70 hover:bg-white text-gray-700 hover:text-[#1A3B4C] rounded-full text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-[#1A3B4C] hover:shadow-md"
                  >
                    {chip}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.form>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label
                    htmlFor="location"
                    className="text-gray-700 font-medium"
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, locality..."
                    value={filters.location}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                    className="mt-2 rounded-xl border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-gray-700 font-medium">
                    Property Type
                  </Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger className="mt-2 rounded-xl border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Invest">Invest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="listingType"
                    className="text-gray-700 font-medium"
                  >
                    Listing Type
                  </Label>
                  <Select
                    value={filters.listingType}
                    onValueChange={(value) =>
                      handleFilterChange("listingType", value)
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-xl border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]">
                      <SelectValue placeholder="All Listings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Listings</SelectItem>
                      <SelectItem value="SALE">For Sale</SelectItem>
                      <SelectItem value="RENT">For Rent</SelectItem>
                      <SelectItem value="INVEST">Invest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="bedrooms"
                    className="text-gray-700 font-medium"
                  >
                    Bedrooms
                  </Label>
                  <Select
                    value={filters.bedrooms}
                    onValueChange={(value) =>
                      handleFilterChange("bedrooms", value)
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-xl border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4 BHK</SelectItem>
                      <SelectItem value="5">5+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="minPrice"
                    className="text-gray-700 font-medium"
                  >
                    Min Price (₹)
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="mt-2 rounded-xl border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="maxPrice"
                    className="text-gray-700 font-medium"
                  >
                    Max Price (₹)
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="mt-2 rounded-xl border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="furnished"
                    className="text-gray-700 font-medium"
                  >
                    Furnished
                  </Label>
                  <Select
                    value={filters.furnished}
                    onValueChange={(value) =>
                      handleFilterChange("furnished", value)
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-xl border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="true">Furnished</SelectItem>
                      <SelectItem value="false">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="parking"
                    className="text-gray-700 font-medium"
                  >
                    Parking
                  </Label>
                  <Select
                    value={filters.parking}
                    onValueChange={(value) =>
                      handleFilterChange("parking", value)
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-xl border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="true">With Parking</SelectItem>
                      <SelectItem value="false">No Parking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400 bg-transparent"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
                <div className="text-sm text-gray-600">
                  {totalProperties} properties found
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {loading ? "Loading..." : `${totalProperties} Properties Found`}
            </h2>
            <p className="text-gray-600">
              {filters.search && `Results for "${filters.search}"`}
              {filters.location && ` in ${filters.location}`}
              {filters.type && ` • ${filters.type}`}
              {filters.listingType &&
                ` • ${
                  filters.listingType === "SALE"
                    ? "For Sale"
                    : filters.listingType === "RENT"
                    ? "For Rent"
                    : filters.listingType === "INVEST"
                    ? "Invest"
                    : filters.listingType.toLowerCase()
                }`}
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <span className="text-sm text-gray-600">View:</span>
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className={
                viewMode === "grid"
                  ? "bg-[#1A3B4C] text-white"
                  : "text-gray-600 hover:text-[#1A3B4C]"
              }
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              className={
                viewMode === "list"
                  ? "bg-[#1A3B4C] text-white"
                  : "text-gray-600 hover:text-[#1A3B4C]"
              }
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden animate-pulse shadow-lg h-full">
                  <div className="aspect-video bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-200 animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3 animate-pulse"></div>
                        <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-16 animate-pulse"></div>
                      </div>
                      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 animate-pulse"></div>
                      <div className="flex space-x-4">
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-20 animate-pulse"></div>
                      </div>
                      <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl w-full animate-pulse mt-6"></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Properties Grid/List */}
        {!loading && properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="h-full"
              >
                <Card
                  className={`overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border-0 h-full ${
                    viewMode === "list" ? "flex flex-row" : "flex flex-col"
                  }`}
                >
                  <div
                    className={`relative group ${
                      viewMode === "list" ? "w-1/3" : ""
                    }`}
                    style={{
                      height: viewMode === "list" ? "auto" : "240px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={property.mainImage || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      width={400}
                      height={300}
                      style={{ objectFit: "cover", height: "100%" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <span className="bg-[#1A3B4C] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {property.listingType}
                      </span>
                      {property.propertyType && (
                        <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                          {property.propertyType}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium text-gray-700 flex items-center">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        {property.images ? property.images.length + 1 : 1}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href={`/properties/${property.slug}`}>
                        <Button
                          size="sm"
                          className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <CardContent
                    className={`${
                      viewMode === "list" ? "flex-1" : "flex-1"
                    } p-6`}
                  >
                    <div className="h-full flex flex-col">
                      {/* Top Section */}
                      <div className="flex-1 space-y-4">
                        {/* Price and Status */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-2xl font-bold text-[#1A3B4C] mb-1">
                              {formatPrice(property.price)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.listingType === "RENT"
                                ? "per month"
                                : ""}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              property.status === "AVAILABLE"
                                ? "bg-green-100 text-green-800"
                                : property.status === "SOLD"
                                ? "bg-blue-100 text-blue-800"
                                : property.status === "RENTED"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {property.status}
                          </span>
                        </div>
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">
                          {property.title}
                        </h3>
                        {/* Location */}
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-[#1A3B4C]" />
                          <span className="text-sm line-clamp-1">
                            {property.address}, {property.city}
                          </span>
                        </div>
                        {/* Property Details */}
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                          {property.bedrooms && property.bedrooms > 0 && (
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1 text-[#1A3B4C]" />
                              <span>
                                {property.bedrooms} Bed
                                {property.bedrooms > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                          {property.bathrooms && property.bathrooms > 0 && (
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1 text-[#1A3B4C]" />
                              <span>
                                {property.bathrooms} Bath
                                {property.bathrooms > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                          {property.area && property.area > 0 && (
                            <div className="flex items-center">
                              <Square className="h-4 w-4 mr-1 text-[#1A3B4C]" />
                              <SimpleAreaDisplay
                                value={property.area}
                                unit="sq_feet"
                              />
                            </div>
                          )}
                        </div>
                        {/* Description */}
                        {property.description && (
                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                            {property.description}
                          </p>
                        )}
                      </div>
                      {/* Action Buttons - Always at bottom */}
                      <div
                        className={`flex ${
                          viewMode === "list"
                            ? "flex-col space-y-2"
                            : "space-x-2"
                        } pt-4 mt-auto`}
                      >
                        <Link
                          href={`/properties/${property.slug || property.id}`}
                          className="flex-1"
                        >
                          <Button className="w-full bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] hover:from-[#0A2B3C] hover:to-[#1A3B4C] text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleInquiry(property)}
                          variant="outline"
                          className="flex-1 border-[#1A3B4C] text-[#1A3B4C] hover:bg-[#1A3B4C] hover:text-white rounded-xl font-semibold transition-all duration-300"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Inquire
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <Home className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Properties Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              We couldn&apos;t find any properties matching your criteria. Try
              adjusting your filters or search terms.
            </p>
            <Button
              onClick={clearAllFilters}
              className="bg-[#1A3B4C] hover:bg-[#0A2B3C] text-white px-8 py-3 rounded-xl"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && properties.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <Button
              onClick={() => handleFilterChange("page", currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:border-[#1A3B4C] hover:text-[#1A3B4C]"
            >
              Previous
            </Button>
            {/* Page Numbers */}
            <div className="flex space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNumber = Math.max(
                  1,
                  Math.min(currentPage - 2 + index, totalPages - 4 + index)
                );
                if (pageNumber > totalPages) return null;

                return (
                  <Button
                    key={pageNumber}
                    onClick={() => handleFilterChange("page", pageNumber)}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    className={
                      currentPage === pageNumber
                        ? "bg-[#1A3B4C] text-white"
                        : "border-gray-300 text-gray-600 hover:border-[#1A3B4C] hover:text-[#1A3B4C]"
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              onClick={() => handleFilterChange("page", currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:border-[#1A3B4C] hover:text-[#1A3B4C]"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Send Inquiry
                </h3>
                <p className="text-gray-600">
                  Get in touch about {selectedProperty.title}
                </p>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={inquiryForm.name}
                    onChange={(e) =>
                      setInquiryForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Your full name"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) =>
                      setInquiryForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="your.email@example.com"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) =>
                      setInquiryForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+91 90909 08081"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="message"
                    className="text-gray-700 font-medium"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={inquiryForm.message}
                    onChange={(e) =>
                      setInquiryForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="I'm interested in this property..."
                    rows="4"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    variant="outline"
                    className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingInquiry}
                    className="flex-1 bg-[#1A3B4C] hover:bg-[#0A2B3C] text-white rounded-xl"
                  >
                    {submittingInquiry ? "Sending..." : "Send Inquiry"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
