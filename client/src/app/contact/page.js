"use client";

import React, { useState } from "react";
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
  CheckCircle,
  ArrowRight,
  Home,
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
      value: "+91 98765 43210",
      action: "tel:+919876543210",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us a message",
      value: "info@prohousing.com",
      action: "mailto:info@prohousing.com",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Our office location",
      value: "Bandra West, Mumbai, Maharashtra 400050",
      action: "#",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Clock,
      title: "Office Hours",
      description: "We're here to help",
      value: "Mon - Sat: 9:00 AM - 7:00 PM",
      action: "#",
      color: "from-orange-500 to-red-500",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Trusted Service",
      description: "10+ years of excellence in real estate",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for outstanding customer service",
    },
    {
      icon: Users,
      title: "5000+ Happy Clients",
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
      name: "Raj Sharma",
      role: "Property Buyer",
      image: "/api/placeholder/60/60",
      rating: 5,
      comment:
        "Excellent service! The team helped me find my dream home within my budget. Highly recommended!",
    },
    {
      name: "Priya Patel",
      role: "Property Seller",
      image: "/api/placeholder/60/60",
      rating: 5,
      comment:
        "Professional and efficient. They sold my property at the best price in the market.",
    },
    {
      name: "Amit Kumar",
      role: "Investor",
      image: "/api/placeholder/60/60",
      rating: 5,
      comment:
        "Great investment advice and market insights. I've invested in multiple properties through them.",
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
    { value: "commercial", label: "Commercial" },
    { value: "land", label: "Land" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Get in Touch With Us
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
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
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {info.description}
                  </p>
                  <a
                    href={info.action}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-lg transition-colors duration-200"
                  >
                    {info.value}
                  </a>
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
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <MessageSquare className="h-6 w-6 mr-3 text-indigo-600" />
                  Send Us a Message
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
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
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
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
                          className="pl-10 py-3 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                          className="pl-10 py-3 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                          placeholder="+91 98765 43210"
                          className="pl-10 py-3 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white appearance-none"
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
                      className="mt-2 py-3 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                      className="mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <MapPin className="h-6 w-6 mr-3 text-green-600" />
                  Our Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Map placeholder - Replace with actual map */}
                <div className="h-64 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">Pro Housing Office</h3>
                    <p className="text-green-100">Bandra West, Mumbai</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Visit Our Office
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Come visit our modern office in the heart of Bandra. Our
                    team is ready to assist you with all your real estate needs.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                  >
                    Get Directions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
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
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-indigo-600" />
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
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
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
                  {[
                    {
                      icon: Facebook,
                      color: "hover:bg-blue-600",
                      name: "Facebook",
                    },
                    {
                      icon: Twitter,
                      color: "hover:bg-blue-400",
                      name: "Twitter",
                    },
                    {
                      icon: Instagram,
                      color: "hover:bg-pink-600",
                      name: "Instagram",
                    },
                    {
                      icon: Linkedin,
                      color: "hover:bg-blue-700",
                      name: "LinkedIn",
                    },
                  ].map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <button
                        key={index}
                        className={`w-12 h-12 bg-gray-100 ${social.color} hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110`}
                        title={social.name}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    );
                  })}
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
              Don't just take our word for it. Here's what our satisfied clients
              have to say about their experience with Pro Housing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  <Quote className="h-8 w-8 text-gray-300 mb-3" />
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-sm">
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
