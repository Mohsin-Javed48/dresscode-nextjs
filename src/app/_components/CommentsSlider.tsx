"use client";
import { useState } from "react";
import { Rating } from "@/app/_components/RatingStart";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

export default function CommentSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const comments = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
      name: "Alex K.",
      rating: 5,
      text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    },
    {
      name: "James L.",
      rating: 5,
      text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
    },
    {
      name: "Moosa",
      rating: 5,
      text: "I stumbled across Shop.co and was impressed by the variety of clothes available. The quality is top-notch, and the designs are modern and stylish.",
    },
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === comments.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? comments.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const getVisibleComments = () => {
    const visible = [];
    for (let i = -1; i <= 3; i++) {
      const index = (currentIndex + i + comments.length) % comments.length;
      visible.push({ ...comments[index], position: i });
    }
    return visible;
  };

  const visibleComments = getVisibleComments();

  return (
    <div className="bg-white py-4 sm:py-6 lg:py-8 w-full overflow-hidden mb-6 sm:mb-8 lg:mb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 px-3 sm:px-4 lg:px-6 xl:px-12 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-black tracking-tight order-2 sm:order-1 sm:ml-0 lg:ml-8 xl:ml-32">
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="flex gap-1 order-1 sm:order-2 self-end sm:self-auto">
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className={`p-1 sm:p-1.5 rounded-full border border-gray-300 transition-all duration-200 mr-1 sm:mr-2 ${
              isTransitioning
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:scale-105"
            }`}
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className={`p-1 sm:p-1.5 rounded-full border border-gray-300 transition-all duration-200 sm:mr-8 lg:mr-8 xl:mr-32 ${
              isTransitioning
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 hover:scale-105"
            }`}
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Comments Carousel */}
      <div className="relative w-full h-auto min-h-[160px] sm:min-h-[180px] lg:min-h-[200px]">
        <div
          className={`flex items-stretch h-[250px] gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 xl:px-12 transition-all duration-500 ease-in-out ${
            isTransitioning ? "transform" : ""
          }`}
          style={{
            transform: isTransitioning ? "translateX(-10px)" : "translateX(0)",
            opacity: isTransitioning ? 0.8 : 1,
          }}
        >
          {visibleComments.map((comment, index) => {
            const { position } = comment;
            let cardClasses =
              "bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm flex-shrink-0 h-full transition-all duration-500 ease-in-out";
            let containerClasses = "";

            if (position === -1) {
              // Left partial card - hidden on mobile, visible on larger screens
              cardClasses += ` blur-sm transition-all duration-500 ${
                isTransitioning ? "opacity-30 scale-95" : "opacity-50"
              }`;
              containerClasses =
                "hidden md:block w-16 md:w-24 lg:w-32 xl:w-40 overflow-hidden flex-shrink-0 transition-all duration-500";
            } else if (position === 3) {
              // Right partial card - hidden on mobile, visible on larger screens
              cardClasses += ` blur-sm transition-all duration-500 ${
                isTransitioning ? "opacity-30 scale-95" : "opacity-50"
              }`;
              containerClasses =
                "hidden md:block w-16 md:w-24 lg:w-32 xl:w-40 overflow-hidden flex-shrink-0 transition-all duration-500";
            } else if (position === 0 || position === 1) {
              // Main visible cards
              cardClasses += ` hover:shadow-lg hover:scale-[1.02] transition-all duration-500 ${
                isTransitioning ? "scale-98 shadow-sm" : "scale-100 shadow-md"
              }`;
              containerClasses = "flex-1 min-w-0 transition-all duration-500";
            } else if (position === 2) {
              // Third card - hidden on mobile and small tablets
              cardClasses += ` hover:shadow-lg hover:scale-[1.02] transition-all duration-500 ${
                isTransitioning ? "scale-98 shadow-sm" : "scale-100 shadow-md"
              }`;
              containerClasses =
                "hidden lg:block flex-1 min-w-0 transition-all duration-500";
            }

            return (
              <div
                key={`${currentIndex}-${index}`}
                className={containerClasses}
                style={{
                  transform: isTransitioning
                    ? `translateX(${
                        position === -1 ? -20 : position === 3 ? 20 : 0
                      }px) scale(${
                        position === -1 || position === 3 ? 0.95 : 0.98
                      })`
                    : "translateX(0) scale(1)",
                  transition: "all 0.5s ease-in-out",
                }}
              >
                <div className={cardClasses}>
                  {/* Stars using your Rating component */}
                  <div className="mb-2 sm:mb-3 transition-opacity duration-300">
                    <Rating
                      value={comment.rating}
                      readOnly
                      size={14}
                      className="sm:text-base"
                    />
                  </div>

                  {/* Customer Name with Checkmark */}
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3 transition-all duration-300">
                    <span className="font-bold text-black text-sm sm:text-base lg:text-lg truncate">
                      {comment.name}
                    </span>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110">
                      <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-sm lg:text-base transition-opacity duration-300 line-clamp-4 sm:line-clamp-none">
                    {comment.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Dots Navigation */}
      <div className="flex justify-center mt-4 sm:hidden">
        <div className="flex gap-2">
          {comments.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-black scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
