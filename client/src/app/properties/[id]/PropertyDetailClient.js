"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { publicAPI } from "@/lib/api-functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Video,
  Check,
} from "lucide-react";
import Link from "next/link";
import { AreaConverter } from "@/components/ui/area-converter";
import Image from "next/image";
import ReviewSection from "@/components/ui/ReviewSection";

const amenityIcons = {
  furnished: {
    icon: <Home className="h-5 w-5" />,
    label: "Furnished",
    color: "text-[#1A3B4C]",
    bg: "bg-[#1A3B4C]/10",
  },
  parking: {
    icon: <Car className="h-5 w-5" />,
    label: "Parking",
    color: "text-[#1A3B4C]",
    bg: "bg-[#1A3B4C]/10",
  },
  balcony: {
    icon: <Building2 className="h-5 w-5" />,
    label: "Balcony",
    color: "text-[#1A3B4C]",
    bg: "bg-[#1A3B4C]/10",
  },
  garden: {
    icon: <Trees className="h-5 w-5" />,
    label: "Garden",
    color: "text-[#1A3B4C]",
    bg: "bg-[#1A3B4C]/10",
  },
  swimming: {
    icon: <Waves className="h-5 w-5" />,
    label: "Swimming Pool",
    color: "text-[#1A3B4C]",
    bg: "bg-[#1A3B4C]/10",
  },
  gym: {
    icon: <Dumbbell className="h-5 w-5" />,
    label: "Gym",
    color: "text-[#1A3B4C]",
    bg: "bg-[#1A3B4C]/10",
  },
  security: {
    icon: <Shield className="h-5 w-5" />,
    label: "24/7 Security",
    color: "text-[#1A3B4C]",
    bg: "bg-[#1A3B4C]/10",
  },
  elevator: {
    icon: <ArrowUpDown className="h-5 w-5" />,
    label: "Elevator",
    color: "text-[#1A3B4C]",
    bg: "bg-[#1A3B4C]/10",
  },
  powerBackup: {
    icon: <Zap className="h-5 w-5" />,
    label: "Power Backup",
    color: "text-[#1A3B4C]",
    bg: "bg-[#1A3B4C]/10",
  },
};

export default function PropertyDetailClient({ property, sidebarContent }) {
  const router = useRouter();
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

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#1A3B4C]/5 flex flex-col items-center justify-center p-4">
        <div className="text-center bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 max-w-md w-full">
          <Building2 className="h-16 w-16 text-[#1A3B4C] mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The property you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/properties">
            <Button className="bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Browse All Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
          text: `${property.title}\n\n${
            property.description
          }\n\nPrice: ${formatPrice(property.price)}\nLocation: ${
            property.address
          }, ${property.city}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      const shareText = `${property.title}\n\nPrice: ${formatPrice(
        property.price
      )}\nLocation: ${property.address}, ${property.city}\n\n${
        window.location.href
      }`;
      navigator.clipboard.writeText(shareText);
      toast.success("Property details copied to clipboard!");
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

  const customAmenities = (() => {
    try {
      return property.customAmenities
        ? JSON.parse(property.customAmenities)
        : [];
    } catch (error) {
      console.error("Error parsing custom amenities:", error);
      return [];
    }
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="flex items-center text-gray-700 hover:text-[#1A3B4C] hover:bg-[#1A3B4C]/10 px-2 md:px-4"
            >
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Back to Properties</span>
            </Button>
            <div className="flex items-center space-x-2 md:space-x-3">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-[#1A3B4C] hover:border-[#1A3B4C] px-2 md:px-4 bg-transparent"
              >
                <Share2 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 md:px-4 py-4 md:py-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Image Gallery */}
            <div className="space-y-4 md:space-y-8">
              <Card className="overflow-hidden shadow-xl border-0 bg-white md:rounded-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Main Image */}
                    <div className="relative">
                      <div className="w-full h-[300px] md:h-[500px] relative ">
                        <Image
                          src={displayImage || "/placeholder.svg"}
                          alt={property.title}
                          className="rounded-none md:rounded-t-xl p-2"
                          fill
                          priority
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, 80vw"
                        />
                      </div>
                      {/* Photo Count Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 flex items-center shadow-sm">
                          <Eye className="h-4 w-4 mr-1.5" />
                          {property.images
                            ? property.images.length + 1
                            : 1}{" "}
                          Photos
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail Gallery */}
                    {property.images && property.images.length > 0 && (
                      <div className="bg-gray-50 px-4 py-4 md:p-6">
                        <div
                          className="flex gap-2 md:gap-3 overflow-x-auto pb-2"
                          style={{
                            msOverflowStyle: "none",
                            scrollbarWidth: "none",
                            WebkitOverflowScrolling: "touch",
                          }}
                        >
                          <button
                            onClick={() => setActiveImageIndex(-1)}
                            className={`flex-shrink-0 w-[72px] h-[72px] md:w-20 md:h-20 relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              activeImageIndex === -1
                                ? "border-[#1A3B4C] shadow-md"
                                : "border-gray-200 hover:border-[#1A3B4C]/50"
                            }`}
                          >
                            <Image
                              src={property.mainImage || "/placeholder.svg"}
                              alt="Main view"
                              fill
                              sizes="(max-width: 768px) 72px, 80px"
                              className="object-cover"
                            />
                          </button>
                          {property.images.map((image, index) => (
                            <button
                              key={image.id}
                              onClick={() => setActiveImageIndex(index)}
                              className={`flex-shrink-0 w-[72px] h-[72px] md:w-20 md:h-20 relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                index === activeImageIndex
                                  ? "border-[#1A3B4C] shadow-md"
                                  : "border-gray-200 hover:border-[#1A3B4C]/50"
                              }`}
                            >
                              <Image
                                src={image.url || "/placeholder.svg"}
                                alt={`View ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 72px, 80px"
                                className="object-cover"
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
                          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight break-words">
                            {property.title}
                          </h1>
                          <div className="flex items-start text-gray-600 text-sm md:text-lg">
                            <MapPin className="h-5 w-5 mr-2 mt-1 text-[#1A3B4C] flex-shrink-0" />
                            <span className="break-words">
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
                      <div className="bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/80 text-sm font-medium">
                              Price
                            </p>
                            <div className="flex items-center">
                              <IndianRupee className="h-8 w-8 mr-1" />
                              <span className="text-xl md:text-3xl font-bold break-all">
                                {formatPrice(property.price)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-white/80 text-sm font-medium">
                              Type
                            </p>
                            <p className="text-lg md:text-xl font-semibold">
                              {property.listingType}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Stats */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                      {property.bedrooms && property.bedrooms > 0 && (
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                          <div className="flex items-center justify-center mb-2">
                            <Bed className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {property.bedrooms}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Bedrooms
                          </div>
                        </div>
                      )}
                      {property.bathrooms && property.bathrooms > 0 && (
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                          <div className="flex items-center justify-center mb-2">
                            <Bath className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {property.bathrooms}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Bathrooms
                          </div>
                        </div>
                      )}
                      {property.area && property.area > 0 && (
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
                            Area (approx, Click to convert)
                          </div>
                        </div>
                      )}
                      {property.propertyType && (
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                          <div className="flex items-center justify-center mb-2">
                            <Building2 className="h-6 w-6 text-orange-600" />
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {property.propertyType}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Type
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h3 className="text-xl font-bold mb-4 text-gray-900">
                        About This Property
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-lg break-words">
                        {property.description}
                      </p>
                    </div>

                    {/* Amenities */}
                    {(activeAmenities.length > 0 ||
                      customAmenities.length > 0) && (
                      <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-900">
                          Amenities & Features
                        </h3>
                        <div className="space-y-6">
                          {/* Standard Amenities */}
                          {activeAmenities.length > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                                Standard Features
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                {activeAmenities.map((amenity) => (
                                  <div
                                    key={amenity}
                                    className={`flex items-center gap-3 p-4 ${amenityIcons[amenity]?.bg} border border-[#1A3B4C]/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
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
                          {/* Custom Amenities */}
                          {customAmenities.length > 0 && (
                            <div>
                              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                                Additional Features
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                {customAmenities.map((amenity, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#1A3B4C]/5 to-[#2A4B5C]/5 border border-[#1A3B4C]/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                                  >
                                    <div className="p-2 bg-white rounded-lg text-[#1A3B4C]">
                                      <Check className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium text-gray-800">
                                      {amenity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Details */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 text-gray-900">
                        Property Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {property.propertyType && (
                          <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <Building2 className="h-4 w-4 text-[#1A3B4C] mr-2" />
                              <p className="text-gray-500 text-sm font-medium">
                                Property Type
                              </p>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">
                              {property.propertyType}
                            </p>
                          </div>
                        )}
                        {property.listingType && (
                          <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <Home className="h-4 w-4 text-[#1A3B4C] mr-2" />
                              <p className="text-gray-500 text-sm font-medium">
                                Listing Type
                              </p>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">
                              {property.listingType}
                            </p>
                          </div>
                        )}
                        {property.builtYear && (
                          <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <Calendar className="h-4 w-4 text-[#1A3B4C] mr-2" />
                              <p className="text-gray-500 text-sm font-medium">
                                Built Year
                              </p>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">
                              {property.builtYear}
                            </p>
                          </div>
                        )}
                        {property.floor && property.totalFloors && (
                          <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <ArrowUpDown className="h-4 w-4 text-[#1A3B4C] mr-2" />
                              <p className="text-gray-500 text-sm font-medium">
                                Floor
                              </p>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">
                              {property.floor} of {property.totalFloors}
                            </p>
                          </div>
                        )}
                        {property.status && (
                          <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <Shield className="h-4 w-4 text-[#1A3B4C] mr-2" />
                              <p className="text-gray-500 text-sm font-medium">
                                Status
                              </p>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">
                              {property.status.replace("_", " ")}
                            </p>
                          </div>
                        )}
                        {property.createdAt && (
                          <div className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <Calendar className="h-4 w-4 text-[#1A3B4C] mr-2" />
                              <p className="text-gray-500 text-sm font-medium">
                                Listed On
                              </p>
                            </div>
                            <p className="font-bold text-gray-900 text-lg">
                              {formatDate(property.createdAt)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Property Videos */}
                    {property.videos && property.videos.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                          <Video className="h-6 w-6 mr-3 text-[#1A3B4C]" />
                          Property Videos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {property.videos.map((video, index) => (
                            <div
                              key={video.id}
                              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                <video
                                  src={video.url}
                                  controls
                                  className="w-full h-full object-cover"
                                  poster={property.mainImage}
                                >
                                  <source src={video.url} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {video.title || `Property Video ${index + 1}`}
                                </h4>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <span>Property Tour</span>
                                  <button
                                    onClick={() =>
                                      window.open(video.url, "_blank")
                                    }
                                    className="flex items-center text-[#1A3B4C] hover:text-[#0A2B3C] font-medium"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Full Screen
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Location & Map Section */}
                    <div>
                      <h3 className="text-xl font-bold mb-6 text-gray-900">
                        Location & Map
                      </h3>
                      <div className="bg-gradient-to-br from-[#1A3B4C]/10 to-[#2A4B5C]/10 p-6 rounded-2xl border border-[#1A3B4C]/20">
                        {/* Address Details */}
                        <div className="mb-6">
                          <div className="flex items-start space-x-3 mb-4">
                            <MapPin className="h-6 w-6 text-[#1A3B4C] mt-1 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Complete Address
                              </h4>
                              <p className="text-gray-700 leading-relaxed">
                                {property.address}
                              </p>
                              <div className="flex flex-wrap gap-2 md:gap-4 mt-3 text-sm">
                                <span className="bg-white px-2 md:px-3 py-1 rounded-full text-gray-600 text-xs md:text-sm break-words">
                                  <strong>Locality:</strong> {property.locality}
                                </span>
                                <span className="bg-white px-2 md:px-3 py-1 rounded-full text-gray-600 text-xs md:text-sm">
                                  <strong>City:</strong> {property.city}
                                </span>
                                <span className="bg-white px-2 md:px-3 py-1 rounded-full text-gray-600 text-xs md:text-sm">
                                  <strong>State:</strong> {property.state}
                                </span>
                                <span className="bg-white px-2 md:px-3 py-1 rounded-full text-gray-600 text-xs md:text-sm">
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
                              className="bg-[#1A3B4C] hover:bg-[#0A2B3C] text-white flex items-center justify-center py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
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
                              className="border-[#1A3B4C] text-[#1A3B4C] hover:bg-[#1A3B4C] hover:text-white flex items-center justify-center py-3 px-6 rounded-xl font-medium transition-all"
                            >
                              <Navigation className="h-5 w-5 mr-2" />
                              Get Directions
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>

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
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    {(property.contactName ||
                      property.contactPhone ||
                      property.contactEmail) && (
                      <div className="bg-gradient-to-r from-[#1A3B4C]/5 to-[#2A4B5C]/5 p-6 rounded-2xl border border-[#1A3B4C]/10">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          {property.contactName && (
                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
                              <User className="h-6 w-6 text-[#1A3B4C]" />
                              <span className="font-semibold text-gray-800 text-lg">
                                {property.contactName}
                              </span>
                            </div>
                          )}
                          {property.contactPhone && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Do you want to call ${property.contactPhone}?`
                                  )
                                ) {
                                  window.open(`tel:${property.contactPhone}`);
                                }
                              }}
                              className="flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-[#1A3B4C]/10 transition-colors group w-full text-left"
                            >
                              <Phone className="h-6 w-6 text-[#1A3B4C]" />
                              <span className="font-semibold text-[#1A3B4C] group-hover:text-[#0A2B3C] text-lg">
                                {property.contactPhone}
                              </span>
                            </button>
                          )}
                          {property.contactEmail && (
                            <a
                              href={`mailto:${property.contactEmail}`}
                              className="flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-[#1A3B4C]/10 transition-colors group"
                            >
                              <Mail className="h-6 w-6 text-[#1A3B4C]" />
                              <span className="font-semibold text-[#1A3B4C] group-hover:text-[#0A2B3C] text-lg">
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
                        className="flex-1 bg-[#1A3B4C] hover:bg-[#0A2B3C] text-white py-3 px-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Send Inquiry
                      </Button>
                      {property.contactPhone && (
                        <div className="flex-1 flex gap-2">
                          <Button
                            onClick={() => {
                              if (
                                confirm(
                                  `Do you want to call ${property.contactPhone}?`
                                )
                              ) {
                                window.open(`tel:${property.contactPhone}`);
                              }
                            }}
                            variant="outline"
                            className="flex-1 border-[#1A3B4C] text-[#1A3B4C] hover:bg-[#1A3B4C] hover:text-white py-3 px-6 rounded-xl text-lg font-semibold transition-all"
                          >
                            <Phone className="h-5 w-5 mr-2" />
                            Call Now
                          </Button>
                          <Button
                            onClick={() => {
                              const whatsappMessage = `Hi! I'm interested in this property:

*${property.title}*

📍 *Location:* ${property.address}, ${property.city}

💰 *Price:* ${formatPrice(property.price)}

🏠 *Type:* ${property.propertyType} for ${property.listingType}

${property.bedrooms ? `🛏️ *Bedrooms:* ${property.bedrooms}` : ""}

        ${property.area ? `📐 *Area:* ~${property.area} sq ft` : ""}

🔗 *View Details:* ${window.location.href}

Please share more details about this property.`;
                              window.open(
                                `https://wa.me/${property.contactPhone.replace(
                                  /[^\d]/g,
                                  ""
                                )}?text=${encodeURIComponent(whatsappMessage)}`,
                                "_blank"
                              );
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                          >
                            <MessageCircle className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <ReviewSection
                propertyId={property.id}
                propertyTitle={property.title}
              />
            </div>
          </div>

          {/* Regular Sidebar for Large Screens */}
          <div className="hidden lg:block w-96 shrink-0">
            <div className="sticky top-24">
              <SidebarContent
                content={sidebarContent}
                currentProperty={property}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed right-0 top-1/2 -translate-y-1/2 bg-[#1A3B4C] text-white p-3 rounded-l-xl shadow-lg hover:bg-[#0A2B3C] transition-all z-40"
      >
        <ChevronLeft
          className={`h-6 w-6 transition-transform ${
            sidebarOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Mobile Sliding Sidebar */}
      <div
        className={`lg:hidden fixed top-20 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-30 ${
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
                    Phone *
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
                    required
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
                    onClick={() => setShowInquiryForm(false)}
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
