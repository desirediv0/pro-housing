"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { publicAPI } from "@/lib/api-functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form";
import SidebarContent from "@/components/ui/sidebar-content";
import { toast } from "react-hot-toast";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Phone,
  Mail,
  User,
  Share2,
  ArrowLeft,
  IndianRupee,
  Building2,
  Car,
  Trees,
  Waves,
  Dumbbell,
  Shield,
  ArrowUpDown,
  Zap,
  MessageCircle,
  Eye,
  ChevronLeft,
  ExternalLink,
  Navigation,
  Home,
  Calendar,
  Ruler,
} from "lucide-react";
import Link from "next/link";
import { AreaConverter } from "@/components/ui/area-converter";

const amenityIcons = {
  furnished: {
    icon: <Home className="h-5 w-5" />,
    label: "Furnished",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  parking: {
    icon: <Car className="h-5 w-5" />,
    label: "Parking",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  balcony: {
    icon: <Building2 className="h-5 w-5" />,
    label: "Balcony",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  garden: {
    icon: <Trees className="h-5 w-5" />,
    label: "Garden",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  swimming: {
    icon: <Waves className="h-5 w-5" />,
    label: "Swimming Pool",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  gym: {
    icon: <Dumbbell className="h-5 w-5" />,
    label: "Gym",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  security: {
    icon: <Shield className="h-5 w-5" />,
    label: "24/7 Security",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  elevator: {
    icon: <ArrowUpDown className="h-5 w-5" />,
    label: "Elevator",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  powerBackup: {
    icon: <Zap className="h-5 w-5" />,
    label: "Power Backup",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
};

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [sidebarContent, setSidebarContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(-1);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (params.id) {
      fetchProperty();
      fetchSidebarContent();
    }
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getProperty(params.id);
      setProperty(response.data.data);
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Property not found");
      router.push("/properties");
    } finally {
      setLoading(false);
    }
  };

  const fetchSidebarContent = async () => {
    try {
      const response = await publicAPI.getSidebarContent();
      const content = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];
      setSidebarContent(content);
    } catch (error) {
      console.error("Error fetching sidebar content:", error);
      setSidebarContent([]);
    }
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
        propertyId: property.id,
        propertyTitle: property.title,
      });

      toast.success("Inquiry sent successfully! We will contact you soon.");
      setShowInquiryForm(false);
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-white to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent via-white to-primary/5 flex flex-col items-center justify-center p-4">
        <div className="text-center glass backdrop-blur-xl rounded-2xl p-8 shadow-premium-lg border border-white/20 max-w-md w-full">
          <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-display text-text-primary mb-2">
            Property Not Found
          </h1>
          <p className="text-text-secondary mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/properties">
            <Button className="gradient-primary hover:shadow-glow text-white px-6 py-2 rounded-xl shadow-premium">
              Browse All Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayImage =
    activeImageIndex === -1
      ? property.mainImage
      : property.images && property.images[activeImageIndex]?.url;

  const activeAmenities = Object.entries(property)
    .filter(
      ([key, value]) =>
        [
          "furnished",
          "parking",
          "balcony",
          "garden",
          "swimming",
          "gym",
          "security",
          "elevator",
          "powerBackup",
        ].includes(key) && value === true
    )
    .map(([key]) => key);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="flex items-center text-gray-700 hover:text-[#5E4CBB] hover:bg-purple-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-[#5E4CBB] hover:border-[#5E4CBB]"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Image Gallery */}
            <div className="space-y-8">
              <Card className="overflow-hidden shadow-xl border-0 bg-white">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-video relative group">
                      <img
                        src={displayImage}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {property.images
                            ? property.images.length + 1
                            : 1}{" "}
                          Photos
                        </span>
                      </div>
                    </div>
                    {property.images && property.images.length > 0 && (
                      <div className="p-6 bg-gray-50">
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                          <button
                            onClick={() => setActiveImageIndex(-1)}
                            className={`flex-shrink-0 aspect-square w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                              activeImageIndex === -1
                                ? "border-[#5E4CBB] shadow-lg scale-105"
                                : "border-gray-200 hover:border-[#5E4CBB]/50"
                            }`}
                          >
                            <img
                              src={property.mainImage}
                              alt="Main"
                              className="w-full h-full object-cover"
                            />
                          </button>
                          {property.images.map((image, index) => (
                            <button
                              key={image.id}
                              onClick={() => setActiveImageIndex(index)}
                              className={`flex-shrink-0 aspect-square w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                                index === activeImageIndex
                                  ? "border-[#5E4CBB] shadow-lg scale-105"
                                  : "border-gray-200 hover:border-[#5E4CBB]/50"
                              }`}
                            >
                              <img
                                src={image.url}
                                alt={`View ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Property Details Card */}
              <Card className="shadow-xl border-0 bg-white">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {/* Title and Price */}
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
                            {property.title}
                          </h1>
                          <div className="flex items-center text-gray-600 text-lg">
                            <MapPin className="h-5 w-5 mr-2 text-[#5E4CBB]" />
                            <span>
                              {property.address}, {property.city},{" "}
                              {property.state} - {property.pincode}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {property.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-[#5E4CBB] to-[#7B68D9] text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/80 text-sm font-medium">
                              Price
                            </p>
                            <div className="flex items-center">
                              <IndianRupee className="h-8 w-8 mr-1" />
                              <span className="text-3xl font-bold">
                                {formatPrice(property.price)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white/80 text-sm font-medium">
                              Type
                            </p>
                            <p className="text-xl font-semibold">
                              {property.listingType}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                        <div className="flex items-center justify-center mb-2">
                          <Bed className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {property.bedrooms && property.bedrooms > 0
                            ? property.bedrooms
                            : "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Bedrooms
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                        <div className="flex items-center justify-center mb-2">
                          <Bath className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {property.bathrooms && property.bathrooms > 0
                            ? property.bathrooms
                            : "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Bathrooms
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                        <div className="flex items-center justify-center mb-2">
                          <Square className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          <AreaConverter
                            value={property.area}
                            originalUnit="sq_feet"
                            className="inline-block"
                          />
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Area (Click to convert)
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                        <div className="flex items-center justify-center mb-2">
                          <Building2 className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          {property.propertyType || "N/A"}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Type
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        About This Property
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                        {property.description}
                      </p>
                    </div>

                    {/* Amenities */}
                    {activeAmenities.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-900">
                          Amenities & Features
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {activeAmenities.map((amenity) => (
                            <div
                              key={amenity}
                              className={`flex items-center gap-3 p-4 ${amenityIcons[amenity]?.bg} border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
                            >
                              <div
                                className={`p-2 bg-white rounded-lg ${amenityIcons[amenity]?.color}`}
                              >
                                {amenityIcons[amenity]?.icon}
                              </div>
                              <span className="font-medium text-gray-800">
                                {amenityIcons[amenity]?.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 text-gray-900">
                        Property Details
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Building2 className="h-4 w-4 text-blue-600 mr-2" />
                            <p className="text-gray-500 text-sm font-medium">
                              Property Type
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 text-lg">
                            {property.propertyType}
                          </p>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Home className="h-4 w-4 text-green-600 mr-2" />
                            <p className="text-gray-500 text-sm font-medium">
                              Listing Type
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 text-lg">
                            {property.listingType}
                          </p>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                            <p className="text-gray-500 text-sm font-medium">
                              Built Year
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 text-lg">
                            {property.builtYear || "N/A"}
                          </p>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <ArrowUpDown className="h-4 w-4 text-orange-600 mr-2" />
                            <p className="text-gray-500 text-sm font-medium">
                              Floor
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 text-lg">
                            {property.floor && property.totalFloors
                              ? `${property.floor} of ${property.totalFloors}`
                              : "N/A"}
                          </p>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Shield className="h-4 w-4 text-red-600 mr-2" />
                            <p className="text-gray-500 text-sm font-medium">
                              Status
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 text-lg">
                            {property.status.replace("_", " ")}
                          </p>
                        </div>
                        <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-indigo-600 mr-2" />
                            <p className="text-gray-500 text-sm font-medium">
                              Listed On
                            </p>
                          </div>
                          <p className="font-bold text-gray-900 text-lg">
                            {formatDate(property.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location & Map Section */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 text-gray-900">
                        Location & Map
                      </h3>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                        {/* Address Details */}
                        <div className="mb-6">
                          <div className="flex items-start space-x-3 mb-4">
                            <MapPin className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Complete Address
                              </h4>
                              <p className="text-gray-700 leading-relaxed">
                                {property.address}
                              </p>
                              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                <span className="bg-white px-3 py-1 rounded-full text-gray-600">
                                  <strong>Locality:</strong> {property.locality}
                                </span>
                                <span className="bg-white px-3 py-1 rounded-full text-gray-600">
                                  <strong>City:</strong> {property.city}
                                </span>
                                <span className="bg-white px-3 py-1 rounded-full text-gray-600">
                                  <strong>State:</strong> {property.state}
                                </span>
                                <span className="bg-white px-3 py-1 rounded-full text-gray-600">
                                  <strong>PIN:</strong> {property.pincode}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Map Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {property.mapLink && (
                            <Button
                              onClick={() =>
                                window.open(property.mapLink, "_blank")
                              }
                              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                            >
                              <MapPin className="h-5 w-5 mr-2" />
                              View on Google Maps
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          )}

                          {property.latitude && property.longitude && (
                            <Button
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`,
                                  "_blank"
                                )
                              }
                              variant="outline"
                              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center py-3 px-6 rounded-xl font-medium transition-all"
                            >
                              <Navigation className="h-5 w-5 mr-2" />
                              Get Directions
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>

                        {/* Coordinates Display */}
                        {property.latitude && property.longitude && (
                          <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                            <h5 className="font-medium text-gray-900 mb-2">
                              GPS Coordinates
                            </h5>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Latitude:</span>
                                <span className="font-mono ml-2 text-gray-800">
                                  {property.latitude}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Longitude:
                                </span>
                                <span className="font-mono ml-2 text-gray-800">
                                  {property.longitude}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Embedded Map */}
                        {property.latitude && property.longitude && (
                          <div className="mt-6">
                            <div className="bg-white p-4 rounded-xl shadow-inner">
                              <div className="aspect-video rounded-lg overflow-hidden">
                                <iframe
                                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${
                                    property.longitude
                                  }!3d${
                                    property.latitude
                                  }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM${Math.abs(
                                    property.latitude
                                  ).toFixed(6)}°${
                                    property.latitude >= 0 ? "N" : "S"
                                  }%20${Math.abs(property.longitude).toFixed(
                                    6
                                  )}°${
                                    property.longitude >= 0 ? "E" : "W"
                                  }!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin`}
                                  width="100%"
                                  height="100%"
                                  style={{ border: 0 }}
                                  allowFullScreen=""
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                  title={`Map showing location of ${property.title}`}
                                  className="rounded-lg"
                                ></iframe>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                📍 Interactive map showing the exact location of
                                this property
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    {(property.contactName ||
                      property.contactPhone ||
                      property.contactEmail) && (
                      <div className="bg-gradient-to-r from-[#5E4CBB]/5 to-[#7B68D9]/5 p-6 rounded-2xl border border-[#5E4CBB]/10">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          {property.contactName && (
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                              <User className="h-5 w-5 text-[#5E4CBB]" />
                              <span className="font-medium text-gray-800">
                                {property.contactName}
                              </span>
                            </div>
                          )}
                          {property.contactPhone && (
                            <a
                              href={`tel:${property.contactPhone}`}
                              className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-blue-50 transition-colors group"
                            >
                              <Phone className="h-5 w-5 text-blue-600" />
                              <span className="font-medium text-blue-600 group-hover:text-blue-700">
                                {property.contactPhone}
                              </span>
                            </a>
                          )}
                          {property.contactEmail && (
                            <a
                              href={`mailto:${property.contactEmail}`}
                              className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-green-50 transition-colors group"
                            >
                              <Mail className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-600 group-hover:text-green-700">
                                {property.contactEmail}
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        onClick={() => setShowInquiryForm(true)}
                        className="flex-1 bg-[#5E4CBB] hover:bg-[#4A3A9B] text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Send Inquiry
                      </Button>
                      {property.contactPhone && (
                        <Button
                          onClick={() =>
                            window.open(`tel:${property.contactPhone}`)
                          }
                          variant="outline"
                          className="flex-1 border-[#5E4CBB] text-[#5E4CBB] hover:bg-[#5E4CBB] hover:text-white py-3 px-6 rounded-xl text-lg font-semibold transition-all"
                        >
                          <Phone className="h-5 w-5 mr-2" />
                          Call Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Regular Sidebar for Large Screens */}
          <div className="hidden lg:block w-96 shrink-0">
            <div className="sticky top-8">
              <SidebarContent content={sidebarContent} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed right-0 top-1/2 -translate-y-1/2 bg-[#5E4CBB] text-white p-3 rounded-l-xl shadow-lg hover:bg-[#4A3A9B] transition-all z-40"
      >
        <ChevronLeft
          className={`h-6 w-6 transition-transform ${
            sidebarOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Mobile Sliding Sidebar */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-30 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-6">
          <SidebarContent content={sidebarContent} />
        </div>
      </div>

      {/* Enhanced Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Send Inquiry
                </h3>
                <p className="text-gray-600">
                  Get in touch about this property
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
                    onClick={() => setShowInquiryForm(false)}
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
