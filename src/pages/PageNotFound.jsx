import React, { useState, useEffect } from "react";
import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Frown,
  Home,
  RefreshCcw,
  ArrowLeft,
  Quote,
  Flower2,
  Heart,
  Brain,
  Sparkles,
  Mountain,
  Compass,
  Map,
  Sparkle,
  Clock,
  PauseCircle,
  HeartHandshake,
  Sun,
  ShieldCheck,
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(50);
  const [activeQuote, setActiveQuote] = useState(0);
  const [showGame, setShowGame] = useState(false);

  // Custom cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Floating elements animation
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Quotes array
  const quotes = [
    {
      text: "Life is like yoga - it's about finding balance in every pose.",
      icon: Flower2,
      color: "text-purple-600",
    },
    {
      text: "Peace comes from within. Do not seek it without.",
      icon: Mountain,
      color: "text-blue-600",
    },
    {
      text: "The mind is everything. What you think you become.",
      icon: Brain,
      color: "text-green-600",
    },
    {
      text: "Breath is the bridge between mind and body.",
      icon: Heart,
      color: "text-pink-600",
    },
    {
      text: "Happiness is not something ready-made. It comes from your own actions.",
      icon: Sparkle,
      color: "text-yellow-500",
    },
    {
      text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
      icon: Clock,
      color: "text-orange-500",
    },
    {
      text: "Stillness is where creativity and solutions to problems are found.",
      icon: PauseCircle,
      color: "text-teal-500",
    },
    {
      text: "The journey of a thousand miles begins with a single step.",
      icon: Compass,
      color: "text-indigo-600",
    },
    {
      text: "Kindness is the language which the deaf can hear and the blind can see.",
      icon: HeartHandshake,
      color: "text-red-500",
    },
    {
      text: "Every morning we are born again. What we do today matters most.",
      icon: Sun,
      color: "text-yellow-400",
    },
    {
      text: "Your calm mind is the ultimate weapon against your challenges.",
      icon: ShieldCheck,
      color: "text-gray-500",
    },
  ];


  useEffect(() => {
    // Timer to countdown
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Quote rotation
    const quoteTimer = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);

    // Cursor effect
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [navigate, quotes.length, cursorX, cursorY]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center overflow-hidden relative">
      {/* Background decorative elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Sparkles className="text-purple-300/30" />
        </motion.div>
      ))}

      {/* Custom Cursor */}
      <motion.div
        className="fixed w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <div className="max-w-4xl w-full">
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Decorative compass */}
          <motion.div
            className="absolute top-4 right-4 text-purple-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Compass size={60} />
          </motion.div>

          {/* Main content */}
          <div className="text-center">
            {/* 404 Text */}
            <motion.h1
              className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              404
            </motion.h1>

            {/* Error messages */}
            <motion.div
              className="space-y-2 mb-8"
              variants={floatingVariants}
              animate="animate"
            >
              <h2 className="text-3xl font-bold text-gray-800">
                Oops! You've Wandered Off the Path
              </h2>
              <p className="text-lg text-gray-600">
                Don't worry, even the most experienced yogis lose their way
                sometimes.
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Map className="animate-pulse" />
                <span>
                  The page you're looking for seems to be in deep meditation.
                </span>
              </div>
            </motion.div>

            {/* Animated Quote Section */}
            <motion.div
              key={activeQuote}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg"
            >
              <div className="flex items-center gap-4">
                {(() => {
                  const ActiveIcon = quotes[activeQuote].icon;
                  return (
                    <ActiveIcon
                      className={`w-8 h-8 ${quotes[activeQuote].color}`}
                    />
                  );
                })()}
                <p className="text-lg italic">{quotes[activeQuote].text}</p>
              </div>
            </motion.div>

            {/* Navigation buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors"
                onClick={() => navigate("/")}
              >
                <Home size={20} />
                Return to Center
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-colors"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={20} />
                Previous Pose
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw size={20} />
                Reset Position
              </motion.button>
            </div>

            <motion.p
              className="text-center text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Finding your way back to the homepage in {count} seconds...
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
