"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyCard from "@/components/ui/PropertyCard";
import {
  Star,
  TrendingUp,
  Zap,
  Crown,
  Gift,
  RefreshCw,
  Settings,
  CheckSquare,
  Square,
  Filter,
} from "lucide-react";
import { adminAPI } from "@/lib/api-functions";
import toast from "react-hot-toast";
import SearchFilter from "@/components/ui/search-filter";

export default function PropertyFeaturesManagement() {
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    highlight: "",
    status: "",
    propertyType: "",
    page: 1,
    limit: 12,
  });
  const [stats, setStats] = useState({
    featured: 0,
    trending: 0,
    hotDeals: 0,
    premium: 0,
    new: 0,
  });

  const highlights = [
    { value: "", label: "All Properties", icon: Settings },
    {
      value: "FEATURED",
      label: "Featured",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      value: "TRENDING",
      label: "Trending",
      icon: TrendingUp,
      color: "text-red-600",
    },
    {
      value: "HOT_DEAL",
      label: "Hot Deal",
      icon: Zap,
      color: "text-orange-600",
    },
    {
      value: "PREMIUM",
      label: "Premium",
      icon: Crown,
      color: "text-purple-600",
    },
    { value: "NEW", label: "New", icon: Gift, color: "text-green-600" },
  ];

  // Debounced filters for API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllProperties(debouncedFilters);
      setProperties(response.data.data.properties || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  const fetchStats = useCallback(async () => {
    try {
      // Get count of properties by highlight
      const highlights = ["FEATURED", "TRENDING", "HOT_DEAL", "PREMIUM", "NEW"];
      const statsPromises = highlights.map(async (highlight) => {
        const response = await adminAPI.getAllProperties({
          highlight,
          limit: 1,
        });
        return {
          [highlight.toLowerCase()]: response.data.data.pagination?.total || 0,
        };
      });

      const results = await Promise.all(statsPromises);
      const newStats = results.reduce((acc, stat) => ({ ...acc, ...stat }), {});
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, [fetchProperties, fetchStats]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleSelectProperty = (propertyId) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map((p) => p.id));
    }
  };

  const handleBulkUpdateHighlight = async (highlight) => {
    if (selectedProperties.length === 0) {
      toast.error("Please select at least one property");
      return;
    }

    try {
      await adminAPI.bulkUpdateHighlights(selectedProperties, highlight);
      toast.success(
        highlight
          ? `${selectedProperties.length} properties marked as ${highlight}`
          : `${selectedProperties.length} properties highlight removed`
      );
      setSelectedProperties([]);
      fetchProperties();
      fetchStats();
    } catch (error) {
      console.error("Error updating highlights:", error);
      toast.error("Failed to update property highlights");
    }
  };

  const StatCard = ({ title, count, icon: Icon, color, highlight }) => (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        filters.highlight === highlight ? "ring-2 ring-indigo-500" : ""
      }`}
      onClick={() => handleFilterChange("highlight", highlight)}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{count}</p>
          </div>
          <Icon className={`h-12 w-12 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Property Features Management
          </h1>
          <p className="text-gray-600">
            Manage featured, trending, and highlighted properties
          </p>
        </div>
        <Button onClick={fetchProperties} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="All Properties"
          count={properties.length}
          icon={Settings}
          color="text-gray-600"
          highlight=""
        />
        <StatCard
          title="Featured"
          count={stats.featured}
          icon={Star}
          color="text-yellow-600"
          highlight="FEATURED"
        />
        <StatCard
          title="Trending"
          count={stats.trending}
          icon={TrendingUp}
          color="text-red-600"
          highlight="TRENDING"
        />
        <StatCard
          title="Hot Deals"
          count={stats.hot_deal || 0}
          icon={Zap}
          color="text-orange-600"
          highlight="HOT_DEAL"
        />
        <StatCard
          title="Premium"
          count={stats.premium}
          icon={Crown}
          color="text-purple-600"
          highlight="PREMIUM"
        />
        <StatCard
          title="New"
          count={stats.new}
          icon={Gift}
          color="text-green-600"
          highlight="NEW"
        />
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <SearchFilter
              filters={filters}
              onFiltersChange={setFilters}
              searchPlaceholder="Search properties..."
              statusOptions={[
                { value: "AVAILABLE", label: "Available" },
                { value: "SOLD", label: "Sold" },
                { value: "RENTED", label: "Rented" },
              ]}
              categoryOptions={highlights.filter((h) => h.value !== "")}
            />

            {/* Bulk Actions */}
            {selectedProperties.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-indigo-900">
                  {selectedProperties.length} properties selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkUpdateHighlight("FEATURED")}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Mark Featured
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkUpdateHighlight("TRENDING")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Mark Trending
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkUpdateHighlight("HOT_DEAL")}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Hot Deal
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkUpdateHighlight("PREMIUM")}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBulkUpdateHighlight(null)}
                    variant="outline"
                  >
                    Remove Highlight
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Properties</CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleSelectAll}>
                {selectedProperties.length === properties.length ? (
                  <CheckSquare className="h-4 w-4 mr-1" />
                ) : (
                  <Square className="h-4 w-4 mr-1" />
                )}
                {selectedProperties.length === properties.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No properties found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <Button
                      size="sm"
                      variant={
                        selectedProperties.includes(property.id)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleSelectProperty(property.id)}
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-2"
                    >
                      {selectedProperties.includes(property.id) ? (
                        <CheckSquare className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <PropertyCard
                    property={property}
                    variant="grid"
                    showActions={false}
                    className="cursor-pointer"
                    onClick={() => handleSelectProperty(property.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
