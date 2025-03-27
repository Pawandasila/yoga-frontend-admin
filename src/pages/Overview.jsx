import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Activity,
  Clock,
  Target,
  Award,
  Info,
  BookOpen,
  UserPlus,
  Star,
  Zap,
  Heart,
  Headphones,
  Filter,
  Plus,
  MoreVertical,
  HomeIcon,
  Shield,
  Book,
  Users,
  Calendar,
  ChevronRight,
  Timer,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAllClasses , getInstructor } from "../api/api";


import DashboardComp from "../components/DashboardCom";

const MetricCard = ({
  title,
  value,
  icon,
  change,
  backgroundColor = "bg-white dark:bg-gray-800",
  iconBackground,
}) => {
  const isPositiveChange = change?.startsWith("+");

  return (
    <div
      className={`
      ${backgroundColor} 
      shadow-lg dark:shadow-gray-900/30
      dark:bg-gray-900/30
      rounded-xl 
      p-6 
      transform 
      transition-all 
      duration-300 
      hover:-translate-y-2 
      hover:shadow-xl
      dark:hover:shadow-gray-900/40
      border border-gray-100 dark:border-gray-700
    `}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-200">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            {value}
          </p>
          {change && (
            <div className="flex items-center space-x-1">
              {isPositiveChange ? (
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              )}
              <p
                className={`
                text-sm font-medium
                ${
                  isPositiveChange
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              `}
              >
                {change}
              </p>
            </div>
          )}
        </div>
        <div
          className={`
          ${iconBackground} dark:bg-opacity-20
          p-3 
          rounded-full 
          flex 
          items-center 
          justify-center
          transition-colors
          duration-200
        `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};


const user = localStorage.getItem("user");
const parsedUserData = user ? JSON.parse(user) : null;

const userName = parsedUserData ? parsedUserData.firstName : "Guest";


const EnhancedInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const instructorsData = await getInstructor();
        setInstructors(instructorsData);
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Award":
        return <Award className="w-4 h-4" />;
      case "Shield":
        return <Shield className="w-4 h-4" />;
      case "Book":
        return <Book className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const CertificationBadge = ({ certification }) => (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-blue-100 text-blue-800 border-blue-200 transition-all duration-300 hover:scale-105`}
    >
      <Award className="w-4 h-4" />
      <span className="text-sm font-medium">{certification}</span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
      <div className="space-y-4">
        {instructors.map((instructor) => (
          <div
            key={instructor._id}
            className="flex flex-col space-y-3 border-b pb-3 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-grow">
                <p className="font-semibold group-hover:text-rose-600 dark:text-white transition">
                  {instructor.firstName} {instructor.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {instructor.specialties?.length > 0 
                    ? instructor.specialties.join(", ") 
                    : "Yoga Instructor"}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setSelectedInstructor(instructor)}
                  className="ml-2 text-purple-500 hover:bg-purple-50 p-1 rounded-full transition-all ease-in-out"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 ml-16">
              {instructor.certifications?.map((cert, index) => (
                <CertificationBadge key={index} certification={cert} />
              ))}
            </div>
          </div>
        ))}
      </div>
      {selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-300">
                {selectedInstructor.firstName} {selectedInstructor.lastName}
              </h2>
              <button
                onClick={() => setSelectedInstructor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-white">
                {selectedInstructor.specialties?.length > 0 
                  ? selectedInstructor.specialties.join(", ") 
                  : "Yoga Instructor"}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-slate-300">
                  Bio
                </h3>
                <p className="text-gray-600 dark:text-slate-300">
                  {selectedInstructor.bio || "No bio available"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Certifications
                </h3>
                <div className="space-y-3">
                  {selectedInstructor.certifications?.map((cert, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/30"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-300">{cert}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EnhancedMemberProgress = () => {
  const memberProgress = [
    { level: "Beginner", members: 120, color: "#3B82F6" },
    { level: "Intermediate", members: 180, color: "#10B981" },
    { level: "Advanced", members: 50, color: "#F43F5E" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Member Skill Progression
        </h3>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Total Members: {memberProgress.reduce((a, b) => a + b.members, 0)}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={memberProgress}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="level"
            stroke="#9CA3AF"
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "#fff",
            }}
          />
          <Bar dataKey="members" barSize={60} radius={[10, 10, 0, 0]}>
            {memberProgress.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const YogaDashboard = () => {
  const [userMetrics, setUserMetrics] = useState({
    totalClasses: 120,
    activeClasses: 45,
    completedClasses: 75,
    upcomingClasses: 15,
    averageAttendance: 82,
    totalSubscribers: 350,
  });

  useEffect(() => {
    const fetchClassMetrics = async () => {
      try {
        const classesData = await getAllClasses();
        
        const classes = Array.isArray(classesData) ? classesData : (classesData.data ? classesData.data : [classesData]);
        
        const totalClasses = classes.length;
        const activeClasses = classes.filter(cls => cls.status === 'Active').length;
        const completedClasses = classes.filter(cls => cls.status === 'Completed').length;
        const upcomingClasses = classes.filter(cls => cls.status === 'Upcoming').length;
        
        setUserMetrics({
          totalClasses,
          activeClasses,
          completedClasses,
          upcomingClasses,
          averageAttendance: 82,
          totalSubscribers: classes.reduce((sum, cls) => sum + (cls.capacity || 0), 0)
        });
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    };

    fetchClassMetrics();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-3">
      <div className="container mx-auto">
        
        {/* <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Yoga Dashboard
          </h2>
        </div>  */}

        <DashboardComp
          UserName={userName}
          subHead={"Here's to a wonderful day ahead filled with possibilities!"}
          icon={HomeIcon}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Classes"
            value={userMetrics.totalClasses}
            icon={<Activity className="h-6 w-6 text-blue-500" />}
            change="+5.2% this month"
            backgroundColor="bg-white"
            iconBackground="bg-blue-100"
          />
          <MetricCard
            title="Active Classes"
            value={userMetrics.activeClasses}
            icon={<Target className="h-6 w-6 text-green-500" />}
            change="+3.8% from last week"
            backgroundColor="bg-white"
            iconBackground="bg-green-100"
          />
          <MetricCard
            title="Completed Classes"
            value={userMetrics.completedClasses}
            icon={<Award className="h-6 w-6 text-orange-500" />}
            change="+7.2% from last week"
            backgroundColor="bg-white"
            iconBackground="bg-orange-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Upcoming Classes"
            value={userMetrics.upcomingClasses}
            icon={<Calendar className="h-6 w-6 text-teal-500" />}
            change="+6.5% this month"
            backgroundColor="bg-white"
            iconBackground="bg-teal-100"
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-xl dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">
              Class Participation Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={classTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="classes"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow-md dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">
              Yoga Style Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={styleDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {styleDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Class Time Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="classes" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* <div className="bg-white shadow-md rounded-xl p-2 dark:bg-gray-800 mt-8">
          <EnhancedUpcomingClasses />
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Top Instructors
              </h3>
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <EnhancedInstructors />
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Member Skill Levels
              </h3>
              <Headphones className="h-6 w-6 text-green-500" />
            </div>
            <EnhancedMemberProgress />
          </div>

          {/* <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Recent Achievements
              </h3>
              <Award className="h-6 w-6 text-orange-500" />
            </div>
            <div className="space-y-4">
              {recentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 pb-2"
                >
                  {achievement.icon}
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

        </div>

      </div>
    </div>
  );
};

export default YogaDashboard;
