"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Home,
  CreditCard,
  Calendar,
  Percent,
  IndianRupee,
  Car,
  Building,
  Car as CarIcon,
  Calculator as CalculatorIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Label } from "./label";

export default function EMICalculator() {
  const [calculatorType, setCalculatorType] = useState("home"); // "home", "car", "general"
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Enhanced calculator type configurations
  const calculatorConfigs = {
    home: {
      title: "Home Loan EMI",
      description: "Calculate your home loan EMI with current market rates",
      icon: Building,
      defaultAmount: 5000000,
      defaultDownPayment: 20,
      defaultInterest: 8.5,
      defaultTenure: 20,
      amountLabel: "Property Value",
      downPaymentLabel: "Down Payment",
      tenureLabel: "Loan Tenure",
      minAmount: 1000000,
      maxAmount: 100000000,
      minDownPayment: 10,
      maxDownPayment: 50,
      minInterest: 6.5,
      maxInterest: 12.0,
      minTenure: 5,
      maxTenure: 30,
      quickAmounts: [
        { label: "25L", value: 2500000 },
        { label: "50L", value: 5000000 },
        { label: "1Cr", value: 10000000 },
        { label: "2Cr", value: 20000000 },
        { label: "5Cr", value: 50000000 },
        { label: "10Cr", value: 100000000 },
      ],
      features: [
        "Lowest interest rates",
        "Longest repayment period",
        "Tax benefits available",
        "Flexible down payment",
      ],
    },
    car: {
      title: "Car Loan EMI",
      description: "Calculate your car loan EMI with competitive rates",
      icon: CarIcon,
      defaultAmount: 800000,
      defaultDownPayment: 15,
      defaultInterest: 12.5,
      defaultTenure: 7,
      amountLabel: "Car Value",
      downPaymentLabel: "Down Payment",
      tenureLabel: "Loan Tenure",
      minAmount: 300000,
      maxAmount: 10000000,
      minDownPayment: 10,
      maxDownPayment: 40,
      minInterest: 8.0,
      maxInterest: 18.0,
      minTenure: 1,
      maxTenure: 8,
      quickAmounts: [
        { label: "3L", value: 300000 },
        { label: "5L", value: 500000 },
        { label: "8L", value: 800000 },
        { label: "12L", value: 1200000 },
        { label: "20L", value: 2000000 },
        { label: "30L", value: 3000000 },
      ],
      features: [
        "Quick approval process",
        "Competitive interest rates",
        "Flexible tenure options",
        "Minimal documentation",
      ],
    },
    general: {
      title: "Personal Loan EMI",
      description:
        "Calculate EMI for personal loans, business loans, or any other loan",
      icon: CalculatorIcon,
      defaultAmount: 1000000,
      defaultDownPayment: 0,
      defaultInterest: 15.0,
      defaultTenure: 5,
      amountLabel: "Loan Amount",
      downPaymentLabel: "Processing Fee",
      tenureLabel: "Loan Tenure",
      minAmount: 50000,
      maxAmount: 5000000,
      minDownPayment: 0,
      maxDownPayment: 5,
      minInterest: 10.0,
      maxInterest: 24.0,
      minTenure: 1,
      maxTenure: 7,
      quickAmounts: [
        { label: "50K", value: 50000 },
        { label: "1L", value: 100000 },
        { label: "5L", value: 500000 },
        { label: "10L", value: 1000000 },
        { label: "25L", value: 2500000 },
        { label: "50L", value: 5000000 },
      ],
      features: [
        "No collateral required",
        "Quick disbursement",
        "Flexible usage",
        "Minimal documentation",
      ],
    },
  };

  // Update values when calculator type changes
  useEffect(() => {
    const config = calculatorConfigs[calculatorType];
    setPropertyValue(config.defaultAmount);
    setDownPaymentPercent(config.defaultDownPayment);
    setInterestRate(config.defaultInterest);
    setLoanTenure(config.defaultTenure);
  }, [calculatorType]);

  // Calculate EMI and related values
  useEffect(() => {
    const downPayment = (propertyValue * downPaymentPercent) / 100;
    const loanAmount = propertyValue - downPayment;

    if (loanAmount > 0 && interestRate > 0 && loanTenure > 0) {
      const monthlyRate = interestRate / 12 / 100;
      const numberOfPayments = loanTenure * 12;

      if (monthlyRate > 0) {
        const emiAmount =
          (loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, numberOfPayments)) /
          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const totalPayable = emiAmount * numberOfPayments;
        const totalInterestPaid = totalPayable - loanAmount;

        setEmi(Math.round(emiAmount));
        setTotalAmount(Math.round(totalPayable));
        setTotalInterest(Math.round(totalInterestPaid));
      }
    }
  }, [propertyValue, downPaymentPercent, interestRate, loanTenure]);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    } else {
      return `₹${amount.toLocaleString("en-IN")}`;
    }
  };

  const formatCurrencyFull = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return num.toLocaleString("en-IN");
  };

  const downPayment = (propertyValue * downPaymentPercent) / 100;
  const loanAmount = propertyValue - downPayment;
  const currentConfig = calculatorConfigs[calculatorType];
  const IconComponent = currentConfig.icon;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] rounded-2xl flex items-center justify-center">
              <Calculator className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800">
              EMI Calculator
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Calculate your loan EMI easily with our comprehensive calculator
          </p>
        </div>

        {/* Calculator Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {Object.entries(calculatorConfigs).map(([key, config]) => {
            const ConfigIcon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setCalculatorType(key)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                  calculatorType === key
                    ? "bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white border-[#1A3B4C] shadow-xl transform scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#1A3B4C] hover:bg-[#1A3B4C]/5"
                }`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      calculatorType === key
                        ? "bg-white/20"
                        : "bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C]"
                    }`}
                  >
                    <ConfigIcon
                      className={`h-8 w-8 ${
                        calculatorType === key ? "text-white" : "text-white"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">{config.title}</h3>
                    <p className="text-sm opacity-80">{config.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white rounded-t-xl">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <IconComponent className="h-6 w-6" />
                  <span>{currentConfig.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Property Value */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-700 flex items-center">
                      <IndianRupee className="h-5 w-5 mr-2 text-[#1A3B4C]" />
                      {currentConfig.amountLabel}
                    </Label>
                    <span className="text-2xl font-bold text-[#1A3B4C]">
                      {formatCurrency(propertyValue)}
                    </span>
                  </div>

                  {/* Manual Input for Unlimited Amount */}
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={propertyValue}
                      onChange={(e) =>
                        setPropertyValue(parseInt(e.target.value) || 0)
                      }
                      placeholder="Enter any amount"
                      className="w-full h-12 text-lg font-semibold border-2 border-gray-200 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]/20 rounded-xl px-4"
                    />
                    <div className="text-xs text-gray-500 text-center">
                      Enter any amount - no limits!
                    </div>
                  </div>

                  {/* Property Value Slider */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={currentConfig.minAmount}
                      max={currentConfig.maxAmount}
                      step={currentConfig.minAmount >= 1000000 ? 100000 : 10000}
                      value={Math.min(propertyValue, currentConfig.maxAmount)}
                      onChange={(e) =>
                        setPropertyValue(parseInt(e.target.value))
                      }
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatCurrency(currentConfig.minAmount)}</span>
                      <span>{formatCurrency(currentConfig.maxAmount)}</span>
                    </div>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    {currentConfig.quickAmounts.map((amount) => (
                      <button
                        key={amount.value}
                        onClick={() => setPropertyValue(amount.value)}
                        className={`p-3 text-center rounded-xl border-2 transition-all duration-200 font-semibold ${
                          propertyValue === amount.value
                            ? "bg-[#1A3B4C] text-white border-[#1A3B4C]"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#1A3B4C] hover:bg-[#1A3B4C]/5"
                        }`}
                      >
                        {amount.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Down Payment */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-700 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-[#1A3B4C]" />
                      {currentConfig.downPaymentLabel}
                    </Label>
                    <span className="text-2xl font-bold text-[#1A3B4C]">
                      {formatCurrency(downPayment)} ({downPaymentPercent}%)
                    </span>
                  </div>

                  {/* Down Payment Slider */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={currentConfig.minDownPayment}
                      max={currentConfig.maxDownPayment}
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) =>
                        setDownPaymentPercent(parseInt(e.target.value))
                      }
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{currentConfig.minDownPayment}%</span>
                      <span>{currentConfig.maxDownPayment}%</span>
                    </div>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-700 flex items-center">
                      <Percent className="h-5 w-5 mr-2 text-[#1A3B4C]" />
                      Interest Rate
                    </Label>
                    <span className="text-2xl font-bold text-[#1A3B4C]">
                      {interestRate}%
                    </span>
                  </div>

                  {/* Interest Rate Slider */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={currentConfig.minInterest}
                      max={currentConfig.maxInterest}
                      step="0.1"
                      value={interestRate}
                      onChange={(e) =>
                        setInterestRate(parseFloat(e.target.value))
                      }
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{currentConfig.minInterest}%</span>
                      <span>{currentConfig.maxInterest}%</span>
                    </div>
                  </div>
                </div>

                {/* Loan Tenure */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-700 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-[#1A3B4C]" />
                      {currentConfig.tenureLabel}
                    </Label>
                    <span className="text-2xl font-bold text-[#1A3B4C]">
                      {loanTenure} Years
                    </span>
                  </div>

                  {/* Loan Tenure Slider */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={currentConfig.minTenure}
                      max={currentConfig.maxTenure}
                      step="1"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{currentConfig.minTenure}Y</span>
                      <span>{currentConfig.maxTenure}Y</span>
                    </div>
                  </div>
                </div>

                {/* Loan Amount Display */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-700">
                      Loan Amount:
                    </span>
                    <span className="text-2xl font-bold text-[#1A3B4C]">
                      {formatCurrency(loanAmount)}
                    </span>
                  </div>
                </div>

                {/* Features Section */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {currentConfig.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-[#1A3B4C] rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* EMI Result */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-[#1A3B4C] to-[#2A4B5C] text-white">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-3">
                    <IconComponent className="h-8 w-8" />
                    <h3 className="text-2xl font-bold">Monthly EMI</h3>
                  </div>
                  <div className="text-5xl sm:text-6xl font-bold">
                    {formatCurrencyFull(emi)}
                  </div>
                  <p className="text-white/80 text-lg">
                    Per month for {loanTenure} years
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Loan Summary */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gray-50 rounded-t-xl">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Loan Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-600">
                        Principal Amount
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {formatCurrency(loanAmount)}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrencyFull(loanAmount)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-600">
                        Total Interest
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {formatCurrency(totalInterest)}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrencyFull(totalInterest)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {formatCurrency(totalAmount)}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrencyFull(totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Yearly Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 text-lg">
                    Yearly Payments
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Year 1</div>
                      <div className="font-semibold text-gray-800">
                        {formatCurrency(emi * 12)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Year 5</div>
                      <div className="font-semibold text-gray-800">
                        {formatCurrency(emi * 12 * 5)}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Year 10</div>
                      <div className="font-semibold text-gray-800">
                        {formatCurrency(emi * 12 * 10)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #1a3b4c;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #1a3b4c;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
