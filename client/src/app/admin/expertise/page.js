"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import { adminAPI } from "@/lib/api-functions";
import toast from "react-hot-toast";
import useAdminProtection from "@/hooks/useAdminProtection";
import SearchFilter from "@/components/ui/search-filter";

export default function ExpertiseInquiries() {
  const { isLoading: authLoading, isAuthenticated } = useAdminProtection();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    serviceType: "",
    search: "",
  });
  const [expandedInquiry, setExpandedInquiry] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInquiries: 0,
  });

  useEffect(() => {
    fetchInquiries();
  }, [filters]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllExpertiseInquiries(filters);
      if (response.data && response.data.success) {
        setInquiries(response.data.data.inquiries || []);
        setPagination(
          response.data.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalInquiries: 0,
          }
        );
      } else {
        setInquiries([]);
        toast.error("Failed to load expertise inquiries");
      }
    } catch (error) {
      console.error("Error fetching expertise inquiries:", error);
      toast.error("Failed to load expertise inquiries");
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await adminAPI.updateExpertiseInquiryStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchInquiries();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleRespond = async () => {
    if (!responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      setSubmitting(true);
      await adminAPI.respondToExpertiseInquiry(
        selectedInquiry.id,
        responseText
      );
      toast.success("Response sent successfully");
      setShowResponseModal(false);
      setResponseText("");
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error("Failed to send response");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) {
      return;
    }

    try {
      await adminAPI.deleteExpertiseInquiry(id);
      toast.success("Inquiry deleted successfully");
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "RESPONDED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "SPAM":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getServiceTypeColor = (type) => {
    switch (type) {
      case "LEGAL":
        return "bg-blue-100 text-blue-800";
      case "TAXATION":
        return "bg-purple-100 text-purple-800";
      case "INSPECTION":
        return "bg-orange-100 text-orange-800";
      case "LOAN":
        return "bg-green-100 text-green-800";
      case "LEASE":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredInquiries = (inquiries || []).filter((inquiry) => {
    const matchesSearch =
      inquiry.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      inquiry.phone.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || inquiry.status === filters.status;
    const matchesServiceType =
      !filters.serviceType || inquiry.serviceType === filters.serviceType;

    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const stats = {
    total: (inquiries || []).length,
    pending: (inquiries || []).filter((i) => i.status === "PENDING").length,
    responded: (inquiries || []).filter((i) => i.status === "RESPONDED").length,
    closed: (inquiries || []).filter((i) => i.status === "CLOSED").length,
  };

  // Show loading if authentication is being checked
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Expertise Inquiries
          </h1>
          <p className="text-gray-600">
            Manage consultation and expertise service inquiries
          </p>
        </div>
        <Button
          onClick={fetchInquiries}
          variant="outline"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-12 w-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.responded}
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-3xl font-bold text-gray-600">
                  {stats.closed}
                </p>
              </div>
              <XCircle className="h-12 w-12 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <SearchFilter
            filters={filters}
            onFiltersChange={setFilters}
            searchPlaceholder="Search by name, email, or phone..."
            statusOptions={[
              { value: "PENDING", label: "Pending" },
              { value: "RESPONDED", label: "Responded" },
              { value: "CLOSED", label: "Closed" },
              { value: "SPAM", label: "Spam" },
            ]}
            serviceTypeOptions={[
              { value: "LEGAL", label: "Legal" },
              { value: "TAXATION", label: "Taxation" },
              { value: "INSPECTION", label: "Inspection" },
              { value: "LOAN", label: "Loan" },
              { value: "LEASE", label: "Lease" },
            ]}
            debounceMs={500}
          />
        </CardContent>
      </Card>

      {/* Inquiries List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Expertise Inquiries ({filteredInquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No inquiries found
              </h3>
              <p className="text-gray-500">
                No expertise inquiries match your current filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <Card key={inquiry.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-400" />
                            <span className="font-semibold text-lg">
                              {inquiry.fullName}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              inquiry.status
                            )}`}
                          >
                            {inquiry.status}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getServiceTypeColor(
                              inquiry.serviceType
                            )}`}
                          >
                            {inquiry.serviceType}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{inquiry.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{inquiry.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {inquiry.preferredTimeSlot}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {formatDate(inquiry.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-sm">
                              Consultation Type:
                            </span>
                            <span className="text-sm ml-2">
                              {inquiry.consultationType}
                            </span>
                          </div>
                          {inquiry.additionalNotes && (
                            <div>
                              <span className="font-medium text-sm">
                                Additional Notes:
                              </span>
                              <p className="text-sm mt-1 text-gray-600">
                                {inquiry.additionalNotes}
                              </p>
                            </div>
                          )}
                          {inquiry.loanRequirements && (
                            <div>
                              <span className="font-medium text-sm">
                                Loan Requirements:
                              </span>
                              <p className="text-sm mt-1 text-gray-600">
                                {inquiry.loanRequirements}
                              </p>
                            </div>
                          )}
                          {inquiry.landDetails && (
                            <div>
                              <span className="font-medium text-sm">
                                Land Details:
                              </span>
                              <p className="text-sm mt-1 text-gray-600">
                                {inquiry.landDetails}
                              </p>
                            </div>
                          )}
                        </div>

                        {inquiry.adminResponse && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-sm text-green-800">
                                Admin Response
                              </span>
                            </div>
                            <p className="text-sm text-green-700">
                              {inquiry.adminResponse}
                            </p>
                            {inquiry.respondedAt && (
                              <p className="text-xs text-green-600 mt-2">
                                Responded on: {formatDate(inquiry.respondedAt)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {inquiry.status === "PENDING" && (
                          <Button
                            onClick={() => {
                              setSelectedInquiry(inquiry);
                              setShowResponseModal(true);
                            }}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                        )}

                        <Select
                          value={inquiry.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(inquiry.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="RESPONDED">Responded</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                            <SelectItem value="SPAM">Spam</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          onClick={() => handleDelete(inquiry.id)}
                          size="sm"
                          variant="destructive"
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
        </CardContent>
      </Card>

      {/* Response Modal */}
      {showResponseModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">Respond to Inquiry</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="response">Response</Label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter your response..."
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText("");
                    setSelectedInquiry(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRespond}
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send Response
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
