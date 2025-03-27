import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, DollarSign, BookOpen, TrendingUp } from "lucide-react";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("traffic");
  const [timeRange, setTimeRange] = useState("6m");

  const mockTrafficData = [
    { name: "Jan", visitors: 4500, newVisitors: 2400, activeUsers: 3200 },
    { name: "Feb", visitors: 3800, newVisitors: 1980, activeUsers: 2800 },
    { name: "Mar", visitors: 5200, newVisitors: 3100, activeUsers: 4100 },
    { name: "Apr", visitors: 4800, newVisitors: 2800, activeUsers: 3800 },
    { name: "May", visitors: 6100, newVisitors: 3600, activeUsers: 4900 },
    { name: "Jun", visitors: 5900, newVisitors: 3400, activeUsers: 4700 },
  ];

  const mockRevenueData = [
    { name: "Jan", revenue: 42000, classes: 180, subscriptions: 320 },
    { name: "Feb", revenue: 38000, classes: 165, subscriptions: 290 },
    { name: "Mar", revenue: 52000, classes: 210, subscriptions: 380 },
    { name: "Apr", revenue: 48000, classes: 195, subscriptions: 350 },
    { name: "May", revenue: 61000, classes: 230, subscriptions: 420 },
    { name: "Jun", revenue: 59000, classes: 225, subscriptions: 410 },
  ];

  const engagementData = [
    { name: "Yoga", value: 400 },
    { name: "Meditation", value: 300 },
    { name: "Pilates", value: 200 },
    { name: "Wellness", value: 100 },
  ];

  const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981"];

  const renderMetricCard = (title, value, Icon, trend, details) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <div className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">
            {value}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-purple-100 dark:bg-slate-700">
          <Icon className="text-purple-600 dark:text-purple-400" size={20} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p
          className={`text-sm ${trend > 0 ? "text-green-500" : "text-red-500"}`}
        >
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
        </p>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {details}
        </span>
      </div>
    </div>
  );

  const timeRanges = [
    { value: "1m", label: "1M" },
    { value: "3m", label: "3M" },
    { value: "6m", label: "6M" },
    { value: "1y", label: "1Y" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-300 p-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Yoga Studio Analytics
          </h1>
          {/* Time Range Selector */}
          <div className="flex rounded-lg bg-white dark:bg-slate-800 p-1 shadow-sm">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range.value
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {renderMetricCard(
            "Total Visitors",
            "24,450",
            Users,
            12,
            "Last 30 days"
          )}
          {renderMetricCard(
            "Monthly Revenue",
            "$184,560",
            DollarSign,
            8,
            "vs last month"
          )}
          {renderMetricCard(
            "Active Students",
            "3,120",
            BookOpen,
            15,
            "Current month"
          )}
          {renderMetricCard(
            "Growth Rate",
            "22.5%",
            TrendingUp,
            20,
            "Year over year"
          )}
        </div>

        {/* Tabs */}
        <div className="flex mb-6 space-x-2">
          {["traffic", "revenue", "engagement", "bookings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Charts Section */}
        <div className="rounded-xl shadow-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-6">
          {activeTab === "traffic" && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Website Traffic Overview
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={mockTrafficData}>
                  <defs>
                    <linearGradient
                      id="colorVisitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      color: "black",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="newVisitors"
                    stroke="#ec4899"
                    fillOpacity={1}
                    fill="url(#colorNew)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "revenue" && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Revenue Analysis
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      color: "black",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                  <Bar dataKey="classes" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "engagement" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Class Popularity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {engagementData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  User Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTrafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        color: "black",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#10b981"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Booking Trends
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      color: "black",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="subscriptions" fill="#06b6d4" />
                  <Bar dataKey="classes" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
