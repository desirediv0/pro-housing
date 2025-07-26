// Review Management Controller

import { prisma } from "../config/db.js";

// Get all reviews with filters and pagination (Admin)
const getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      propertyId,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Ensure page and limit are valid numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Validate and set defaults
    const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;
    const validLimit =
      Number.isInteger(limitNum) && limitNum > 0 ? limitNum : 10;

    const skip = (validPage - 1) * validLimit;
    const take = validLimit;

    // Build filters
    const where = {};

    if (status) {
      where.status = status;
    }

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (search) {
      where.OR = [
        { reviewerName: { contains: search, mode: "insensitive" } },
        { reviewerEmail: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
        { comment: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get reviews with property details
    const reviews = await prisma.propertyReview.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            propertyType: true,
            listingType: true,
            city: true,
            mainImage: true,
          },
        },
      },
    });

    // Get total count
    const totalReviews = await prisma.propertyReview.count({ where });
    const totalPages = Math.ceil(totalReviews / take);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: validPage,
          totalPages,
          totalReviews,
          hasNextPage: validPage < totalPages,
          hasPrevPage: validPage > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Get review by ID (Admin)
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.propertyReview.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            propertyType: true,
            listingType: true,
            address: true,
            city: true,
            state: true,
            mainImage: true,
            bedrooms: true,
            bathrooms: true,
            area: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Get review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch review",
      error: error.message,
    });
  }
};

// Create new review (Public endpoint)
const createReview = async (req, res) => {
  try {
    const {
      propertyId,
      reviewerName,
      reviewerEmail,
      reviewerPhone,
      rating,
      title,
      comment,
    } = req.body;

    // Validate required fields
    if (!propertyId || !reviewerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "PropertyId, reviewerName, rating, and comment are required",
      });
    }

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Validate email format if provided
    if (reviewerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(reviewerEmail)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }
    }

    // Check if property exists and is active
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, isActive: true },
    });

    if (!property || !property.isActive) {
      return res.status(404).json({
        success: false,
        message: "Property not found or inactive",
      });
    }

    // Create review
    const review = await prisma.propertyReview.create({
      data: {
        propertyId,
        reviewerName: reviewerName.trim(),
        reviewerEmail: reviewerEmail?.toLowerCase().trim(),
        reviewerPhone: reviewerPhone?.trim(),
        rating: parseInt(rating),
        title: title?.trim(),
        comment: comment.trim(),
        status: "PENDING",
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            propertyType: true,
            listingType: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message:
        "Review submitted successfully! It will be visible after admin approval.",
      data: review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message,
    });
  }
};

// Get approved reviews for a property (Public endpoint)
const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true, isActive: true },
    });

    if (!property || !property.isActive) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Get approved reviews only
    const reviews = await prisma.propertyReview.findMany({
      where: {
        propertyId,
        status: "APPROVED",
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reviewerName: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
      },
    });

    // Get total count of approved reviews
    const totalReviews = await prisma.propertyReview.count({
      where: {
        propertyId,
        status: "APPROVED",
      },
    });

    // Calculate average rating
    const averageRating = await prisma.propertyReview.aggregate({
      where: {
        propertyId,
        status: "APPROVED",
      },
      _avg: {
        rating: true,
      },
    });

    const totalPages = Math.ceil(totalReviews / limitNum);

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          totalReviews,
          averageRating: averageRating._avg.rating || 0,
        },
        pagination: {
          currentPage: pageNum,
          totalPages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get property reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Update review status and add admin response (Admin)
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    // Validate status
    const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    // Check if review exists
    const existingReview = await prisma.propertyReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Prepare update data
    const updateData = {};

    if (status) {
      updateData.status = status;
    }

    if (adminResponse) {
      updateData.adminResponse = adminResponse.trim();
      updateData.respondedAt = new Date();
    }

    // Update review
    const updatedReview = await prisma.propertyReview.update({
      where: { id },
      data: updateData,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            propertyType: true,
            listingType: true,
            city: true,
            mainImage: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// Delete review (Admin)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if review exists
    const review = await prisma.propertyReview.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Delete review
    await prisma.propertyReview.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// Bulk update reviews (Admin)
const bulkUpdateReviews = async (req, res) => {
  try {
    const { reviewIds, action, adminResponse } = req.body;

    if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Review IDs array is required",
      });
    }

    if (!action || !["approve", "reject", "delete"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be one of: approve, reject, delete",
      });
    }

    let result;

    switch (action) {
      case "approve":
        result = await prisma.propertyReview.updateMany({
          where: { id: { in: reviewIds } },
          data: { status: "APPROVED" },
        });
        break;
      case "reject":
        result = await prisma.propertyReview.updateMany({
          where: { id: { in: reviewIds } },
          data: {
            status: "REJECTED",
            adminResponse: adminResponse || "Review rejected by admin",
            respondedAt: new Date(),
          },
        });
        break;
      case "delete":
        result = await prisma.propertyReview.deleteMany({
          where: { id: { in: reviewIds } },
        });
        break;
    }

    res.json({
      success: true,
      message: `Successfully ${action}d ${result.count} review(s)`,
      data: { updatedCount: result.count },
    });
  } catch (error) {
    console.error("Bulk update reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update reviews",
      error: error.message,
    });
  }
};

// Get review statistics (Admin)
const getReviewStats = async (req, res) => {
  try {
    const stats = await prisma.propertyReview.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const totalReviews = await prisma.propertyReview.count();
    const averageRating = await prisma.propertyReview.aggregate({
      where: { status: "APPROVED" },
      _avg: { rating: true },
    });

    const recentReviews = await prisma.propertyReview.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            mainImage: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        totalReviews,
        averageRating: averageRating._avg.rating || 0,
        statusBreakdown: stats,
        recentReviews,
      },
    });
  } catch (error) {
    console.error("Get review stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch review statistics",
      error: error.message,
    });
  }
};

export {
  getAllReviews,
  getReviewById,
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
  bulkUpdateReviews,
  getReviewStats,
};
