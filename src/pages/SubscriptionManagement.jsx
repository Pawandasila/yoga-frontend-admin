import { Edit, RefreshCw, X } from "lucide-react";
import React, { useState } from "react";
import ComingSoonPage from "../components/ComingSoonPage";

const SubscriptionManagement = () => {
  const [selectedTab, setSelectedTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");

  const subscriptions = [
    {
      id: 1,
      member: "Sarah Johnson",
      plan: "Premium Yearly",
      status: "Active",
      startDate: "2024-01-15",
      amount: 1200,
      nextBilling: "2025-01-15",
      email: "sarah.j@email.com",
      phone: "(555) 123-4567",
      classes: ["Vinyasa Flow", "Meditation", "Power Yoga"],
      attendance: "85%",
      paymentMethod: "Visa **** 4589",
      lastPayment: "2024-01-15",
      notes: "Prefers morning classes",
    },
    {
      id: 2,
      member: "Michael Chen",
      plan: "Monthly Unlimited",
      status: "Active",
      startDate: "2024-03-01",
      amount: 120,
      nextBilling: "2024-04-01",
      email: "mchen@email.com",
      phone: "(555) 987-6543",
      classes: ["Beginner Yoga", "Yin Yoga"],
      attendance: "92%",
      paymentMethod: "Mastercard **** 7890",
      lastPayment: "2024-03-01",
      notes: "New to yoga, needs modifications",
    },
    {
      id: 3,
      member: "Emma Wilson",
      plan: "Class Pack (20)",
      status: "Expired",
      startDate: "2023-12-01",
      amount: 400,
      nextBilling: "N/A",
      email: "emma.w@email.com",
      phone: "(555) 456-7890",
      classes: ["Hot Yoga", "Ashtanga"],
      attendance: "75%",
      paymentMethod: "PayPal",
      lastPayment: "2023-12-01",
      notes: "Interested in teacher training",
    },
  ];

  const plans = [
    {
      name: "Premium Yearly",
      price: 1200,
      details: "Unlimited classes, 2 guest passes/month, workshop discounts",
    },
    {
      name: "Monthly Unlimited",
      price: 120,
      details: "Unlimited classes for one month",
    },
    {
      name: "Class Pack (20)",
      price: 400,
      details: "20 classes, valid for 6 months",
    },
  ];

  const filterSubscriptions = () => {
    return subscriptions.filter((sub) => {
      const matchesSearch =
        sub.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedTab === "all" ||
        (selectedTab === "active" && sub.status === "Active") ||
        (selectedTab === "expired" && sub.status === "Expired");
      const matchesPlan = selectedPlan === "all" || sub.plan === selectedPlan;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  };

  const [show] = useState(true);

  return show ? (
    <ComingSoonPage />
  ) : (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subscription Management
          </h1>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search members..."
              className="pl-4 w-64 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="all">All Plans</option>
              {plans.map((plan) => (
                <option key={plan.name} value={plan.name}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Revenue
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              $4,520
            </p>
            <p className="text-xs text-green-500">+12% from last month</p>
          </div>
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Active Members
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              248
            </p>
            <p className="text-xs text-blue-500">+8 new this week</p>
          </div>
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Renewal Rate
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              92%
            </p>
            <p className="text-xs text-purple-500">+2% from last month</p>
          </div>
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Avg. Attendance
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              84%
            </p>
            <p className="text-xs text-orange-500">-3% from last month</p>
          </div>
        </div>

        {/* Plan Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${plan.price}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {plan.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === "all"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setSelectedTab("all")}
            >
              All Subscriptions
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === "active"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setSelectedTab("active")}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                selectedTab === "expired"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setSelectedTab("expired")}
            >
              Expired
            </button>
          </nav>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Member Details
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Plan & Status
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Classes & Attendance
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Payment Info
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filterSubscriptions().map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/40"
                  >
                    <td className="p-4">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {sub.member}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {sub.email}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {sub.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {sub.plan}
                      </div>
                      <span
                        className={`mt-1 inline-block px-2 py-1 rounded-full text-xs ${
                          sub.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {sub.status}
                      </span>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Start: {sub.startDate}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {sub.classes.join(", ")}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Attendance: {sub.attendance}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        ${sub.amount}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {sub.paymentMethod}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Next Billing: {sub.nextBilling}
                      </div>
                    </td>

                    <td className="p-2">
                      <div className="flex gap-2 justify-center">
                        <button className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-200 border border-blue-200 dark:border-blue-800">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/50 rounded-md transition-colors duration-200 border border-green-200 dark:border-green-800">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Renew
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors duration-200 border border-red-200 dark:border-red-800">
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
