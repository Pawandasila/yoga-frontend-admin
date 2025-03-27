import React, { useState, useEffect } from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";

const ComingSoonPage = () => {
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState({
    days: 30,
    hours: 24,
    minutes: 60,
    seconds: 60,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => ({
        ...prev,
        seconds: prev.seconds > 0 ? prev.seconds - 1 : 60,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white overflow-hidden relative">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full -top-20 -left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full -bottom-20 -right-20 animate-pulse delay-700" />
        <div className="absolute w-64 h-64 bg-indigo-600/20 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Main Content */}
        <div className="text-center space-y-5">
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg px-6 py-2 rounded-full border border-white/20">
            <span className="text-sm font-medium tracking-wider animate-pulse">
              Launching in 30 Days
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient pb-2">
              Zen Flow Yoga
            </h1>

            <div className="text-3xl font-light text-gray-300 animate-fade-in-up">
              A New Era of Wellness is Coming
            </div>
          </div>

          {/* Animated Countdown Timer */}
          <div className="grid grid-cols-4 gap-6 max-w-3xl mx-auto mt-16">
            {Object.entries(countdown).map(([unit, value]) => (
              <div key={unit} className="relative group">
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:bg-white/20 transition-all duration-500" />
                <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 transform hover:scale-105 hover:-translate-y-2 transition-all duration-500">
                  <div className="text-5xl font-bold mb-2">{value}</div>
                  <div className="text-sm uppercase tracking-wider text-gray-300">
                    {unit}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup with enhanced design */}
          <div className="max-w-xl mx-auto mt-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:bg-white/20 transition-all duration-500" />
              <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20">
                <h3 className="text-2xl font-semibold mb-6">
                  Join Our Journey
                </h3>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg text-white placeholder-gray-400 outline-none focus:border-purple-500 transition-all duration-300"
                  />
                  <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                    Notify Me
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links with floating animation */}
          <div className="flex justify-center gap-8 mt-16">
            {[Instagram, Facebook, Twitter].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="p-4 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 transform hover:scale-110 hover:rotate-12 hover:bg-white/20 transition-all duration-500 hover:shadow-lg hover:shadow-purple-500/25 animate-float"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
