import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Smartphone,
  Image,
  LogIn,
  ArrowRight,
  Smile,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import { SignUpAdmin } from "../api/api";

const AdminSignupPage = () => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    Fname: "",
    Lname: "",
    phone_Number: "",
    userPhoto: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await SignUpAdmin(formData);

      // Check if registration was successful
      if (response && response.success) {
        console.log("Registration successful");
        // Optionally navigate or show success message
        // For example:
        // navigate("/login");
      } else {
        const errorMessage = response?.message || "Registration failed";
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during registration";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
      }));
    }
  };

  const [draggedItems, setDraggedItems] = useState([]);
  const [activeCharacter, setActiveCharacter] = useState(null);

  const characters = [
    {
      id: "user",
      icon: User,
      name: "User",
      color: "text-blue-500",
      draggable: true,
    },
    {
      id: "lock",
      icon: Lock,
      name: "Security",
      color: "text-green-500",
      draggable: true,
    },
    {
      id: "mail",
      icon: Mail,
      name: "Messenger",
      color: "text-purple-500",
      draggable: true,
    },
  ];

  const handleDragEnd = (event, info, character) => {
    if (info.point.x > window.innerWidth * 0.5) {
      setDraggedItems((prev) => [...prev, character]);
      setActiveCharacter(character);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative Section */}
      <div className="w-1/2 bg-gradient-to-br from-pink-100 to-pink-400 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        {[...Array(70)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute bg-white/30 rounded-full"
            style={{
              width: Math.random() * 50 + 20,
              height: Math.random() * 50 + 20,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -50, 50, 0],
              scale: [1, 1.2, 0.8, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}

        <div className="z-10 text-center text-pink-900 px-12 w-full">
          <motion.h1
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome, Admin!
          </motion.h1>

          <div className="flex justify-center space-x-4 mb-8">
            {characters.map((character) => (
              <motion.div
                key={character.id}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.7}
                onDragEnd={(event, info) =>
                  handleDragEnd(event, info, character)
                }
                whileDrag={{ scale: 1.2, cursor: "grabbing" }}
                className={`w-20 h-20 bg-white/30 rounded-full flex items-center justify-center cursor-grab 
                ${character.color}`}
              >
                <character.icon className="w-10 h-10" />
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {activeCharacter && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="flex items-center justify-center space-x-4"
              >
                <Sparkles className="text-yellow-500" />
                <p className="text-xl">
                  {activeCharacter.name} character activated!
                </p>
                <Smile className="text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-pink-500 text-white px-6 py-3 rounded-full flex items-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Right side - Form Section */}
      <div className="w-1/2 flex items-center justify-center bg-white px-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-pink-600">
              Admin Registration
            </h2>
            <p className="text-gray-500 mt-2">
              Let's create your cute admin account
            </p>
          </div>

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-pink-600 mb-2">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-pink-400" />
                  </div>
                  <input
                    type="text"
                    name="Fname"
                    value={formData.Fname}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-full pl-10 pr-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-pink-600 mb-2">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-pink-400" />
                  </div>
                  <input
                    type="text"
                    name="Lname"
                    value={formData.Lname}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-full pl-10 pr-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-pink-600 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-pink-600 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-pink-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-pink-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-pink-600 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type="tel"
                  name="phone_Number"
                  value={formData.phone_Number}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-pink-600 mb-2">Profile Photo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image className="h-5 w-5 text-pink-400" />
                </div>
                <input
                  type="file"
                  name="userPhoto"
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="w-full pl-10 pr-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              {formData.userPhoto && (
                <p className="text-sm text-pink-500 mt-2">
                  {formData.userPhoto.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 rounded-lg transition duration-300 flex items-center justify-center space-x-2 ${
                isLoading
                  ? "bg-pink-300 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              <LogIn className="h-5 w-5" />
              <span>{isLoading ? "Registering..." : "Register"}</span>
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-pink-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;
