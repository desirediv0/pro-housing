"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Bed,
  Bath,
  Square,
  TrendingUp,
  CheckCircle,
  Clock,
  RefreshCw,
  Grid3X3,
  List,
  Image as ImageIcon,
  Video,
  Star,
  Home,
  IndianRupee,
} from "lucide-react";
import { adminAPI } from "@/utils/adminAPI";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import SearchFilter from "@/components/ui/search-filter";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("grid");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    propertyType: "",
    listingType: "",
    highlight: "",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    rented: 0,
  });

  const propertyTypes = [
    { value: "", label: "All Types" },
    { value: "APARTMENT", label: "Apartment" },
    { value: "HOUSE", label: "House" },
    { value: "VILLA", label: "Villa" },
    { value: "DUPLEX", label: "Duplex" },
    { value: "PENTHOUSE", label: "Penthouse" },
    { value: "STUDIO", label: "Studio" },
    { value: "PLOT", label: "Plot" },
    { value: "FARMHOUSE", label: "Farmhouse" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "WAREHOUSE", label: "Warehouse" },
    { value: "OFFICE", label: "Office" },
    { value: "SHOP", label: "Shop" },
    { value: "SHOWROOM", label: "Showroom" },
    { value: "MALL", label: "Mall" },
    { value: "RESTAURANT", label: "Restaurant" },
    { value: "HOTEL", label: "Hotel" },
    { value: "HOSPITAL", label: "Hospital" },
    { value: "SCHOOL", label: "School" },
    { value: "PG", label: "PG" },
    { value: "HOSTEL", label: "Hostel" },
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "AVAILABLE", label: "Available" },
    { value: "SOLD", label: "Sold" },
    { value: "RENTED", label: "Rented" },
    { value: "UNDER_NEGOTIATION", label: "Under Negotiation" },
    { value: "WITHDRAWN", label: "Withdrawn" },
  ];

  const listingTypes = [
    { value: "", label: "All Listings" },
    { value: "SALE", label: "For Sale" },
    { value: "RENT", label: "For Rent" },
    { value: "LEASE", label: "For Lease" },
  ];

  const highlightOptions = [
    { value: "", label: "All Highlights" },
    { value: "FEATURED", label: "Featured" },
    { value: "NEW", label: "New" },
    { value: "TRENDING", label: "Trending" },
    { value: "HOT_DEAL", label: "Hot Deal" },
    { value: "PREMIUM", label: "Premium" },
  ];

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log("Fetching properties with filters:", filters);

      const response = await adminAPI.getProperties(filters);
      console.log("API Response:", response);

      // Handle the response structure properly
      let data;
      if (response.data && response.data.data) {
        data = response.data.data;
      } else if (response.data) {
        data = response.data;
      } else {
        data = response;
      }

      console.log("Parsed data:", data);

      const propertiesList = data.properties || data || [];
      const paginationData = data.pagination || {
        total: propertiesList.length,
        pages: 1,
        currentPage: 1,
        limit: propertiesList.length,
      };

      setProperties(propertiesList);
      setPagination(paginationData);

      // Calculate stats from the actual data
      const total = propertiesList.length;
      const available = propertiesList.filter(
        (p) => p.status === "AVAILABLE"
      ).length;
      const sold = propertiesList.filter((p) => p.status === "SOLD").length;
      const rented = propertiesList.filter((p) => p.status === "RENTED").length;

      setStats({ total, available, sold, rented });

      console.log("Properties loaded:", propertiesList.length);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties. Please try again.", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
        },
      });
      // Set empty state on error
      setProperties([]);
      setPagination({ total: 0, pages: 1, currentPage: 1 });
      setStats({ total: 0, available: 0, sold: 0, rented: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      try {
        await adminAPI.deleteProperty(id);
        toast.success("Property deleted successfully", {
          icon: "🗑️",
          style: {
            borderRadius: "10px",
            background: "#10B981",
            color: "#fff",
          },
        });
        fetchProperties();
      } catch (error) {
        console.error("Error deleting property:", error);
        toast.error("Failed to delete property", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
          },
        });
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "SOLD":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "RENTED":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "UNDER_NEGOTIATION":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "WITHDRAWN":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getHighlightColor = (highlight) => {
    switch (highlight) {
      case "FEATURED":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "TRENDING":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "NEW":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "HOT_DEAL":
        return "bg-gradient-to-r from-orange-500 to-orange-600";
      case "PREMIUM":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const PropertyCard = ({ property }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden rounded-2xl">
      <div className="relative aspect-video">
        <Image
          src={property.mainImage || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Highlight Badge */}
        {property.highlight && (
          <div
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-full ${getHighlightColor(
              property.highlight
            )} shadow-lg backdrop-blur-sm`}
          >
            <Star className="h-3 w-3 inline mr-1" />
            {property.highlight}
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
            property.status
          )} shadow-lg backdrop-blur-sm`}
        >
          {property.status.replace("_", " ")}
        </div>

        {/* Stats Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-white text-sm">
          {property.images && property.images.length > 0 && (
            <div className="flex items-center bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <ImageIcon className="h-3 w-3 mr-1" />
              <span className="font-medium">{property.images.length + 1}</span>
            </div>
          )}
          {property.videos && property.videos.length > 0 && (
            <div className="flex items-center bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <Video className="h-3 w-3 mr-1" />
              <span className="font-medium">{property.videos.length}</span>
            </div>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-2">
            <Link href={`/properties/${property.slug}`} target="_blank">
              <Button
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm shadow-lg border-0 rounded-full h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/admin/properties/${property.id}/edit`}>
              <Button
                size="sm"
                className="bg-blue-500/90 hover:bg-blue-600 text-white backdrop-blur-sm shadow-lg border-0 rounded-full h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title and Price */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(property.price)}
              </div>
              {property.listingType && (
                <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                  {property.listingType}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {(property.locality || property.city || property.state) && (
            <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
              <span className="text-sm truncate font-medium">
                {property.locality && `${property.locality}, `}
                {property.city && `${property.city}`}
                {property.state && `, ${property.state}`}
              </span>
            </div>
          )}

          {/* Property Details */}
          {(property.bedrooms > 0 ||
            property.bathrooms > 0 ||
            property.area > 0) && (
            <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
              {property.bedrooms && property.bedrooms > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Bed className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {property.bedrooms}
                  </div>
                  <div className="text-xs text-gray-500">Bedrooms</div>
                </div>
              )}
              {property.bathrooms && property.bathrooms > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Bath className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {property.bathrooms}
                  </div>
                  <div className="text-xs text-gray-500">Bathrooms</div>
                </div>
              )}
              {property.area && property.area > 0 && (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Square className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {property.area}
                  </div>
                  <div className="text-xs text-gray-500">Sq Ft (approx)</div>
                </div>
              )}
            </div>
          )}

          {/* Additional Info */}
          {(property.propertyType ||
            (property.views && property.views > 0) ||
            property.createdAt) && (
            <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-4">
                {property.propertyType && (
                  <div className="flex items-center text-gray-600">
                    <Home className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                )}
                {property.views && property.views > 0 && (
                  <div className="flex items-center text-gray-600">
                    <Eye className="h-4 w-4 mr-1 text-green-500" />
                    <span className="font-medium">{property.views} views</span>
                  </div>
                )}
              </div>
              {property.createdAt && (
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-xs">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Link href={`/properties/${property.slug}`} target="_blank">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-lg"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </Link>
              <Link href={`/admin/properties/${property.id}/edit`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50 rounded-lg"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(property.id)}
              className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PropertyListItem = ({ property }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-center space-x-6">
          <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={property.mainImage || "/placeholder-property.jpg"}
              alt={property.title}
              fill
              className="object-cover"
            />
            {property.highlight && (
              <div
                className={`absolute top-2 left-2 px-2 py-1 text-xs font-bold text-white rounded-full ${getHighlightColor(
                  property.highlight
                )}`}
              >
                {property.highlight}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {property.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {property.locality && `${property.locality}, `}
                    {property.city}, {property.state}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 ml-4">
                <div
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    property.status
                  )}`}
                >
                  {property.status.replace("_", " ")}
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  <span>{property.listingType}</span>
                </div>
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
                    <span>~{property.area} sq ft</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Link href={`/properties/${property.slug}`} target="_blank">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/admin/properties/${property.id}/edit`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(property.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Property Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all your property listings and track performance
          </p>
        </div>
        <Link href="/admin/properties/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Total Properties
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.total}
                </p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Available</p>
                <p className="text-3xl font-bold text-green-900">
                  {stats.available}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Sold</p>
                <p className="text-3xl font-bold text-purple-900">
                  {stats.sold}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Rented</p>
                <p className="text-3xl font-bold text-orange-900">
                  {stats.rented}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0 bg-white">
        <CardContent className="p-6">
          <SearchFilter
            filters={filters}
            onFiltersChange={setFilters}
            searchPlaceholder="Search properties..."
            statusOptions={statusOptions.filter((opt) => opt.value !== "")}
            categoryOptions={propertyTypes.filter((opt) => opt.value !== "")}
            priceRangeOptions={[
              { value: "0-500000", label: "Under ₹5L" },
              { value: "500000-1000000", label: "₹5L - ₹10L" },
              { value: "1000000-5000000", label: "₹10L - ₹50L" },
              { value: "5000000-10000000", label: "₹50L - ₹1Cr" },
              { value: "10000000+", label: "Above ₹1Cr" },
            ]}
            debounceMs={500}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setViewType("grid")}
                variant={viewType === "grid" ? "default" : "outline"}
                size="sm"
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                onClick={() => setViewType("list")}
                variant={viewType === "list" ? "default" : "outline"}
                size="sm"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
            <Button onClick={fetchProperties} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      {properties.length === 0 ? (
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-12 text-center">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-6">
              {Object.values(filters).some((f) => f)
                ? "No properties match your current filters. Try adjusting the filters or clear them to see all properties."
                : "You haven't added any properties yet. Start by creating your first property listing."}
            </p>
            <Link href="/admin/properties/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewType === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {properties.map((property) =>
            viewType === "grid" ? (
              <PropertyCard key={property.id} property={property} />
            ) : (
              <PropertyListItem key={property.id} property={property} />
            )
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(pagination.currentPage - 1) * filters.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * filters.limit,
                  pagination.total
                )}{" "}
                of {pagination.total} properties
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() =>
                    handleFilterChange("page", Math.max(1, filters.page - 1))
                  }
                  disabled={filters.page <= 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.pages}
                </span>
                <Button
                  onClick={() =>
                    handleFilterChange(
                      "page",
                      Math.min(pagination.pages, filters.page + 1)
                    )
                  }
                  disabled={filters.page >= pagination.pages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
