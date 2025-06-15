"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, Select } from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import {
  ArrowLeft,
  Save,
  MapPin,
  Home,
  DollarSign,
  Image as ImageIcon,
  Users,
  Settings,
  Phone,
  Car,
  Building2,
  Trees,
  Waves,
  Dumbbell,
  Shield,
  Zap,
  Sofa,
  Building,
  Eye,
  Loader2,
} from "lucide-react";
import { adminAPI } from "@/utils/adminAPI";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import LocationPicker from "@/components/ui/LocationPicker";

export default function EditProperty() {
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    description: "",
    price: "",
    propertyType: "",
    listingType: "",

    // Property Details
    bedrooms: "",
    bathrooms: "",
    area: "",
    builtYear: "",
    floor: "",
    totalFloors: "",

    // Location
    address: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    mapLink: "", // Google Maps link

    // Amenities (Boolean fields)
    furnished: false,
    parking: false,
    balcony: false,
    garden: false,
    swimming: false,
    gym: false,
    security: false,
    elevator: false,
    powerBackup: false,

    // Status & Highlights
    status: "AVAILABLE",
    highlight: "",
    isActive: true,
    isVerified: false,

    // Contact Information
    contactName: "",
    contactPhone: "",
    contactEmail: "",

    // Expiry
    expiresAt: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [videosToDelete, setVideosToDelete] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id;

  const propertyTypes = [
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

  const listingTypes = [
    { value: "SALE", label: "For Sale" },
    { value: "RENT", label: "For Rent" },
    { value: "LEASE", label: "For Lease" },
  ];

  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "SOLD", label: "Sold" },
    { value: "RENTED", label: "Rented" },
    { value: "UNDER_NEGOTIATION", label: "Under Negotiation" },
    { value: "WITHDRAWN", label: "Withdrawn" },
  ];

  const highlightOptions = [
    { value: "", label: "No Highlight" },
    { value: "NEW", label: "New" },
    { value: "TRENDING", label: "Trending" },
    { value: "FEATURED", label: "Featured" },
    { value: "HOT_DEAL", label: "Hot Deal" },
    { value: "PREMIUM", label: "Premium" },
  ];

  // Fetch property data on component mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setPageLoading(true);
        console.log("Fetching property with ID:", propertyId);
        const property = await adminAPI.getPropertyById(propertyId);
        console.log("Fetched property:", property);

        if (property) {
          // Format date for input field
          const formatDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
          };

          setFormData({
            title: property.title || "",
            description: property.description || "",
            price: property.price ? property.price.toString() : "",
            propertyType: property.propertyType || "",
            listingType: property.listingType || "",
            bedrooms: property.bedrooms ? property.bedrooms.toString() : "",
            bathrooms: property.bathrooms ? property.bathrooms.toString() : "",
            area: property.area ? property.area.toString() : "",
            builtYear: property.builtYear ? property.builtYear.toString() : "",
            floor: property.floor ? property.floor.toString() : "",
            totalFloors: property.totalFloors
              ? property.totalFloors.toString()
              : "",
            address: property.address || "",
            locality: property.locality || "",
            city: property.city || "",
            state: property.state || "",
            pincode: property.pincode || "",
            latitude: property.latitude ? property.latitude.toString() : "",
            longitude: property.longitude ? property.longitude.toString() : "",
            mapLink: property.mapLink || "",
            furnished: Boolean(property.furnished),
            parking: Boolean(property.parking),
            balcony: Boolean(property.balcony),
            garden: Boolean(property.garden),
            swimming: Boolean(property.swimming),
            gym: Boolean(property.gym),
            security: Boolean(property.security),
            elevator: Boolean(property.elevator),
            powerBackup: Boolean(property.powerBackup),
            status: property.status || "AVAILABLE",
            highlight: property.highlight || "",
            isActive: Boolean(property.isActive),
            isVerified: Boolean(property.isVerified),
            contactName: property.contactName || "",
            contactPhone: property.contactPhone || "",
            contactEmail: property.contactEmail || "",
            expiresAt: formatDate(property.expiresAt),
          });

          // Set existing media
          setExistingImages(property.images || []);
          setExistingVideos(property.videos || []);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
        router.push("/admin/properties");
      } finally {
        setPageLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLocationChange = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      address: locationData.address,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      mapLink: locationData.mapLink,
    }));
  };

  const handleRemoveExistingImage = (imageToRemove) => {
    setExistingImages((prev) =>
      prev.filter((img) => img.id !== imageToRemove.id)
    );
    setImagesToDelete((prev) => [...prev, imageToRemove]);
  };

  const handleRemoveExistingVideo = (videoToRemove) => {
    setExistingVideos((prev) =>
      prev.filter((vid) => vid.id !== videoToRemove.id)
    );
    setVideosToDelete((prev) => [...prev, videoToRemove]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== "" &&
          formData[key] !== null &&
          formData[key] !== undefined
        ) {
          submitData.append(key, formData[key]);
        }
      });

      // Add images/videos to delete
      if (imagesToDelete.length > 0) {
        submitData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }
      if (videosToDelete.length > 0) {
        submitData.append("videosToDelete", JSON.stringify(videosToDelete));
      }

      // Handle new image files
      const imageFiles = newFiles.filter(
        (fileItem) => fileItem.type === "image" && fileItem.file
      );
      const videoFiles = newFiles.filter(
        (fileItem) => fileItem.type === "video" && fileItem.file
      );

      // Add new images
      imageFiles.forEach((fileItem) => {
        submitData.append("images", fileItem.file);
      });

      // Add new videos
      videoFiles.forEach((fileItem) => {
        submitData.append("videos", fileItem.file);
      });

      await adminAPI.updateProperty(propertyId, submitData);
      toast.success("Property updated successfully!", {
        icon: "🏡",
        style: {
          borderRadius: "10px",
          background: "#10B981",
          color: "#fff",
        },
      });
      router.push("/admin/properties");
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error(
        error.response?.data?.message || "Failed to update property",
        {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#EF4444",
            color: "#fff",
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/properties">
          <Button variant="outline" size="sm" className="hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Edit Property
          </h1>
          <p className="text-gray-600 mt-1">
            Update property details and media
          </p>
        </div>
        <Link href={`/property/${propertyId}`}>
          <Button variant="outline" size="sm" className="hover:bg-gray-50">
            <Eye className="h-4 w-4 mr-2" />
            View Property
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-gray-900">
              <Home className="h-5 w-5 mr-2 text-indigo-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Property Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Beautiful 3BHK Apartment with Garden View"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="propertyType"
                  className="text-sm font-medium text-gray-700"
                >
                  Property Type *
                </Label>
                <Select
                  value={formData.propertyType}
                  onChange={(e) => handleChange(e)}
                  name="propertyType"
                  className="mt-1"
                  required
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="listingType"
                  className="text-sm font-medium text-gray-700"
                >
                  Listing Type *
                </Label>
                <Select
                  value={formData.listingType}
                  onChange={(e) => handleChange(e)}
                  name="listingType"
                  className="mt-1"
                  required
                >
                  <option value="">Select Listing Type</option>
                  {listingTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-700"
                >
                  Price (₹) *
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="5000000"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="area"
                  className="text-sm font-medium text-gray-700"
                >
                  Area (sq ft)
                </Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="1200"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the property, its features, and surrounding area..."
                rows={4}
                className="mt-1"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-gray-900">
              <Settings className="h-5 w-5 mr-2 text-blue-600" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <Label
                  htmlFor="bedrooms"
                  className="text-sm font-medium text-gray-700"
                >
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="3"
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="bathrooms"
                  className="text-sm font-medium text-gray-700"
                >
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="2"
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="builtYear"
                  className="text-sm font-medium text-gray-700"
                >
                  Built Year
                </Label>
                <Input
                  id="builtYear"
                  name="builtYear"
                  type="number"
                  value={formData.builtYear}
                  onChange={handleChange}
                  placeholder="2020"
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="floor"
                  className="text-sm font-medium text-gray-700"
                >
                  Floor
                </Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="2"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="totalFloors"
                  className="text-sm font-medium text-gray-700"
                >
                  Total Floors
                </Label>
                <Input
                  id="totalFloors"
                  name="totalFloors"
                  type="number"
                  value={formData.totalFloors}
                  onChange={handleChange}
                  placeholder="5"
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="expiresAt"
                  className="text-sm font-medium text-gray-700"
                >
                  Listing Expires At
                </Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-4 block">
                Amenities & Features
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    key: "furnished",
                    label: "Furnished",
                    icon: Sofa,
                    color: "text-amber-600 bg-amber-50",
                  },
                  {
                    key: "parking",
                    label: "Parking",
                    icon: Car,
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    key: "balcony",
                    label: "Balcony",
                    icon: Building2,
                    color: "text-cyan-600 bg-cyan-50",
                  },
                  {
                    key: "garden",
                    label: "Garden",
                    icon: Trees,
                    color: "text-green-600 bg-green-50",
                  },
                  {
                    key: "swimming",
                    label: "Swimming Pool",
                    icon: Waves,
                    color: "text-blue-600 bg-blue-50",
                  },
                  {
                    key: "gym",
                    label: "Gym",
                    icon: Dumbbell,
                    color: "text-red-600 bg-red-50",
                  },
                  {
                    key: "security",
                    label: "Security",
                    icon: Shield,
                    color: "text-purple-600 bg-purple-50",
                  },
                  {
                    key: "elevator",
                    label: "Elevator",
                    icon: Building,
                    color: "text-gray-600 bg-gray-50",
                  },
                  {
                    key: "powerBackup",
                    label: "Power Backup",
                    icon: Zap,
                    color: "text-yellow-600 bg-yellow-50",
                  },
                ].map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div
                      key={amenity.key}
                      className={`relative rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        formData[amenity.key]
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          [amenity.key]: !prev[amenity.key],
                        }));
                      }}
                    >
                      <div className="p-4 flex flex-col items-center text-center space-y-2">
                        <div className={`p-3 rounded-full ${amenity.color}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {amenity.label}
                        </span>
                        <input
                          type="checkbox"
                          id={amenity.key}
                          name={amenity.key}
                          checked={formData[amenity.key]}
                          onChange={handleChange}
                          className="absolute top-2 right-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-gray-900">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Interactive Location Picker */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Location on Map *
              </Label>
              <LocationPicker
                address={formData.address}
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={handleLocationChange}
                className="mb-4"
              />
            </div>

            <div>
              <Label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Full Address *
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, Area Name, Landmark"
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="locality"
                  className="text-sm font-medium text-gray-700"
                >
                  Locality/Area
                </Label>
                <Input
                  id="locality"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  placeholder="Andheri West"
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="city"
                  className="text-sm font-medium text-gray-700"
                >
                  City *
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="state"
                  className="text-sm font-medium text-gray-700"
                >
                  State *
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="pincode"
                  className="text-sm font-medium text-gray-700"
                >
                  Pincode *
                </Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400058"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="latitude"
                  className="text-sm font-medium text-gray-700"
                >
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="19.0760"
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="longitude"
                  className="text-sm font-medium text-gray-700"
                >
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="72.8777"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Google Maps Link */}
            <div>
              <Label
                htmlFor="mapLink"
                className="text-sm font-medium text-gray-700"
              >
                Google Maps Link
              </Label>
              <Input
                id="mapLink"
                name="mapLink"
                value={formData.mapLink}
                onChange={handleChange}
                placeholder="https://maps.app.goo.gl/oCA2a6fgxCuNt4bXA"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste Google Maps share link for this property location
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-gray-900">
              <Phone className="h-5 w-5 mr-2 text-purple-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label
                  htmlFor="contactName"
                  className="text-sm font-medium text-gray-700"
                >
                  Contact Name
                </Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="contactPhone"
                  className="text-sm font-medium text-gray-700"
                >
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="contactEmail"
                  className="text-sm font-medium text-gray-700"
                >
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Highlights */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-gray-900">
              <Users className="h-5 w-5 mr-2 text-orange-600" />
              Status & Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700"
                >
                  Property Status
                </Label>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange(e)}
                  name="status"
                  className="mt-1"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="highlight"
                  className="text-sm font-medium text-gray-700"
                >
                  Highlight
                </Label>
                <Select
                  value={formData.highlight}
                  onChange={(e) => handleChange(e)}
                  name="highlight"
                  className="mt-1"
                >
                  {highlightOptions.map((highlight) => (
                    <option key={highlight.value} value={highlight.value}>
                      {highlight.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex items-center space-x-6 pt-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label
                    htmlFor="isActive"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Active Listing
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isVerified"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label
                    htmlFor="isVerified"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Verified Property
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images & Videos */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-gray-900">
              <ImageIcon className="h-5 w-5 mr-2 text-teal-600" />
              Property Media
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Current Images
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={image.url}
                          alt={`Property image ${image.id}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(image)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Videos */}
            {existingVideos.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Current Videos
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {existingVideos.map((video) => (
                    <div key={video.id} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <video
                          src={video.url}
                          className="w-full h-full object-cover"
                          controls={false}
                          muted
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingVideo(video)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 truncate">
                        {video.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Media Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Add New Images & Videos
              </Label>
              <ImageUpload
                onFilesChange={setNewFiles}
                maxFiles={15}
                acceptVideo={true}
                existingFiles={[...existingImages, ...existingVideos]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 sticky bottom-0 bg-white p-6 border-t border-gray-200 shadow-lg">
          <Link href="/admin/properties">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Property
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
