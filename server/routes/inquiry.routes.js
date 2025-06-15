// Inquiry Management Routes

import express from "express";
import {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  createGeneralInquiry,
  updateInquiry,
  deleteInquiry,
  bulkUpdateInquiries,
  getInquiryStats,
} from "../controllers/inquiry.controller.js";
import { verifyAdminToken } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/", createInquiry); // Create property-specific inquiry - public endpoint
router.post("/general", createGeneralInquiry); // Create general inquiry from contact form - public endpoint

// Admin protected routes
router.use(verifyAdminToken); // Apply admin middleware to all routes below

// GET /inquiries - Get all inquiries with filters and pagination
router.get("/", getAllInquiries);

// GET /inquiries/stats - Get inquiry statistics
router.get("/stats", getInquiryStats);

// GET /inquiries/:id - Get inquiry by ID
router.get("/:id", getInquiryById);

// PUT /inquiries/:id - Update inquiry (status, admin response)
router.put("/:id", updateInquiry);

// PATCH /inquiries/:id/status - Update inquiry status only
router.patch("/:id/status", updateInquiry);

// POST /inquiries/:id/respond - Respond to inquiry
router.post("/:id/respond", updateInquiry);

// DELETE /inquiries/:id - Delete inquiry
router.delete("/:id", deleteInquiry);

// PATCH /inquiries/bulk - Bulk update inquiries
router.patch("/bulk", bulkUpdateInquiries);

export default router;
