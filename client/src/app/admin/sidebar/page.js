"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Switch } from "@/components/ui/form";
import {
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Image,
  Video,
  Phone,
  MessageCircle,
  Eye,
  EyeOff,
  Upload,
  X,
  Edit,
  GripVertical,
  AlertCircle,
  CheckCircle,
  Camera,
  Film,
  Globe,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";

export default function SidebarContentManagement() {
  const [loading, setLoading] = useState(false);
  const [sidebarContent, setSidebarContent] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [uploading, setUploading] = useState({ image: false, video: false });
  const [copiedUrl, setCopiedUrl] = useState("");
  const [previewUrls, setPreviewUrls] = useState({ image: "", video: "" });

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

  const getAuthToken = () => {
    // Try different token sources in order of preference
    const localStorageToken = localStorage.getItem("adminToken");
    const accessTokenCookie = getCookie("accessToken");
    const adminTokenCookie = getCookie("adminToken");
    const refreshTokenCookie = getCookie("refreshToken");

    const token =
      localStorageToken ||
      accessTokenCookie ||
      adminTokenCookie ||
      refreshTokenCookie;

    // Debug logging
    console.log("🔍 Token Debug:");
    console.log(
      "localStorage adminToken:",
      localStorageToken ? "Found" : "Not found"
    );
    console.log(
      "Cookie accessToken:",
      accessTokenCookie ? "Found" : "Not found"
    );
    console.log("Cookie adminToken:", adminTokenCookie ? "Found" : "Not found");
    console.log(
      "Cookie refreshToken:",
      refreshTokenCookie ? "Found" : "Not found"
    );
    console.log("Selected token:", token ? "Found" : "Not found");

    return token;
  };

  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        const cookieValue = parts.pop().split(";").shift();
        return cookieValue && cookieValue !== "undefined" ? cookieValue : null;
      }
      return null;
    } catch (error) {
      console.error(`Error reading cookie ${name}:`, error);
      return null;
    }
  };

  const loadSidebarContent = async () => {
    try {
      setLoading(true);

      // Debug: Show all cookies and localStorage
      console.log("🍪 All cookies:", document.cookie);
      console.log(
        "💾 localStorage adminToken:",
        localStorage.getItem("adminToken")
      );

      const token = getAuthToken();

      if (!token) {
        console.error("❌ No token found!");
        toast.error("🔒 Please login to access admin features", {
          style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
        });
        return;
      }

      console.log(
        "🚀 Making API call with token:",
        token.substring(0, 20) + "..."
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sidebar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("🔑 Authentication failed. Please login again.", {
            style: {
              borderRadius: "12px",
              background: "#EF4444",
              color: "#fff",
            },
          });
          return;
        }
        throw new Error("Failed to fetch sidebar content");
      }

      const result = await response.json();
      setSidebarContent(result.data.content || []);
    } catch (error) {
      console.error("Error loading sidebar content:", error);
      toast.error("❌ Failed to load sidebar content", {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced validation
    if (
      !formData.imageUrl &&
      !formData.videoUrl &&
      !formData.phoneNumber &&
      !formData.whatsappNumber
    ) {
      toast.error("📝 Please fill at least one field", {
        style: { borderRadius: "12px", background: "#F59E0B", color: "#fff" },
      });
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        toast.error("🔒 Authentication required");
        return;
      }

      const url = editingContent
        ? `${process.env.NEXT_PUBLIC_API_URL}/sidebar/${editingContent.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/sidebar`;
      const method = editingContent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save sidebar content");
      }

      toast.success(
        editingContent
          ? "✅ Content updated successfully!"
          : "✅ Content created successfully!",
        {
          style: {
            borderRadius: "12px",
            background: "#10B981",
            color: "#fff",
            fontWeight: "600",
          },
        }
      );

      resetForm();
      loadSidebarContent();
    } catch (error) {
      toast.error(error.message || "❌ Failed to save sidebar content", {
        style: {
          borderRadius: "12px",
          background: "#EF4444",
          color: "#fff",
          fontWeight: "500",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to delete this content?\n\nThis action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(`http://localhost:4000/api/sidebar/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete sidebar content");
      }

      toast.success("🗑️ Content deleted successfully", {
        style: { borderRadius: "12px", background: "#10B981", color: "#fff" },
      });
      loadSidebarContent();
    } catch (error) {
      toast.error("❌ Failed to delete sidebar content", {
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
    setPreviewUrls({
      image: content.imageUrl || "",
      video: content.videoUrl || "",
    });
    setShowAddForm(true);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sidebar/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(
        `📱 Content ${
          !currentStatus ? "activated" : "deactivated"
        } successfully`,
        {
          style: { borderRadius: "12px", background: "#10B981", color: "#fff" },
        }
      );
      loadSidebarContent();
    } catch (error) {
      toast.error("❌ Failed to update status", {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    // Enhanced file validation
    const maxSize = type === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        `📏 File size must be less than ${type === "image" ? "5MB" : "50MB"}`,
        {
          style: { borderRadius: "12px", background: "#F59E0B", color: "#fff" },
        }
      );
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [type]: true }));
      const token = getAuthToken();
      const uploadData = new FormData();
      uploadData.append(type, file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sidebar/upload/${type}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to upload ${type}`);
      }

      const result = await response.json();

      setFormData((prev) => ({
        ...prev,
        [`${type}Url`]: result.data.url,
      }));

      setPreviewUrls((prev) => ({
        ...prev,
        [type]: result.data.url,
      }));

      toast.success(
        `📸 ${
          type.charAt(0).toUpperCase() + type.slice(1)
        } uploaded successfully`,
        {
          style: { borderRadius: "12px", background: "#10B981", color: "#fff" },
        }
      );
    } catch (error) {
      toast.error(error.message || `❌ Failed to upload ${type}`, {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sidebarContent);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSidebarContent(items);
    toast.success("🔄 Order updated successfully", {
      style: { borderRadius: "12px", background: "#10B981", color: "#fff" },
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      toast.success("📋 URL copied to clipboard", {
        style: { borderRadius: "12px", background: "#10B981", color: "#fff" },
      });
      setTimeout(() => setCopiedUrl(""), 2000);
    } catch (error) {
      toast.error("❌ Failed to copy URL", {
        style: { borderRadius: "12px", background: "#EF4444", color: "#fff" },
      });
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
    setPreviewUrls({ image: "", video: "" });
    setEditingContent(null);
    setShowAddForm(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "imageUrl") {
      setPreviewUrls((prev) => ({ ...prev, image: value }));
    } else if (field === "videoUrl") {
      setPreviewUrls((prev) => ({ ...prev, video: value }));
    }
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg border border-indigo-100">
            <Globe className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">
              Pro Housing Admin
            </span>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sidebar Content Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create and manage beautiful sidebar content with drag-and-drop
            reordering, stunning image uploads, and seamless contact integration
          </p>

          <div className="flex justify-center gap-4">
            <Button
              onClick={loadSidebarContent}
              variant="outline"
              size="lg"
              className="bg-white hover:bg-gray-50 border-gray-200 shadow-sm px-6"
              disabled={loading}
            >
              <RefreshCw
                className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl px-8"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Content
            </Button>
          </div>
        </div>

        {/* Enhanced Add/Edit Form */}
        {showAddForm && (
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b border-gray-100 rounded-t-xl">
              <CardTitle className="flex items-center justify-between text-gray-900">
                <div className="flex items-center">
                  {editingContent ? (
                    <Edit className="h-7 w-7 mr-3 text-emerald-600" />
                  ) : (
                    <Plus className="h-7 w-7 mr-3 text-emerald-600" />
                  )}
                  <span className="text-2xl font-bold">
                    {editingContent ? "Edit Content" : "Create New Content"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Enhanced Image Upload */}
                  <div className="space-y-6">
                    <Label className="text-xl font-bold text-gray-800 flex items-center">
                      <Camera className="h-6 w-6 mr-3 text-indigo-600" />
                      Sidebar Image
                    </Label>

                    <div className="space-y-6">
                      <Input
                        value={formData.imageUrl}
                        onChange={(e) =>
                          handleInputChange("imageUrl", e.target.value)
                        }
                        placeholder="🔗 Enter image URL or upload file below"
                        className="border-2 border-gray-300 focus:border-indigo-500 rounded-xl p-4 text-lg"
                      />

                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleFileUpload(file, "image");
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className={`flex items-center justify-center w-full h-40 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 ${
                            uploading.image
                              ? "opacity-50 cursor-not-allowed bg-indigo-50"
                              : ""
                          }`}
                        >
                          {uploading.image ? (
                            <div className="flex flex-col items-center text-indigo-600">
                              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600 mb-3"></div>
                              <span className="text-lg font-semibold">
                                Uploading image...
                              </span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-lg font-semibold text-gray-700 mb-2">
                                Click to upload image
                              </p>
                              <p className="text-sm text-gray-500">
                                Maximum file size: 5MB • Supported: JPG, PNG,
                                GIF
                              </p>
                            </div>
                          )}
                        </label>
                      </div>

                      {previewUrls.image && (
                        <div className="relative group">
                          <img
                            src={previewUrls.image}
                            alt="Preview"
                            className="w-full h-64 object-cover rounded-xl shadow-xl"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-xl flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(previewUrls.image)
                                }
                                className="bg-white shadow-lg hover:shadow-xl"
                              >
                                {copiedUrl === previewUrls.image ? (
                                  <Check className="h-4 w-4 mr-2 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4 mr-2" />
                                )}
                                Copy URL
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(previewUrls.image, "_blank")
                                }
                                className="bg-white shadow-lg hover:shadow-xl"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Video Upload */}
                  <div className="space-y-6">
                    <Label className="text-xl font-bold text-gray-800 flex items-center">
                      <Film className="h-6 w-6 mr-3 text-purple-600" />
                      Sidebar Video
                    </Label>

                    <div className="space-y-6">
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) =>
                          handleInputChange("videoUrl", e.target.value)
                        }
                        placeholder="🎥 Enter video URL or upload file below"
                        className="border-2 border-gray-300 focus:border-purple-500 rounded-xl p-4 text-lg"
                      />

                      <div className="relative">
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleFileUpload(file, "video");
                          }}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className={`flex items-center justify-center w-full h-40 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 ${
                            uploading.video
                              ? "opacity-50 cursor-not-allowed bg-purple-50"
                              : ""
                          }`}
                        >
                          {uploading.video ? (
                            <div className="flex flex-col items-center text-purple-600">
                              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-purple-600 mb-3"></div>
                              <span className="text-lg font-semibold">
                                Uploading video...
                              </span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-lg font-semibold text-gray-700 mb-2">
                                Click to upload video
                              </p>
                              <p className="text-sm text-gray-500">
                                Maximum file size: 50MB • Supported: MP4, AVI,
                                MOV
                              </p>
                            </div>
                          )}
                        </label>
                      </div>

                      {previewUrls.video && (
                        <div className="relative group">
                          <video
                            src={previewUrls.video}
                            className="w-full h-64 object-cover rounded-xl shadow-xl"
                            controls
                          />
                          <div className="absolute top-4 right-4 space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(previewUrls.video)}
                              className="bg-white shadow-lg hover:shadow-xl"
                            >
                              {copiedUrl === previewUrls.video ? (
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 mr-2" />
                              )}
                              Copy URL
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-xl font-bold text-gray-800 flex items-center">
                      <Phone className="h-6 w-6 mr-3 text-blue-600" />
                      Phone Number
                    </Label>
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="📞 +91 98765 43210"
                      className="border-2 border-gray-300 focus:border-blue-500 rounded-xl p-4 text-lg"
                    />
                    {formData.phoneNumber &&
                      !validatePhoneNumber(formData.phoneNumber) && (
                        <p className="text-sm text-red-600 flex items-center bg-red-50 p-3 rounded-lg">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Please enter a valid phone number
                        </p>
                      )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xl font-bold text-gray-800 flex items-center">
                      <Smartphone className="h-6 w-6 mr-3 text-green-600" />
                      WhatsApp Number
                    </Label>
                    <Input
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        handleInputChange("whatsappNumber", e.target.value)
                      }
                      placeholder="💬 +91 98765 43210"
                      className="border-2 border-gray-300 focus:border-green-500 rounded-xl p-4 text-lg"
                    />
                    {formData.whatsappNumber &&
                      !validatePhoneNumber(formData.whatsappNumber) && (
                        <p className="text-sm text-red-600 flex items-center bg-red-50 p-3 rounded-lg">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Please enter a valid WhatsApp number
                        </p>
                      )}
                  </div>
                </div>

                {/* Enhanced Active Status */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <Label className="text-xl font-bold text-gray-800">
                        Active Status
                      </Label>
                      <p className="text-gray-600 mt-1">
                        Enable this content to display on the website
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                    className="scale-150"
                  />
                </div>

                {/* Enhanced Form Actions */}
                <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t-2 border-gray-200">
                  <Button
                    type="submit"
                    disabled={loading || uploading.image || uploading.video}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white h-14 text-xl font-bold shadow-xl rounded-xl"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="h-6 w-6 mr-3" />
                        {editingContent ? "Update Content" : "Create Content"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 h-14 text-xl font-bold border-2 border-gray-300 hover:border-gray-400 rounded-xl"
                  >
                    <X className="h-6 w-6 mr-3" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Content List with Drag & Drop */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100 rounded-t-xl">
            <CardTitle className="flex items-center text-gray-900">
              <GripVertical className="h-7 w-7 mr-3 text-blue-600" />
              <span className="text-2xl font-bold">
                Sidebar Content ({sidebarContent.length})
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-10">
            {loading && !sidebarContent.length ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-6"></div>
                <p className="text-xl text-gray-600 font-semibold">
                  Loading content...
                </p>
              </div>
            ) : sidebarContent.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Image className="h-16 w-16 text-indigo-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  No content found
                </h3>
                <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                  Create your first sidebar content to get started with your
                  amazing website
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl px-8"
                >
                  <Plus className="h-6 w-6 mr-3" />
                  Add First Content
                </Button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sidebar-content">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-8"
                    >
                      {sidebarContent.map((content, index) => (
                        <Draggable
                          key={content.id}
                          draggableId={content.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`p-8 bg-white border-2 border-gray-200 rounded-2xl shadow-xl transition-all duration-300 ${
                                snapshot.isDragging
                                  ? "shadow-2xl scale-105 rotate-2 border-indigo-300"
                                  : "hover:shadow-2xl hover:border-indigo-200"
                              }`}
                            >
                              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                                {/* Enhanced Drag Handle & Status */}
                                <div className="flex flex-col items-center space-y-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing p-4 hover:bg-gray-100 rounded-xl transition-colors border-2 border-dashed border-gray-300 hover:border-indigo-400"
                                  >
                                    <GripVertical className="h-8 w-8 text-gray-400" />
                                  </div>

                                  <span
                                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                                      content.isActive
                                        ? "bg-green-100 text-green-800 border-2 border-green-200"
                                        : "bg-gray-100 text-gray-600 border-2 border-gray-200"
                                    }`}
                                  >
                                    {content.isActive ? (
                                      <CheckCircle className="h-5 w-5 mr-2" />
                                    ) : (
                                      <AlertCircle className="h-5 w-5 mr-2" />
                                    )}
                                    {content.isActive ? "Active" : "Inactive"}
                                  </span>
                                </div>

                                {/* Enhanced Image Preview */}
                                <div className="text-center">
                                  <p className="text-lg font-bold text-gray-700 mb-4 flex items-center justify-center">
                                    <Camera className="h-5 w-5 mr-2 text-indigo-600" />
                                    Image
                                  </p>
                                  {content.imageUrl ? (
                                    <div className="relative group">
                                      <img
                                        src={content.imageUrl}
                                        alt="Sidebar"
                                        className="w-full h-32 object-cover rounded-xl shadow-lg"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-xl flex items-center justify-center">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            window.open(
                                              content.imageUrl,
                                              "_blank"
                                            )
                                          }
                                          className="opacity-0 group-hover:opacity-100 bg-white shadow-lg"
                                        >
                                          <ExternalLink className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                      <Image className="h-10 w-10 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Enhanced Video Preview */}
                                <div className="text-center">
                                  <p className="text-lg font-bold text-gray-700 mb-4 flex items-center justify-center">
                                    <Film className="h-5 w-5 mr-2 text-purple-600" />
                                    Video
                                  </p>
                                  {content.videoUrl ? (
                                    <div className="relative">
                                      <video
                                        src={content.videoUrl}
                                        className="w-full h-32 object-cover rounded-xl shadow-lg"
                                        muted
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          window.open(
                                            content.videoUrl,
                                            "_blank"
                                          )
                                        }
                                        className="absolute top-2 right-2 bg-white shadow-lg"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                      <Video className="h-10 w-10 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                {/* Enhanced Contact Info */}
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-lg font-bold text-gray-700 flex items-center mb-2">
                                      <Phone className="h-5 w-5 mr-2 text-blue-600" />
                                      Phone
                                    </p>
                                    <p className="text-base text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                      {content.phoneNumber || "Not set"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-lg font-bold text-gray-700 flex items-center mb-2">
                                      <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                                      WhatsApp
                                    </p>
                                    <p className="text-base text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                                      {content.whatsappNumber || "Not set"}
                                    </p>
                                  </div>
                                </div>

                                {/* Enhanced Actions */}
                                <div className="flex flex-col space-y-3">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      toggleStatus(content.id, content.isActive)
                                    }
                                    className={`border-2 ${
                                      content.isActive
                                        ? "text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 hover:bg-green-50"
                                        : "text-gray-400 hover:text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                  >
                                    {content.isActive ? (
                                      <Eye className="h-4 w-4 mr-2" />
                                    ) : (
                                      <EyeOff className="h-4 w-4 mr-2" />
                                    )}
                                    {content.isActive ? "Active" : "Inactive"}
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(content)}
                                    className="text-blue-600 hover:text-blue-700 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(content.id)}
                                    className="text-red-600 hover:text-red-700 border-2 border-red-200 hover:border-red-300 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
