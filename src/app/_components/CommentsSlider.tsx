"use client";

import { useState } from "react";
import { Rating } from "@/app/_components/RatingStart";

export default function CommentSlider() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [rating, setRating] = useState(0);

  const comments = [
    {
      name: "Sarah M.",
      rating: 4,
      text: "I'm blown away by the quality and style of the clothes I received from Shopco. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
      name: "Alex K.",
      rating: 4.5,
      text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shopco. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    },
    {
      name: "James L.",
      rating: 4,
      text: "I'm someone who's always on the lookout for unique fashion pieces. I'm thrilled to have stumbled upon Shopco. The selection of clothes is not only diverse but also on-point with the latest trends.",
    },
    {
      name: "Moosa",
      rating: 5,
      text: "I stumbled across Shopco and was impressed by the variety of clothes available. The quality is top-notch, and the designs are modern and stylish.",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === comments.length - 2 ? 1 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 1 ? comments.length - 2 : prevIndex - 1
    );
  };

  // Catch Rating value
  const handleRating = (rate: number) => {
    setRating(rate);

    // other logic
  };
  // Optinal callback functions
  const onPointerEnter = () => console.log("Enter");
  const onPointerLeave = () => console.log("Leave");
  const onPointerMove = (value: number, index: number) =>
    console.log(value, index);

  return (
    <div className="relative w-full  mx-auto py-10 flex flex-col justify-center">
      <h2 className="text-4xl font-extrabold text-black mb-6 text-left ml-46">
        OUR HAPPY CUSTOMERS
      </h2>
      <div className="absolute top-16 right-42 mb-6 ">
        <button
          onClick={prevSlide}
          className=" text-3xl text-black hover:text-gray-700"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="  text-3xl text-black hover:text-gray-700"
        >
          →
        </button>
      </div>
      <div className="flex justify-center items-center border border-gray-200  ">
        {[-1, 0, 1, 2, 3].map((offset) => {
          const index =
            (currentIndex + offset + comments.length) % comments.length;
          const isBlurred = offset === -1 || offset === 3;
          return (
            <div
              key={index}
              className={`bg-white p-6 m-2 rounded-lg shadow-lg min-h-[230px]  min-w-[500px]   text-left  ${
                isBlurred ? "blur-sm opacity-70" : ""
              }`}
            >
              <div className="flex flex-row items-center gap-x-2">
                <Rating value={comments[index].rating} readOnly size={24} />
              </div>
              <p className="font-semibold">{comments[index].name}</p>
              <p className="text-gray-600 mb-4">{comments[index].text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
