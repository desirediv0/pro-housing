// Expertise Inquiry Management Routes

import express from "express";
import {
  getAllExpertiseInquiries,
  getExpertiseInquiryById,
  createExpertiseInquiry,
  updateExpertiseInquiry,
  deleteExpertiseInquiry,
  bulkUpdateExpertiseInquiries,
  getExpertiseInquiryStats,
} from "../controllers/expertise.controller.js";
import { verifyAdminToken } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/", createExpertiseInquiry); // Create expertise inquiry - public endpoint

// Admin protected routes
router.use(verifyAdminToken); // Apply admin middleware to all routes below

// GET /expertise - Get all expertise inquiries with filters and pagination
router.get("/", getAllExpertiseInquiries);

// GET /expertise/stats - Get expertise inquiry statistics
router.get("/stats", getExpertiseInquiryStats);

// GET /expertise/:id - Get expertise inquiry by ID
router.get("/:id", getExpertiseInquiryById);

// PUT /expertise/:id - Update expertise inquiry (status, admin response)
router.put("/:id", updateExpertiseInquiry);

// PATCH /expertise/:id/status - Update expertise inquiry status only
router.patch("/:id/status", updateExpertiseInquiry);

// POST /expertise/:id/respond - Respond to expertise inquiry
router.post("/:id/respond", updateExpertiseInquiry);

// DELETE /expertise/:id - Delete expertise inquiry
router.delete("/:id", deleteExpertiseInquiry);

// PATCH /expertise/bulk - Bulk update expertise inquiries
router.patch("/bulk", bulkUpdateExpertiseInquiries);

export default router; 