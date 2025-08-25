import React from "react";
import Image from "next/image";

export default function page() {
  return (
    <div className="relative w-full h-[600px] flex justify-center items-center ">
      <Image
        src="/hero-section-bg.jpg"
        alt="hero section not found"
        layout="fill"
        // objectFit="cover"
      />
      <div className="text-left absolute left-24 top-16 h-[500px] w-[670px]">
        <h1 className="font-extrabold text-7xl">FIND CLOTHES</h1>
        <h1 className="font-extrabold text-7xl">THAT MATCHES</h1>
        <h1 className="font-extrabold text-7xl">YOUR STYLE</h1>
        <p className="mt-2 text-lg text-[#989598]">
          Explore our exquisite collection of handcrafted garments, meticulously
          designed to reflect your unique style and celebrate the rich heritage
          of Pakistani design.
        </p>
        <button className="bg-black text-white rounded-4xl py-2 px-8 w-42 h-12 flex justify-center items-center flex-row">
          Shop Now
        </button>
        <div className="flex flex-row gap-16 mt-12">
          <div>
            <h1 className="font-bold text-5xl">200+</h1>
            <p className="text-[#989598]">International Brands</p>
          </div>
          <div>
            <h1 className="font-bold text-5xl">2,000+</h1>
            <p className="text-[#989598]">High Quality Products</p>
          </div>
          <div>
            <h1 className="font-bold text-5xl">30,000+</h1>
            <p className="text-[#989598]">Happy Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
