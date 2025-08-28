import React from "react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative w-full h-[600px] ">
      <Image
        src="/hero-section-bg.jpg"
        alt="Hero section background"
        fill
        className="object-cover"
      />

      <div className="absolute left-6 top-8  md:left-24 md:top-16 max-w-3xl px-4 ">
        <h1 className="font-extrabold text-4xl md:text-6xl lg:text-7xl ">
          FIND CLOTHES
        </h1>
        <h2 className="font-extrabold text-4xl md:text-6xl lg:text-7xl ">
          THAT MATCHES
        </h2>
        <h2 className="font-extrabold text-4xl md:text-6xl lg:text-7xl ">
          YOUR STYLE
        </h2>

        <p className="mt-4 text-base md:text-lg text-[#989598]">
          Explore our exquisite collection of handcrafted garments, meticulously
          designed to reflect your unique style and celebrate the rich heritage
          of Pakistani design.
        </p>

        <button className="bg-black text-white rounded-full py-3 px-8 mt-6 text-lg">
          Shop Now
        </button>

        <div className="flex flex-wrap gap-8 md:gap-16 mt-10">
          <div>
            <h3 className="font-bold text-3xl md:text-5xl">200+</h3>
            <p className="text-[#989598]">International Brands</p>
          </div>
          <div>
            <h3 className="font-bold text-3xl md:text-5xl">2,000+</h3>
            <p className="text-[#989598]">High Quality Products</p>
          </div>
          <div>
            <h3 className="font-bold text-3xl md:text-5xl">30,000+</h3>
            <p className="text-[#989598]">Happy Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
