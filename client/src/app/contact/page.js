"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  User,
  Building,
  Star,
  Quote,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Shield,
  Award,
  Users,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form";
import { publicAPI } from "@/lib/api-functions";
import toast from "react-hot-toast";
import Image from "next/image";
import Testimonials from "@/components/Testimonials";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    propertyType: "",
    inquiryType: "general",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.message) {
        toast.error("Please fill in all required fields", {
          icon: "⚠️",
          style: {
            borderRadius: "10px",
            background: "#F59E0B",
            color: "#fff",
          },
        });
        setLoading(false);
        return;
      }

      // Submit inquiry to API
      const inquiryData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject || `${formData.inquiryType} inquiry`,
        message: formData.message,
        propertyType: formData.propertyType || null,
        inquiryType: formData.inquiryType,
        type: formData.inquiryType.toUpperCase(),
        source: "CONTACT_FORM",
      };

      const response = await publicAPI.submitGeneralInquiry(inquiryData);

      toast.success("Message sent successfully! We'll get back to you soon.", {
        icon: "📧",
        style: {
          borderRadius: "10px",
          background: "#10B981",
          color: "#fff",
        },
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        propertyType: "",
        inquiryType: "general",
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to send message. Please try again.", {
        icon: "❌",
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

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our experts",
      value: "+91 90909 08081",
      action: "tel:+919090908081",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us a message",
      value: "Founder.prohousing@gmail.com",
      action: "mailto:Founder.prohousing@gmail.com",
    },
    {
      icon: MapPin,
      title: "Corporate Office",
      description: "Our corporate address",
      value: "89/2 Sector 39, Gurugram",
      action: "#",
    },
    {
      icon: Building,
      title: "Registered Office",
      description: "Our registered address",
      value:
        "Dahaliya Builders Pvt Ltd, B-205, Jindal Global City, GT Road, Sonipat",
      action: "#",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Trusted Service",
      description: "9+ years of excellence in real estate",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for outstanding customer service",
    },
    {
      icon: Users,
      title: "3000+ Happy Clients",
      description: "Successfully helped thousands find homes",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock assistance available",
    },
  ];

  const testimonials = [
    {
      name: "Arun Sharma",
      role: "Property Buyer",
      content:
        "Found my dream apartment in Sector 48, Gurugram through Pro Housing. Their team was extremely professional and helped me negotiate the best price. The entire process from property viewing to documentation was seamless.",
      rating: 5,
      location: "Sector 48, Gurugram",
      date: "2 weeks ago",
      propertyType: "3 BHK Apartment",
    },
    {
      name: "Priya Malhotra",
      role: "Home Owner",
      content:
        "Pro Housing helped me sell my property in DLF Phase 5 at the best market price. Their market analysis and property valuation was spot on. The team's dedication and regular updates made the selling process stress-free.",
      rating: 5,
      location: "DLF Phase 5, Gurugram",
      date: "1 month ago",
      propertyType: "4 BHK Villa",
    },
    {
      name: "Rajat Verma",
      role: "First-time Buyer",
      content:
        "As a first-time homebuyer in Gurugram, I was quite nervous. Pro Housing's team guided me through every step, from shortlisting properties in Golf Course Road to handling all the paperwork. Highly recommend their services!",
      rating: 5,
      location: "Golf Course Road, Gurugram",
      date: "3 weeks ago",
      propertyType: "2 BHK Apartment",
    },
    {
      name: "Neha Gupta",
      role: "Property Investor",
      content:
        "Pro Housing has been instrumental in building my property portfolio in Gurugram. Their investment advice and market insights for Sohna Road properties were invaluable. The rental management services are excellent too.",
      rating: 5,
      location: "Sohna Road, Gurugram",
      date: "1 week ago",
      propertyType: "Commercial Space",
    },
    {
      name: "Vikram Singh",
      role: "NRI Investor",
      content:
        "Managing property investment from abroad was made easy by Pro Housing. They helped me acquire a premium property in Sector 60 and are managing it perfectly. Their virtual tours and detailed reports are excellent.",
      rating: 5,
      location: "Sector 60, Gurugram",
      date: "2 months ago",
      propertyType: "Luxury Apartment",
    },
  ];

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "buying", label: "Buying Property" },
    { value: "selling", label: "Selling Property" },
    { value: "renting", label: "Renting Property" },
    { value: "investment", label: "Investment Advice" },
    { value: "support", label: "Customer Support" },
  ];

  const propertyTypes = [
    { value: "", label: "Select Property Type" },
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "builder-floor", label: "Builder Floor" },
    { value: "commercial", label: "Commercial" },
    { value: "land", label: "Land" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1A3B4C] via-[#2A4B5C] to-[#3A5B6C] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Get in Touch With Us
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Ready to find your perfect property? Our expert team is here to help
            you every step of the way. Contact us today for personalized real
            estate solutions.
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-[#1A3B4C]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {info.description}
                  </p>
                  {info.action.startsWith("tel:") ? (
                    <button
                      onClick={() => {
                        if (confirm(`Do you want to call ${info.value}?`)) {
                          window.open(info.action);
                        }
                      }}
                      className="text-[#1A3B4C] hover:text-[#0A2B3C] font-semibold text-base transition-colors duration-200"
                    >
                      {info.value}
                    </button>
                  ) : (
                    <a
                      href={info.action}
                      className="text-[#1A3B4C] hover:text-[#0A2B3C] font-semibold text-base transition-colors duration-200"
                    >
                      {info.value}
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#1A3B4C]/10 to-[#2A4B5C]/10 border-b border-gray-200">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-3 text-[#1A3B4C]" />
                  Send Us a Message
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Inquiry Type */}
                  <div>
                    <Label
                      htmlFor="inquiryType"
                      className="text-gray-700 font-semibold"
                    >
                      Inquiry Type *
                    </Label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      required
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3B4C] focus:border-transparent bg-white"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-gray-700 font-semibold"
                      >
                        Full Name *
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className="pl-10 py-3 border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-gray-700 font-semibold"
                      >
                        Email Address *
                      </Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your email"
                          className="pl-10 py-3 border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone and Property Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-gray-700 font-semibold"
                      >
                        Phone Number
                      </Label>
                      <div className="relative mt-2">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 90909 08081"
                          className="pl-10 py-3 border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="propertyType"
                        className="text-gray-700 font-semibold"
                      >
                        Property Type
                      </Label>
                      <div className="relative mt-2">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          id="propertyType"
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3B4C] focus:border-transparent bg-white appearance-none"
                        >
                          {propertyTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <Label
                      htmlFor="subject"
                      className="text-gray-700 font-semibold"
                    >
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What can we help you with?"
                      className="mt-2 py-3 border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C]"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <Label
                      htmlFor="message"
                      className="text-gray-700 font-semibold"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Tell us more about your requirements..."
                      className="mt-2 border-gray-300 focus:border-[#1A3B4C] focus:ring-[#1A3B4C] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6 md:mt-0 hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="h-5 w-5 mr-3" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Map and Additional Info */}
          <div className="space-y-8">
            {/* Map */}
            <Card className="shadow-2xl border border-gray-200 overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <MapPin className="h-6 w-6 mr-3 text-[#1A3B4C]" />
                  Our Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Map placeholder - Replace with actual map */}
                <div className="h-64 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6983.177298602003!2d77.05923744251169!3d28.94026010199202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390daf0e208d00d9%3A0x4ca8cbfc3e07f682!2sJindal%20Global%20City!5e0!3m2!1sen!2sin!4v1753681361053!5m2!1sen!2sin"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Visit Our Office
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Come visit our modern office in Jindal Global City, Sector
                    35, Sonipat. Our team is ready to assist you with all your
                    real estate needs.
                  </p>
                  <Button
                    onClick={() => {
                      window.open(
                        "https://www.google.com/maps/place/Jindal+Global+City/@28.94026010199202,77.05923744251169,15z/data=!4m6!3m5!1s0x390daf0e208d00d9:0x4ca8cbfc3e07f682!8m2!3d28.94026010199202!4d77.05923744251169!16s%2Fg%2F11c4028q7c?entry=ttu",
                        "_blank"
                      );
                    }}
                    variant="outline"
                    className="w-full border-[#1A3B4C] text-[#1A3B4C] hover:bg-[#1A3B4C] hover:text-white"
                  >
                    Get Directions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-2xl border border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Why Choose Pro Housing?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-[#1A3B4C]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-2xl border border-gray-200">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Connect With Us
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-6">
                  Follow us on social media for the latest property updates and
                  real estate news.
                </p>
                <div className="flex space-x-4">
                  {/* WhatsApp */}
                  <button
                    onClick={() => {
                      const phoneNumber = "9090908081";
                      const message =
                        "Hello! I'm interested in exploring properties with Pro Housing. Can you please help me find the right property?";
                      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                        message
                      )}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    className="w-12 h-12 bg-gray-100 hover:bg-green-500 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                    title="Chat on WhatsApp"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386" />
                    </svg>
                  </button>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/prohousing_india?igsh=dTc3YzV6MjNuZ2Qz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 hover:bg-pink-500 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                    title="Follow us on Instagram"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com/@PROHOUSINGINDIA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                    title="Subscribe to our YouTube channel"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our
              satisfied clients have to say about their experience with Pro
              Housing.
            </p>
          </div>
          <Testimonials testimonials={testimonials} />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Get quick answers to the most common questions about our services.
          </p>
        </div>
        <div className="space-y-4">
          {[
            {
              question: "How long does it take to find a property?",
              answer:
                "The time varies based on your requirements and market conditions. On average, we help clients find suitable properties within 2-4 weeks.",
            },
            {
              question: "Do you charge any consultation fees?",
              answer:
                "Initial consultations are completely free. We only charge a commission when we successfully complete a transaction.",
            },
            {
              question: "Can you help with property documentation?",
              answer:
                "Yes! We provide complete assistance with legal documentation, property verification, and registration processes.",
            },
            {
              question: "Do you offer property management services?",
              answer:
                "Yes, we offer comprehensive property management services including maintenance, tenant management, and rental collection.",
            },
          ].map((faq, index) => (
            <Card key={index} className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#1A3B4C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#1A3B4C] font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
