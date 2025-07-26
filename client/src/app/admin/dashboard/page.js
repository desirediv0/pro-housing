"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building,
  MessageSquare,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Calendar,
  ArrowUpRight,
  Download,
  ShoppingCart,
  Home,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
} from "lucide-react";
import { adminAPI } from "@/lib/api-functions";
import Link from "next/link";
import toast from "react-hot-toast";
import useAdminProtection from "@/hooks/useAdminProtection";

export default function AdminDashboard() {
  const { isLoading: authLoading, isAuthenticated } = useAdminProtection();
  const [stats, setStats] = useState({
    overview: {
      totalProperties: 0,
      activeProperties: 0,
      totalInquiries: 0,
      pendingInquiries: 0,
      todayViews: 0,
      todayInquiries: 0,
      saleProperties: 0,
      rentProperties: 0,
      leaseProperties: 0,
      availableProperties: 0,
      soldProperties: 0,
      rentedProperties: 0,
    },
    trends: {
      viewsChange: 0,
      inquiriesChange: 0,
      monthlyViews: 0,
      monthlyInquiries: 0,
      monthlyViewsChange: 0,
      monthlyInquiriesChange: 0,
    },
    propertyBreakdown: [],
    listingTypeBreakdown: [],
    statusBreakdown: [],
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getRecentActivities(),
      ]);

      setStats(statsResponse.data.data);
      setRecentActivities(activitiesResponse.data.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Show loading if authentication is being checked
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with your
            properties.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Total Properties
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.overview?.totalProperties || 0}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {stats.overview?.activeProperties || 0} Active
                  </span>
                </div>
              </div>
              <Building className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Total Inquiries */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Total Inquiries
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.overview?.totalInquiries || 0}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-orange-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {stats.overview?.pendingInquiries || 0} Pending
                  </span>
                </div>
              </div>
              <MessageSquare className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Monthly Views */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Monthly Views
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.trends?.monthlyViews || 0}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-blue-600 flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {stats.overview?.todayViews || 0} Today
                  </span>
                </div>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        {/* Monthly Inquiries */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Monthly Inquiries
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.trends?.monthlyInquiries || 0}
                </p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-yellow-600 flex items-center">
                    <MousePointer className="h-4 w-4 mr-1" />
                    {stats.overview?.todayInquiries || 0} Today
                  </span>
                </div>
              </div>
              <Users className="h-12 w-12 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listing Type Stats (Buy/Sell/Rent) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">For Sale</p>
                <p className="text-3xl font-bold text-blue-900">
                  {stats.overview?.saleProperties || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1">Buy Properties</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">For Rent</p>
                <p className="text-3xl font-bold text-green-900">
                  {stats.overview?.rentProperties || 0}
                </p>
                <p className="text-sm text-green-600 mt-1">Rental Properties</p>
              </div>
              <Home className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">For Lease</p>
                <p className="text-3xl font-bold text-purple-900">
                  {stats.overview?.leaseProperties || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1">Lease Properties</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Status Overview</CardTitle>
            <CardDescription>Current status of all properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium">Available</span>
                </div>
                <span className="text-green-600 font-semibold">
                  {stats.overview?.availableProperties || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">Sold</span>
                </div>
                <span className="text-blue-600 font-semibold">
                  {stats.overview?.soldProperties || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium">Rented</span>
                </div>
                <span className="text-purple-600 font-semibold">
                  {stats.overview?.rentedProperties || 0}
                </span>
              </div>
              <div className="pt-2">
                <Link href="/admin/properties">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Properties
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inquiry Status</CardTitle>
            <CardDescription>Status of customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total</span>
                <span className="text-blue-600 font-semibold">
                  {stats.overview?.totalInquiries || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-orange-600 font-semibold">
                  {stats.overview?.pendingInquiries || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">This Month</span>
                <span className="text-green-600 font-semibold">
                  {stats.trends?.monthlyInquiries || 0}
                </span>
              </div>
              <div className="pt-2">
                <Link href="/admin/inquiries">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Inquiries
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates from your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 py-2"
              >
                <div
                  className={`
                  h-2 w-2 rounded-full
                  ${
                    activity.type === "property"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }
                `}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/properties/create">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Add New Property</h3>
              <p className="text-gray-600 text-sm">
                List a new property for sale or rent
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">View Analytics</h3>
              <p className="text-gray-600 text-sm">
                Detailed performance metrics
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/sidebar">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Manage Content</h3>
              <p className="text-gray-600 text-sm">
                Update sidebar and website content
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/expertise">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Expertise Inquiries</h3>
              <p className="text-gray-600 text-sm">
                Manage consultation requests
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reviews">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg">Property Reviews</h3>
              <p className="text-gray-600 text-sm">Moderate customer reviews</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
