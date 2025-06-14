import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Phone } from "lucide-react";

const CTA = () => {
  return (
    <motion.section
      className="py-24 bg-gradient-to-br from-[#493AB1] via-[#6B5FC7] to-[#8A79DD]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-10 text-white/90">
            Join thousands of happy customers who found their perfect property
            with Pro Housing
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 hover:text-blue-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Search className="h-5 w-5 mr-2" />
              Start Searching
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-black hover:bg-white hover:text-blue-600 font-bold px-8 py-4 rounded-xl transition-all duration-300"
            >
              <Phone className="h-5 w-5 mr-2" />
              Talk to Expert
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTA;
