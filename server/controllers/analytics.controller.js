// Analytics Dashboard Controller

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get dashboard overview stats
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Today's analytics
    const todayStats = await prisma.analytics.findUnique({
      where: { date: today },
    });

    // Yesterday's analytics for comparison
    const yesterdayStats = await prisma.analytics.findUnique({
      where: { date: yesterday },
    });

    // Current month totals
    const currentMonthStats = await prisma.analytics.aggregate({
      where: {
        date: { gte: startOfMonth },
      },
      _sum: {
        totalViews: true,
        totalClicks: true,
        totalInquiries: true,
        newProperties: true,
      },
    });

    // Last month totals for comparison
    const lastMonthStats = await prisma.analytics.aggregate({
      where: {
        date: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: {
        totalViews: true,
        totalClicks: true,
        totalInquiries: true,
        newProperties: true,
      },
    });

    // Property counts by type and status
    const propertyStats = await prisma.property.groupBy({
      by: ["propertyType", "status"],
      _count: { id: true },
    });

    // Property counts by listing type (Buy/Sell/Rent)
    const listingTypeStats = await prisma.property.groupBy({
      by: ["listingType"],
      _count: { id: true },
      where: { isActive: true },
    });

    // Property counts by status
    const statusStats = await prisma.property.groupBy({
      by: ["status"],
      _count: { id: true },
      where: { isActive: true },
    });

    // Total properties count
    const totalProperties = await prisma.property.count();
    const activeProperties = await prisma.property.count({
      where: { isActive: true },
    });

    // Recent inquiries count
    const totalInquiries = await prisma.inquiry.count();
    const pendingInquiries = await prisma.inquiry.count({
      where: { status: "PENDING" },
    });

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (!previous) return 0;
      return (((current - previous) / previous) * 100).toFixed(1);
    };

    const todayViews = todayStats?.totalViews || 0;
    const yesterdayViews = yesterdayStats?.totalViews || 0;

    const todayInquiries = todayStats?.totalInquiries || 0;
    const yesterdayInquiries = yesterdayStats?.totalInquiries || 0;

    // Process listing type statistics
    const listingTypeCounts = listingTypeStats.reduce((acc, item) => {
      acc[item.listingType] = item._count.id;
      return acc;
    }, {});

    // Process status statistics
    const statusCounts = statusStats.reduce((acc, item) => {
      acc[item.status] = item._count.id;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        overview: {
          totalProperties,
          activeProperties,
          totalInquiries,
          pendingInquiries,
          todayViews,
          todayInquiries,
          // Add listing type counts
          saleProperties: listingTypeCounts.SALE || 0,
          rentProperties: listingTypeCounts.RENT || 0,
          leaseProperties: listingTypeCounts.LEASE || 0,
          // Add status counts
          availableProperties: statusCounts.AVAILABLE || 0,
          soldProperties: statusCounts.SOLD || 0,
          rentedProperties: statusCounts.RENTED || 0,
          underNegotiationProperties: statusCounts.UNDER_NEGOTIATION || 0,
          withdrawnProperties: statusCounts.WITHDRAWN || 0,
        },
        trends: {
          viewsChange: calculateChange(todayViews, yesterdayViews),
          inquiriesChange: calculateChange(todayInquiries, yesterdayInquiries),
          monthlyViews: currentMonthStats._sum.totalViews || 0,
          monthlyInquiries: currentMonthStats._sum.totalInquiries || 0,
          monthlyViewsChange: calculateChange(
            currentMonthStats._sum.totalViews || 0,
            lastMonthStats._sum.totalViews || 0
          ),
          monthlyInquiriesChange: calculateChange(
            currentMonthStats._sum.totalInquiries || 0,
            lastMonthStats._sum.totalInquiries || 0
          ),
        },
        propertyBreakdown: propertyStats,
        listingTypeBreakdown: listingTypeStats,
        statusBreakdown: statusStats,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// Get analytics data for charts
const getAnalyticsData = async (req, res) => {
  try {
    const { period = "30", type = "daily" } = req.query;
    const days = parseInt(period);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let groupBy = [];
    let orderBy = {};

    if (type === "daily") {
      groupBy = ["date"];
      orderBy = { date: "asc" };
    } else if (type === "monthly") {
      // For monthly, we'll group by year and month
      const monthlyData = await prisma.analytics.groupBy({
        by: ["date"],
        where: {
          date: { gte: startDate, lte: endDate },
        },
        _sum: {
          totalViews: true,
          totalClicks: true,
          totalInquiries: true,
          newProperties: true,
          apartmentViews: true,
          houseViews: true,
          plotViews: true,
          commercialViews: true,
        },
        orderBy: { date: "asc" },
      });

      // Group by month
      const monthlyGrouped = monthlyData.reduce((acc, item) => {
        const monthKey = item.date.toISOString().substring(0, 7); // YYYY-MM

        if (!acc[monthKey]) {
          acc[monthKey] = {
            period: monthKey,
            totalViews: 0,
            totalClicks: 0,
            totalInquiries: 0,
            newProperties: 0,
            apartmentViews: 0,
            houseViews: 0,
            plotViews: 0,
            commercialViews: 0,
          };
        }

        acc[monthKey].totalViews += item._sum.totalViews || 0;
        acc[monthKey].totalClicks += item._sum.totalClicks || 0;
        acc[monthKey].totalInquiries += item._sum.totalInquiries || 0;
        acc[monthKey].newProperties += item._sum.newProperties || 0;
        acc[monthKey].apartmentViews += item._sum.apartmentViews || 0;
        acc[monthKey].houseViews += item._sum.houseViews || 0;
        acc[monthKey].plotViews += item._sum.plotViews || 0;
        acc[monthKey].commercialViews += item._sum.commercialViews || 0;

        return acc;
      }, {});

      return res.json({
        success: true,
        data: Object.values(monthlyGrouped),
      });
    }

    // Daily analytics
    const analytics = await prisma.analytics.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      orderBy,
    });

    // Fill missing dates with zero values
    const filledData = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const existingData = analytics.find(
        (item) => item.date.toISOString().split("T")[0] === dateStr
      );

      filledData.push({
        date: dateStr,
        totalViews: existingData?.totalViews || 0,
        totalClicks: existingData?.totalClicks || 0,
        totalInquiries: existingData?.totalInquiries || 0,
        newProperties: existingData?.newProperties || 0,
        apartmentViews: existingData?.apartmentViews || 0,
        houseViews: existingData?.houseViews || 0,
        plotViews: existingData?.plotViews || 0,
        commercialViews: existingData?.commercialViews || 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: filledData,
    });
  } catch (error) {
    console.error("Get analytics data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: error.message,
    });
  }
};

// Update analytics (internal function called by other controllers)
const updateAnalytics = async (type, data = {}) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updateData = {};

    switch (type) {
      case "property_view":
        updateData.totalViews = { increment: 1 };
        if (data.propertyType) {
          const typeField = `${data.propertyType.toLowerCase()}Views`;
          if (
            [
              "apartmentViews",
              "houseViews",
              "plotViews",
              "commercialViews",
            ].includes(typeField)
          ) {
            updateData[typeField] = { increment: 1 };
          }
        }
        break;

      case "property_click":
        updateData.totalClicks = { increment: 1 };
        break;

      case "inquiry_created":
        updateData.totalInquiries = { increment: 1 };
        break;

      case "property_created":
        updateData.newProperties = { increment: 1 };
        break;

      default:
        return;
    }

    await prisma.analytics.upsert({
      where: { date: today },
      update: updateData,
      create: {
        date: today,
        ...Object.entries(updateData).reduce((acc, [key, value]) => {
          acc[key] = value.increment || 0;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("Update analytics error:", error);
    // Don't throw error to avoid breaking main functionality
  }
};

// Get property performance analytics
const getPropertyAnalytics = async (req, res) => {
  try {
    const { period = "30", limit = 10 } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Top performing properties by views
    const topViewedProperties = await prisma.property.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { views: "desc" },
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        price: true,
        propertyType: true,
        listingType: true,
        city: true,
        views: true,
        clicks: true,
        mainImage: true,
        createdAt: true,
        _count: {
          select: {
            inquiries: true,
          },
        },
      },
    });

    // Properties with most inquiries
    const topInquiredProperties = await prisma.property.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: {
        inquiries: {
          _count: "desc",
        },
      },
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        price: true,
        propertyType: true,
        listingType: true,
        city: true,
        views: true,
        clicks: true,
        mainImage: true,
        createdAt: true,
        _count: {
          select: {
            inquiries: true,
          },
        },
      },
    });

    // Property type performance
    const typePerformance = await prisma.property.groupBy({
      by: ["propertyType"],
      _count: { id: true },
      _sum: { views: true, clicks: true },
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Listing type performance
    const listingTypePerformance = await prisma.property.groupBy({
      by: ["listingType"],
      _count: { id: true },
      _sum: { views: true, clicks: true },
      where: {
        createdAt: { gte: startDate },
      },
    });

    res.json({
      success: true,
      data: {
        topViewedProperties,
        topInquiredProperties,
        typePerformance,
        listingTypePerformance,
      },
    });
  } catch (error) {
    console.error("Get property analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch property analytics",
      error: error.message,
    });
  }
};

// Export analytics data
const exportAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, format = "json" } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date must be before end date",
      });
    }

    // Get analytics data
    const analytics = await prisma.analytics.findMany({
      where: {
        date: { gte: start, lte: end },
      },
      orderBy: { date: "asc" },
    });

    // Get property data for the period
    const properties = await prisma.property.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      select: {
        id: true,
        title: true,
        propertyType: true,
        listingType: true,
        price: true,
        city: true,
        views: true,
        clicks: true,
        createdAt: true,
        _count: {
          select: {
            inquiries: true,
          },
        },
      },
    });

    // Get inquiry data for the period
    const inquiries = await prisma.inquiry.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        property: {
          select: {
            title: true,
            propertyType: true,
            city: true,
          },
        },
      },
    });

    const exportData = {
      period: {
        startDate: startDate,
        endDate: endDate,
        totalDays: Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
      },
      summary: {
        totalViews: analytics.reduce((sum, item) => sum + item.totalViews, 0),
        totalClicks: analytics.reduce((sum, item) => sum + item.totalClicks, 0),
        totalInquiries: analytics.reduce(
          (sum, item) => sum + item.totalInquiries,
          0
        ),
        newProperties: analytics.reduce(
          (sum, item) => sum + item.newProperties,
          0
        ),
        totalPropertiesInPeriod: properties.length,
        totalInquiriesInPeriod: inquiries.length,
      },
      dailyAnalytics: analytics,
      properties,
      inquiries,
      generatedAt: new Date().toISOString(),
    };

    if (format === "csv") {
      // Convert to CSV format
      const csvHeaders =
        "Date,Total Views,Total Clicks,Total Inquiries,New Properties\n";
      const csvData = analytics
        .map(
          (item) =>
            `${item.date.toISOString().split("T")[0]},${item.totalViews},${
              item.totalClicks
            },${item.totalInquiries},${item.newProperties}`
        )
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=analytics-${startDate}-to-${endDate}.csv`
      );
      res.send(csvHeaders + csvData);
    } else {
      res.json({
        success: true,
        data: exportData,
      });
    }
  } catch (error) {
    console.error("Export analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export analytics data",
      error: error.message,
    });
  }
};

// Get recent activities for dashboard
const getRecentActivities = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get recent properties
    const recentProperties = await prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        views: true,
      },
    });

    // Get recent inquiries
    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        status: true,
        property: {
          select: {
            title: true,
          },
        },
      },
    });

    // Combine and format activities
    const activities = [];

    // Add property activities
    recentProperties.forEach((property) => {
      activities.push({
        id: `property_${property.id}`,
        type: "property",
        action: "created",
        title: `New property added: ${property.title}`,
        time: formatTimeAgo(property.createdAt),
        createdAt: property.createdAt,
      });

      if (property.views > 50) {
        activities.push({
          id: `property_views_${property.id}`,
          type: "property",
          action: "viewed",
          title: `Property "${property.title}" reached ${property.views} views`,
          time: formatTimeAgo(property.createdAt),
          createdAt: property.createdAt,
        });
      }
    });

    // Add inquiry activities
    recentInquiries.forEach((inquiry) => {
      // Skip inquiries without properties or with null properties
      if (!inquiry.property) {
        return;
      }

      activities.push({
        id: `inquiry_${inquiry.id}`,
        type: "inquiry",
        action: inquiry.status === "RESPONDED" ? "responded" : "received",
        title:
          inquiry.status === "RESPONDED"
            ? `Inquiry responded for "${inquiry.property.title}"`
            : `New inquiry from ${inquiry.name} for "${inquiry.property.title}"`,
        time: formatTimeAgo(inquiry.createdAt),
        createdAt: inquiry.createdAt,
      });
    });

    // Sort by time and limit
    const sortedActivities = activities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: sortedActivities,
    });
  } catch (error) {
    console.error("Get recent activities error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities",
      error: error.message,
    });
  }
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
};

export {
  getDashboardStats,
  getAnalyticsData,
  updateAnalytics,
  getPropertyAnalytics,
  exportAnalytics,
  getRecentActivities,
};
