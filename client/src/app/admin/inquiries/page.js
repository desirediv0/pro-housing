"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/form";
import {
  MessageSquare,
  Search,
  Filter,
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
} from "lucide-react";
import { adminAPI } from "@/lib/api-functions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    responded: 0,
    closed: 0,
  });

  const router = useRouter();

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "RESPONDED", label: "Responded" },
    { value: "CLOSED", label: "Closed" },
    { value: "SPAM", label: "Spam" },
  ];

  useEffect(() => {
    fetchInquiries();
  }, [filters]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllInquiries(filters);

      setInquiries(response.data.data.inquiries || []);
      setPagination(
        response.data.data.pagination || { total: 0, pages: 1, currentPage: 1 }
      );

      // Get status stats
      const statusStats = response.data.data.statusStats || {};
      setStats({
        total: Object.values(statusStats).reduce((a, b) => a + b, 0),
        pending: statusStats.PENDING || 0,
        responded: statusStats.RESPONDED || 0,
        closed: statusStats.CLOSED || 0,
        spam: statusStats.SPAM || 0,
      });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
        },
      });

      // Fallback to empty state
      setInquiries([]);
      setPagination({ total: 0, pages: 1, currentPage: 1 });
      setStats({ total: 0, pending: 0, responded: 0, closed: 0, spam: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      await adminAPI.updateInquiryStatus(inquiryId, newStatus);

      toast.success("Inquiry status updated successfully", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#10B981",
          color: "#fff",
        },
      });

      fetchInquiries(); // Refresh to update data and stats
    } catch (error) {
      console.error("Error updating inquiry status:", error);
      toast.error("Failed to update inquiry status", {
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
      await adminAPI.respondToInquiry(selectedInquiry.id, responseText);

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

      fetchInquiries(); // Refresh to update data and stats
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error("Failed to send response", {
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

  const InquiryCard = ({ inquiry }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {inquiry.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {inquiry.email}
                  </div>
                  {inquiry.phone && (
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {inquiry.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center space-x-1 ${getStatusColor(
                  inquiry.status
                )}`}
              >
                {getStatusIcon(inquiry.status)}
                <span>{inquiry.status.replace("_", " ")}</span>
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={
                    inquiry.property.mainImage || "/placeholder-property.jpg"
                  }
                  alt={inquiry.property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {inquiry.property.title}
                </h4>
                <p className="text-sm text-gray-500">{inquiry.property.city}</p>
                <p className="text-sm font-medium text-indigo-600">
                  {formatPrice(inquiry.property.price)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  router.push(`/admin/properties/${inquiry.property.id}`)
                }
                className="hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Building className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {inquiry.message}
            </p>
          </div>

          {/* Admin Response */}
          {inquiry.adminResponse && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Reply className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Admin Response
                </span>
                <span className="text-xs text-blue-600">
                  {new Date(inquiry.respondedAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-blue-700 text-sm">{inquiry.adminResponse}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(inquiry.createdAt).toLocaleDateString()} at{" "}
              {new Date(inquiry.createdAt).toLocaleTimeString()}
            </div>

            <div className="flex items-center space-x-2">
              {inquiry.status === "PENDING" && (
                <Button
                  size="sm"
                  onClick={() => setSelectedInquiry(inquiry)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Respond
                </Button>
              )}

              <Select
                value={inquiry.status}
                onValueChange={(value) => handleStatusUpdate(inquiry.id, value)}
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
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Inquiries Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage property inquiries and customer communications
          </p>
        </div>
        <div className="flex items-center space-x-3">
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
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
              <MessageSquare className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-12 w-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.responded}
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
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.closed}
                </p>
              </div>
              <Check className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name, email, or message..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Inquiries Found
            </h3>
            <p className="text-gray-600">
              No property inquiries match your current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}

      {/* Response Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Reply className="h-5 w-5 mr-2 text-indigo-600" />
                  Respond to {selectedInquiry.name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInquiry(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Original Message */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Original Message:
                </h4>
                <p className="text-gray-700 text-sm">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Response Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response:
                </label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={6}
                  className="w-full"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInquiry(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendResponse}
                  disabled={sending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {sending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
