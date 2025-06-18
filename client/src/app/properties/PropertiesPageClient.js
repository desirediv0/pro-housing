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

  // Search filters
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
      page: parseInt(searchParams?.page) || 1,
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
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Custom Select component
  const Select = ({ value, onValueChange, className, children }) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5E4CBB] focus:border-transparent bg-white text-gray-900 ${className}`}
    >
      {children}
    </select>
  );

  const SelectItem = ({ value, children }) => (
    <option value={value}>{children}</option>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Dream Property
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover premium properties for sale and rent. Browse through our
              curated collection of homes, apartments, and commercial spaces.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by title, location, or property type..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  className="h-14 text-lg rounded-xl border-gray-300 focus:border-[#5E4CBB] focus:ring-[#5E4CBB]"
                />
              </div>
              <Button
                type="submit"
                className="h-14 px-8 bg-[#5E4CBB] hover:bg-[#4A3A9B] text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
              <Button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-14 px-6 border-[#5E4CBB] text-[#5E4CBB] hover:bg-[#5E4CBB] hover:text-white rounded-xl text-lg font-semibold transition-all"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>
          </form>

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
                    className="mt-2 rounded-xl border-gray-300 focus:border-[#5E4CBB] focus:ring-[#5E4CBB]"
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="text-gray-700 font-medium">
                    Property Type
                  </Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => handleFilterChange("type", value)}
                    className="mt-2"
                  >
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Plot">Plot</SelectItem>
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
                    className="mt-2"
                  >
                    <SelectItem value="">All Listings</SelectItem>
                    <SelectItem value="SALE">For Sale</SelectItem>
                    <SelectItem value="RENT">For Rent</SelectItem>
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
                    className="mt-2"
                  >
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4 BHK</SelectItem>
                    <SelectItem value="5">5+ BHK</SelectItem>
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
                    className="mt-2 rounded-xl border-gray-300 focus:border-[#5E4CBB] focus:ring-[#5E4CBB]"
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
                    className="mt-2 rounded-xl border-gray-300 focus:border-[#5E4CBB] focus:ring-[#5E4CBB]"
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
                    className="mt-2"
                  >
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="true">Furnished</SelectItem>
                    <SelectItem value="false">Unfurnished</SelectItem>
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
                    className="mt-2"
                  >
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="true">With Parking</SelectItem>
                    <SelectItem value="false">No Parking</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
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
                ` • For ${filters.listingType.toLowerCase()}`}
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
                  ? "bg-[#5E4CBB] text-white"
                  : "text-gray-600 hover:text-[#5E4CBB]"
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
                  ? "bg-[#5E4CBB] text-white"
                  : "text-gray-600 hover:text-[#5E4CBB]"
              }
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-300"></div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-0 ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                >
                  <div
                    className={`relative group ${
                      viewMode === "list" ? "w-1/3" : "aspect-video"
                    }`}
                  >
                    <Image
                      src={property.mainImage}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      width={400}
                      height={300}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <span className="bg-[#5E4CBB] text-white px-3 py-1 rounded-full text-sm font-semibold">
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
                    className={`${viewMode === "list" ? "flex-1" : ""} p-6`}
                  >
                    <div className="space-y-4">
                      {/* Price and Status */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-2xl font-bold text-[#5E4CBB] mb-1">
                            {formatPrice(property.price)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.listingType === "RENT" ? "per month" : ""}
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
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {property.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-[#5E4CBB]" />
                        <span className="text-sm">
                          {property.address}, {property.city}
                        </span>
                      </div>

                      {/* Property Details */}
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
                            />
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                        {property.description}
                      </p>

                      {/* Action Buttons */}
                      <div
                        className={`flex ${
                          viewMode === "list"
                            ? "flex-col space-y-2"
                            : "space-x-2"
                        } pt-2`}
                      >
                        <Link
                          href={`/properties/${property.slug}`}
                          className="flex-1"
                        >
                          <Button className="w-full bg-[#5E4CBB] hover:bg-[#4A3A9B] text-white rounded-xl">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        <Button
                          onClick={() => handleInquiry(property)}
                          variant="outline"
                          className="flex-1 border-[#5E4CBB] text-[#5E4CBB] hover:bg-[#5E4CBB] hover:text-white rounded-xl"
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
              className="bg-[#5E4CBB] hover:bg-[#4A3A9B] text-white px-8 py-3 rounded-xl"
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
              className="border-gray-300 text-gray-600 hover:border-[#5E4CBB] hover:text-[#5E4CBB]"
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
                        ? "bg-[#5E4CBB] text-white"
                        : "border-gray-300 text-gray-600 hover:border-[#5E4CBB] hover:text-[#5E4CBB]"
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
              className="border-gray-300 text-gray-600 hover:border-[#5E4CBB] hover:text-[#5E4CBB]"
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
                    onClick={() => setShowInquiryModal(false)}
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
