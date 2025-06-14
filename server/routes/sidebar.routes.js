import express from "express";
import {
  getAllSidebarContent,
  getPublicSidebarContent,
  getSidebarContentById,
  createSidebarContent,
  updateSidebarContent,
  deleteSidebarContent,
  bulkUpdateStatus,
} from "../controllers/sidebar.controller.js";
import { verifyAdminToken } from "../middlewares/admin.middleware.js";
import { uploadFiles } from "../middlewares/multer.middlerware.js";
import { uploadImageToS3, uploadToS3 } from "../utils/uploadToS3.js";
import { deleteFromS3 } from "../utils/deleteFromS3.js";

const router = express.Router();

// Public routes (no authentication required)
// GET /sidebar/public - Get active sidebar content for frontend
router.get("/public", getPublicSidebarContent);

// Admin protected routes
router.use(verifyAdminToken); // Apply admin middleware to all routes below

// GET /sidebar - Get all sidebar content (admin view)
router.get("/", getAllSidebarContent);

// GET /sidebar/:id - Get sidebar content by ID
router.get("/:id", getSidebarContentById);

// POST /sidebar - Create new sidebar content
router.post("/", createSidebarContent);

// PUT /sidebar/:id - Update sidebar content
router.put("/:id", updateSidebarContent);

// DELETE /sidebar/:id - Delete sidebar content
router.delete("/:id", deleteSidebarContent);

// PATCH /sidebar/bulk-status - Bulk update content status (active/inactive)
router.patch("/bulk-status", bulkUpdateStatus);

// File upload routes
// POST /sidebar/upload/image - Upload image for sidebar content
router.post("/upload/image", uploadFiles.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "File must be an image",
      });
    }

    const result = await uploadImageToS3(
      req.file,
      `${process.env.UPLOAD_FOLDER}/sidebar/images`,
      80,
      1200
    );

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.url,
        fileName: result.fileName,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
});

// POST /sidebar/upload/video - Upload video for sidebar content
router.post("/upload/video", uploadFiles.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith("video/")) {
      return res.status(400).json({
        success: false,
        message: "File must be a video",
      });
    }

    // Check file size (limit to 50MB)
    if (req.file.size > 50 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Video file size must be less than 50MB",
      });
    }

    const result = await uploadToS3(
      req.file,
      `${process.env.UPLOAD_FOLDER}/sidebar/videos`
    );

    res.json({
      success: true,
      message: "Video uploaded successfully",
      data: {
        url: result.url,
        fileName: result.fileName,
      },
    });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload video",
      error: error.message,
    });
  }
});

// DELETE /sidebar/upload/delete - Delete file from S3
router.delete("/upload/delete", async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "File URL is required",
      });
    }

    await deleteFromS3(fileUrl);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message,
    });
  }
});

export default router;
