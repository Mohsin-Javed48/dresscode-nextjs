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
    <div className="container mx-auto px-4 py-8 bg-[#f0f0f0] rounded-xl shadow-md">
      <h2 className="text-4xl font-extrabold text-center text-black mb-8">
        BROWSE BY DRESS STYLE
      </h2>
      <div className="grid grid-cols-2 gap-6 p-4">
        {/* Casual */}
        <div className="relative w-full h-64  rounded-xl overflow-hidden">
          <h2 className="absolute top-2 left-4 text-2xl font-semibold text-black  bg-opacity-50 px-2 py-1 rounded z-10">
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
        <div className="relative w-full h-64  rounded-xl overflow-hidden">
          <h2 className="absolute top-2 left-4 text-2xl font-semibold text-white  bg-opacity-50 px-2 py-1 rounded z-10">
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
        <div className="relative w-full h-64  rounded-xl overflow-hidden">
          <h2 className="absolute top-2 left-4 text-2xl font-semibold text-black  bg-opacity-50 px-2 py-1 rounded z-10">
            Party
          </h2>
          <Image
            src={partyImage}
            alt="Party image not found"
            className="w-full h-full object-cover"
            fill
            priority
          />
        </div>

        {/* Gym */}
        <div className="relative w-full h-64  rounded-xl overflow-hidden">
          <h2 className="absolute top-2 left-4 text-2xl font-semibold text-white  bg-opacity-50 px-2 py-1 rounded z-10">
            Gym
          </h2>
          <Image
            src={gymImage}
            alt="Gym image not found"
            className="w-full h-full object-cover"
            fill
            priority
          />
        </div>
      </div>
    </div>
  );
}
