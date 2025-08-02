import React, { useState, useEffect } from "react";
import { Input, Label, Select } from "@/components/ui/form";

const PriceInput = ({
  value,
  onChange,
  label = "Price (₹)",
  required = false,
  placeholder = "Enter price (e.g., 22cr - 27.6cr or 35lakh-66lakh)",
  className = "",
}) => {
  const [inputMode, setInputMode] = useState("range"); // "single" or "range"
  const [singleAmount, setSingleAmount] = useState("");
  const [singleUnit, setSingleUnit] = useState("CR");
  const [rangeMin, setRangeMin] = useState("");
  const [rangeMax, setRangeMax] = useState("");
  const [rangeUnit, setRangeUnit] = useState("CR");
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState("");

  // Initialize values when component mounts or value prop changes (only once)
  useEffect(() => {
    if (!isInitialized && value && value !== "") {
      // Check if it's a range (contains "-" or "to")
      if (value.includes("-") || value.toLowerCase().includes("to")) {
        setInputMode("range");
        // Parse range value
        const rangeValues = parseRangeValue(value);
        if (rangeValues) {
          setRangeMin(rangeValues.min);
          setRangeMax(rangeValues.max);
          setRangeUnit(rangeValues.unit);
        }
        setSingleAmount("");
        setSingleUnit("CR");
      } else {
        // Single price format
        setInputMode("single");
        setRangeMin("");
        setRangeMax("");
        setRangeUnit("CR");

        // Parse the value which should be in format "amount unit" like "33 CR" or "50 LAKH"
        const parts = value.toString().split(" ");
        if (parts.length === 2) {
          setSingleAmount(parts[0]);
          setSingleUnit(parts[1]);
        } else {
          // Fallback: try to parse as number and convert
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            if (numValue >= 10000000) {
              setSingleAmount((numValue / 10000000).toString());
              setSingleUnit("CR");
            } else if (numValue >= 100000) {
              setSingleAmount((numValue / 100000).toString());
              setSingleUnit("LAKH");
            } else {
              setSingleAmount(numValue.toString());
              setSingleUnit("LAKH");
            }
          }
        }
      }
      setIsInitialized(true);
    } else if (!value || value === "") {
      setSingleAmount("");
      setSingleUnit("CR");
      setRangeMin("");
      setRangeMax("");
      setRangeUnit("CR");
      setInputMode("range");
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Parse range value like "22cr - 27.6cr" to {min: "22", max: "27.6", unit: "CR"}
  const parseRangeValue = (rangeStr) => {
    const trimmed = rangeStr.trim();

    // Split by "-" or "to" (case insensitive)
    const parts = trimmed.split(/[-to]+/i).map((part) => part.trim());

    if (parts.length !== 2) {
      return null;
    }

    // Extract numbers and unit from both parts (case insensitive)
    // Updated regex to handle formats like "14cr", "14 CR", "14crore", etc.
    const minMatch = parts[0].match(
      /^(\d+(?:\.\d+)?)\s*(cr|lakh|crore|laakh)$/i
    );
    const maxMatch = parts[1].match(
      /^(\d+(?:\.\d+)?)\s*(cr|lakh|crore|laakh)$/i
    );

    if (!minMatch || !maxMatch) {
      return null;
    }

    const unit =
      minMatch[2].toLowerCase() === "lakh" ||
      minMatch[2].toLowerCase() === "laakh"
        ? "LAKH"
        : "CR";

    // Return the values as they appear in the string (don't auto-swap)
    return {
      min: minMatch[1],
      max: maxMatch[1],
      unit: unit,
    };
  };

  const validateRange = (min, max) => {
    if (min && max && parseFloat(min) > parseFloat(max)) {
      setError("Minimum price cannot be greater than maximum price");
      return false;
    }
    setError("");
    return true;
  };

  const handleSingleAmountChange = (e) => {
    const newAmount = e.target.value;
    setSingleAmount(newAmount);
    // Update price immediately
    if (newAmount && newAmount !== "" && newAmount !== "0") {
      const amountStr = newAmount;
      const unitStr = singleUnit || "CR";
      const priceValue = `${amountStr} ${unitStr}`;
      onChange({ target: { name: "price", value: priceValue } });
    } else {
      onChange({ target: { name: "price", value: "" } });
    }
  };

  const handleSingleUnitChange = (e) => {
    const newUnit = e.target.value;
    setSingleUnit(newUnit);
    // Update price immediately if we have an amount
    if (singleAmount && singleAmount !== "") {
      const amountStr = singleAmount;
      const unitStr = newUnit;
      const priceValue = `${amountStr} ${unitStr}`;
      onChange({ target: { name: "price", value: priceValue } });
    }
  };

  const handleRangeMinChange = (e) => {
    const newMin = e.target.value;
    setRangeMin(newMin);
    // Use the actual input values directly
    if (validateRange(newMin, rangeMax)) {
      updateRangePriceWithValues(newMin, rangeMax);
    }
  };

  const handleRangeMaxChange = (e) => {
    const newMax = e.target.value;
    setRangeMax(newMax);
    // Use the actual input values directly
    if (validateRange(rangeMin, newMax)) {
      updateRangePriceWithValues(rangeMin, newMax);
    }
  };

  const updateRangePriceWithValues = (min, max) => {
    if (min && max && min !== "" && max !== "") {
      const unitStr = rangeUnit === "CR" ? "CR" : "LAKH";
      const priceValue = `${min} ${unitStr} - ${max} ${unitStr}`;
      onChange({ target: { name: "price", value: priceValue } });
    } else if (min && min !== "") {
      // If only min is filled, still update
      const unitStr = rangeUnit === "CR" ? "CR" : "LAKH";
      const priceValue = `${min} ${unitStr}`;
      onChange({ target: { name: "price", value: priceValue } });
    } else if (max && max !== "") {
      // If only max is filled, still update
      const unitStr = rangeUnit === "CR" ? "CR" : "LAKH";
      const priceValue = `${max} ${unitStr}`;
      onChange({ target: { name: "price", value: priceValue } });
    } else {
      onChange({ target: { name: "price", value: "" } });
    }
  };

  const handleRangeUnitChange = (e) => {
    const newUnit = e.target.value;
    setRangeUnit(newUnit);
    updateRangePriceWithValues(rangeMin, rangeMax);
  };

  const handleInputModeChange = (e) => {
    const newMode = e.target.value;
    setInputMode(newMode);
    setError(""); // Clear any existing errors

    // Clear the other input when switching modes
    if (newMode === "single") {
      setRangeMin("");
      setRangeMax("");
      setRangeUnit("CR");
      onChange({ target: { name: "price", value: "" } });
    } else {
      setSingleAmount("");
      setSingleUnit("CR");
      onChange({ target: { name: "price", value: "" } });
    }
  };

  const formatDisplayValue = () => {
    if (inputMode === "range") {
      // For range mode, use current state values
      if (rangeMin && rangeMax && rangeMin !== "" && rangeMax !== "") {
        const unitDisplay = rangeUnit === "CR" ? "Cr" : "Lakh";
        return `${rangeMin} ${unitDisplay} - ${rangeMax} ${unitDisplay}`;
      } else if (rangeMin && rangeMin !== "") {
        const unitDisplay = rangeUnit === "CR" ? "Cr" : "Lakh";
        return `${rangeMin} ${unitDisplay}`;
      } else if (rangeMax && rangeMax !== "") {
        const unitDisplay = rangeUnit === "CR" ? "Cr" : "Lakh";
        return `${rangeMax} ${unitDisplay}`;
      }
      return "";
    } else {
      // For single mode, use current state values
      if (singleAmount && singleAmount !== "") {
        const unitDisplay = singleUnit === "CR" ? "Cr" : "Lakh";
        return `${singleAmount} ${unitDisplay}`;
      }
      return "";
    }
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && "*"}
      </Label>

      {/* Input Mode Selector */}
      <div className="mb-3">
        <Select
          value={inputMode}
          onChange={handleInputModeChange}
          className="w-full"
        >
          <option value="range">Price Range</option>
          <option value="single">Single Price</option>
        </Select>
      </div>

      {inputMode === "single" ? (
        // Single Price Input
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              type="number"
              value={singleAmount}
              onChange={handleSingleAmountChange}
              placeholder="50"
              className="pr-20"
              required={required}
              min="0"
              step="0.01"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              {singleUnit === "CR" ? "Cr" : "Lakh"}
            </div>
          </div>
          <Select
            value={singleUnit}
            onChange={handleSingleUnitChange}
            className="w-24"
          >
            <option value="LAKH">Lakh</option>
            <option value="CR">Crore</option>
          </Select>
        </div>
      ) : (
        // Range Input - More user friendly
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <Label className="text-xs text-gray-600 mb-1 block">
                Min Price
              </Label>
              <Input
                type="number"
                value={rangeMin}
                onChange={handleRangeMinChange}
                placeholder="22"
                className="w-full"
                required={required}
                min="0"
                step="0.01"
              />
            </div>
            <div className="text-gray-500">to</div>
            <div className="flex-1">
              <Label className="text-xs text-gray-600 mb-1 block">
                Max Price
              </Label>
              <Input
                type="number"
                value={rangeMax}
                onChange={handleRangeMaxChange}
                placeholder="27.6"
                className="w-full"
                required={required}
                min="0"
                step="0.01"
              />
            </div>
            <div className="w-24">
              <Label className="text-xs text-gray-600 mb-1 block">Unit</Label>
              <Select
                value={rangeUnit}
                onChange={handleRangeUnitChange}
                className="w-full"
              >
                <option value="LAKH">Lakh</option>
                <option value="CR">Crore</option>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Display formatted value */}
      {formatDisplayValue() && !error && (
        <div className="mt-2 p-2 bg-orange-100 rounded-md">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Price:</span> ₹{formatDisplayValue()}
          </p>
        </div>
      )}

      {/* Help text */}
      <div className="mt-1 text-xs text-gray-500">
        {inputMode === "range"
          ? "Enter minimum and maximum price values and select unit"
          : "Enter single price value"}
      </div>
    </div>
  );
};

export default PriceInput;
