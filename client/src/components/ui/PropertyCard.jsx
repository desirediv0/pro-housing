"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
  MessageSquare,
  Heart,
  Share2,
  Phone,
  ExternalLink,
} from "lucide-react";

const PropertyCard = ({
  property,
  variant = "grid", // grid, list, admin, featured
  showActions = false,
  onEdit,
  onDelete,
  onToggleHighlight,
  className = "",
}) => {
  const formatPrice = (price) => {
    // Handle price ranges like "10 CR - 15 CR" or "50 LAKH - 75 LAKH"
    if (typeof price === "string" && price.includes(" - ")) {
      const parts = price.split(" - ");
      const minPart = parts[0].trim();
      const maxPart = parts[1].trim();

      // Parse min and max parts
      const minMatch = minPart.match(/^(\d+(?:\.\d+)?)\s*(CR|LAKH)$/i);
      const maxMatch = maxPart.match(/^(\d+(?:\.\d+)?)\s*(CR|LAKH)$/i);

      if (minMatch && maxMatch) {
        const minAmount = parseFloat(minMatch[1]);
        const maxAmount = parseFloat(maxMatch[1]);
        const unit = minMatch[2].toUpperCase();

        if (!isNaN(minAmount) && !isNaN(maxAmount)) {
          const unitDisplay = unit === "CR" ? "Cr" : "Lakh";
          return `₹${minAmount.toFixed(2)} - ${maxAmount.toFixed(
            2
          )} ${unitDisplay}`;
        }
      }
    }

    // Handle single price in "amount unit" format like "33 CR" or "50 LAKH"
    if (typeof price === "string" && price.includes(" ")) {
      const parts = price.split(" ");
      const amount = parseFloat(parts[0]);
      const unit = parts[1];

      if (!isNaN(amount)) {
        const unitDisplay = unit === "CR" ? "Cr" : "Lakh";
        return `₹${amount.toFixed(2)} ${unitDisplay}`;
      }
    }

    // Fallback for old numeric format
    if (typeof price === "number") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(price);
    }

    return `₹${price}`;
  };

  const getHighlightColor = (highlight) => {
    const colors = {
      FEATURED: "bg-gradient-to-r from-yellow-400 to-yellow-600",
      TRENDING: "bg-gradient-to-r from-red-400 to-red-600",
      NEW: "bg-gradient-to-r from-green-400 to-green-600",
      HOT_DEAL: "bg-gradient-to-r from-orange-400 to-orange-600",
      PREMIUM: "bg-gradient-to-r from-purple-400 to-purple-600",
    };
    return colors[highlight] || "bg-blue-500";
  };

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: "bg-green-100 text-green-800 border-green-200",
      SOLD: "bg-red-100 text-red-800 border-red-200",
      RENTED: "bg-blue-100 text-blue-800 border-blue-200",
      UNDER_NEGOTIATION: "bg-yellow-100 text-yellow-800 border-yellow-200",
      WITHDRAWN: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const renderMapLink = () => {
    if (!property.mapLink) return null;
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => window.open(property.mapLink, "_blank")}
        className="hover:bg-blue-50 hover:text-blue-600"
      >
        <MapPin className="h-3 w-3 mr-1" />
        View Map
      </Button>
    );
  };

  // Grid View (Default for most pages)
  if (variant === "grid" || variant === "featured") {
    return (
      <Card
        className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden ${className}`}
      >
        <div className="relative">
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={
                property.mainImage ||
                property.images?.[0]?.url ||
                "/placeholder-property.jpg"
              }
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
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

            {/* Overlay Actions */}
            {!showActions && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 text-white border-white/30"
                  >
                    <Heart className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="backdrop-blur-sm bg-white/20 text-white border-white/30"
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Title and Location */}
              <div>
                <Link href={`/properties/${property.slug || property.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
                    {property.title}
                  </h3>
                </Link>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="line-clamp-1">
                    {property.location ||
                      `${property.locality ? property.locality + ", " : ""}${
                        property.city
                      }, ${property.state}`}
                  </span>
                </div>
              </div>

              {/* Price and Listing Type */}
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-indigo-600">
                  {formatPrice(property.price)}
                </div>
                <div className="text-sm text-gray-500">
                  {property.listingType === "SALE"
                    ? "For Sale"
                    : property.listingType === "RENT"
                    ? "For Rent"
                    : "For Lease"}
                </div>
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
                    <span>{property.area} sq ft</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{property.views || 0} views</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatTimeAgo(property.createdAt)}</span>
                  </div>
                </div>
                {property.isVerified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  {renderMapLink()}
                  <span className="text-xs text-gray-500">
                    {property.propertyType}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {showActions ? (
                    <>
                      <Link
                        href={`/properties/${property.slug || property.id}`}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                      {onEdit && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(property)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(property.slug || property.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-green-50 hover:text-green-600"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // List View
  if (variant === "list") {
    return (
      <Card
        className={`hover:shadow-lg transition-all duration-200 border-0 shadow-md ${className}`}
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={
                  property.mainImage ||
                  property.images?.[0]?.url ||
                  "/placeholder-property.jpg"
                }
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

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link href={`/properties/${property.slug || property.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
                      {property.title}
                    </h3>
                  </Link>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {property.location ||
                        `${property.city}, ${property.state}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                    {property.bedrooms && <span>{property.bedrooms} Bed</span>}
                    {property.bathrooms && (
                      <span>{property.bathrooms} Bath</span>
                    )}
                    {property.area && <span>{property.area} sq ft</span>}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-indigo-600">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.listingType === "SALE" ? "For Sale" : "For Rent"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {property.views || 0} views
                  </span>
                  <span>{formatTimeAgo(property.createdAt)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {renderMapLink()}
                  {showActions ? (
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Admin compact view
  if (variant === "admin") {
    return (
      <div
        className={`flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow ${className}`}
      >
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          <Image
            src={
              property.mainImage ||
              property.images?.[0]?.url ||
              "/placeholder-property.jpg"
            }
            alt={property.title}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {property.title}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {property.city}, {property.state}
          </p>
          <div className="flex items-center space-x-3 mt-1">
            <div className="flex items-center text-xs text-gray-600">
              <Eye className="h-3 w-3 mr-1" />
              {property.views || 0} views
            </div>
            <div className="text-xs font-medium text-indigo-600">
              {formatPrice(property.price)}
            </div>
          </div>
        </div>
        {property.highlight && (
          <div
            className={`px-2 py-1 text-xs font-medium text-white rounded ${getHighlightColor(
              property.highlight
            )}`}
          >
            {property.highlight}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default PropertyCard;
