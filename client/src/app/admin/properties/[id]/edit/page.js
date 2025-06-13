"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api-functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea, Select } from "@/components/ui/form";
import ImageUpload from "@/components/ui/image-upload";
import toast from "react-hot-toast";
import {
  Trash2,
  Sofa,
  Car,
  Building2,
  Trees,
  Waves,
  Dumbbell,
  Shield,
  Building,
  Zap,
} from "lucide-react";
import LocationPicker from "@/components/ui/LocationPicker";

export default function EditProperty() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [newMainImage, setNewMainImage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "APARTMENT",
    listingType: "SALE",
    status: "AVAILABLE",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    builtYear: "",
    floor: "",
    totalFloors: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
    locality: "",
    latitude: "",
    longitude: "",
    mapLink: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    furnished: false,
    parking: false,
    balcony: false,
    garden: false,
    swimming: false,
    gym: false,
    security: false,
    elevator: false,
    powerBackup: false,
    highlight: "",
    images: [],
    videos: [],
  });

  useEffect(() => {
    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getProperty(params.id);
      const property = response.data.data || response.data;

      console.log("Fetched property:", property);

      // Set main image separately
      setMainImage(property.mainImage || null);

      setFormData({
        title: property.title || "",
        description: property.description || "",
        price: property.price || "",
        propertyType: property.propertyType || "APARTMENT",
        listingType: property.listingType || "SALE",
        status: property.status || "AVAILABLE",
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        area: property.area || "",
        builtYear: property.builtYear || "",
        floor: property.floor || "",
        totalFloors: property.totalFloors || "",
        city: property.city || "",
        state: property.state || "",
        pincode: property.pincode || "",
        address: property.address || "",
        locality: property.locality || "",
        latitude: property.latitude || "",
        longitude: property.longitude || "",
        mapLink: property.mapLink || "",
        contactName: property.contactName || "",
        contactPhone: property.contactPhone || "",
        contactEmail: property.contactEmail || "",
        furnished: property.furnished || false,
        parking: property.parking || false,
        balcony: property.balcony || false,
        garden: property.garden || false,
        swimming: property.swimming || false,
        gym: property.gym || false,
        security: property.security || false,
        elevator: property.elevator || false,
        powerBackup: property.powerBackup || false,
        highlight: property.highlight || "",
        images: property.images || [],
        videos: property.videos || [],
      });
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Failed to fetch property details");
      router.push("/admin/properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.city ||
      !formData.state ||
      !formData.pincode ||
      !formData.address
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData for multipart request
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "images" || key === "videos") {
          // Skip these, handle separately
          return;
        } else if (typeof formData[key] === "boolean") {
          submitData.append(key, formData[key].toString());
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Handle main image
      if (newMainImage) {
        submitData.append("mainImage", newMainImage);
      }

      // Handle additional images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((file) => {
          if (file instanceof File) {
            submitData.append("images", file);
          }
        });
      }

      // Handle videos
      if (formData.videos && formData.videos.length > 0) {
        formData.videos.forEach((file) => {
          if (file instanceof File) {
            submitData.append("videos", file);
          }
        });
      }

      await adminAPI.updateProperty(params.id, submitData);
      toast.success("Property updated successfully!");
      router.push("/admin/properties");
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error(error.response?.data?.message || "Failed to update property");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (field, files) => {
    setFormData((prev) => ({
      ...prev,
      [field]: files,
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

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMainImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setMainImage(previewUrl);
    }
  };

  const removeMainImage = () => {
    setMainImage(null);
    setNewMainImage(null);
  };

  const handleDeleteProperty = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setSubmitting(true);
      await adminAPI.deleteProperty(params.id);
      toast.success("Property deleted successfully!");
      router.push("/admin/properties");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error(error.response?.data?.message || "Failed to delete property");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        <div className="flex space-x-3">
          <Button
            onClick={handleDeleteProperty}
            variant="destructive"
            size="sm"
            disabled={submitting}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Property</span>
          </Button>
          <Button
            onClick={() => router.push("/admin/properties")}
            variant="outline"
          >
            Back to Properties
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Main Property Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mainImage && (
              <div className="relative inline-block">
                <img
                  src={mainImage}
                  alt="Main property image"
                  className="w-64 h-48 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            <div>
              <Label htmlFor="mainImage">
                {mainImage ? "Change Main Image" : "Upload Main Image"}
              </Label>
              <Input
                id="mainImage"
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Recommended size: 1920x1080px. Maximum file size: 5MB
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Beautiful 3-bedroom house with garden"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Detailed description of the property..."
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="250000"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={(e) =>
                    handleInputChange("propertyType", e.target.value)
                  }
                >
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="VILLA">Villa</option>
                  <option value="PLOT">Plot</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="WAREHOUSE">Warehouse</option>
                  <option value="OFFICE">Office</option>
                  <option value="SHOP">Shop</option>
                  <option value="PG">PG</option>
                  <option value="HOSTEL">Hostel</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="listingType">Listing Type</Label>
                <Select
                  id="listingType"
                  value={formData.listingType}
                  onChange={(e) =>
                    handleInputChange("listingType", e.target.value)
                  }
                >
                  <option value="SALE">Sale</option>
                  <option value="RENT">Rent</option>
                  <option value="LEASE">Lease</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="SOLD">Sold</option>
                  <option value="RENTED">Rented</option>
                  <option value="UNDER_NEGOTIATION">Under Negotiation</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="highlight">Property Highlight</Label>
              <Select
                id="highlight"
                value={formData.highlight}
                onChange={(e) => handleInputChange("highlight", e.target.value)}
              >
                <option value="">No Highlight</option>
                <option value="FEATURED">Featured</option>
                <option value="HOT_DEAL">Hot Deal</option>
                <option value="PREMIUM">Premium</option>
                <option value="TRENDING">Trending</option>
                <option value="NEW">New</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    handleInputChange("bedrooms", parseInt(e.target.value) || 0)
                  }
                  min="0"
                  max="20"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    handleInputChange(
                      "bathrooms",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  max="20"
                />
              </div>

              <div>
                <Label htmlFor="area">Area (sq ft)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder="1500"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="builtYear">Built Year</Label>
                <Input
                  id="builtYear"
                  type="number"
                  value={formData.builtYear}
                  onChange={(e) =>
                    handleInputChange("builtYear", e.target.value)
                  }
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  type="number"
                  value={formData.floor}
                  onChange={(e) => handleInputChange("floor", e.target.value)}
                  placeholder="2"
                  min="0"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Amenities & Features
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: "furnished", label: "Furnished", icon: Sofa },
                  { key: "parking", label: "Parking", icon: Car },
                  { key: "balcony", label: "Balcony", icon: Building2 },
                  { key: "garden", label: "Garden", icon: Trees },
                  { key: "swimming", label: "Swimming Pool", icon: Waves },
                  { key: "gym", label: "Gym", icon: Dumbbell },
                  { key: "security", label: "Security", icon: Shield },
                  { key: "elevator", label: "Elevator", icon: Building },
                  { key: "powerBackup", label: "Power Backup", icon: Zap },
                ].map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <label
                      key={amenity.key}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData[amenity.key]
                          ? "border-[#5e4cbb] bg-purple-50 text-[#5e4cbb]"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData[amenity.key]}
                        onChange={(e) =>
                          handleInputChange(amenity.key, e.target.checked)
                        }
                        className="sr-only"
                      />
                      <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {amenity.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Mumbai"
                  required
                />
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Maharashtra"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  placeholder="400001"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Building name, Street, Area"
                rows="2"
                required
              />
            </div>

            <div>
              <Label htmlFor="locality">Locality (Optional)</Label>
              <Input
                id="locality"
                value={formData.locality}
                onChange={(e) => handleInputChange("locality", e.target.value)}
                placeholder="Bandra West, Andheri East, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) =>
                    handleInputChange("contactName", e.target.value)
                  }
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Images & Videos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Property Images (Gallery)</Label>
              <ImageUpload
                value={formData.images}
                onChange={(files) => handleFileChange("images", files)}
                maxFiles={10}
                accept="image/*"
                multiple
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload additional property images for the gallery
              </p>
            </div>

            <div>
              <Label>Property Videos</Label>
              <ImageUpload
                value={formData.videos}
                onChange={(files) => handleFileChange("videos", files)}
                maxFiles={3}
                accept="video/*"
                multiple
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload property tour videos (max 3 videos, 50MB each)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pb-8">
          <Button
            type="button"
            onClick={() => router.push("/admin/properties")}
            variant="outline"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? "Updating..." : "Update Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}
