"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Play, User, Mail } from "lucide-react";
import Image from "next/image";

const SidebarContent = ({ content = [], currentProperty = null }) => {
  // If content is null or undefined, use an empty array
  const safeContent = Array.isArray(content) ? content : [];

  // If there's no content, return null
  if (!safeContent.length) {
    return null;
  }

  // Only show active content
  const activeContent = safeContent.filter((item) => item.isActive);

  if (!activeContent.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {activeContent.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden shadow-xl border-0 bg-white"
        >
          {/* Image Section */}
          {item.imageUrl && (
            <div className="aspect-video relative group">
              <Image
                src={item.imageUrl}
                alt="Property content"
                className="w-full h-full object-cover"
                width={400}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}

          <CardContent className="p-6">
            {/* Contact Information */}
            <div className="space-y-4">
              {/* Phone Number */}
              {item.phoneNumber && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    📞 Contact Agent
                  </p>
                  <a
                    href={`tel:${item.phoneNumber}`}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <div className="p-3 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-all duration-300 shadow-lg">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-blue-700 text-lg">
                        Call Now
                      </p>
                      <p className="text-xl font-semibold text-blue-600 tracking-wide">
                        {item.phoneNumber}
                      </p>
                      <p className="text-xs text-blue-500 mt-1">
                        ⚡ Instant Response
                      </p>
                    </div>
                  </a>
                </div>
              )}

              {/* WhatsApp */}
              {item.whatsappNumber && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">
                    💬 WhatsApp Chat
                  </p>
                  <a
                    href={`https://wa.me/${item.whatsappNumber.replace(
                      /[^0-9]/g,
                      ""
                    )}${
                      currentProperty
                        ? `?text=Hi! I'm interested in the property: ${
                            currentProperty.title
                          } (${currentProperty.propertyType} in ${
                            currentProperty.city
                          }). Price: ₹${new Intl.NumberFormat("en-IN").format(
                            currentProperty.price
                          )}. Can you provide more details?`
                        : ""
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <div className="p-3 bg-green-500 rounded-full group-hover:bg-green-600 transition-all duration-300 shadow-lg">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-green-700 text-lg">
                        WhatsApp Chat
                      </p>
                      <p className="text-xl font-semibold text-green-600 tracking-wide">
                        {item.whatsappNumber}
                      </p>
                      <p className="text-xs text-green-500 mt-1">
                        💚 Quick Response Guaranteed
                      </p>
                    </div>
                  </a>
                </div>
              )}

              {/* Video Section */}
              {item.videoUrl && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600">
                    Property Video
                  </p>
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100">
                    <video
                      src={item.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                      poster={item.imageUrl} // Use the image as poster if available
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    <span>Verified Agent</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    <span>Quick Response</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Additional Sidebar Card - Property Tips */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-[#5E4CBB]/5 to-[#7B68D9]/5">
        <CardHeader className="pb-3">
          <h3 className="font-bold text-gray-900">💡 Property Tips</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#5E4CBB] rounded-full mt-2 flex-shrink-0"></span>
              <p>Schedule a visit during different times of the day</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#5E4CBB] rounded-full mt-2 flex-shrink-0"></span>
              <p>Check for nearby amenities and transportation</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#5E4CBB] rounded-full mt-2 flex-shrink-0"></span>
              <p>Verify all documents before making a decision</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Card */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-[#5E4CBB] to-[#7B68D9] text-white hidden md:block">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold text-lg mb-2">Need Help?</h3>
          <p className="text-white/80 text-sm mb-4">
            Our property experts are here to assist you with any questions.
          </p>
          <Button className="w-full bg-white text-[#5E4CBB] hover:bg-gray-100 rounded-xl font-semibold">
            Get Expert Advice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarContent;
