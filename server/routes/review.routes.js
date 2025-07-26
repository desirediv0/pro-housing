import express from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
  bulkUpdateReviews,
  getReviewStats,
} from "../controllers/review.controller.js";
import { verifyAdminToken } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/", createReview); // Submit a new review
router.get("/property/:propertyId", getPropertyReviews); // Get approved reviews for a property

// Admin routes (require authentication)
router.get("/", verifyAdminToken, getAllReviews); // Get all reviews with filters
router.get("/stats", verifyAdminToken, getReviewStats); // Get review statistics
router.get("/:id", verifyAdminToken, getReviewById); // Get specific review
router.put("/:id", verifyAdminToken, updateReview); // Update review status
router.delete("/:id", verifyAdminToken, deleteReview); // Delete review
router.post("/bulk", verifyAdminToken, bulkUpdateReviews); // Bulk update reviews

export default router;
