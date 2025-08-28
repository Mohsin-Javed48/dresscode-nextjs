"use client";

import React, { useState } from "react";
import {
  Star,
  MoreHorizontal,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

export default function ReviewsSection() {
  const [activeTab, setActiveTab] = useState("Rating & Reviews");
  const [sortBy, setSortBy] = useState("Latest");

  const tabs = ["Product Details", "Rating & Reviews", "FAQs"];

  const reviews = [
    {
      id: 1,
      name: "Samantha D.",
      rating: 4.5,
      verified: true,
      review:
        "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
      date: "August 14, 2023",
    },
    {
      id: 2,
      name: "Alex M.",
      rating: 4,
      verified: true,
      review:
        "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
      date: "August 15, 2023",
    },
    {
      id: 3,
      name: "Ethan R.",
      rating: 3.5,
      verified: true,
      review:
        "The t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
      date: "August 16, 2023",
    },
    {
      id: 4,
      name: "Olivia P.",
      rating: 4,
      verified: true,
      review:
        "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.",
      date: "August 17, 2023",
    },
    {
      id: 5,
      name: "Liam K.",
      rating: 4,
      verified: true,
      review:
        "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion.",
      date: "August 18, 2023",
    },
    {
      id: 6,
      name: "Ava H.",
      rating: 4.5,
      verified: true,
      review:
        "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
      date: "August 19, 2023",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
          style={{
            clipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)",
          }}
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="max-w-screen-3xl mx-auto px-8 sm:px-6 lg:px-12 py-12">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Reviews Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">All Reviews</h2>
          <span className="text-gray-500">(451)</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            >
              <option>Latest</option>
              <option>Oldest</option>
              <option>Highest Rating</option>
              <option>Lowest Rating</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Write a Review
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-gray-900">{review.name}</span>
              {review.verified && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">
              "{review.review}"
            </p>

            <p className="text-sm text-gray-500">Posted on {review.date}</p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="border border-gray-200 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
          Load More Reviews
        </button>
      </div>
    </div>
  );
}
