"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Building,
  Users,
  MapPin,
  Calendar,
  IndianRupee,
  Activity,
  Phone,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
} from "lucide-react";
import { adminAPI } from "@/lib/api-functions";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    totalClicks: 0,
    availableProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
    recentProperties: [],
    topProperties: [],
    inquiriesStats: {},
    monthlyStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats
      try {
        const dashboardResponse = await adminAPI.getDashboardStats();
        console.log("Dashboard response:", dashboardResponse);

        // Handle both direct response and nested response structure
        const dashboardData = dashboardResponse.data || dashboardResponse;

        if (dashboardData.success && dashboardData.data) {
          const data = dashboardData.data;

          setAnalytics((prev) => ({
            ...prev,
            totalProperties: data.overview?.totalProperties || 0,
            totalViews: data.overview?.todayViews || 0,
            totalInquiries: data.overview?.totalInquiries || 0,
            totalClicks: 0, // This would come from analytics data
            availableProperties: data.overview?.availableProperties || 0,
            soldProperties: data.overview?.soldProperties || 0,
            rentedProperties: data.overview?.rentedProperties || 0,
          }));
        }
      } catch (dashboardError) {
        console.error("Error fetching dashboard stats:", dashboardError);
        // Don't show toast for dashboard error, just log it
      }

      // Fetch property analytics for top properties
      try {
        const propertyAnalyticsResponse = await adminAPI.getPropertyAnalytics();
        console.log("Property analytics response:", propertyAnalyticsResponse);

        // Handle both direct response and nested response structure
        const propertyData =
          propertyAnalyticsResponse.data || propertyAnalyticsResponse;

        if (propertyData.success && propertyData.data) {
          const data = propertyData.data;

          setAnalytics((prev) => ({
            ...prev,
            topProperties: data.topViewedProperties || [],
            recentProperties: data.topViewedProperties?.slice(0, 5) || [],
          }));
        }
      } catch (propertyError) {
        console.error("Error fetching property analytics:", propertyError);
        // Don't show toast for property analytics error, just log it
      }
    } catch (error) {
      console.error("Error in fetchAnalytics:", error);
      toast.error("Failed to load analytics data", {
        icon: "📊",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    // Handle price ranges like "10 CR - 15 CR" or "50 LAKH - 75 LAKH"
    if (typeof price === "string" && price.includes(" - ")) {
      const parts = price.split(" - ");
      const minPart = parts[0].trim();
      const maxPart = parts[1].trim();

      // Parse min and max parts
      const minMatch = minPart.match(/^(\d+(?:\.\d+)?)\s*(CR|LAKH)$/i);
      const maxMatch = maxPart.match(/^(\d+(?:\.\d+)?)\s*(CR|LAKH)$/i);

      if (minMatch && maxMatch) {
        const minAmount = parseFloat(minMatch[1]);
        const maxAmount = parseFloat(maxMatch[1]);
        const unit = minMatch[2].toUpperCase();

        if (!isNaN(minAmount) && !isNaN(maxAmount)) {
          const unitDisplay = unit === "CR" ? "Cr" : "Lakh";
          return `₹${minAmount.toFixed(2)} - ${maxAmount.toFixed(
            2
          )} ${unitDisplay}`;
        }
      }
    }

    // Handle single price in "amount unit" format like "33 CR" or "50 LAKH"
    if (typeof price === "string" && price.includes(" ")) {
      const parts = price.split(" ");
      const amount = parseFloat(parts[0]);
      const unit = parts[1];

      if (!isNaN(amount)) {
        const unitDisplay = unit === "CR" ? "Cr" : "Lakh";
        return `₹${amount.toFixed(2)} ${unitDisplay}`;
      }
    }

    // If price is a number, format it
    if (typeof price === "number") {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(price);
    }

    // If price is a string number, convert and format
    if (typeof price === "string" && !isNaN(parseFloat(price))) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(parseFloat(price));
    }

    // Default fallback
    return price || "Price N/A";
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color = "blue",
  }) => {
    const colorClasses = {
      blue: "from-blue-50 to-blue-100 text-blue-600",
      green: "from-green-50 to-green-100 text-green-600",
      purple: "from-purple-50 to-purple-100 text-purple-600",
      orange: "from-orange-50 to-orange-100 text-orange-600",
      red: "from-red-50 to-red-100 text-red-600",
      yellow: "from-yellow-50 to-yellow-100 text-yellow-600",
    };

    const bgClass =
      colorClasses[color]?.split(" ")[0] +
        " " +
        colorClasses[color]?.split(" ")[1] || "from-blue-50 to-blue-100";
    const textClass = colorClasses[color]?.split(" ")[2] || "text-blue-600";

    return (
      <Card
        className={`bg-gradient-to-r ${bgClass} border-0 shadow-lg hover:shadow-xl transition-all duration-200`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className={`text-3xl font-bold ${textClass}`}>{value}</p>
              {trend && (
                <div
                  className={`flex items-center mt-2 text-sm ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{trendValue}% vs last month</span>
                </div>
              )}
            </div>
            <Icon className={`h-12 w-12 ${textClass}`} />
          </div>
        </CardContent>
      </Card>
    );
  };

  const PropertyCard = ({ property, rank }) => {
    const getRankColor = (rank) => {
      switch (rank) {
        case 1:
          return "from-yellow-400 to-yellow-600";
        case 2:
          return "from-gray-300 to-gray-500";
        case 3:
          return "from-amber-600 to-amber-800";
        default:
          return "from-blue-400 to-blue-600";
      }
    };

    return (
      <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(
            rank
          )} flex items-center justify-center text-white font-bold text-sm`}
        >
          {rank}
        </div>
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
          <Image
            src={property.mainImage || "/placeholder-property.jpg"}
            alt={property.title}
            className="w-full h-full object-cover"
            width={64}
            height={64}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 truncate">
            {property.title}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {property.city}, {property.state}
          </p>
          <div className="flex items-center space-x-3 mt-1">
            <div className="flex items-center text-xs text-gray-600">
              <Eye className="h-3 w-3 mr-1" />
              {property.views || 0} views
            </div>
            <div className="text-xs font-medium text-indigo-600">
              {formatPrice(property.price)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analytics & Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Track your property performance and business insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </Select>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            size="sm"
            className="hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={analytics.totalProperties}
          icon={Building}
          trend="up"
          trendValue="12"
          color="blue"
        />
        <StatCard
          title="Total Views"
          value={analytics.totalViews.toLocaleString()}
          icon={Eye}
          trend="up"
          trendValue="8"
          color="green"
        />
        <StatCard
          title="Total Inquiries"
          value={analytics.totalInquiries}
          icon={Mail}
          trend="up"
          trendValue="15"
          color="purple"
        />
        <StatCard
          title="Total Clicks"
          value={analytics.totalClicks.toLocaleString()}
          icon={Activity}
          trend="down"
          trendValue="3"
          color="orange"
        />
      </div>

      {/* Property Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Available Properties
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {analytics.availableProperties}
                </p>
                <p className="text-sm text-green-600 mt-1">Ready for market</p>
              </div>
              <Building className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Sold Properties
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {analytics.soldProperties}
                </p>
                <p className="text-sm text-blue-600 mt-1">Successfully sold</p>
              </div>
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Rented Properties
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics.rentedProperties}
                </p>
                <p className="text-sm text-purple-600 mt-1">Currently rented</p>
              </div>
              <MapPin className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Properties & Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-gray-900">
              <BarChart3 className="h-5 w-5 mr-2 text-yellow-600" />
              Top Performing Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : analytics.topProperties.length > 0 ? (
              <div className="space-y-4">
                {analytics.topProperties.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    rank={index + 1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No property data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-gray-900">
              <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
              Recent Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : analytics.recentProperties.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                      <Image
                        src={property.mainImage || "/placeholder-property.jpg"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {property.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {property.city}, {property.state}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-600">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-medium text-indigo-600">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <CardTitle className="flex items-center text-gray-900">
            <Activity className="h-5 w-5 mr-2 text-gray-600" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {analytics.totalViews > 0
                  ? Math.round(
                      (analytics.totalClicks / analytics.totalViews) * 100
                    )
                  : 0}
                %
              </div>
              <p className="text-sm text-gray-600 mt-1">Click-through Rate</p>
              <p className="text-xs text-gray-500">
                Views to clicks conversion
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {analytics.totalProperties > 0
                  ? Math.round(analytics.totalViews / analytics.totalProperties)
                  : 0}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Avg. Views per Property
              </p>
              <p className="text-xs text-gray-500">Property engagement rate</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {analytics.totalProperties > 0
                  ? Math.round(
                      ((analytics.soldProperties + analytics.rentedProperties) /
                        analytics.totalProperties) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-sm text-gray-600 mt-1">Success Rate</p>
              <p className="text-xs text-gray-500">Sold/Rented vs Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              <Building className="h-6 w-6" />
              <span>View All Properties</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
            >
              <Mail className="h-6 w-6" />
              <span>Check Inquiries</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
            >
              <Download className="h-6 w-6" />
              <span>Export Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
