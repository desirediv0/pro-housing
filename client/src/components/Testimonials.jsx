import { Building, CheckCircle, MapPin, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";

const Testimonials = ({ testimonials }) => {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <h2 className="text-3xl font-bold text-gray-900">
              What Our Clients Say
            </h2>
          </div>
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="text-3xl font-bold text-gray-900">4.9</div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 text-yellow-400 fill-current"
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600">
            Based on {testimonials.length} reviews from Gurugram
          </p>
        </div>

        <div className="px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              skipSnaps: false,
              slidesToScroll: 1,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/3"
                >
                  <div className="h-full">
                    <div className="h-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-500">
                              {testimonial.date}
                            </p>
                            <span className="text-gray-300">•</span>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 text-yellow-400 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Building className="h-4 w-4 mr-2" />
                          <span>{testimonial.propertyType}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{testimonial.location}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 mb-4">
                        {testimonial.content}
                      </p>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">
                            {testimonial.role}
                          </span>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 bg-white hover:bg-gray-100" />
              <CarouselNext className="-right-4 bg-white hover:bg-gray-100" />
            </div>
          </Carousel>
        </div>

        {/* <div className="mt-12 text-center">
        <Button
          className="bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300 px-8 py-3 rounded-full font-medium"
          onClick={() =>
            window.open(
              "https://g.page/r/your-google-review-link",
              "_blank"
            )
          }
        >
          Write a review
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div> */}
      </div>
    </section>
  );
};

export default Testimonials;
