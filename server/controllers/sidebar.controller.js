// Sidebar Content Management Controller
import { PrismaClient } from "@prisma/client";
import { deleteFromS3 } from "../utils/deleteFromS3.js";
const prisma = new PrismaClient();

// Get all sidebar content with filters
const getAllSidebarContent = async (req, res) => {
  try {
    const { isActive } = req.query;

    // Build filters
    const where = {};

    if (isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    const sidebarContent = await prisma.sidebarContent.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: { content: sidebarContent },
    });
  } catch (error) {
    console.error("Get sidebar content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sidebar content",
      error: error.message,
    });
  }
};

// Get public sidebar content (for frontend)
const getPublicSidebarContent = async (req, res) => {
  try {
    const sidebarContent = await prisma.sidebarContent.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        imageUrl: true,
        videoUrl: true,
        phoneNumber: true,
        whatsappNumber: true,
        isActive: true,
      },
    });

    res.json({
      success: true,
      data: sidebarContent,
    });
  } catch (error) {
    console.error("Get public sidebar content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sidebar content",
      error: error.message,
    });
  }
};

// Get sidebar content by ID
const getSidebarContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await prisma.sidebarContent.findUnique({
      where: { id },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Sidebar content not found",
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get sidebar content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sidebar content",
      error: error.message,
    });
  }
};

// Create new sidebar content
const createSidebarContent = async (req, res) => {
  try {
    const {
      isActive = true,
      imageUrl,
      videoUrl,
      phoneNumber,
      whatsappNumber,
    } = req.body;

    // Check if an active sidebar content already exists
    if (isActive) {
      const existingActiveSidebar = await prisma.sidebarContent.findFirst({
        where: { isActive: true },
      });

      if (existingActiveSidebar) {
        return res.status(400).json({
          success: false,
          message:
            "An active sidebar content already exists. Please deactivate the existing one first or set this as inactive.",
        });
      }
    }

    // Validate that at least one content is provided
    if (!imageUrl && !videoUrl && !phoneNumber && !whatsappNumber) {
      return res.status(400).json({
        success: false,
        message:
          "At least one content field (image, video, phone, or WhatsApp) is required",
      });
    }

    // Validate URL formats if provided
    if (imageUrl && !isValidUrl(imageUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image URL format",
      });
    }

    if (videoUrl && !isValidUrl(videoUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid video URL format",
      });
    }

    // Validate phone numbers if provided
    if (
      phoneNumber &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(phoneNumber.replace(/[\s\-\(\)]/g, ""))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    if (
      whatsappNumber &&
      !/^[\+]?[1-9][\d]{0,15}$/.test(whatsappNumber.replace(/[\s\-\(\)]/g, ""))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid WhatsApp number format",
      });
    }

    const newContent = await prisma.sidebarContent.create({
      data: {
        isActive,
        imageUrl: imageUrl?.trim(),
        videoUrl: videoUrl?.trim(),
        phoneNumber: phoneNumber?.trim(),
        whatsappNumber: whatsappNumber?.trim(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Sidebar content created successfully",
      data: newContent,
    });
  } catch (error) {
    console.error("Create sidebar content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create sidebar content",
      error: error.message,
    });
  }
};

// Update sidebar content
const updateSidebarContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, imageUrl, videoUrl, phoneNumber, whatsappNumber } =
      req.body;

    // Check if content exists
    const existingContent = await prisma.sidebarContent.findUnique({
      where: { id },
    });

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: "Sidebar content not found",
      });
    }

    // Prepare update data
    const updateData = {};

    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle image URL update with S3 cleanup
    if (imageUrl !== undefined) {
      if (imageUrl && !isValidUrl(imageUrl)) {
        return res.status(400).json({
          success: false,
          message: "Invalid image URL format",
        });
      }

      // Delete old image from S3 if it exists and is being replaced
      if (existingContent.imageUrl && imageUrl !== existingContent.imageUrl) {
        try {
          await deleteFromS3(existingContent.imageUrl);
          console.log("Old image deleted from S3:", existingContent.imageUrl);
        } catch (error) {
          console.error("Failed to delete old image from S3:", error);
          // Don't fail the update if S3 deletion fails
        }
      }

      updateData.imageUrl = imageUrl?.trim() || null;
    }

    // Handle video URL update with S3 cleanup
    if (videoUrl !== undefined) {
      if (videoUrl && !isValidUrl(videoUrl)) {
        return res.status(400).json({
          success: false,
          message: "Invalid video URL format",
        });
      }

      // Delete old video from S3 if it exists and is being replaced
      if (existingContent.videoUrl && videoUrl !== existingContent.videoUrl) {
        try {
          await deleteFromS3(existingContent.videoUrl);
          console.log("Old video deleted from S3:", existingContent.videoUrl);
        } catch (error) {
          console.error("Failed to delete old video from S3:", error);
          // Don't fail the update if S3 deletion fails
        }
      }

      updateData.videoUrl = videoUrl?.trim() || null;
    }

    if (phoneNumber !== undefined) {
      if (
        phoneNumber &&
        !/^[\+]?[1-9][\d]{0,15}$/.test(phoneNumber.replace(/[\s\-\(\)]/g, ""))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number format",
        });
      }
      updateData.phoneNumber = phoneNumber?.trim() || null;
    }

    if (whatsappNumber !== undefined) {
      if (
        whatsappNumber &&
        !/^[\+]?[1-9][\d]{0,15}$/.test(
          whatsappNumber.replace(/[\s\-\(\)]/g, "")
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid WhatsApp number format",
        });
      }
      updateData.whatsappNumber = whatsappNumber?.trim() || null;
    }

    const updatedContent = await prisma.sidebarContent.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: "Sidebar content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Update sidebar content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update sidebar content",
      error: error.message,
    });
  }
};

// Delete sidebar content
const deleteSidebarContent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if content exists
    const content = await prisma.sidebarContent.findUnique({
      where: { id },
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Sidebar content not found",
      });
    }

    // Delete associated files from S3
    const filesToDelete = [];
    if (content.imageUrl) filesToDelete.push(content.imageUrl);
    if (content.videoUrl) filesToDelete.push(content.videoUrl);

    // Delete files from S3 (don't let S3 errors block database deletion)
    if (filesToDelete.length > 0) {
      try {
        const deletePromises = filesToDelete.map((fileUrl) =>
          deleteFromS3(fileUrl)
        );
        await Promise.allSettled(deletePromises);
        console.log(
          `Deleted ${filesToDelete.length} files from S3 for sidebar content ${id}`
        );
      } catch (error) {
        console.error("Error deleting files from S3:", error);
        // Continue with database deletion even if S3 cleanup fails
      }
    }

    // Delete from database
    await prisma.sidebarContent.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Sidebar content deleted successfully",
    });
  } catch (error) {
    console.error("Delete sidebar content error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete sidebar content",
      error: error.message,
    });
  }
};

// Bulk update sidebar content status
const bulkUpdateStatus = async (req, res) => {
  try {
    const { contentIds, isActive } = req.body;

    if (!contentIds || !Array.isArray(contentIds) || contentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "contentIds array is required",
      });
    }

    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: "isActive status is required",
      });
    }

    const result = await prisma.sidebarContent.updateMany({
      where: {
        id: { in: contentIds },
      },
      data: {
        isActive,
      },
    });

    res.json({
      success: true,
      message: `${result.count} items updated successfully`,
      data: { updatedCount: result.count },
    });
  } catch (error) {
    console.error("Bulk update status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update content status",
      error: error.message,
    });
  }
};

// Helper function to validate URLs
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export {
  getAllSidebarContent,
  getPublicSidebarContent,
  getSidebarContentById,
  createSidebarContent,
  updateSidebarContent,
  deleteSidebarContent,
  bulkUpdateStatus,
};
