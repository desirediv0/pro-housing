"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Image as ImageIcon,
  Video,
  Phone,
  MessageCircle,
  Eye,
  EyeOff,
  Upload,
  X,
  Edit,
  AlertCircle,
  Camera,
  Film,
  Globe,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import adminAPI from "@/utils/adminAPI";
import Image from "next/image";

export default function SidebarContentManagement() {
  const [loading, setLoading] = useState(false);
  const [sidebarContent, setSidebarContent] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [uploading, setUploading] = useState({ image: false, video: false });
  const [copiedUrl, setCopiedUrl] = useState("");

  const [formData, setFormData] = useState({
    imageUrl: "",
    videoUrl: "",
    phoneNumber: "",
    whatsappNumber: "",
    isActive: true,
  });

  useEffect(() => {
    loadSidebarContent();
  }, []);

  const loadSidebarContent = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSidebarContent();

      if (response.success && response.data) {
        setSidebarContent(response.data.content || []);
      } else {
        setSidebarContent([]);
      }
    } catch (error) {
      console.error("Error loading sidebar content:", error);
      toast.error("Failed to load sidebar content", {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
      setSidebarContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.imageUrl &&
      !formData.videoUrl &&
      !formData.phoneNumber &&
      !formData.whatsappNumber
    ) {
      toast.error(
        "Please provide at least one content field (image, video, phone, or WhatsApp)",
        {
          style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
        }
      );
      return;
    }

    // Check if trying to create active content when active content already exists
    if (formData.isActive && !editingContent) {
      const hasActiveContent = sidebarContent.some(
        (content) => content.isActive
      );
      if (hasActiveContent) {
        toast.error(
          "An active sidebar content already exists. Please deactivate it first or set this as inactive.",
          {
            style: {
              borderRadius: "12px",
              background: "#EF4444",
              color: "#fff",
            },
          }
        );
        return;
      }
    }

    try {
      setLoading(true);

      if (editingContent) {
        await adminAPI.updateSidebarContent(editingContent.id, formData);
        toast.success("Content updated successfully!", {
          icon: "✨",
          style: {
            borderRadius: "12px",
            background: "#10B981",
            color: "#fff",
          },
        });
      } else {
        await adminAPI.createSidebarContent(formData);
        toast.success("Content created successfully!", {
          icon: "🎉",
          style: {
            borderRadius: "12px",
            background: "#10B981",
            color: "#fff",
          },
        });
      }

      // Reset form and state
      setFormData({
        imageUrl: "",
        videoUrl: "",
        phoneNumber: "",
        whatsappNumber: "",
        isActive: true,
      });
      setShowAddForm(false);
      setEditingContent(null);
      loadSidebarContent();
    } catch (error) {
      console.error("Error saving content:", error);

      // Handle specific error messages from server
      const errorMessage =
        error.response?.data?.message || "Failed to save content";
      toast.error(errorMessage, {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this content? This will also delete associated files from storage."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await adminAPI.deleteSidebarContent(id);

      toast.success("Content deleted successfully!", {
        icon: "🗑️",
        style: { borderRadius: "12px", background: "#10B981", color: "#fff" },
      });

      loadSidebarContent();
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content", {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      imageUrl: content.imageUrl || "",
      videoUrl: content.videoUrl || "",
      phoneNumber: content.phoneNumber || "",
      whatsappNumber: content.whatsappNumber || "",
      isActive: content.isActive,
    });
    setShowAddForm(true);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await adminAPI.updateSidebarContent(id, { isActive: !currentStatus });

      toast.success(
        `Content ${!currentStatus ? "activated" : "deactivated"} successfully!`,
        {
          icon: !currentStatus ? "👁️" : "👁️‍🗨️",
          style: { borderRadius: "12px", background: "#10B981", color: "#fff" },
        }
      );

      loadSidebarContent();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status", {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (type === "video" && !file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [type]: true }));

      let processedFile = file;

      // Compress image if it's an image file
      if (type === "image" && file.type.startsWith("image/")) {
        try {
          const { compressImage } = await import("@/utils/imageCompression");
          processedFile = await compressImage(file, {
            maxWidth: 1920,
            maxHeight: 1080,
            quality: 0.85,
            maxSizeMB: 10,
          });

          console.log(
            `Image compressed: ${file.size} -> ${processedFile.size} bytes`
          );
        } catch (compressionError) {
          console.warn(
            "Image compression failed, using original file:",
            compressionError
          );
          processedFile = file;
        }
      }

      // Validate file size after compression
      const maxSize = type === "image" ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (processedFile.size > maxSize) {
        toast.error(
          `File size must be less than ${type === "image" ? "10MB" : "50MB"}`
        );
        setUploading((prev) => ({ ...prev, [type]: false }));
        return;
      }

      let response;
      if (type === "image") {
        response = await adminAPI.uploadSidebarImage(processedFile);
      } else {
        response = await adminAPI.uploadSidebarVideo(processedFile);
      }

      if (response.success) {
        setFormData((prev) => ({
          ...prev,
          [type === "image" ? "imageUrl" : "videoUrl"]: response.data.url,
        }));

        const originalSize = file.size;
        const compressedSize = processedFile.size;
        const compressionRatio = (
          ((originalSize - compressedSize) / originalSize) *
          100
        ).toFixed(1);

        toast.success(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } uploaded successfully!${
            type === "image" && originalSize !== compressedSize
              ? ` (${compressionRatio}% smaller)`
              : ""
          }`,
          {
            icon: type === "image" ? "🖼️" : "🎥",
            style: {
              borderRadius: "12px",
              background: "#10B981",
              color: "#fff",
            },
          }
        );
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Failed to upload ${type}`, {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleRemoveFile = async (fileUrl, type) => {
    if (!fileUrl) return;

    try {
      // If we're editing existing content, update it in database
      if (editingContent) {
        const updateData = {
          ...formData,
          [type === "image" ? "imageUrl" : "videoUrl"]: "",
        };

        await adminAPI.updateSidebarContent(editingContent.id, updateData);

        // Reload content to reflect changes
        await loadSidebarContent();
      } else {
        // If it's new content, just delete from S3
        await adminAPI.deleteFile(fileUrl);
      }

      // Update form state
      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "imageUrl" : "videoUrl"]: "",
      }));

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} removed successfully!`,
        {
          icon: "🗑️",
          style: { borderRadius: "12px", background: "#10B981", color: "#fff" },
        }
      );
    } catch (error) {
      console.error(`Error removing ${type}:`, error);
      toast.error(`Failed to remove ${type}`, {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      toast.success("URL copied to clipboard!", {
        icon: "📋",
        style: { borderRadius: "12px", background: "#10B981", color: "#fff" },
      });
      setTimeout(() => setCopiedUrl(""), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  const resetForm = () => {
    setFormData({
      imageUrl: "",
      videoUrl: "",
      phoneNumber: "",
      whatsappNumber: "",
      isActive: true,
    });
    setEditingContent(null);
    setShowAddForm(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePhoneNumber = (phone) => {
    return phone.replace(/[^0-9+]/g, "");
  };

  // Check if there's already an active content
  const hasActiveContent = sidebarContent.some((content) => content.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Sidebar Content Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage images, videos, and contact information for your website
              sidebar
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!hasActiveContent && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Content
            </Button>
          )}

          <Button
            onClick={loadSidebarContent}
            variant="outline"
            className="border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            <RefreshCw
              className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center">
                {editingContent ? (
                  <Edit className="h-6 w-6 mr-3" />
                ) : (
                  <Plus className="h-6 w-6 mr-3" />
                )}
                {editingContent ? "Edit Content" : "Add New Content"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-700 flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-blue-500" />
                      Image Upload
                    </Label>

                    {formData.imageUrl ? (
                      <div className="relative group">
                        <Image
                          src={formData.imageUrl}
                          alt="Uploaded"
                          className="w-full h-48 object-cover rounded-xl shadow-lg"
                          width={64}
                          height={64}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center space-x-4">
                          <Button
                            type="button"
                            onClick={() => copyToClipboard(formData.imageUrl)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                          >
                            {copiedUrl === formData.imageUrl ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              handleRemoveFile(formData.imageUrl, "image")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload(e.target.files[0], "image")
                          }
                          className="hidden"
                          id="image-upload"
                          disabled={uploading.image}
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center space-y-3"
                        >
                          {uploading.image ? (
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                          ) : (
                            <Upload className="h-12 w-12 text-blue-500" />
                          )}
                          <span className="text-lg font-medium text-gray-700">
                            {uploading.image
                              ? "Uploading..."
                              : "Click to upload image"}
                          </span>
                          <span className="text-sm text-gray-500">
                            Max size: 10MB
                          </span>
                        </label>
                      </div>
                    )}

                    <Input
                      type="url"
                      placeholder="Or paste image URL"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        handleInputChange("imageUrl", e.target.value)
                      }
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Video Upload Section */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-700 flex items-center">
                      <Film className="h-5 w-5 mr-2 text-purple-500" />
                      Video Upload
                    </Label>

                    {formData.videoUrl ? (
                      <div className="relative group">
                        <video
                          src={formData.videoUrl}
                          className="w-full h-48 object-cover rounded-xl shadow-lg"
                          controls
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button
                            type="button"
                            onClick={() => copyToClipboard(formData.videoUrl)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                          >
                            {copiedUrl === formData.videoUrl ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            onClick={() =>
                              handleRemoveFile(formData.videoUrl, "video")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            handleFileUpload(e.target.files[0], "video")
                          }
                          className="hidden"
                          id="video-upload"
                          disabled={uploading.video}
                        />
                        <label
                          htmlFor="video-upload"
                          className="cursor-pointer flex flex-col items-center space-y-3"
                        >
                          {uploading.video ? (
                            <Loader2 className="h-12 w-12 text-purple-500 animate-spin" />
                          ) : (
                            <Upload className="h-12 w-12 text-purple-500" />
                          )}
                          <span className="text-lg font-medium text-gray-700">
                            {uploading.video
                              ? "Uploading..."
                              : "Click to upload video"}
                          </span>
                          <span className="text-sm text-gray-500">
                            Max size: 50MB
                          </span>
                        </label>
                      </div>
                    )}

                    <Input
                      type="url"
                      placeholder="Or paste video URL"
                      value={formData.videoUrl}
                      onChange={(e) =>
                        handleInputChange("videoUrl", e.target.value)
                      }
                      className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700 flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-green-500" />
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {formData.phoneNumber &&
                      !validatePhoneNumber(formData.phoneNumber) && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Invalid phone number format
                        </p>
                      )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-700 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
                      WhatsApp Number
                    </Label>
                    <Input
                      type="tel"
                      placeholder="+1234567890"
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        handleInputChange("whatsappNumber", e.target.value)
                      }
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {formData.whatsappNumber &&
                      !validatePhoneNumber(formData.whatsappNumber) && (
                        <p className="text-red-500 text-sm flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Invalid WhatsApp number format
                        </p>
                      )}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {formData.isActive ? (
                      <Eye className="h-6 w-6 text-green-500" />
                    ) : (
                      <EyeOff className="h-6 w-6 text-gray-400" />
                    )}
                    <div>
                      <Label className="text-lg font-semibold text-gray-700">
                        Content Status
                      </Label>
                      <p className="text-sm text-gray-500">
                        {formData.isActive
                          ? "Content is active and visible"
                          : "Content is inactive and hidden"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5 mr-2" />
                    )}
                    {editingContent ? "Update Content" : "Save Content"}
                  </Button>

                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Content List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Existing Content ({sidebarContent.length})
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-lg animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="h-48 bg-gray-200 rounded-lg"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sidebarContent.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Globe className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    No Content Found
                  </h3>
                  <p className="text-gray-500">
                    Start by adding your first sidebar content
                  </p>
                  {!hasActiveContent && (
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Content
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sidebarContent.map((content) => (
                <Card
                  key={content.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Media Preview */}
                      <div className="relative">
                        {content.imageUrl ? (
                          <Image
                            src={content.imageUrl}
                            alt="Content"
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                            width={64}
                            height={64}
                          />
                        ) : content.videoUrl ? (
                          <video
                            src={content.videoUrl}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                            controls
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <Globe className="h-16 w-16 text-gray-400" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              content.isActive
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            {content.isActive ? "Active" : "Inactive"}
                          </div>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="space-y-3">
                        {content.phoneNumber && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-green-500" />
                            <span>{content.phoneNumber}</span>
                          </div>
                        )}

                        {content.whatsappNumber && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MessageCircle className="h-4 w-4 text-green-500" />
                            <span>{content.whatsappNumber}</span>
                          </div>
                        )}

                        {content.imageUrl && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <ImageIcon className="h-4 w-4 text-blue-500" />
                            <span className="truncate">Image attached</span>
                          </div>
                        )}

                        {content.videoUrl && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Video className="h-4 w-4 text-purple-500" />
                            <span className="truncate">Video attached</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-4 border-t border-gray-100">
                        <Button
                          onClick={() => handleEdit(content)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          onClick={() =>
                            toggleStatus(content.id, content.isActive)
                          }
                          className={`px-4 py-2 rounded-lg ${
                            content.isActive
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          {content.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>

                        <Button
                          onClick={() => handleDelete(content.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
