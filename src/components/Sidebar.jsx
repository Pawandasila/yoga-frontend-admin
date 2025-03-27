import React from "react";
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  FileText,
  DollarSign,
  HelpCircle,
  Settings,
} from "lucide-react";

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();

  const menuItems = [
    {
      icon: HomeIcon,
      text: "Dashboard",
      path: "/",
    },
    {
      icon: CalendarIcon,
      text: "Class Management",
      path: "/class-management",
    },
    {
      icon: UserGroupIcon,
      text: "User Management",
      path: "/user-management",
    },
    // {
    //   icon: Users,
    //   text: "Instructor Management",
    //   path: "/instructor-management",
    // },
    {
      icon: FileText,
      text: "Blog Management",
      path: "/blog-management",
    },
    // {
    //   icon: ChartBarIcon,
    //   text: "Analytics",
    //   path: "/analytics",
    // },
    // {
    //   icon: DollarSign,
    //   text: "Subscription Management",
    //   path: "/subscription-management",
    // },
    // {
    //   icon: DollarSign,
    //   text: "Payment Management",
    //   path: "/payment-management",
    // },
    {
      icon: HelpCircle,
      text: "Support & Feedback",
      path: "/support-feedback",
    },
    {
      icon: Settings,
      text: "Settings",
      path: "/settings",
    },
  ];

  return (
    <div
      className={`
        bg-white 
        dark:bg-gray-800
        border-r 
        border-gray-200 
        dark:border-gray-700
        h-screen 
        fixed 
        left-0 
        top-0 
        transition-all 
        duration-300 
        ease-in-out 
        ${isCollapsed ? "w-20" : "w-64"}
        shadow-md 
        dark:shadow-gray-900/30
        flex 
        flex-col
      `}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={onToggleCollapse}
        className="
          absolute 
          top-4 
          -right-4 
          bg-white 
          dark:bg-gray-800
          border 
          border-gray-200 
          dark:border-gray-700
          rounded-full 
          w-8 
          h-8 
          flex 
          items-center 
          justify-center 
          shadow-md 
          dark:shadow-gray-900/30
          z-10
          hover:bg-gray-50 
          dark:hover:bg-gray-700
          transition-all
        "
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Logo */}
      <div
        className="
          h-16 
          flex 
          items-center 
          justify-center 
          border-b 
          border-gray-200 
          dark:border-gray-700
          relative
        "
      >
        {!isCollapsed ? (
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Yoga Studio
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Y
          </h1>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex 
              items-center 
              px-6 
              py-3 
              transition-all 
              duration-200 
              ease-in-out 
              ${
                location.pathname === item.path
                  ? "bg-blue-50 dark:bg-rose-500/20 text-blue-600 dark:text-rose-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-rose-500/10"
              }
            `}
          >
            <item.icon
              className={`
                h-6 
                w-6 
                ${
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-rose-400"
                    : "text-gray-400 dark:text-gray-500"
                }
                ${!isCollapsed ? "mr-4" : ""}
              `}
            />
            {!isCollapsed && (
              <span
                className={`
                  text-lg 
                  font-medium 
                  ${
                    location.pathname === item.path
                      ? "text-violet-600 dark:text-rose-400"
                      : "text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {item.text}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
