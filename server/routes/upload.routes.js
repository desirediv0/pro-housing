import express from "express";
import fs from "fs";
import path from "path";
import {
  propertyUpload,
  sidebarUpload,
  profileUpload,
  getFileUrl,
  deleteFile,
} from "../config/upload.js";
import { verifyAdminToken } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Property image upload
router.post(
  "/property/images",
  verifyAdminToken,
  propertyUpload.array("images", 20),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        url: getFileUrl(file.path, req),
        size: file.size,
        mimetype: file.mimetype,
      }));

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully`,
        data: uploadedFiles,
      });
    } catch (error) {
      console.error("Property image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload files",
        error: error.message,
      });
    }
  }
);

// Property document upload
router.post(
  "/property/documents",
  verifyAdminToken,
  propertyUpload.array("documents", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No documents uploaded",
        });
      }

      const uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        url: getFileUrl(file.path, req),
        size: file.size,
        mimetype: file.mimetype,
      }));

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} documents uploaded successfully`,
        data: uploadedFiles,
      });
    } catch (error) {
      console.error("Property document upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload documents",
        error: error.message,
      });
    }
  }
);

// Sidebar image upload
router.post(
  "/sidebar/images",
  verifyAdminToken,
  sidebarUpload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No images uploaded",
        });
      }

      const uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        url: getFileUrl(file.path, req),
        size: file.size,
        mimetype: file.mimetype,
      }));

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} sidebar images uploaded successfully`,
        data: uploadedFiles,
      });
    } catch (error) {
      console.error("Sidebar image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload sidebar images",
        error: error.message,
      });
    }
  }
);

// Profile image upload
router.post(
  "/profile/image",
  verifyAdminToken,
  profileUpload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      const uploadedFile = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        url: getFileUrl(req.file.path, req),
        size: req.file.size,
        mimetype: req.file.mimetype,
      };

      res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        data: uploadedFile,
      });
    } catch (error) {
      console.error("Profile image upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload profile image",
        error: error.message,
      });
    }
  }
);

// Delete file
router.delete("/file", verifyAdminToken, async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "File path is required",
      });
    }

    const deleted = deleteFile(filePath);

    if (deleted) {
      res.status(200).json({
        success: true,
        message: "File deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "File not found or already deleted",
      });
    }
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message,
    });
  }
});

// Get file info
router.get("/file/info", verifyAdminToken, async (req, res) => {
  try {
    const { filePath } = req.query;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "File path is required",
      });
    }

    // fs and path already imported at top

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const fileInfo = {
        exists: true,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: filePath,
        url: getFileUrl(filePath, req),
        extension: path.extname(filePath),
      };

      res.status(200).json({
        success: true,
        data: fileInfo,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
    }
  } catch (error) {
    console.error("File info error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get file info",
      error: error.message,
    });
  }
});

export default router;
