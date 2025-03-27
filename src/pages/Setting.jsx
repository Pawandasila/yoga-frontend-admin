import React, { useState, useEffect } from "react";
import {
  User,
  Settings,
  Shield,
  Bell,
  CreditCard,
  Layout,
  BarChart2,
  Globe,
  LogOut,
} from "lucide-react";
import { getProfileById, updateProfile } from "../api/api";

const Alert = ({ children, className }) => (
  <div className={`p-4 rounded-lg ${className}`}>{children}</div>
);

const AlertDescription = ({ children }) => (
  <p className="text-sm">{children}</p>
);

const UserDashboardSettings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [profileData, setProfileData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      
      // Fetch full profile details
      const fetchProfileDetails = async () => {
        try {
          const fullProfile = await getProfileById(userData.id);
          setProfileData({
            id: fullProfile.id || userData.id,
            firstName: fullProfile.firstName || userData.firstName,
            lastName: fullProfile.lastName || userData.lastName,
            email: fullProfile.email || userData.email,
            role: fullProfile.role || userData.role,
          });
        } catch (error) {
          console.error("Error fetching profile details:", error);
          // Fallback to localStorage data if API call fails
          setProfileData({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            role: userData.role,
          });
        }
      };

      fetchProfileDetails();
    }
  }, []);

  const handleSave = async () => {
    try {
      // Prepare the profile data for update with field names matching backend
      const updateData = {
        Fname: profileData.firstName,
        Lname: profileData.lastName,
        email: profileData.email
      };
  
      let id = profileData.id;
      
      // Call API to update profile
      const updatedProfile = await updateProfile(id, updateData);
  
      // Update localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        const updatedUserData = {
          ...userData,
          firstName: updatedProfile.user.Fname,
          lastName: updatedProfile.user.Lname,
          email: updatedProfile.user.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
      }
  
      // Update local state
      setProfileData({
        ...profileData,
        firstName: updatedProfile.user.Fname,
        lastName: updatedProfile.user.Lname,
        email: updatedProfile.user.email
      });
  
      // Show save alert
      setShowSaveAlert(true);
      setTimeout(() => setShowSaveAlert(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const dashboardSections = [
    {
      id: "profile",
      icon: <User className="w-5 h-5" />,
      title: "Profile",
      description: "Personal Information",
      color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300",
      hoverColor: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <User className="w-6 h-6 text-pink-500 dark:text-pink-400" />
              Profile Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="mt-1 block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-3 transition-colors focus:border-pink-500 dark:focus:border-pink-400 focus:ring-1 focus:ring-pink-500 dark:focus:ring-pink-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="mt-1 block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-3 transition-colors focus:border-pink-500 dark:focus:border-pink-400 focus:ring-1 focus:ring-pink-500 dark:focus:ring-pink-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-3 transition-colors focus:border-pink-500 dark:focus:border-pink-400 focus:ring-1 focus:ring-pink-500 dark:focus:ring-pink-400"
                />
              </div>
              {/* <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company
                </label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-3 transition-colors focus:border-pink-500 dark:focus:border-pink-400 focus:ring-1 focus:ring-pink-500 dark:focus:ring-pink-400"
                />
              </div> */}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-pink-500 dark:bg-pink-600 text-white rounded-xl hover:bg-pink-600 dark:hover:bg-pink-700 transition-colors duration-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col">
        <div className="flex items-center space-x-4 mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
          <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profileData.role}
            </p>
          </div>
        </div>

        <nav className="space-y-3">
          {dashboardSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
                activeSection === section.id
                  ? section.color
                  : `text-gray-600 dark:text-gray-400 ${section.hoverColor}`
              }`}
            >
              {section.icon}
              <div className="text-left">
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center justify-center space-x-2 p-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {showSaveAlert && (
            <Alert className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900 text-green-800 dark:text-green-200 mb-4">
              <AlertDescription>
                Changes saved successfully! ✨
              </AlertDescription>
            </Alert>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardSettings;