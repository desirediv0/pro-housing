"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Eye,
  Reply,
  Check,
  X,
  Clock,
  Mail,
  Phone,
  User,
  Building,
  Calendar,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  ExternalLink,
  Home,
  BedDouble,
  Bath,
  Square,
  Car,
  Trees,
  Shield,
  Zap,
  Loader2,
  Archive,
  Trash2,
  Star,
  TrendingUp,
} from "lucide-react";
import { adminAPI } from "@/utils/adminAPI";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchFilter from "@/components/ui/search-filter";
import { Select } from "@/components/ui/select";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    PENDING: 0,
    RESPONDED: 0,
    CLOSED: 0,
    SPAM: 0,
  });

  const router = useRouter();

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "RESPONDED", label: "Responded" },
    { value: "CLOSED", label: "Closed" },
    { value: "SPAM", label: "Spam" },
  ];

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllInquiries(filters);

      if (response.success && response.data) {
        const { inquiries, pagination, statusStats } = response.data;

        // Set inquiries
        setInquiries(inquiries || []);

        // Set pagination data
        setPagination({
          total: pagination?.totalInquiries || 0,
          pages: pagination?.totalPages || 1,
          currentPage: pagination?.currentPage || 1,
          hasNext: pagination?.hasNext || false,
          hasPrev: pagination?.hasPrev || false,
        });

        // Set status statistics
        const total = pagination?.totalInquiries || 0;
        setStats({
          total,
          PENDING: statusStats?.PENDING || 0,
          RESPONDED: statusStats?.RESPONDED || 0,
          CLOSED: statusStats?.CLOSED || 0,
          SPAM: statusStats?.SPAM || 0,
        });
      } else {
        throw new Error(response.message || "Failed to fetch inquiries");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error(error.message || "Failed to fetch inquiries");
      setInquiries([]);
      setPagination({
        total: 0,
        pages: 1,
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
      });
      setStats({
        total: 0,
        PENDING: 0,
        RESPONDED: 0,
        CLOSED: 0,
        SPAM: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      console.log("Updating status:", { inquiryId, newStatus });

      const response = await adminAPI.updateInquiryStatus(inquiryId, newStatus);
      console.log("Status update response:", response);

      if (response.success) {
        toast.success("Inquiry status updated successfully", {
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#10B981",
            color: "#fff",
          },
        });

        // Update local state immediately for better UX
        setInquiries((prevInquiries) =>
          prevInquiries.map((inquiry) =>
            inquiry.id === inquiryId
              ? { ...inquiry, status: newStatus }
              : inquiry
          )
        );

        // Also refresh data to get latest from server
        fetchInquiries();
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      toast.error(error.message || "Failed to update inquiry status", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
        },
      });
    }
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      toast.error("Please enter a response message");
      return;
    }

    try {
      setSending(true);
      console.log("Sending response:", {
        inquiryId: selectedInquiry.id,
        response: responseText,
      });

      const response = await adminAPI.respondToInquiry(
        selectedInquiry.id,
        responseText
      );
      console.log("Response send result:", response);

      if (response.success) {
        setSelectedInquiry(null);
        setResponseText("");

        toast.success("Response sent successfully", {
          icon: "📧",
          style: {
            borderRadius: "10px",
            background: "#10B981",
            color: "#fff",
          },
        });

        // Update local state immediately
        setInquiries((prevInquiries) =>
          prevInquiries.map((inquiry) =>
            inquiry.id === selectedInquiry.id
              ? {
                  ...inquiry,
                  status: "RESPONDED",
                  adminResponse: responseText,
                  respondedAt: new Date().toISOString(),
                }
              : inquiry
          )
        );

        // Also refresh data to get latest from server
        fetchInquiries();
      } else {
        throw new Error(response.message || "Failed to send response");
      }
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error(error.message || "Failed to send response", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
        },
      });
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "RESPONDED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CLOSED":
        return "bg-green-100 text-green-800 border-green-200";
      case "SPAM":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "RESPONDED":
        return <CheckCircle className="h-4 w-4" />;
      case "CLOSED":
        return <Check className="h-4 w-4" />;
      case "SPAM":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const InquiryCard = ({ inquiry }) => {
    const { date, time } = formatDate(inquiry.createdAt);

    return (
      <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
            {/* Property Section - Left */}
            <div className="lg:col-span-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
              {/* Property Image */}
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4 group">
                <Image
                  src={
                    inquiry.property?.mainImage || "/placeholder-property.jpg"
                  }
                  alt={inquiry.property?.title || "Property"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  width={64}
                  height={64}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {inquiry.property?.propertyType || "N/A"}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="font-bold text-white text-sm leading-tight mb-1">
                    {inquiry.property?.title || "Property Title"}
                  </h4>
                  <p className="text-xs text-gray-200 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {inquiry.property?.city || "Location"}
                  </p>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-indigo-600">
                    {inquiry.property?.price
                      ? formatPrice(inquiry.property.price)
                      : "Price N/A"}
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">
                    {inquiry.property?.listingType || "N/A"}
                  </span>
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-2 gap-2">
                  {inquiry.property?.bedrooms && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <BedDouble className="h-3 w-3" />
                      <span>{inquiry.property.bedrooms} Bed</span>
                    </div>
                  )}
                  {inquiry.property?.bathrooms && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Bath className="h-3 w-3" />
                      <span>{inquiry.property.bathrooms} Bath</span>
                    </div>
                  )}
                  {inquiry.property?.area && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Square className="h-3 w-3" />
                      <span>~{inquiry.property.area} sq ft</span>
                    </div>
                  )}
                  {inquiry.property?.parking && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Car className="h-3 w-3" />
                      <span>Parking</span>
                    </div>
                  )}
                </div>

                {/* Property Action */}
                <Link href={`/properties/${inquiry.property?.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3 hover:bg-indigo-50 hover:text-indigo-600 border-indigo-200"
                  >
                    <Building className="h-3 w-3 mr-1" />
                    View Property
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Inquiry Details - Right */}
            <div className="lg:col-span-8 p-6 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {inquiry.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {inquiry.name || "Unknown"}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-blue-500" />
                        <span className="truncate">
                          {inquiry.email || "No email"}
                        </span>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-green-500" />
                          <span>{inquiry.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`px-3 py-2 text-sm font-semibold rounded-lg border flex items-center space-x-2 ${getStatusColor(
                      inquiry.status
                    )}`}
                  >
                    {getStatusIcon(inquiry.status)}
                    <span>
                      {inquiry.status?.replace("_", " ") || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="flex-1 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
                  Customer Message:
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-indigo-500">
                  <p className="text-gray-700 leading-relaxed">
                    {inquiry.message || "No message provided"}
                  </p>
                </div>
              </div>

              {/* Admin Response */}
              {inquiry.adminResponse && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Reply className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">
                      Admin Response
                    </span>
                    {inquiry.respondedAt && (
                      <span className="text-xs text-blue-600">
                        {formatDate(inquiry.respondedAt).date}
                      </span>
                    )}
                  </div>
                  <p className="text-blue-700 leading-relaxed">
                    {inquiry.adminResponse}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {date} at {time}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {inquiry.status === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Respond
                    </Button>
                  )}

                  <Select
                    value={inquiry.status}
                    onChange={(e) =>
                      handleStatusUpdate(inquiry.id, e.target.value)
                    }
                    className="text-sm"
                  >
                    {statusOptions
                      .filter((opt) => opt.value)
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Property Inquiries
          </h1>
          <p className="text-gray-600 mt-2">
            Manage customer inquiries and property interest
          </p>
        </div>
        <Button
          onClick={fetchInquiries}
          variant="outline"
          size="sm"
          className="hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Inquiries
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.PENDING}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.RESPONDED}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.CLOSED}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Check className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-rose-50 border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Spam</p>
                <p className="text-3xl font-bold text-red-600">{stats.SPAM}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <SearchFilter
            filters={filters}
            onFiltersChange={setFilters}
            searchPlaceholder="Search by name, email, phone, or message..."
            statusOptions={statusOptions.filter((opt) => opt.value !== "")}
            debounceMs={500}
          />
        </CardContent>
      </Card>

      {/* Inquiries List */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-4 space-y-4">
                    <div className="h-40 bg-gray-200 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="p-16 text-center">
            <MessageSquare className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Inquiries Found
            </h3>
            <p className="text-gray-600 text-lg">
              {filters.search || filters.status
                ? "No inquiries match your current filters."
                : "No property inquiries have been received yet."}
            </p>
            {(filters.search || filters.status) && (
              <Button
                onClick={() =>
                  setFilters({ search: "", status: "", page: 1, limit: 20 })
                }
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing page {pagination.currentPage} of {pagination.pages} (
                {pagination.total} total inquiries)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium">
                  {pagination.currentPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Reply className="h-6 w-6 mr-3 text-indigo-600" />
                  <div>
                    <h3 className="text-xl font-bold">
                      Respond to {selectedInquiry.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Property: {selectedInquiry.property?.title}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInquiry(null)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Customer Information:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Name:</span>
                    <span className="ml-2">{selectedInquiry.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{selectedInquiry.email}</span>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{selectedInquiry.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">
                      {formatDate(selectedInquiry.createdAt).date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Original Message */}
              <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-blue-600" />
                  Original Message:
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Response Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Response:
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your professional response here..."
                  rows={8}
                  className="w-full resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This response will be sent to the customer&apos;s email
                  address.
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInquiry(null)}
                  className="hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendResponse}
                  disabled={sending || !responseText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                >
                  {sending ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
