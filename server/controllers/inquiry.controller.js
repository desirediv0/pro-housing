// Inquiry Management Controller

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all inquiries with filters and pagination
const getAllInquiries = async (req, res) => {
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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

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
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get inquiries with property details
    const inquiries = await prisma.inquiry.findMany({
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
    const totalInquiries = await prisma.inquiry.count({ where });
    const totalPages = Math.ceil(totalInquiries / take);

    // Get status counts
    const statusCounts = await prisma.inquiry.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const statusStats = statusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalInquiries,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
        statusStats,
      },
    });
  } catch (error) {
    console.error("Get inquiries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
      error: error.message,
    });
  }
};

// Get inquiry by ID
const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.inquiry.findUnique({
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

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error("Get inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiry",
      error: error.message,
    });
  }
};

// Create new inquiry (Public endpoint)
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;

    // Validate required fields
    if (!name || !email || !message || !propertyId) {
      return res.status(400).json({
        success: false,
        message: "Name, email, message, and propertyId are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if property exists
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

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim(),
        message: message.trim(),
        propertyId,
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

    // Update analytics - increment inquiry count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.analytics.upsert({
      where: { date: today },
      update: {
        totalInquiries: { increment: 1 },
      },
      create: {
        date: today,
        totalInquiries: 1,
      },
    });

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error("Create inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create inquiry",
      error: error.message,
    });
  }
};

// Create general inquiry (for contact form - without propertyId requirement)
const createGeneralInquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      subject,
      inquiryType = "GENERAL",
      propertyType,
      source = "CONTACT_FORM",
    } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Create general inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        message: message.trim(),
        subject: subject?.trim() || `${inquiryType} Inquiry`,
        type: inquiryType.toUpperCase(),
        propertyType: propertyType || null,
        source: source.toUpperCase(),
        status: "PENDING",
        propertyId: null, // No specific property
      },
    });

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully! We will get back to you soon.",
      data: inquiry,
    });
  } catch (error) {
    console.error("Create general inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
      error: error.message,
    });
  }
};

// Update inquiry status and add admin response
const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse, response } = req.body;

    // Validate status
    const validStatuses = ["PENDING", "RESPONDED", "CLOSED", "SPAM"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    // Check if inquiry exists
    const existingInquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!existingInquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Prepare update data
    const updateData = {};

    // Handle status update
    if (status) {
      updateData.status = status;
    }

    // Handle admin response (from both adminResponse and response fields)
    const responseText = adminResponse || response;
    if (responseText) {
      updateData.adminResponse = responseText.trim();
      updateData.respondedAt = new Date();
      // Auto-set status to RESPONDED if admin response is provided
      if (!status) {
        updateData.status = "RESPONDED";
      }
    }

    // Update inquiry
    const updatedInquiry = await prisma.inquiry.update({
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
      message: "Inquiry updated successfully",
      data: updatedInquiry,
    });
  } catch (error) {
    console.error("Update inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update inquiry",
      error: error.message,
    });
  }
};

// Delete inquiry
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if inquiry exists
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Delete inquiry
    await prisma.inquiry.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete inquiry",
      error: error.message,
    });
  }
};

// Bulk update inquiries
const bulkUpdateInquiries = async (req, res) => {
  try {
    const { inquiryIds, status, adminResponse } = req.body;

    if (!inquiryIds || !Array.isArray(inquiryIds) || inquiryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "inquiryIds array is required",
      });
    }

    // Validate status
    const validStatuses = ["PENDING", "RESPONDED", "CLOSED", "SPAM"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
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

    // Bulk update
    const result = await prisma.inquiry.updateMany({
      where: {
        id: { in: inquiryIds },
      },
      data: updateData,
    });

    res.json({
      success: true,
      message: `${result.count} inquiries updated successfully`,
      data: { updatedCount: result.count },
    });
  } catch (error) {
    console.error("Bulk update inquiries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update inquiries",
      error: error.message,
    });
  }
};

// Get inquiry statistics
const getInquiryStats = async (req, res) => {
  try {
    const { period = "30" } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total inquiries by status
    const statusCounts = await prisma.inquiry.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // Recent inquiries (last X days)
    const recentInquiries = await prisma.inquiry.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Daily inquiry counts for chart
    const dailyInquiries = await prisma.inquiry.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });

    // Top properties by inquiry count
    const topProperties = await prisma.inquiry.groupBy({
      by: ["propertyId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    });

    // Get property details for top properties
    const propertyIds = topProperties.map((item) => item.propertyId);
    const properties = await prisma.property.findMany({
      where: { id: { in: propertyIds } },
      select: {
        id: true,
        title: true,
        price: true,
        propertyType: true,
        city: true,
        mainImage: true,
      },
    });

    const topPropertiesWithDetails = topProperties.map((item) => ({
      ...item,
      property: properties.find((p) => p.id === item.propertyId),
    }));

    res.json({
      success: true,
      data: {
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {}),
        recentInquiries,
        dailyInquiries: dailyInquiries.map((item) => ({
          date: item.createdAt.toISOString().split("T")[0],
          count: item._count.id,
        })),
        topProperties: topPropertiesWithDetails,
      },
    });
  } catch (error) {
    console.error("Get inquiry stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiry statistics",
      error: error.message,
    });
  }
};

export {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  createGeneralInquiry,
  updateInquiry,
  deleteInquiry,
  bulkUpdateInquiries,
  getInquiryStats,
};
