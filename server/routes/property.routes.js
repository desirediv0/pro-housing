import express from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  addPropertyImages,
  deletePropertyImage,
  addPropertyVideos,
  deletePropertyVideo,
  togglePropertyStatus,
  updatePropertyHighlight,
  getPropertyAnalytics,
  getFeaturedProperties,
  getTrendingProperties,
  bulkUpdateHighlights,
  getPropertiesByHighlight,
  getPublicProperties,
  getPublicPropertyBySlug,
  getPropertiesByCategory,
  getPropertyCategoriesStats,
} from "../controllers/property.controller.js";
import { verifyAdminToken } from "../middlewares/admin.middleware.js";
import {
  propertyUpload,
  multipleImagesUpload,
  multipleVideosUpload,
  handleMulterError,
} from "../middlewares/propertyUpload.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/public", getPublicProperties); // Public properties with pagination and filters
router.get("/public/featured", getFeaturedProperties); // Public featured properties
router.get("/search", getPublicProperties); // Public search with better filtering
router.get("/featured", getFeaturedProperties); // Dedicated featured properties endpoint
router.get("/trending", getTrendingProperties);
router.get("/highlight/:highlight", getPropertiesByHighlight);
router.get("/public/slug/:slug", getPublicPropertyBySlug); // Public property details by slug
router.get("/public/:propertyId", getPropertyById); // Public property details
router.get("/public/category/:category", getPropertiesByCategory); // Public properties by category
router.get("/public/categories/stats", getPropertyCategoriesStats); // Public category statistics

// Categories routes
router.get("/categories/stats", getPropertyCategoriesStats); // Category statistics
router.get("/category/:category", getPropertiesByCategory); // Properties by category

// Admin routes (require authentication)
router.use(verifyAdminToken);

// Property CRUD routes
router.post("/create", propertyUpload, handleMulterError, createProperty);
router.get("/all", getAllProperties);
router.get("/:propertyId", getPropertyById);
router.put("/:propertyId", propertyUpload, handleMulterError, updateProperty);
router.delete("/:propertyId", deleteProperty);

// Property media management
router.post(
  "/:propertyId/images",
  multipleImagesUpload,
  handleMulterError,
  addPropertyImages
);
router.delete("/images/:imageId", deletePropertyImage);
router.post(
  "/:propertyId/videos",
  multipleVideosUpload,
  handleMulterError,
  addPropertyVideos
);
router.delete("/videos/:videoId", deletePropertyVideo);

// Property status management
router.patch("/:propertyId/status", togglePropertyStatus);
router.patch("/:propertyId/highlight", updatePropertyHighlight);
router.patch("/bulk/highlights", bulkUpdateHighlights);

// Property analytics
router.get("/:propertyId/analytics", getPropertyAnalytics);

export default router;
