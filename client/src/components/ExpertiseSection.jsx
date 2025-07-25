"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input, Label, Textarea, Select } from "./ui/form";
import {
  X,
  Scale,
  Clipboard,
  Search,
  Home,
  ArrowUpRight,
  Calculator,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { publicAPI } from "@/lib/api-functions";

const ExpertiseSection = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    preferredTimeSlot: "",
    consultationType: "",
    additionalNotes: "",
    loanRequirements: "",
    landDetails: "",
  });

  const expertiseCards = [
    {
      id: "legal",
      title: "Legal",
      icon: <Scale className="h-12 w-12 text-amber-600" />,
      buttonText: "Get Legal Advice",
      description: "Expert legal consultation for property matters",
    },
    {
      id: "taxation",
      title: "Taxation",
      icon: <Calculator className="h-12 w-12 text-blue-600" />,
      buttonText: "Get CA/CS Advice",
      description: "Professional tax and compliance guidance",
    },
    {
      id: "inspection",
      title: "Home Inspection",
      icon: <Search className="h-12 w-12 text-purple-600" />,
      buttonText: "Get Inspection",
      description: "Comprehensive property inspection services",
    },
    {
      id: "loan",
      title: "Home Loan",
      icon: <Home className="h-12 w-12 text-gray-600" />,
      buttonText: "Apply Home Loan",
      description: "Easy home loan application process",
    },
    {
      id: "lease",
      title: "Lease your land",
      icon: <FileText className="h-12 w-12 text-green-600" />,
      buttonText: "Lease Land",
      description: "Lease your property for development",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (serviceType) => {
    try {
      // Validate required fields
      if (
        !formData.fullName ||
        !formData.phoneNumber ||
        !formData.emailAddress ||
        !formData.preferredTimeSlot ||
        !formData.consultationType
      ) {
        alert("Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);

      // Prepare the data to send
      const submitData = {
        ...formData,
        serviceType: serviceType.charAt(0).toUpperCase() + serviceType.slice(1),
      };

      console.log("Submitting data:", submitData);

      // Send to backend
      const response = await publicAPI.submitExpertiseInquiry(submitData);
      console.log("API Response:", response);

      const result = response.data;

      if (result.success) {
        // Reset form and close modal
        setFormData({
          fullName: "",
          phoneNumber: "",
          emailAddress: "",
          preferredTimeSlot: "",
          consultationType: "",
          additionalNotes: "",
          loanRequirements: "",
          landDetails: "",
        });
        setActiveModal(null);

        // Show success message
        alert("Form submitted successfully! We will contact you soon.");
      } else {
        alert(result.message || "Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      console.error("Error details:", error.response?.data);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev + 2 >= expertiseCards.length ? 0 : prev + 2
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev - 2 < 0 ? Math.max(0, expertiseCards.length - 2) : prev - 2
    );
  };

  const renderForm = (serviceType) => {
    const isLegal = serviceType === "legal";
    const isLoan = serviceType === "loan";
    const isLease = serviceType === "lease";

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <Label htmlFor="emailAddress">Email Address *</Label>
          <Input
            id="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={(e) => handleInputChange("emailAddress", e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <Label htmlFor="preferredTimeSlot">Preferred Time Slot *</Label>
          <select
            id="preferredTimeSlot"
            value={formData.preferredTimeSlot}
            onChange={(e) =>
              handleInputChange("preferredTimeSlot", e.target.value)
            }
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            required
          >
            <option value="">Select time slot</option>
            <option value="10 AM - 12 PM">10 AM - 12 PM</option>
            <option value="12 PM - 2 PM">12 PM - 2 PM</option>
            <option value="2 PM - 4 PM">2 PM - 4 PM</option>
            <option value="4 PM - 6 PM">4 PM - 6 PM</option>
          </select>
        </div>

        <div>
          <Label htmlFor="consultationType">Consultation Type *</Label>
          <select
            id="consultationType"
            value={formData.consultationType}
            onChange={(e) =>
              handleInputChange("consultationType", e.target.value)
            }
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            required
          >
            <option value="">Select consultation type</option>
            <option value="New Property">New Property</option>
            <option value="Old Property">Old Property</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {isLegal && (
          <div>
            <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) =>
                handleInputChange("additionalNotes", e.target.value)
              }
              placeholder="Any specific questions or requirements..."
              rows={3}
            />
          </div>
        )}

        {isLoan && (
          <div>
            <Label htmlFor="loanRequirements">
              Loan Requirements (Optional)
            </Label>
            <Textarea
              id="loanRequirements"
              value={formData.loanRequirements}
              onChange={(e) =>
                handleInputChange("loanRequirements", e.target.value)
              }
              placeholder="Any specific loan requirements or property details..."
              rows={3}
            />
          </div>
        )}

        {isLease && (
          <div>
            <Label htmlFor="landDetails">Land Details (Optional)</Label>
            <Textarea
              id="landDetails"
              value={formData.landDetails}
              onChange={(e) => handleInputChange("landDetails", e.target.value)}
              placeholder="Please provide details about your land..."
              rows={3}
            />
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            onClick={() => handleSubmit(serviceType)}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              <>
                {isLegal && "Book My Consultation"}
                {isLoan && "Submit Loan Application"}
                {isLease && "Submit Land Details"}
                {!isLegal && !isLoan && !isLease && "Submit Application"}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveModal(null)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const renderCard = (card) => (
    <div key={card.id} className="text-center flex flex-col h-full">
      <div className="flex-1">
        <div className="flex justify-center mb-4">{card.icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {card.title}
        </h3>
        <p className="text-gray-600 text-sm mb-6">{card.description}</p>
      </div>
      <Button
        onClick={() => setActiveModal(card.id)}
        className="mt-auto w-full bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 rounded-lg px-4 py-2 flex items-center justify-center space-x-2"
      >
        <span>{card.buttonText}</span>
        <ArrowUpRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            EXPLORE OUR EXPERTISE
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get professional assistance for all your property-related needs
          </p>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {expertiseCards.map((card) => renderCard(card))}
        </div>

        {/* Mobile/Tablet Scrollable Carousel */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Scrollable Container */}
            <div
              className="flex gap-2 overflow-x-auto scrollbar-hide px-1"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollSnapType: "x mandatory",
              }}
              tabIndex={0}
            >
              {expertiseCards.map((card, idx) => (
                <div
                  key={card.id}
                  className="w-1/2 flex-shrink-0 snap-start"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    {renderCard(card)}
                  </div>
                </div>
              ))}
            </div>
            {/* Optional: You can add left/right arrows for mobile if you want, but drag/scroll is main UX */}
          </div>
          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from(
              { length: Math.ceil(expertiseCards.length / 2) },
              (_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors bg-gray-300 inline-block`}
                />
              )
            )}
          </div>
        </div>

        {/* Modal */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {activeModal === "legal" && "Book Expert Legal Consultation"}
                  {activeModal === "taxation" && "Book CA/CS Consultation"}
                  {activeModal === "inspection" && "Book Home Inspection"}
                  {activeModal === "loan" && "Home Loan Application"}
                  {activeModal === "lease" && "Lease Your Land"}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6">{renderForm(activeModal)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertiseSection;
