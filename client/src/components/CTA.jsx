"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Phone } from "lucide-react";
import Link from "next/link";

const CTA = () => {
  return (
    <motion.section
      className="py-24 bg-gradient-to-br from-[#1A3B4C] via-[#2A4B5C] to-[#3A5B6C]"
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
            <Link href="/properties" className="flex-1 sm:flex-none">
              <Button
                size="lg"
                className="w-full bg-white text-[#1A3B4C] hover:bg-gray-100 hover:text-[#1A3B4C] font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="h-5 w-5 mr-2" />
                Start Searching
              </Button>
            </Link>
            <Link href="/contact" className="flex-1 sm:flex-none">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-[#1A3B4C] font-bold px-8 py-4 rounded-xl transition-all duration-300 bg-transparent"
              >
                <Phone className="h-5 w-5 mr-2" />
                Talk to Expert
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTA;
