"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { publicAPI } from "@/lib/api-functions";
import { toast } from "react-hot-toast";
import {
  Star,
  MessageCircle,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const ReviewSection = ({ propertyId, propertyTitle }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    reviewerName: "",
    reviewerEmail: "",
    reviewerPhone: "",
    rating: 5,
    title: "",
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getPropertyReviews(propertyId, {
        page: 1,
        limit: 10,
      });
      setReviews(response.data.data.reviews);
      setReviewStats(response.data.data.stats);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.reviewerName || !reviewForm.comment) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmittingReview(true);
      await publicAPI.submitReview({
        ...reviewForm,
        propertyId,
      });
      toast.success(
        "Review submitted successfully! It will be visible after admin approval."
      );
      setShowReviewForm(false);
      setReviewForm({
        reviewerName: "",
        reviewerEmail: "",
        reviewerPhone: "",
        rating: 5,
        title: "",
        comment: "",
      });
      // Refresh reviews to show updated stats
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  const getRatingText = (rating) => {
    switch (rating) {
      case 5:
        return "Excellent";
      case 4:
        return "Very Good";
      case 3:
        return "Good";
      case 2:
        return "Fair";
      case 1:
        return "Poor";
      default:
        return "No Rating";
    }
  };

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white">
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="h-6 w-6 mr-3 text-[#1A3B4C]" />
                Customer Reviews
              </h3>
              <p className="text-gray-600 mt-1">
                What others are saying about this property
              </p>
            </div>
            <Button
              onClick={() => setShowReviewForm(true)}
              className="bg-[#1A3B4C] hover:bg-[#0A2B3C] text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Write a Review
            </Button>
          </div>

          {/* Review Stats */}
          <div className="bg-gradient-to-r from-[#1A3B4C]/5 to-[#2A4B5C]/5 p-6 rounded-2xl border border-[#1A3B4C]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1A3B4C]">
                    {reviewStats.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    {renderStars(Math.round(reviewStats.averageRating))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Average Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1A3B4C]">
                    {reviewStats.totalReviews}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {reviewStats.totalReviews === 1 ? "Review" : "Reviews"}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Based on verified reviews
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  All reviews are moderated
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#1A3B4C] rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {review.reviewerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getRatingText(review.rating)}
                      </div>
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {review.title}
                    </h4>
                  )}

                  <p className="text-gray-700 leading-relaxed break-words overflow-hidden">
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Verified Review</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  No Reviews Yet
                </h4>
                <p className="text-gray-600 mb-6">
                  Be the first to share your experience with this property!
                </p>
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-[#1A3B4C] hover:bg-[#0A2B3C] text-white px-6 py-2 rounded-xl"
                >
                  Write the First Review
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Write a Review
                </h3>
                <p className="text-gray-600">
                  Share your experience with {propertyTitle}
                </p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <Label className="text-gray-700 font-medium">Rating *</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm((prev) => ({ ...prev, rating: star }))
                        }
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= reviewForm.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {getRatingText(reviewForm.rating)}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    value={reviewForm.reviewerName}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        reviewerName: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={reviewForm.reviewerEmail}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        reviewerEmail: e.target.value,
                      }))
                    }
                    placeholder="your.email@example.com"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={reviewForm.reviewerPhone}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        reviewerPhone: e.target.value,
                      }))
                    }
                    placeholder="+91 90909 08081"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                  />
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-gray-700 font-medium">
                    Review Title
                  </Label>
                  <Input
                    id="title"
                    value={reviewForm.title}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Brief summary of your experience"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                  />
                </div>

                {/* Comment */}
                <div>
                  <Label
                    htmlFor="comment"
                    className="text-gray-700 font-medium"
                  >
                    Your Review *
                  </Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Share your detailed experience with this property..."
                    rows="4"
                    className="mt-2 rounded-xl border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                    required
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Review Moderation</p>
                      <p>
                        Your review will be reviewed by our team and published
                        within 24-48 hours if approved.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    variant="outline"
                    className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 bg-[#1A3B4C] hover:bg-[#0A2B3C] text-white rounded-xl"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReviewSection;
