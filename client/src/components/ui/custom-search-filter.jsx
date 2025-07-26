"use client";

import React, { useState, useCallback } from "react";
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

const CustomSearchFilter = ({
  filters,
  onFiltersChange,
  searchPlaceholder = "Search...",
  statusOptions = [],
  categoryOptions = [],
  priceRangeOptions = [],
  debounceMs = 500,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearchChange = useCallback(
    (value) => {
      // Clear existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Set new timeout for debounced search
      const timeout = setTimeout(() => {
        onFiltersChange({
          ...filters,
          search: value,
          page: 1, // Reset to first page when searching
        });
      }, debounceMs);

      setSearchTimeout(timeout);
    },
    [filters, onFiltersChange, debounceMs, searchTimeout]
  );

  const handleFilterChange = useCallback(
    (key, value) => {
      // Convert "all" values to empty strings for the parent component
      const actualValue = value === "all" ? "" : value;
      onFiltersChange({
        ...filters,
        [key]: actualValue,
        page: 1, // Reset to first page when filtering
      });
    },
    [filters, onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      status: "all",
      propertyType: "all",
      listingType: "all",
      highlight: "all",
      priceRange: "all",
      minPrice: "",
      maxPrice: "",
      page: 1,
      limit: filters.limit || 12,
    };
    // Convert "all" values to empty strings for parent component
    const processedClearedFilters = Object.fromEntries(
      Object.entries(clearedFilters).map(([key, value]) => [
        key,
        value === "all" ? "" : value,
      ])
    );
    onFiltersChange(processedClearedFilters);
  }, [onFiltersChange, filters.limit]);

  const hasActiveFilters = Object.entries(filters).some(
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
              defaultValue={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Status Filter */}
            {statusOptions.length > 0 && (
              <div className="w-full md:w-48">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status || "all"}
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

            {/* Property Type Filter */}
            {categoryOptions.length > 0 && (
              <div className="w-full md:w-48">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={filters.propertyType || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("propertyType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Listing Type Filter */}
            <div className="w-full md:w-48">
              <Label htmlFor="listingType">Listing Type</Label>
              <Select
                value={filters.listingType || "all"}
                onValueChange={(value) =>
                  handleFilterChange("listingType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SALE">Sale</SelectItem>
                  <SelectItem value="RENT">Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Highlight Filter */}
            <div className="w-full md:w-48">
              <Label htmlFor="highlight">Highlight</Label>
              <Select
                value={filters.highlight || "all"}
                onValueChange={(value) =>
                  handleFilterChange("highlight", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Highlights" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Highlights</SelectItem>
                  <SelectItem value="FEATURED">Featured</SelectItem>
                  <SelectItem value="TRENDING">Trending</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="HOT_DEAL">Hot Deal</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            {priceRangeOptions.length > 0 && (
              <div className="w-full md:w-48">
                <Label htmlFor="priceRange">Price Range</Label>
                <Select
                  value={filters.priceRange || "all"}
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
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
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
              case "propertyType":
                label = `Type: ${value}`;
                break;
              case "listingType":
                label = `Listing: ${value}`;
                break;
              case "highlight":
                label = `Highlight: ${value}`;
                break;
              case "priceRange":
                label = `Price: ${value}`;
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
                  onClick={() => handleFilterChange(key, "all")}
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

export default CustomSearchFilter;
