"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import {
  Building,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Filter,
  Bed,
  Bath,
  Square,
  TrendingUp,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { adminAPI } from "@/lib/api-functions";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import useAdminProtection from "@/hooks/useAdminProtection";
import PropertyCard from "@/components/ui/PropertyCard";

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
    { value: "PLOT", label: "Plot" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "WAREHOUSE", label: "Warehouse" },
    { value: "OFFICE", label: "Office" },
    { value: "SHOP", label: "Shop" },
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

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllProperties(filters);
      const data = response.data.data;

      setProperties(data.properties || []);
      setPagination(data.pagination || {});

      // Calculate stats
      const total = data.properties?.length || 0;
      const available =
        data.properties?.filter((p) => p.status === "AVAILABLE").length || 0;
      const sold =
        data.properties?.filter((p) => p.status === "SOLD").length || 0;
      const rented =
        data.properties?.filter((p) => p.status === "RENTED").length || 0;

      setStats({ total, available, sold, rented });
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
        },
      });
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
        return "bg-green-100 text-green-800 border-green-200";
      case "SOLD":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "RENTED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "UNDER_NEGOTIATION":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "WITHDRAWN":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getHighlightColor = (highlight) => {
    switch (highlight) {
      case "FEATURED":
        return "bg-gradient-to-r from-[#5e4cbb] to-purple-600";
      case "TRENDING":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "NEW":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "HOT_DEAL":
        return "bg-gradient-to-r from-orange-500 to-orange-600";
      case "PREMIUM":
        return "bg-gradient-to-r from-[#5e4cbb] to-indigo-600";
      case "EXCLUSIVE":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const PropertyListItem = ({ property }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
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
                className={`absolute top-2 left-2 px-1 py-0.5 text-xs font-bold text-white rounded ${getHighlightColor(
                  property.highlight
                )}`}
              >
                {property.highlight}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {property.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {property.address}, {property.city}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <div
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    property.status
                  )}`}
                >
                  {property.status.replace("_", " ")}
                </div>
                <div className="text-lg font-bold text-indigo-600">
                  {formatPrice(property.price)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="font-medium">{property.propertyType}</span>
                <span>•</span>
                <span>
                  {property.listingType === "SALE"
                    ? "For Sale"
                    : property.listingType === "RENT"
                    ? "For Rent"
                    : "For Lease"}
                </span>
                {property.bedrooms && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <Bed className="h-3 w-3 mr-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                  </>
                )}
                {property.bathrooms && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <Bath className="h-3 w-3 mr-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                  </>
                )}
                {property.area && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <Square className="h-3 w-3 mr-1" />
                      <span>{property.area} sq ft</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Link href={`/properties/${property.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/admin/properties/${property.id}/edit`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(property.id)}
                  className="hover:bg-red-50 hover:text-red-600"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Properties Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your property listings and track performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={fetchProperties}
            variant="outline"
            size="sm"
            className="hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/admin/properties/create">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Properties
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <Building className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.available}
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sold</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.sold}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rented</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.rented}
                </p>
              </div>
              <Clock className="h-12 w-12 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-600" />
              Filters & Search
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewType === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("grid")}
                className="hover:bg-indigo-50"
              >
                Grid View
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("list")}
                className="hover:bg-indigo-50"
              >
                List View
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-6 gap-4"
          >
            <div className="md:col-span-2">
              <Input
                placeholder="Search properties by title, location..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.propertyType}
              onChange={(e) =>
                handleFilterChange("propertyType", e.target.value)
              }
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {propertyTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.listingType}
              onChange={(e) =>
                handleFilterChange("listingType", e.target.value)
              }
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {listingTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Properties Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <CardContent className="p-6 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="p-12 text-center">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first property listing.
            </p>
            <Link href="/admin/properties/create">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
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
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {properties.map((property) =>
            viewType === "grid" ? (
              <PropertyCard
                key={property.id}
                property={property}
                variant="admin"
                showActions={true}
                onDelete={handleDelete}
              />
            ) : (
              <PropertyListItem key={property.id} property={property} />
            )
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={pagination.currentPage === 1}
            onClick={() =>
              handleFilterChange("page", pagination.currentPage - 1)
            }
          >
            Previous
          </Button>
          {[...Array(pagination.pages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={pagination.currentPage === i + 1 ? "default" : "outline"}
              onClick={() => handleFilterChange("page", i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={pagination.currentPage === pagination.pages}
            onClick={() =>
              handleFilterChange("page", pagination.currentPage + 1)
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
