import React from "react";
import Image from "next/image";
import casualImage from "../../../public/casual-image.jpg";
import formalImage from "../../../public/formal-image.jpg";
import partyImage from "../../../public/party-image.jpg";
import gymImage from "../../../public/gym-image.jpg";

const styles = [
  { id: 1, name: "Casual", image: casualImage },
  { id: 2, name: "Formal", image: formalImage },
  { id: 3, name: "Party", image: partyImage },
  { id: 4, name: "Gym", image: gymImage },
];

export default function BrowseByStyle() {
  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12 bg-[#f0f0f0] rounded-xl shadow-md">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-center text-black mb-6 sm:mb-8 lg:mb-10">
        BROWSE BY DRESS STYLE
      </h2>

      {/* Mobile: Single column, Tablet: 2 columns, Desktop: 2x2 grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 p-2 sm:p-4">
        {/* Casual */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
          <h2 className="absolute top-2 sm:top-3 lg:top-4 left-3 sm:left-4 text-lg sm:text-xl lg:text-2xl font-semibold text-black bg-white bg-opacity-70 px-2 sm:px-3 py-1 sm:py-2 rounded z-10 shadow-sm">
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
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
          <h2 className="absolute top-2 sm:top-3 lg:top-4 left-3 sm:left-4 text-lg sm:text-xl lg:text-2xl font-semibold text-white bg-black bg-opacity-70 px-2 sm:px-3 py-1 sm:py-2 rounded z-10 shadow-sm">
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
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
          <h2 className="absolute top-2 sm:top-3 lg:top-4 left-3 sm:left-4 text-lg sm:text-xl lg:text-2xl font-semibold text-black bg-white bg-opacity-70 px-2 sm:px-3 py-1 sm:py-2 rounded z-10 shadow-sm">
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
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
          <h2 className="absolute top-2 sm:top-3 lg:top-4 left-3 sm:left-4 text-lg sm:text-xl lg:text-2xl font-semibold text-white bg-black bg-opacity-70 px-2 sm:px-3 py-1 sm:py-2 rounded z-10 shadow-sm">
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
  );
}
