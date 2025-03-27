import React, { useState, useEffect } from "react";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        "https://images.pexels.com/photos/30007968/pexels-photo-30007968/free-photo-of-weathered-shutters-on-old-corfu-building-wall.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
      title: "Think Less",
      subtitle: "Lift More",
    },
    {
      image:
        "https://images.pexels.com/photos/28858556/pexels-photo-28858556/free-photo-of-serene-couple-walk-on-a-tranquil-beach.png?auto=compress&cs=tinysrgb&w=600&lazy=load",
      title: "Lifestyle Is The Key To",
      subtitle: "Unlocking A Brighter Future.",
    },
  ];

  return (
    <div className="max-w-screen-md mx-auto p-4">
      {/* Left Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Move to
          <br />
          Maintain your
          <br />
          Health
        </h1>
        <p className="text-gray-600 mb-6">
          Energize your lifestyle, embrace movement for a healthier you, get
          motivated, stay active, and reap the benefits of a vibrant,
          well-nurtured body
        </p>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium">
          Get Started
        </button>
      </div>

      {/* Right Section with Images */}
      <div className="relative">
        <div className="grid grid-cols-1 gap-4">
          {slides.map((slide, index) => (
            <div key={index} className="relative rounded-2xl overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                <h2 className="text-white text-xl font-bold">{slide.title}</h2>
                <p className="text-white">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bars */}
        <div className="flex gap-2 mt-4">
          {slides.map((_, index) => (
            <div key={index} className="h-1 flex-1 rounded-full bg-gray-300" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;

