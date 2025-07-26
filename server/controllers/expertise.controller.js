import { prisma } from "../config/db.js";
import { SendEmail } from "../email/SendEmail.js";

// Get all expertise inquiries with filters and pagination
const getAllExpertiseInquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      serviceType,
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

    if (serviceType) {
      where.serviceType = serviceType;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { additionalNotes: { contains: search, mode: "insensitive" } },
        { loanRequirements: { contains: search, mode: "insensitive" } },
        { landDetails: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get expertise inquiries
    const inquiries = await prisma.expertiseInquiry.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
    });

    // Get total count
    const totalInquiries = await prisma.expertiseInquiry.count({ where });
    const totalPages = Math.ceil(totalInquiries / take);

    // Get status counts
    const statusCounts = await prisma.expertiseInquiry.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const statusStats = statusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {});

    // Get service type counts
    const serviceTypeCounts = await prisma.expertiseInquiry.groupBy({
      by: ["serviceType"],
      _count: { id: true },
    });

    const serviceTypeStats = serviceTypeCounts.reduce((acc, item) => {
      acc[item.serviceType] = item._count.id;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          currentPage: validPage,
          totalPages,
          totalInquiries,
          hasNext: validPage < totalPages,
          hasPrev: validPage > 1,
        },
        statusStats,
        serviceTypeStats,
      },
    });
  } catch (error) {
    console.error("Get expertise inquiries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expertise inquiries",
      error: error.message,
    });
  }
};

// Get expertise inquiry by ID
const getExpertiseInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await prisma.expertiseInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Expertise inquiry not found",
      });
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error("Get expertise inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expertise inquiry",
      error: error.message,
    });
  }
};

// Create new expertise inquiry (Public endpoint)
const createExpertiseInquiry = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      emailAddress,
      preferredTimeSlot,
      consultationType,
      additionalNotes,
      loanRequirements,
      landDetails,
      serviceType,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !phoneNumber ||
      !emailAddress ||
      !preferredTimeSlot ||
      !consultationType ||
      !serviceType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: fullName, phoneNumber, emailAddress, preferredTimeSlot, consultationType, serviceType",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    // Create expertise inquiry
    const inquiry = await prisma.expertiseInquiry.create({
      data: {
        fullName: fullName.trim(),
        email: emailAddress.toLowerCase().trim(),
        phone: phoneNumber.trim(),
        preferredTimeSlot,
        consultationType,
        additionalNotes: additionalNotes?.trim() || null,
        loanRequirements: loanRequirements?.trim() || null,
        landDetails: landDetails?.trim() || null,
        serviceType: serviceType.toUpperCase(),
        status: "PENDING",
      },
    });

    // Send confirmation email to user
    const userEmailContent = `
      <h2>Thank you for your ${serviceType} consultation request!</h2>
      <p>Dear ${fullName},</p>
      <p>We have received your request for ${serviceType} consultation. Here are the details:</p>
      <ul>
        <li><strong>Service:</strong> ${serviceType}</li>
        <li><strong>Preferred Time:</strong> ${preferredTimeSlot}</li>
        <li><strong>Consultation Type:</strong> ${consultationType}</li>
      </ul>
      <p>Our team will review your request and contact you within 24 hours to confirm your appointment.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>Pro Housing Team</p>
    `;

    await SendEmail({
      email: emailAddress,
      subject: `${serviceType} Consultation Request Confirmation`,
      message: userEmailContent,
    });

    // Send notification email to admin
    const adminEmailContent = `
      <h2>New ${serviceType} Consultation Request</h2>
      <p>A new expertise consultation request has been submitted:</p>
      <ul>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> ${emailAddress}</li>
        <li><strong>Phone:</strong> ${phoneNumber}</li>
        <li><strong>Service:</strong> ${serviceType}</li>
        <li><strong>Preferred Time:</strong> ${preferredTimeSlot}</li>
        <li><strong>Consultation Type:</strong> ${consultationType}</li>
        ${
          additionalNotes
            ? `<li><strong>Additional Notes:</strong> ${additionalNotes}</li>`
            : ""
        }
        ${
          loanRequirements
            ? `<li><strong>Loan Requirements:</strong> ${loanRequirements}</li>`
            : ""
        }
        ${
          landDetails
            ? `<li><strong>Land Details:</strong> ${landDetails}</li>`
            : ""
        }
      </ul>
      <p>Please review and respond to this inquiry.</p>
    `;

    await SendEmail({
      email: process.env.FROM_EMAIL,
      subject: `New ${serviceType} Consultation Request - ${fullName}`,
      message: adminEmailContent,
    });

    res.status(201).json({
      success: true,
      message: "Expertise inquiry submitted successfully",
      data: {
        id: inquiry.id,
        serviceType,
        submittedAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    console.error("Create expertise inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit expertise inquiry",
      error: error.message,
    });
  }
};

// Update expertise inquiry status and add admin response
const updateExpertiseInquiry = async (req, res) => {
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
    const existingInquiry = await prisma.expertiseInquiry.findUnique({
      where: { id },
    });

    if (!existingInquiry) {
      return res.status(404).json({
        success: false,
        message: "Expertise inquiry not found",
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
    const updatedInquiry = await prisma.expertiseInquiry.update({
      where: { id },
      data: updateData,
    });

    // Send response email to user if admin response is provided
    if (responseText) {
      const userEmailContent = `
        <h2>Response to your ${existingInquiry.serviceType} consultation request</h2>
        <p>Dear ${existingInquiry.fullName},</p>
        <p>Thank you for your inquiry. Here is our response:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
          ${responseText}
        </div>
        <p>If you have any further questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Pro Housing Team</p>
      `;

      await SendEmail({
        email: existingInquiry.email,
        subject: `Response to your ${existingInquiry.serviceType} consultation request`,
        message: userEmailContent,
      });
    }

    res.json({
      success: true,
      message: "Expertise inquiry updated successfully",
      data: updatedInquiry,
    });
  } catch (error) {
    console.error("Update expertise inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update expertise inquiry",
      error: error.message,
    });
  }
};

// Delete expertise inquiry
const deleteExpertiseInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if inquiry exists
    const inquiry = await prisma.expertiseInquiry.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Expertise inquiry not found",
      });
    }

    // Delete inquiry
    await prisma.expertiseInquiry.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Expertise inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete expertise inquiry error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete expertise inquiry",
      error: error.message,
    });
  }
};

// Bulk update expertise inquiries
const bulkUpdateExpertiseInquiries = async (req, res) => {
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
    const result = await prisma.expertiseInquiry.updateMany({
      where: {
        id: { in: inquiryIds },
      },
      data: updateData,
    });

    res.json({
      success: true,
      message: `${result.count} expertise inquiries updated successfully`,
      data: { updatedCount: result.count },
    });
  } catch (error) {
    console.error("Bulk update expertise inquiries error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update expertise inquiries",
      error: error.message,
    });
  }
};

// Get expertise inquiry statistics
const getExpertiseInquiryStats = async (req, res) => {
  try {
    const { period = "30" } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total inquiries by status
    const statusCounts = await prisma.expertiseInquiry.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // Total inquiries by service type
    const serviceTypeCounts = await prisma.expertiseInquiry.groupBy({
      by: ["serviceType"],
      _count: { id: true },
    });

    // Recent inquiries (last X days)
    const recentInquiries = await prisma.expertiseInquiry.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Daily inquiry counts for chart
    const dailyInquiries = await prisma.expertiseInquiry.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: startDate },
      },
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });

    res.json({
      success: true,
      data: {
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {}),
        serviceTypeCounts: serviceTypeCounts.reduce((acc, item) => {
          acc[item.serviceType] = item._count.id;
          return acc;
        }, {}),
        recentInquiries,
        dailyInquiries: dailyInquiries.map((item) => ({
          date: item.createdAt.toISOString().split("T")[0],
          count: item._count.id,
        })),
      },
    });
  } catch (error) {
    console.error("Get expertise inquiry stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expertise inquiry statistics",
      error: error.message,
    });
  }
};

export {
  getAllExpertiseInquiries,
  getExpertiseInquiryById,
  createExpertiseInquiry,
  updateExpertiseInquiry,
  deleteExpertiseInquiry,
  bulkUpdateExpertiseInquiries,
  getExpertiseInquiryStats,
};
