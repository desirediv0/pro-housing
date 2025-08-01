"use client";

import {
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7,
  logo8,
  logo9,
  logo10,
  logo11,
  logo12,
  logo13,
  logo14,
  logo15,
  logo16,
  logo17,
  logo18,
  logo19,
  logo20,
  logo21,
  logo22,
  logo23,
  logo24,
  logo25,
  logo26,
  logo27,
  logo28,
  logo29,
  logo30,
  logo31,
  logo32,
  logo33,
  logo34,
  logo35,
  logo36,
  logo37,
  logo38,
} from "@/assets";
import { InfiniteMovingCards } from "./InfiniteMovingCards";

export default function LogoSlider() {
  const logos = [
    { src: logo1, alt: "logo" },
    { src: logo2, alt: "logo" },
    { src: logo3, alt: "logo" },
    { src: logo4, alt: "logo" },
    { src: logo5, alt: "logo" },
    { src: logo6, alt: "logo" },
    { src: logo7, alt: "logo" },
    { src: logo8, alt: "logo" },
    { src: logo9, alt: "logo" },
    { src: logo10, alt: "logo" },
    { src: logo11, alt: "logo" },
    { src: logo12, alt: "logo" },
    { src: logo13, alt: "logo" },
    { src: logo14, alt: "logo" },
    { src: logo15, alt: "logo" },
    { src: logo16, alt: "logo" },
    { src: logo17, alt: "logo" },
    { src: logo18, alt: "logo" },
    { src: logo19, alt: "logo" },
    { src: logo20, alt: "logo" },
    { src: logo21, alt: "logo" },
    { src: logo22, alt: "logo" },
    { src: logo23, alt: "logo" },
    { src: logo24, alt: "logo" },
    { src: logo25, alt: "logo" },
    { src: logo26, alt: "logo" },
    { src: logo27, alt: "logo" },
    { src: logo28, alt: "logo" },
    { src: logo29, alt: "logo" },
    { src: logo30, alt: "logo" },
    { src: logo31, alt: "logo" },
    { src: logo32, alt: "logo" },
    { src: logo33, alt: "logo" },
    { src: logo34, alt: "logo" },
    { src: logo35, alt: "logo" },
    { src: logo36, alt: "logo" },
    { src: logo37, alt: "logo" },
    { src: logo38, alt: "logo" },
  ];

  // Create multiple copies to ensure full coverage
  const allLogos = [...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <div className="overflow-hidden py-8 bg-[#2a4b5c24]">
      <div className="text-center mb-8">
        <h3 className="text-3xl sm:text-4xl font-bold text-[#1A3B4C] mb-3">
          Trusted Developers
        </h3>
        <p className="text-gray-500">
          Partnered with top developers across India
        </p>
      </div>
      <div className="relative w-full">
        <InfiniteMovingCards items={allLogos} />
      </div>
    </div>
  );
}
