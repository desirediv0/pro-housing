// Analytics Dashboard Routes

import express from "express";
import {
  getDashboardStats,
  getAnalyticsData,
  getPropertyAnalytics,
  exportAnalytics,
  getRecentActivities,
} from "../controllers/analytics.controller.js";
import { verifyAdminToken } from "../middlewares/admin.middleware.js";

const router = express.Router();

// All analytics routes require admin authentication
router.use(verifyAdminToken);

// GET /analytics/dashboard - Get dashboard overview stats
router.get("/dashboard", getDashboardStats);

// GET /analytics/data - Get analytics data for charts (daily/monthly)
router.get("/data", getAnalyticsData);

// GET /analytics/properties - Get property performance analytics
router.get("/properties", getPropertyAnalytics);

// GET /analytics/export - Export analytics data (JSON/CSV)
router.get("/export", exportAnalytics);

// GET /analytics/recent-activities - Get recent activities for dashboard
router.get("/recent-activities", getRecentActivities);

export default router;
