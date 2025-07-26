"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react";

const SearchFilter = ({
  filters,
  onFiltersChange,
  searchPlaceholder = "Search...",
  statusOptions = [],
  serviceTypeOptions = [],
  categoryOptions = [],
  priceRangeOptions = [],
  highlightOptions = [],
  showAdvancedFilters = true,
  debounceMs = 500,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const isUpdatingFromParent = useRef(false);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(localFilters);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localFilters, debounceMs]);

  // Notify parent when debounced filters change
  useEffect(() => {
    // Don't call onFiltersChange if we're updating from parent
    if (isUpdatingFromParent.current) {
      isUpdatingFromParent.current = false;
      return;
    }

    // Convert "all" values to empty strings for parent component
    const processedFilters = Object.fromEntries(
      Object.entries(debouncedFilters).map(([key, value]) => [
        key,
        value === "all" ? "" : value,
      ])
    );
    onFiltersChange(processedFilters);
  }, [debouncedFilters, onFiltersChange]);

  // Update local filters when parent filters change (but don't trigger onFiltersChange)
  useEffect(() => {
    isUpdatingFromParent.current = true;
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = useCallback((key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      status: "all",
      serviceType: "all",
      category: "all",
      highlight: "all",
      priceRange: "all",
      minPrice: "",
      maxPrice: "",
      location: "",
      propertyType: "all",
      // Preserve pagination parameters
      page: localFilters.page || 1,
      limit: localFilters.limit || 10,
    };
    setLocalFilters(clearedFilters);
    // Convert "all" values to empty strings for parent component
    const processedClearedFilters = Object.fromEntries(
      Object.entries(clearedFilters).map(([key, value]) => [
        key,
        value === "all" ? "" : value,
      ])
    );
    onFiltersChange(processedClearedFilters);
  }, [onFiltersChange, localFilters.page, localFilters.limit]);

  const hasActiveFilters = Object.entries(localFilters).some(
    ([key, value]) =>
      value &&
      value !== "" &&
      value !== "all" &&
      key !== "page" &&
      key !== "limit"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
          {showAdvancedFilters && (
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder={searchPlaceholder}
              value={localFilters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && showAdvancedFilters && (
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Status Filter */}
            {statusOptions.length > 0 && (
              <div className="w-full md:w-48">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={localFilters.status || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Service Type Filter */}
            {serviceTypeOptions.length > 0 && (
              <div className="w-full md:w-48">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select
                  value={localFilters.serviceType || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("serviceType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {serviceTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Highlight Filter */}
            {highlightOptions.length > 0 && (
              <div className="w-full md:w-48">
                <Label htmlFor="highlight">Highlight</Label>
                <Select
                  value={localFilters.highlight || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("highlight", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Highlights" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Highlights</SelectItem>
                    {highlightOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Category Filter */}
            {categoryOptions.length > 0 && (
              <div className="w-full md:w-48">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={localFilters.category || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Property Type Filter */}
            {localFilters.propertyType !== undefined && (
              <div className="w-full md:w-48">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={localFilters.propertyType || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("propertyType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="plot">Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price Range Filter */}
            {priceRangeOptions.length > 0 && (
              <div className="w-full md:w-48">
                <Label htmlFor="priceRange">Price Range</Label>
                <Select
                  value={localFilters.priceRange || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("priceRange", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    {priceRangeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Custom Price Range */}
            {(localFilters.minPrice !== undefined ||
              localFilters.maxPrice !== undefined) && (
              <div className="flex gap-2 w-full md:w-auto">
                <div className="w-full md:w-32">
                  <Label htmlFor="minPrice">Min Price</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="Min"
                    value={localFilters.minPrice || ""}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                  />
                </div>
                <div className="w-full md:w-32">
                  <Label htmlFor="maxPrice">Max Price</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxPrice || ""}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(localFilters).map(([key, value]) => {
            // Skip pagination parameters and empty values
            if (
              !value ||
              value === "" ||
              value === "all" ||
              key === "page" ||
              key === "limit"
            )
              return null;

            let label = "";
            switch (key) {
              case "search":
                label = `Search: "${value}"`;
                break;
              case "status":
                label = `Status: ${value}`;
                break;
              case "serviceType":
                label = `Service: ${value}`;
                break;
              case "category":
                label = `Category: ${value}`;
                break;
              case "highlight":
                label = `Highlight: ${value}`;
                break;
              case "propertyType":
                label = `Type: ${value}`;
                break;
              case "priceRange":
                label = `Price: ${value}`;
                break;
              case "minPrice":
                label = `Min Price: ₹${value}`;
                break;
              case "maxPrice":
                label = `Max Price: ₹${value}`;
                break;
              default:
                label = `${key}: ${value}`;
            }

            return (
              <div
                key={key}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                <span>{label}</span>
                <button
                  onClick={() => handleFilterChange(key, "")}
                  className="ml-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
