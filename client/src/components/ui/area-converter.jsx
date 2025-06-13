"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  ChevronDown,
  RotateCcw,
  Maximize2,
  Copy,
  Check,
} from "lucide-react";
import {
  convertArea,
  getAllConversions,
  formatArea,
  getPopularUnits,
  AREA_UNITS,
  UNIT_LABELS,
  UNIT_FULL_NAMES,
} from "@/lib/area-calculator";

export function AreaConverter({
  value,
  originalUnit = AREA_UNITS.SQ_FEET,
  showAll = false,
  className = "",
}) {
  const [selectedUnit, setSelectedUnit] = useState(originalUnit);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAllUnits, setShowAllUnits] = useState(showAll);
  const [copiedUnit, setCopiedUnit] = useState(null);

  if (!value || value <= 0) {
    return <span className={`text-gray-500 ${className}`}>N/A</span>;
  }

  const convertedValue = convertArea(value, originalUnit, selectedUnit);
  const allConversions = getAllConversions(value, originalUnit);
  const popularUnits = getPopularUnits();

  const handleCopy = async (unit, convertedValue) => {
    const text = formatArea(convertedValue, unit);
    await navigator.clipboard.writeText(text);
    setCopiedUnit(unit);
    setTimeout(() => setCopiedUnit(null), 2000);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Display */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-[#5e4cbb]/10 to-[#5e4cbb]/5 border border-[#5e4cbb]/20 rounded-lg hover:from-[#5e4cbb]/20 hover:to-[#5e4cbb]/10 transition-all duration-200 group"
          >
            <Calculator className="h-4 w-4 text-[#5e4cbb]" />
            <span className="font-semibold text-gray-900">
              {formatArea(convertedValue, selectedUnit)}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-[#5e4cbb] transition-transform duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
              >
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      Area Converter
                    </h4>
                    <button
                      onClick={() => setShowAllUnits(!showAllUnits)}
                      className="p-1 text-[#5e4cbb] hover:bg-[#5e4cbb]/10 rounded-md transition-colors"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {(showAllUnits
                    ? Object.values(AREA_UNITS)
                    : popularUnits
                  ).map((unit) => {
                    const unitValue = allConversions[unit];
                    return (
                      <motion.button
                        key={unit}
                        whileHover={{
                          backgroundColor: "rgba(94, 76, 187, 0.05)",
                        }}
                        onClick={() => {
                          setSelectedUnit(unit);
                          setShowDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#5e4cbb]/5 transition-colors ${
                          selectedUnit === unit
                            ? "bg-[#5e4cbb]/10 border-r-2 border-[#5e4cbb]"
                            : ""
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatArea(unitValue, unit)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {UNIT_FULL_NAMES[unit]}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(unit, unitValue);
                          }}
                          className="p-1 text-gray-400 hover:text-[#5e4cbb] transition-colors"
                        >
                          {copiedUnit === unit ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => {
                      setSelectedUnit(originalUnit);
                      setShowDropdown(false);
                    }}
                    className="flex items-center space-x-2 text-sm text-[#5e4cbb] hover:text-[#4a3d99] transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset to Original</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Show All Button */}
        {!showDropdown && (
          <button
            onClick={() => setShowAllUnits(!showAllUnits)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showAllUnits
                ? "text-[#5e4cbb] bg-[#5e4cbb]/10"
                : "text-gray-400 hover:text-[#5e4cbb] hover:bg-[#5e4cbb]/5"
            }`}
            title={showAllUnits ? "Hide all units" : "View all units"}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* All Units Display (when expanded) */}
      <AnimatePresence>
        {showAllUnits && !showDropdown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 mt-2 w-80 p-4 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">All Area Units</h4>
              <button
                onClick={() => setShowAllUnits(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {popularUnits.map((unit) => {
                const unitValue = allConversions[unit];
                return (
                  <motion.button
                    key={unit}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setShowAllUnits(false);
                    }}
                    className={`p-3 bg-gray-50 rounded-lg border transition-all duration-200 text-left ${
                      selectedUnit === unit
                        ? "border-[#5e4cbb] bg-[#5e4cbb]/5"
                        : "border-gray-200 hover:border-[#5e4cbb]/50"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {formatArea(unitValue, unit)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {UNIT_FULL_NAMES[unit]}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {(showDropdown || showAllUnits) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowDropdown(false);
            setShowAllUnits(false);
          }}
        />
      )}
    </div>
  );
}

export function SimpleAreaDisplay({
  value,
  unit = AREA_UNITS.SQ_FEET,
  className = "",
}) {
  if (!value || value <= 0) {
    return <span className={`text-gray-500 ${className}`}>N/A</span>;
  }

  return (
    <span className={`font-medium text-gray-900 ${className}`}>
      {formatArea(value, unit)}
    </span>
  );
}
