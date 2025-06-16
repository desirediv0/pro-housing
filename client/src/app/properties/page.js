"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { publicAPI } from "@/lib/api-functions";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { SimpleAreaDisplay } from "@/components/ui/area-converter";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
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

  // Search filters
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
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

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: 12,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const response = await publicAPI.getAllProperties(params);

      // Handle API response
      const data = response.data.data || response.data || {};
      setProperties(data.data || data || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalProperties(data.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Watch for URL parameter changes and update filters
  useEffect(() => {
    const newFilters = {
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      type: searchParams.get("type") || "",
      price: searchParams.get("price") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedrooms: searchParams.get("bedrooms") || "",
      bathrooms: searchParams.get("bathrooms") || "",
      furnished: searchParams.get("furnished") || "",
      parking: searchParams.get("parking") || "",
      page: parseInt(searchParams.get("page")) || 1,
      limit: 12,
    };

    setFilters(newFilters);
    setCurrentPage(newFilters.page);
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && key !== "limit") {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const newURL = queryString ? `/properties?${queryString}` : "/properties";
    router.push(newURL, { scroll: false });
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
      page: filterName === "page" ? value : 1, // Reset to page 1 for new searches
    };

    setFilters(newFilters);
    setCurrentPage(newFilters.page);
    updateURL(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters);
  };

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

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      type: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      location: "",
      furnished: "",
      parking: "",
      bathrooms: "",
      page: 1,
      limit: 12,
    };

    setFilters(clearedFilters);
    setCurrentPage(1);
    router.push("/properties");
  };

  const formatPrice = (price) => {
    if (!price) return "Price on Request";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const propertyTypes = [
    { value: "", label: "All Types" },
    { value: "APARTMENT", label: "Apartment" },
    { value: "HOUSE", label: "House" },
    { value: "VILLA", label: "Villa" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "LAND", label: "Land" },
  ];

  // Simple Select component since it's not imported
  const Select = ({ value, onValueChange, className, children }) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={className}
    >
      {children}
    </select>
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 lg:w-[calc(100%-320px)]">
            {/* Hero Search Header */}
            <div className="mb-10">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Find Your
                  <span className="text-[#5E4CBB]"> Perfect Property</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  {totalProperties > 0
                    ? `${totalProperties} properties available`
                    : "Discover thousands of properties with advanced search and filtering options"}
                </p>
              </div>

              {/* Enhanced Search Card */}
              <Card className="shadow-2xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-[#5E4CBB] to-[#7c6bc9] p-1">
                  <CardContent className="bg-white m-0 p-8 rounded-lg">
                    <form onSubmit={handleSearch} className="space-y-6">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[300px] relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-[#5E4CBB] rounded-xl shadow-sm"
                            placeholder="Search by location, property type, or keywords..."
                            value={filters.search}
                            onChange={(e) =>
                              handleFilterChange("search", e.target.value)
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-14 px-6 border-2 border-gray-200 hover:border-[#5E4CBB] hover:bg-[#5E4CBB] hover:text-white rounded-xl transition-all duration-200"
                          onClick={() => setShowFilters(!showFilters)}
                        >
                          <SlidersHorizontal className="h-5 w-5 mr-2" />
                          Advanced Filters
                        </Button>
                        <Button
                          type="submit"
                          className="h-14 gradient-primary  text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300 mt-6 md:mt-0"
                        >
                          <Search className="h-5 w-5 mr-2" />
                          Search Properties
                        </Button>
                      </div>

                      {/* Enhanced Advanced Filters */}
                      {showFilters && (
                        <div className="bg-gray-50 rounded-xl p-6 border-t-4 border-[#5E4CBB]">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Advanced Filters
                            </h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowFilters(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Property Type
                              </label>
                              <Select
                                value={filters.type}
                                onValueChange={(value) =>
                                  handleFilterChange("type", value)
                                }
                                className="h-12 border-2 border-gray-200 focus:border-[#5E4CBB] rounded-lg w-full px-3"
                              >
                                {propertyTypes.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </Select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Min Price
                              </label>
                              <Input
                                placeholder="₹ Min Price"
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) =>
                                  handleFilterChange("minPrice", e.target.value)
                                }
                                className="h-12 border-2 border-gray-200 focus:border-[#5E4CBB] rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Price
                              </label>
                              <Input
                                placeholder="₹ Max Price"
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                  handleFilterChange("maxPrice", e.target.value)
                                }
                                className="h-12 border-2 border-gray-200 focus:border-[#5E4CBB] rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bedrooms
                              </label>
                              <Select
                                value={filters.bedrooms}
                                onValueChange={(value) =>
                                  handleFilterChange("bedrooms", value)
                                }
                                className="h-12 border-2 border-gray-200 focus:border-[#5E4CBB] rounded-lg w-full px-3"
                              >
                                <option value="">Any Bedrooms</option>
                                <option value="1">1 Bedroom</option>
                                <option value="2">2 Bedrooms</option>
                                <option value="3">3 Bedrooms</option>
                                <option value="4">4+ Bedrooms</option>
                              </Select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                              </label>
                              <Input
                                placeholder="Enter location"
                                value={filters.location}
                                onChange={(e) =>
                                  handleFilterChange("location", e.target.value)
                                }
                                className="h-12 border-2 border-gray-200 focus:border-[#5E4CBB] rounded-lg"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={clearAllFilters}
                              className="mr-3 border-2 border-gray-300 hover:border-red-500 hover:text-red-500"
                            >
                              Clear All
                            </Button>
                            <Button
                              type="submit"
                              className="gradient-primary  text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300 mt-6 md:mt-0"
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading
                    ? "Searching Properties..."
                    : `${properties.length} Properties Found`}
                </h2>
                {(filters.type || filters.location || filters.search) && (
                  <p className="text-gray-600 mt-1">
                    {filters.type && `Type: ${filters.type}`}
                    {filters.location && ` • Location: ${filters.location}`}
                    {filters.search && ` • Search: "${filters.search}"`}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "gradient-primary  text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300 mt-6 md:mt-0"
                      : ""
                  }
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "gradient-primary  text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300 mt-6 md:mt-0"
                      : ""
                  }
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
              </div>
            </div>

            {/* Property Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="animate-pulse border-0 shadow-lg rounded-2xl"
                  >
                    <div className="h-56 bg-gray-200 rounded-t-2xl"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Home className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No Properties Found
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We couldn&apos;t find any properties matching your criteria.
                    Try adjusting your search filters or browse all available
                    properties.
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    className="gradient-primary  text-white px-8 py-3 rounded-xl font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-300 mt-6 md:mt-0"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "gap-8 grid grid-cols-1 md:grid-cols-2"
                }
              >
                {properties.map((property) => (
                  <motion.div
                    key={property.id || property._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card className="group overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl h-full">
                      <div className="relative overflow-hidden">
                        {/* Enhanced Image Handling */}
                        {property.mainImage ||
                        (property.images && property.images.length > 0) ? (
                          <Image
                            src={
                              property.mainImage ||
                              property.images[0]?.url ||
                              property.images[0]
                            }
                            alt={property.title || "Property Image"}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "flex";
                            }}
                            width={400}
                            height={400}
                          />
                        ) : null}

                        {/* Fallback Image */}
                        <div
                          className={`w-full h-64 bg-gradient-to-br from-[#5E4CBB]/10 to-[#7c6bc9]/20 flex items-center justify-center ${
                            property.mainImage ||
                            (property.images && property.images.length > 0)
                              ? "hidden"
                              : "flex"
                          }`}
                        >
                          <div className="text-center">
                            <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                              No Image Available
                            </p>
                          </div>
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Property Type Badge */}
                        {(property.propertyType || property.type) && (
                          <span className="absolute top-4 left-4 bg-[#5E4CBB] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                            {property.propertyType || property.type}
                          </span>
                        )}

                        {/* Status Badge */}
                        {property.status && (
                          <span
                            className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${
                              property.status === "AVAILABLE"
                                ? "bg-green-500 text-white"
                                : property.status === "SOLD"
                                ? "bg-blue-500 text-white"
                                : property.status === "RENTED"
                                ? "bg-purple-500 text-white"
                                : property.status === "UNDER_NEGOTIATION"
                                ? "bg-amber-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}
                          >
                            {property.status.replace("_", " ")}
                          </span>
                        )}

                        {/* Quick View Button */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Link href={`/properties/${property.slug}`}>
                            <Button className="w-full bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white font-semibold rounded-xl shadow-lg hover:shadow-xl">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <CardContent className="p-6 flex-grow flex flex-col">
                        {/* Title and Price */}
                        <div className="mb-4">
                          <Link href={`/properties/${property.slug}`}>
                            <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-[#5E4CBB] transition-colors duration-300 cursor-pointer">
                              {property.title || "Property Title"}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-[#5E4CBB]">
                              {property.formattedPrice ||
                                formatPrice(property.price)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {property.listingType}
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="h-5 w-5 mr-2 text-[#5E4CBB] flex-shrink-0" />
                          <span className="text-sm line-clamp-1 font-medium">
                            {property.location ||
                              `${
                                property.locality
                                  ? property.locality + ", "
                                  : ""
                              }${property.city || ""}${
                                property.state ? ", " + property.state : ""
                              }` ||
                              "Location not specified"}
                          </span>
                        </div>

                        {/* Property Features */}
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                          {property.bedrooms && property.bedrooms > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-white rounded-lg text-[#5E4CBB]">
                                <Bed className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-sm text-gray-700">
                                  {property.bedrooms} Bed
                                  {property.bedrooms > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          )}

                          {property.bathrooms && property.bathrooms > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-white rounded-lg text-[#5E4CBB]">
                                <Bath className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-sm text-gray-700">
                                  {property.bathrooms} Bath
                                  {property.bathrooms > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          )}

                          {property.area && property.area > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-white rounded-lg text-[#5E4CBB]">
                                <Square className="h-5 w-5" />
                              </div>
                              <div>
                                <SimpleAreaDisplay
                                  value={property.area}
                                  unit="sq_feet"
                                  className="font-medium text-sm text-gray-700"
                                />
                              </div>
                            </div>
                          )}

                          {property.propertyType && (
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-white rounded-lg text-[#5E4CBB]">
                                <Home className="h-5 w-5" />
                              </div>
                              <div>
                                <span className="font-medium text-sm text-gray-700">
                                  {property.propertyType}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto flex gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInquiry(property)}
                            className="flex-1 border-2 border-[#5E4CBB] text-[#5E4CBB] hover:bg-[#5E4CBB] hover:text-white rounded-xl transition-all duration-200 font-medium"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Inquire
                          </Button>
                          <Link
                            href={`/properties/${property.slug}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-[#5E4CBB] hover:bg-[#4a3d99] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button
                  variant="outline"
                  disabled={filters.page === 1}
                  onClick={() => handleFilterChange("page", filters.page - 1)}
                  className="px-6 py-3 border-2 border-gray-200 hover:border-[#5E4CBB] hover:bg-[#5E4CBB] hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, filters.page - 2) + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          filters.page === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleFilterChange("page", pageNum)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                          filters.page === pageNum
                            ? "bg-[#5E4CBB] hover:bg-[#4a3d99] text-white shadow-lg"
                            : "border-2 border-gray-200 hover:border-[#5E4CBB] hover:bg-[#5E4CBB] hover:text-white"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  disabled={filters.page === totalPages}
                  onClick={() => handleFilterChange("page", filters.page + 1)}
                  className="px-6 py-3 border-2 border-gray-200 hover:border-[#5E4CBB] hover:bg-[#5E4CBB] hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
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
                  Get in touch about{" "}
                  <span className="font-semibold text-[#5E4CBB]">
                    {selectedProperty.title}
                  </span>
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
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#5E4CBB] focus:ring-[#5E4CBB]"
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
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#5E4CBB] focus:ring-[#5E4CBB]"
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
                    placeholder="+91 98765 43210"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#5E4CBB] focus:ring-[#5E4CBB]"
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
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#5E4CBB] focus:ring-[#5E4CBB]"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowInquiryModal(false);
                      setSelectedProperty(null);
                      setInquiryForm({
                        name: "",
                        email: "",
                        phone: "",
                        message: "",
                      });
                    }}
                    variant="outline"
                    className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingInquiry}
                    className="flex-1 bg-[#5E4CBB] hover:bg-[#4A3A9B] text-white rounded-xl"
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
