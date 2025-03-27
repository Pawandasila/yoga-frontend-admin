import React, { useEffect, useState } from "react";
import {
  Dumbbell,
  Flame,
  Flower2,
  Footprints,
  Heart,
  Moon,
  MountainSnow,
  Sun,
  Timer,
  Wind,
} from "lucide-react";
import { motion } from "framer-motion";

const FloatingElement = ({ children, className }) => (
  <div className={`absolute animate-bounce ${className}`}>{children}</div>
);

const DashboardComp = ({ UserName, subHead, icon }) => {
  const [greeting, setGreeting] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const dateString = now.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (hours < 12) {
        setGreeting("Good Morning");
      } else if (hours < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }

      setCurrentDateTime(`${dateString}, ${timeString}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-200 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 mx-auto flex justify-center items-center min-h-[30vh] relative overflow-hidden rounded-xl mb-3 bg-transparent text-clip"
    >
      <FloatingElement className="top-20 left-[8%] animate-[bounce_7s_ease-in-out_infinite]">
        <MountainSnow className="w-12 h-12 text-indigo-400/30" />
      </FloatingElement>
      <FloatingElement className="bottom-16 right-[12%] animate-[bounce_8s_ease-in-out_infinite]">
        <Wind className="w-10 h-10 text-violet-400/30" />
      </FloatingElement>

      {/* Decorative Elements - Second Layer (Mid-ground) */}
      <FloatingElement className="top-32 left-[15%] animate-[bounce_6s_ease-in-out_infinite]">
        <Flower2 className="w-8 h-8 text-indigo-400/40" />
      </FloatingElement>
      <FloatingElement className="top-24 right-[18%] animate-[bounce_5s_ease-in-out_infinite]">
        <Dumbbell className="w-7 h-7 text-violet-400/40" />
      </FloatingElement>
      <FloatingElement className="bottom-28 left-[22%] animate-[bounce_9s_ease-in-out_infinite]">
        <Timer className="w-6 h-6 text-purple-400/40" />
      </FloatingElement>
      <FloatingElement className="bottom-36 right-[25%] animate-[bounce_7s_ease-in-out_infinite]">
        <Footprints className="w-8 h-8 text-indigo-300/40" />
      </FloatingElement>

      <div className="max-w-6xl mx-auto py-10 px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-4 animate-[bounce_4s_ease-in-out_infinite]">
            {React.createElement(icon, {
              className: "w-12 h-12 text-blue-600 ",
            })}
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 dark:from-blue-400 dark:to-blue-400 bg-clip-text text-transparent h-[60px]">
              {greeting}, {UserName}! <span className="text-red-500">🌸</span>
            </h1>
          </div>
          <h2 className="text-lg text-gray-600 dark:text-gray-200 mb-2">
            {subHead}
          </h2>
          <p className="text-gray-500 dark:text-slate-300 text-md">
            {currentDateTime}
          </p>

          {/* Gradient Orbs */}
          <div className="absolute -z-10 blur-3xl opacity-30">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply animate-[blob_7s_infinite]" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply animate-[blob_8s_infinite]" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply animate-[blob_6s_infinite]" />
          </div>
        </div>
      </div>

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/20 dark:to-gray-800/20 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>
    </motion.div>
  );
};

export default DashboardComp;
