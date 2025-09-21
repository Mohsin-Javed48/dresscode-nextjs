"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import casualImage from "../../../public/casual-image.jpg";
import formalImage from "../../../public/formal-image.jpg";
import partyImage from "../../../public/party-image.jpg";
import gymImage from "../../../public/gym-image.jpg";

export default function BrowseByStyle() {
  const router = useRouter();

  const handleStyleClick = (styleName: string) => {
    router.push(`/styles?style=${styleName.toLowerCase()}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-black mb-8 lg:mb-12">
        BROWSE BY DRESS STYLE
      </h2>

      {/* 2x2 grid layout */}
      <div className="bg-[#f0f0f0] rounded-2xl p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {/* Casual */}
          <div
            onClick={() => handleStyleClick("Casual")}
            className="relative w-full h-40 sm:h-44 lg:h-48 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h2 className="absolute top-3 left-3 text-xl lg:text-2xl font-semibold text-black bg-white bg-opacity-80 px-3 py-2 rounded-lg z-10 shadow-sm">
              Casual
            </h2>
            <Image
              src={casualImage}
              alt="Casual image not found"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Formal */}
          <div
            onClick={() => handleStyleClick("Formal")}
            className="relative w-full h-40 sm:h-44 lg:h-48 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h2 className="absolute top-3 left-3 text-xl lg:text-2xl font-semibold text-white bg-black bg-opacity-80 px-3 py-2 rounded-lg z-10 shadow-sm">
              Formal
            </h2>
            <Image
              src={formalImage}
              alt="Formal image not found"
              className="object-cover"
              fill
              priority
            />
          </div>

          {/* Party */}
          <div
            onClick={() => handleStyleClick("Party")}
            className="relative w-full h-40 sm:h-44 lg:h-48 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h2 className="absolute top-3 left-3 text-xl lg:text-2xl font-semibold text-black bg-white bg-opacity-80 px-3 py-2 rounded-lg z-10 shadow-sm">
              Party
            </h2>
            <Image
              src={partyImage}
              alt="Party image not found"
              className="object-cover"
              fill
              priority
            />
          </div>

          {/* Gym */}
          <div
            onClick={() => handleStyleClick("Gym")}
            className="relative w-full h-40 sm:h-44 lg:h-48 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <h2 className="absolute top-3 left-3 text-xl lg:text-2xl font-semibold text-white bg-black bg-opacity-80 px-3 py-2 rounded-lg z-10 shadow-sm">
              Gym
            </h2>
            <Image
              src={gymImage}
              alt="Gym image not found"
              className="object-cover"
              fill
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
