import React, { useState, useEffect } from "react";
import { Input, Label, Select } from "@/components/ui/form";

const PriceInput = ({
  value,
  onChange,
  label = "Price (₹)",
  required = false,
  placeholder = "Enter price",
  className = "",
}) => {
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("CR");

  // Initialize values when component mounts or value prop changes
  useEffect(() => {
    if (value && value !== "") {
      // Parse the value which should be in format "amount unit" like "33 CR" or "50 LAKH"
      const parts = value.toString().split(" ");
      if (parts.length === 2) {
        setAmount(parts[0]);
        setUnit(parts[1]);
      } else {
        // Fallback: try to parse as number and convert
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (numValue >= 10000000) {
            setAmount((numValue / 10000000).toString());
            setUnit("CR");
          } else if (numValue >= 100000) {
            setAmount((numValue / 100000).toString());
            setUnit("LAKH");
          } else {
            setAmount(numValue.toString());
            setUnit("LAKH");
          }
        }
      }
    } else {
      setAmount("");
      setUnit("CR");
    }
  }, [value]);

  // Update price in format "amount unit"
  const updatePrice = (newAmount, newUnit = unit) => {
    const amountStr = newAmount || "0";
    const unitStr = newUnit || "CR";
    const priceValue = `${amountStr} ${unitStr}`;
    onChange({ target: { name: "price", value: priceValue } });
  };

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    updatePrice(newAmount);
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    updatePrice(amount, newUnit);
  };

  const formatDisplayValue = () => {
    if (!value || value === "") return "";

    const parts = value.toString().split(" ");
    if (parts.length === 2) {
      const amount = parseFloat(parts[0]);
      const unit = parts[1];
      if (!isNaN(amount)) {
        return `${amount.toFixed(2)} ${unit === "CR" ? "Cr" : "Lakh"}`;
      }
    }
    return value;
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && "*"}
      </Label>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="50"
            className="pr-20"
            required={required}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {unit === "CR" ? "Cr" : "Lakh"}
          </div>
        </div>
        <Select value={unit} onChange={handleUnitChange} className="w-24">
          <option value="LAKH">Lakh</option>
          <option value="CR">Crore</option>
        </Select>
      </div>

      {/* Display formatted value */}
      {value && value !== "" && (
        <div className="mt-2 p-2 bg-orange-100 rounded-md">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Price:</span> ₹{formatDisplayValue()}
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceInput;
