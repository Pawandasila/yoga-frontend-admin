import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  Plus,
  MessageCircle,
} from 'lucide-react';
import { getFeedback } from '../api/api';

const SupportFeedback = () => {
  const [activeTab, setActiveTab] = useState("feedback");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await getFeedback();
        // Add a default rating and helpful count for each feedback
        const formattedFeedback = data.map(item => ({
          ...item,
          rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1-5
          helpful: Math.floor(Math.random() * 15), // Random helpful count
        }));
        setFeedback(formattedFeedback);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const StatsCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      {trend && (
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
          {trend}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Support & Feedback
          </h1>
          {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </button> */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Feedback"
            value={feedback.length}
            icon={MessageSquare}
            trend="+2.5% from last week"
          />
          {/* <StatsCard
            title="Average Rating"
            value={(feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length || 0).toFixed(1)}
            icon={Star}
            trend="+0.2 from last month"
          /> */}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-4 p-4">
              <button
                onClick={() => setActiveTab("feedback")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  activeTab === "feedback"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                User Feedback
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "feedback" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Feedback Section Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Feedback
              </h2>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Loading feedback...
              </div>
            )}

            {error && (
              <div className="p-6 text-center text-red-500 dark:text-red-400">
                Error loading feedback: {error.message}
              </div>
            )}

            {/* Feedback List */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {feedback.map((item) => (
                <div key={item._id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          • {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Email */}
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <strong>Email:</strong> {item.email}
                      </div>

                      {/* Subject */}
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <strong>Subject:</strong> {item.subject}
                      </div>

                      {/* Message */}
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <strong>Message:</strong> {item.message}
                      </p>

                      {/* Rating */}
                      {/* <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${
                              index < item.rating
                                ? "text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {feedback.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing 1-{feedback.length} of {feedback.length} results
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportFeedback;