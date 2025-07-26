"use client";
import { motion } from "framer-motion";
import {
  Award,
  Users,
  Home,
  Star,
  Shield,
  Heart,
  TrendingUp,
  Building,
  CheckCircle,
  Target,
  Phone,
  Linkedin,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import CTA from "@/components/CTA";

export default function AboutPage() {
  const stats = [
    {
      icon: Home,
      number: "2500+",
      label: "Properties Sold",
    },
    {
      icon: Users,
      number: "5000+",
      label: "Happy Clients",
    },
    {
      icon: Building,
      number: "50+",
      label: "Cities Covered",
    },
    {
      icon: Award,
      number: "15+",
      label: "Years Experience",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description:
        "We believe in complete transparency in all our dealings and building long-term trust with our clients.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Our customers are at the heart of everything we do. Their satisfaction is our primary goal.",
    },
    {
      icon: Star,
      title: "Excellence",
      description:
        "We strive for excellence in every aspect of our service, from property selection to customer support.",
    },
    {
      icon: Target,
      title: "Innovation",
      description:
        "We continuously innovate our processes and technology to provide the best real estate experience.",
    },
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      position: "CEO & Founder",
      image: "/user1.jpg",
      description:
        "15+ years in real estate industry with expertise in luxury properties.",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Priya Sharma",
      position: "Head of Sales",
      image: "/user3.jpg",
      description:
        "Expert in property valuation and market analysis with 12+ years experience.",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Amit Patel",
      position: "Technical Director",
      image: "/user2.jpg",
      description:
        "Technology enthusiast driving digital transformation in real estate.",
      social: {
        linkedin: "#",
        twitter: "#",
      },
    },
  ];

  const achievements = [
    "Best Real Estate Company 2023 - Mumbai Awards",
    "Customer Choice Award 2022 - Property Today",
    "Excellence in Digital Innovation 2023",
    "Top 10 Real Estate Brands in India 2022",
    "Certified Green Building Partner",
    "ISO 9001:2015 Quality Management Certified",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-[#1A3B4C] via-[#2A4B5C] to-[#3A5B6C] py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-4 -right-4 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-8 -left-8 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About Pro Housing
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transforming the real estate landscape with innovation, trust, and
            excellence. Your dream home is just a click away.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              onClick={() => {
                if (confirm("Do you want to call +91 90909 08081?")) {
                  window.open("tel:+919090908081");
                }
              }}
              size="lg"
              className="bg-white text-[#1A3B4C] hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="h-5 w-5 mr-2" />
              Get In Touch
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="text-center border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-[#1A3B4C]" />
                      </div>
                      <motion.h3
                        className="text-3xl font-bold text-gray-900 mb-2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {stat.number}
                      </motion.h3>
                      <p className="text-gray-600 font-medium">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded in 2008, Pro Housing began with a simple vision: to
                  make real estate transactions transparent, efficient, and
                  stress-free for everyone involved.
                </p>
                <p>
                  What started as a small team of passionate real estate
                  professionals has grown into one of India&apos;s most trusted
                  property platforms, serving thousands of customers across 50+
                  cities.
                </p>
                <p>
                  Today, we leverage cutting-edge technology, deep market
                  insights, and personalized service to help you find not just a
                  property, but a place you can truly call home.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6 md:mt-0">
                    Learn More
                    <TrendingUp className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/main.jpg"
                  alt="Pro Housing Office"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-xl font-bold mb-2">Our Mumbai Office</h4>
                  <p className="text-white/90">
                    Where innovation meets tradition
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Values */}
      <motion.section
        className="py-20 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These fundamental principles guide everything we do and help us
              deliver exceptional service to our clients.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-[#1A3B4C] to-[#2A4B5C] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Our Team */}
      <motion.section
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced professionals are dedicated to helping you achieve
              your real estate goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-[#1A3B4C] font-semibold mb-3">
                      {member.position}
                    </p>
                    <p className="text-gray-600 mb-4">{member.description}</p>
                    <div className="flex justify-center space-x-3">
                      <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </button>
                      <button className="w-10 h-10 bg-blue-400 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-colors">
                        <Twitter className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Awards & Recognition */}
      <motion.section
        className="py-20 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry
              leaders and customers alike.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <p className="text-gray-800 font-medium">{achievement}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
