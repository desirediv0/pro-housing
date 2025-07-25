"use client";

import React, { useState, useEffect } from "react";
import { adminAPI } from "@/lib/api-functions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, Select } from "@/components/ui/form";
import { Eye, MessageSquare, XCircle } from "lucide-react";

const ExpertiseInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    serviceType: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalInquiries: 0,
  });

  useEffect(() => {
    fetchInquiries();
  }, [filters, pagination.currentPage]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...filters,
      };

      const response = await adminAPI.getAllExpertiseInquiries(params);
      const data = response.data;

      setInquiries(data.inquiries || []);
      setPagination({
        currentPage: data.pagination?.currentPage || 1,
        totalPages: data.pagination?.totalPages || 1,
        totalInquiries: data.pagination?.totalInquiries || 0,
      });
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      await adminAPI.updateExpertiseInquiryStatus(inquiryId, newStatus);
      fetchInquiries();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleResponse = async () => {
    if (!selectedInquiry || !responseText.trim()) return;

    try {
      await adminAPI.respondToExpertiseInquiry(
        selectedInquiry.id,
        responseText
      );
      setShowResponseModal(false);
      setResponseText("");
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "RESPONDED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      case "SPAM":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypeColor = (serviceType) => {
    switch (serviceType) {
      case "LEGAL":
        return "bg-amber-100 text-amber-800";
      case "TAXATION":
        return "bg-blue-100 text-blue-800";
      case "INSPECTION":
        return "bg-purple-100 text-purple-800";
      case "LOAN":
        return "bg-gray-100 text-gray-800";
      case "LEASE":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Expertise Inquiries
        </h1>
        <p className="text-gray-600">Manage consultation requests from users</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name, email, phone..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="RESPONDED">Responded</option>
              <option value="CLOSED">Closed</option>
              <option value="SPAM">Spam</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Select
              id="serviceType"
              value={filters.serviceType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, serviceType: value }))
              }
            >
              <option value="">All Services</option>
              <option value="LEGAL">Legal</option>
              <option value="TAXATION">Taxation</option>
              <option value="INSPECTION">Inspection</option>
              <option value="LOAN">Loan</option>
              <option value="LEASE">Lease</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() =>
                setFilters({ status: "", serviceType: "", search: "" })
              }
              variant="outline"
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            Inquiries ({pagination.totalInquiries})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {inquiry.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.consultationType}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getServiceTypeColor(
                        inquiry.serviceType
                      )}`}
                    >
                      {inquiry.serviceType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div>{inquiry.email}</div>
                      <div className="text-gray-500">{inquiry.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {inquiry.preferredTimeSlot}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        inquiry.status
                      )}`}
                    >
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setShowResponseModal(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Select
                        value={inquiry.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(inquiry.id, value)
                        }
                      >
                        <option value="PENDING">Pending</option>
                        <option value="RESPONDED">Responded</option>
                        <option value="CLOSED">Closed</option>
                        <option value="SPAM">Spam</option>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Respond to {selectedInquiry.fullName}
            </h3>
            <div className="mb-4">
              <Label htmlFor="response">Response</Label>
              <Textarea
                id="response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Enter your response..."
                rows={4}
              />
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleResponse} className="flex-1">
                Send Response
              </Button>
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
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Details Modal */}
      {selectedInquiry && !showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Inquiry Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedInquiry(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <div className="text-sm text-gray-900">
                    {selectedInquiry.fullName}
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="text-sm text-gray-900">
                    {selectedInquiry.email}
                  </div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="text-sm text-gray-900">
                    {selectedInquiry.phone}
                  </div>
                </div>
                <div>
                  <Label>Service Type</Label>
                  <div className="text-sm text-gray-900">
                    {selectedInquiry.serviceType}
                  </div>
                </div>
                <div>
                  <Label>Preferred Time</Label>
                  <div className="text-sm text-gray-900">
                    {selectedInquiry.preferredTimeSlot}
                  </div>
                </div>
                <div>
                  <Label>Consultation Type</Label>
                  <div className="text-sm text-gray-900">
                    {selectedInquiry.consultationType}
                  </div>
                </div>
              </div>

              {selectedInquiry.additionalNotes && (
                <div>
                  <Label>Additional Notes</Label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedInquiry.additionalNotes}
                  </div>
                </div>
              )}

              {selectedInquiry.loanRequirements && (
                <div>
                  <Label>Loan Requirements</Label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedInquiry.loanRequirements}
                  </div>
                </div>
              )}

              {selectedInquiry.landDetails && (
                <div>
                  <Label>Land Details</Label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {selectedInquiry.landDetails}
                  </div>
                </div>
              )}

              {selectedInquiry.adminResponse && (
                <div>
                  <Label>Admin Response</Label>
                  <div className="text-sm text-gray-900 bg-blue-50 p-3 rounded">
                    {selectedInquiry.adminResponse}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="text-sm text-gray-900">
                    {selectedInquiry.status}
                  </div>
                </div>
                <div>
                  <Label>Created At</Label>
                  <div className="text-sm text-gray-900">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertiseInquiriesPage;
