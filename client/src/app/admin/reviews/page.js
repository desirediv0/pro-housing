"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";
import {
  Star,
  MessageCircle,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Download,
} from "lucide-react";
import { adminAPI } from "@/lib/api-functions";
import toast from "react-hot-toast";
import useAdminProtection from "@/hooks/useAdminProtection";

export default function AdminReviews() {
  const { isLoading: authLoading, isAuthenticated } = useAdminProtection();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    statusBreakdown: [],
    recentReviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllReviews(filters);
      setReviews(response.data.data.reviews);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getReviewStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching review stats:", error);
    }
  };

  const handleStatusUpdate = async (reviewId, status) => {
    try {
      await adminAPI.updateReviewStatus(reviewId, status);
      toast.success(`Review ${status.toLowerCase()} successfully`);
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error("Error updating review status:", error);
      toast.error("Failed to update review status");
    }
  };

  const handleResponse = async () => {
    if (!selectedReview || !responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      await adminAPI.respondToReview(selectedReview.id, responseText);
      toast.success("Response sent successfully");
      setShowResponseModal(false);
      setResponseText("");
      setSelectedReview(null);
      fetchReviews();
    } catch (error) {
      console.error("Error sending response:", error);
      toast.error("Failed to send response");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await adminAPI.deleteReview(reviewId);
      toast.success("Review deleted successfully");
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleBulkAction = async (action) => {
    const selectedReviews = reviews.filter((review) => review.selected);
    if (selectedReviews.length === 0) {
      toast.error("Please select reviews to perform bulk action");
      return;
    }

    try {
      await adminAPI.bulkUpdateReviews(
        selectedReviews.map((r) => r.id),
        action
      );
      toast.success(
        `Successfully ${action}d ${selectedReviews.length} review(s)`
      );
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to perform bulk action");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
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
            Reviews Management
          </h1>
          <p className="text-gray-600">
            Manage and moderate property reviews from customers
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Total Reviews
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalReviews}
                </p>
              </div>
              <MessageCircle className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Average Rating
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </p>
                <div className="flex items-center mt-1">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
              </div>
              <Star className="h-12 w-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Pending Reviews
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.statusBreakdown.find((s) => s.status === "PENDING")
                    ?._count?.id || 0}
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
                <p className="text-sm font-medium text-gray-600">
                  Approved Reviews
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.statusBreakdown.find((s) => s.status === "APPROVED")
                    ?._count?.id || 0}
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reviews..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                      page: 1,
                    }))
                  }
                  className="pl-10 w-full md:w-64"
                />
              </div>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                    page: 1,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3B4C]"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleBulkAction("approve")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Approve Selected
              </Button>
              <Button
                onClick={() => handleBulkAction("reject")}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Reject Selected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>
            Manage customer reviews and their approval status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-[#1A3B4C] rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {review.reviewerName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                        {getStatusBadge(review.status)}
                      </div>

                      {review.property && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">
                            Property:{" "}
                          </span>
                          <span className="text-sm font-medium text-[#1A3B4C]">
                            {review.property.title}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 mb-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600">
                          ({review.rating}/5)
                        </span>
                      </div>

                      {review.title && (
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {review.title}
                        </h4>
                      )}

                      <p className="text-gray-700 text-sm mb-2">
                        {review.comment}
                      </p>

                      {review.adminResponse && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm font-medium text-blue-900 mb-1">
                            Admin Response:
                          </div>
                          <p className="text-sm text-blue-800">
                            {review.adminResponse}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {review.status === "PENDING" && (
                        <>
                          <Button
                            onClick={() =>
                              handleStatusUpdate(review.id, "APPROVED")
                            }
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedReview(review);
                              setShowResponseModal(true);
                            }}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => {
                          setSelectedReview(review);
                          setShowReviewModal(true);
                        }}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        onClick={() => handleDelete(review.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.currentPage} of{" "}
                    {pagination.totalPages} ({pagination.totalReviews} total
                    reviews)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                      disabled={!pagination.hasPrevPage}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={!pagination.hasNextPage}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Detail Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Review Details
                </h3>
                <Button
                  onClick={() => setShowReviewModal(false)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#1A3B4C] rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {selectedReview.reviewerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedReview.createdAt)}
                    </div>
                    {getStatusBadge(selectedReview.status)}
                  </div>
                </div>

                {selectedReview.property && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Property Details:
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Title: {selectedReview.property.title}</div>
                      <div>Type: {selectedReview.property.propertyType}</div>
                      <div>
                        Price: ₹
                        {selectedReview.property.price?.toLocaleString()}
                      </div>
                      <div>Location: {selectedReview.property.city}</div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(selectedReview.rating)}
                    <span className="text-lg font-medium text-gray-900">
                      {selectedReview.rating}/5
                    </span>
                  </div>
                </div>

                {selectedReview.title && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Review Title:
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedReview.title}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Review Comment:
                  </div>
                  <div className="text-gray-900 leading-relaxed">
                    {selectedReview.comment}
                  </div>
                </div>

                {selectedReview.reviewerEmail && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Contact Email:
                    </div>
                    <div className="text-gray-900">
                      {selectedReview.reviewerEmail}
                    </div>
                  </div>
                )}

                {selectedReview.reviewerPhone && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Contact Phone:
                    </div>
                    <div className="text-gray-900">
                      {selectedReview.reviewerPhone}
                    </div>
                  </div>
                )}

                {selectedReview.adminResponse && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-2">
                      Admin Response:
                    </div>
                    <div className="text-blue-800">
                      {selectedReview.adminResponse}
                    </div>
                    {selectedReview.respondedAt && (
                      <div className="text-xs text-blue-600 mt-2">
                        Responded on: {formatDate(selectedReview.respondedAt)}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  {selectedReview.status === "PENDING" && (
                    <>
                      <Button
                        onClick={() => {
                          handleStatusUpdate(selectedReview.id, "APPROVED");
                          setShowReviewModal(false);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Review
                      </Button>
                      <Button
                        onClick={() => {
                          setShowReviewModal(false);
                          setShowResponseModal(true);
                        }}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject with Response
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handleDelete(selectedReview.id)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Reject Review
                </h3>
                <p className="text-gray-600">
                  Provide a reason for rejecting this review
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-medium">
                    Response to Reviewer *
                  </Label>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Explain why this review is being rejected..."
                    rows="4"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowResponseModal(false);
                      setResponseText("");
                      setSelectedReview(null);
                    }}
                    variant="outline"
                    className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleResponse}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  >
                    Reject Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
