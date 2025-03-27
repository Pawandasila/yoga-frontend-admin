import React, { useEffect, useRef, useState } from "react";
import {
  Users,
  Calendar,
  Search,
  Filter,
  PlusCircle,
  MoreVertical,
  BookOpen,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Edit,
  Trash2,
  Medal,
  List,
  Info,
  Star,
  Video,
  UploadCloud,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  createClass,
  getClass,
  enrollmentStat,
  updateClass,
  deleteClass,
  getInstructor,
} from "../api/api";

const TableSection = ({
  title,
  Icon,
  searchTerm,
  onSearchChange,
  children,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          {Icon && <Icon className="mr-2 text-indigo-600" size={20} />}
          {title}
        </h3>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
      </div>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-5xl rounded-xl bg-white dark:bg-gray-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="px-6 py-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClassManagement = () => {
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [mainSearchTerm, setMainSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [classes, setClasses] = useState([]);
  const [equipment, setEquipment] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [enrollmentStats, setEnrollmentStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    activeClasses: 0,
    averageAttendance: "0%",
    yogaCategories: 0,
  });
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await getInstructor();
        setInstructors(response);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };
  
    fetchInstructors();
  }, []);

  useEffect(() => {
    const fetchEnrollmentStats = async () => {
      try {
        const user = localStorage.getItem("user");
        const parsedUserData = user ? JSON.parse(user) : null;

        const stats = await enrollmentStat(parsedUserData.id);
        const overallStats = stats.data.overallStats;
        const classes = stats.data.enrollmentByClass;

        const totalStudents = classes.reduce(
          (acc, cls) => acc + cls.registeredUsers,
          0
        ); // Summing registered users for all classes
        const activeClasses = classes.filter(
          (cls) => cls.classDetails.status === "In Progress"
        ).length;

        const averageAttendance =
          classes.length > 0
            ? `${(
                (classes.reduce((acc, cls) => acc + cls.presentUsers, 0) /
                  totalStudents) *
                100
              ).toFixed(0)}%`
            : "0%";

        const yogaCategories = new Set(
          classes.map((cls) => cls.classDetails.category)
        ).size;

        setEnrollmentStats({
          totalClasses: classes.length,
          totalStudents,
          activeClasses,
          averageAttendance,
          yogaCategories,
        });
      } catch (error) {
        console.error("Failed to fetch enrollment stats", error);
      }
    };

    fetchEnrollmentStats();
  }, []);

  const [newClass, setNewClass] = useState({
    className: "",
    category: "",
    instructor: "",
    description: "",
    schedule: {
      startDate: "",
      endDate: "",
      daysOfWeek: [],
      startTime: "",
      endTime: "",
      timeZone: "UTC+5:30",
    },
    type: "Online",
    totalClasses: 12,
    capacity: 30,
    difficulty: "Beginner",
    status: "Upcoming",
    equipmentNeeded: [],
    remainingClasses: 12,
    price: 0,
    renewal: false,
    feedback: "",
    image: null,
    students: 0,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await getClass();
      if (response.success) {
        // Ensure all required properties exist
        const processedClasses = response.data.map((cls) => ({
          ...cls,
          students: cls.students || 0,
          attendance: cls.attendance || "N/A",
          room: cls.room || "N/A",
          resources: cls.equipmentNeeded || [],
        }));
        setClasses(processedClasses);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const formatInstructorName = (instructor) => {
    if (!instructor) return "N/A";
    if (typeof instructor === "string") return instructor;
    return instructor.email || "N/A";
  };
  const handleEquipmentAdd = () => {
    if (equipment.trim()) {
      setNewClass((prev) => ({
        ...prev,
        equipmentNeeded: [...prev.equipmentNeeded, equipment.trim()],
      }));
      setEquipment("");
    }
  };

  const handleDayToggle = (day) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setSelectedDays(updatedDays);
    setNewClass((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        daysOfWeek: updatedDays,
      },
    }));
  };

  const handleEditClick = (classData) => {
    console.log("Original Class Data:", classData);

    const preparedClassData = {
      _id: classData._id,
      className: classData.className,
      category: classData.category,
      description: classData.description,
      type: classData.type,
      difficulty: classData.difficulty,
      instructor: classData.instructor,
      schedule: {
        startDate: classData.scheduleDetails?.startDate
          ? new Date(classData.scheduleDetails.startDate)
              .toISOString()
              .split("T")[0]
          : "",
        endDate: classData.scheduleDetails?.endDate
          ? new Date(classData.scheduleDetails.endDate)
              .toISOString()
              .split("T")[0]
          : "",
        startTime: classData.scheduleDetails?.startTime || "",
        endTime: classData.scheduleDetails?.endTime || "",
        daysOfWeek: classData.scheduleDetails?.days
          ? classData.scheduleDetails.days
              .split(", ")
              .map(
                (day) =>
                  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(
                    day
                  ) + 1
              )
          : [],
        timeZone: classData.scheduleDetails?.timeZone || "UTC+5:30",
      },
      totalClasses: classData.totalClasses || 12,
      capacity: classData.capacity || 30,
      status: classData.status,
      equipmentNeeded: classData.equipmentNeeded || [],
      remainingClasses: classData.remainingClasses || 12,
      price: classData.price || 0,
      renewal: classData.renewal || false,
      students: String(classData.students || 0),
      image: classData.image || null,
    };

    // Set the new class state
    setNewClass(preparedClassData);

    // Set selected days
    const scheduleWeekDays = classData.scheduleDetails?.days
      ? classData.scheduleDetails.days
          .split(", ")
          .map(
            (day) =>
              ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(day) + 1
          )
      : [];
    setSelectedDays(scheduleWeekDays);

    // Handle image preview
    if (classData.image) {
      if (classData.image.url) {
        setImagePreview(classData.image.url);
        setSelectedImage(classData.image);
      } else if (classData.image instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(classData.image);
      } else if (typeof classData.image === "string") {
        setImagePreview(classData.image);
        setSelectedImage(classData.image);
      }
    } else {
      setImagePreview(null);
      setSelectedImage(null);
    }

    // Reset equipment input
    setEquipment("");

    // Open the modal
    setSelectedClass(classData);
    setIsAddModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should not exceed 5MB");
        return;
      }

      // Remove previous image if it exists
      if (selectedImage) {
        if (selectedImage.public_id) {
          cloudinary.uploader.destroy(selectedImage.public_id);
        }

        setSelectedImage(null);
        setImagePreview(null);
      }

      setSelectedImage(file);
      setNewClass((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDeleteClass = async () => {
    if (!selectedClass || !selectedClass._id) {
      console.error("No class selected for deletion");
      return;
    }
  
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this class?"
      );
      
      if (confirmDelete) {
        const response = await deleteClass(selectedClass._id);
        
        if (response.success) {
          await fetchClasses();
          
          setIsDeleteModalOpen(false);
          setSelectedClass(null);
          alert("Class deleted successfully");
        } else {
          console.error("Error deleting class:", response.message);
          alert(response.message);
        }
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("Failed to delete class. Please try again.");
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      const classData = {
        ...newClass,
        schedule: {
          ...newClass.schedule,
          startDate: new Date(newClass.schedule.startDate).toISOString(),
          endDate: new Date(newClass.schedule.endDate).toISOString(),
        },
      };

      Object.keys(classData).forEach((key) => {
        if (key === "schedule") {
          Object.keys(classData.schedule).forEach((scheduleKey) => {
            if (scheduleKey === "daysOfWeek") {
              classData.schedule.daysOfWeek.forEach((day, index) => {
                formData.append(`schedule[daysOfWeek][${index}]`, day);
              });
            } else {
              formData.append(
                `schedule[${scheduleKey}]`,
                classData.schedule[scheduleKey]
              );
            }
          });
        } else if (key === "equipmentNeeded") {
          classData.equipmentNeeded.forEach((item, index) => {
            formData.append(`equipmentNeeded[${index}]`, item);
          });
        } else if (key === "image") {
          if (classData.image && classData.image instanceof File) {
            formData.append("image", classData.image);
          }
        } else {
          formData.append(key, classData[key]);
        }
      });

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      let response;
      if (selectedClass) {
        response = await updateClass(selectedClass._id, formData);
      } else {
        response = await createClass(formData);
      }

      if (response.success) {
        await fetchClasses();
        setIsAddModalOpen(false);
        resetForm();
      } else {
        console.error("Error creating class:", response.message);
        alert(response.message);
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert(error);
    }
  };

  const resetForm = () => {
    setNewClass({
      className: "",
      category: "",
      instructor: "",
      description: "",
      schedule: {
        startDate: "",
        endDate: "",
        daysOfWeek: [],
        startTime: "",
        endTime: "",
        timeZone: "UTC+5:30",
      },
      totalClasses: 12,
      capacity: 30,
      difficulty: "",
      status: "Upcoming",
      equipmentNeeded: [],
      remainingClasses: 12,
      price: 0,
      renewal: false,
      feedback: "",
      image: null,
    });
    setSelectedDays([]);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const formatClassData = (classData) => {
    const formatDaysOfWeek = (days) => {
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days?.map((day) => dayNames[day - 1]).join(", ") || "N/A";
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return {
      ...classData,
      schedule: `${classData.schedule?.startTime || ""} - ${
        classData.schedule?.endTime || ""
      }`,
      duration: calculateDuration(
        classData.schedule?.startTime,
        classData.schedule?.endTime
      ),
      resources: classData.equipmentNeeded || [],
      formattedInstructor: formatInstructorName(classData.instructor),
      scheduleDetails: {
        startDate: formatDate(classData.schedule?.startDate),
        endDate: formatDate(classData.schedule?.endDate),
        days: formatDaysOfWeek(classData.schedule?.daysOfWeek),
        startTime: classData.schedule?.startTime || "N/A",
        endTime: classData.schedule?.endTime || "N/A",
        timeZone: classData.schedule?.timeZone || "UTC+5:30",
      },
    };
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000/01/01 ${startTime}`);
    const end = new Date(`2000/01/01 ${endTime}`);
    const diff = (end - start) / (1000 * 60);
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const statusConfig = {
    "In Progress": {
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/50",
    },
    Upcoming: {
      icon: Calendar,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    },
    Completed: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/50",
    },
    Cancelled: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/50",
    },
  };

  const getFilteredClasses = () => {
    let filtered = classes.map(formatClassData);

    if (mainSearchTerm) {
      filtered = filtered.filter((cls) =>
        Object.values(cls).some((value) =>
          String(value).toLowerCase().includes(mainSearchTerm.toLowerCase())
        )
      );
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter((cls) => cls.status === statusFilter);
    }

    return filtered;
  };

  const filteredClasses = getFilteredClasses();

  return (
    <div className="min-h-screen dark:bg-gray-900 p-4">
      <div className="max-w-[85rem] mx-auto">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <GraduationCap className="mr-3 text-indigo-600" size={32} />
              Yoga Class Management
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="mr-2" size={20} />
              Add New Class
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Classes",
                value: enrollmentStats.totalClasses,
                icon: BookOpen,
              },
              {
                label: "Total Students",
                value: enrollmentStats.totalStudents,
                icon: Users,
              },
              {
                label: "Active Classes",
                value: enrollmentStats.activeClasses,
                icon: Clock,
              },
              {
                label: "Yoga Categories",
                value: enrollmentStats.yogaCategories,
                icon: List,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className="text-indigo-600" size={24} />
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filter Section */}
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search all classes..."
                value={mainSearchTerm}
                onChange={(e) => setMainSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="All">All Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* edit */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedClass(null);
            resetForm();
          }}
          title={selectedClass ? "Edit Class" : "Add New Class"}
        >
          {/* Modal Content */}
          <form onSubmit={handleAddClass} className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Basic Information */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Class Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.className}
                    onChange={(e) =>
                      setNewClass({ ...newClass, className: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.category}
                    onChange={(e) =>
                      setNewClass({ ...newClass, category: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newClass.description}
                    onChange={(e) =>
                      setNewClass({ ...newClass, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </label>
                  <select
                    value={newClass.type}
                    onChange={(e) =>
                      setNewClass({ ...newClass, type: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Difficulty Level
                  </label>
                  <select
                    value={newClass.difficulty}
                    onChange={(e) =>
                      setNewClass({ ...newClass, difficulty: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              {/* Middle Column - Schedule & Capacity */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Schedule & Capacity
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newClass.schedule.startDate}
                      onChange={(e) =>
                        setNewClass({
                          ...newClass,
                          schedule: {
                            ...newClass.schedule,
                            startDate: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newClass.schedule.endDate}
                      onChange={(e) =>
                        setNewClass({
                          ...newClass,
                          schedule: {
                            ...newClass.schedule,
                            endDate: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={newClass.schedule.startTime}
                      onChange={(e) =>
                        setNewClass({
                          ...newClass,
                          schedule: {
                            ...newClass.schedule,
                            startTime: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Time
                    </label>
                    <input
                      type="time"
                      required
                      value={newClass.schedule.endTime}
                      onChange={(e) =>
                        setNewClass({
                          ...newClass,
                          schedule: {
                            ...newClass.schedule,
                            endTime: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Days of Week
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, index) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(index + 1)}
                          className={`px-3 py-1 rounded ${
                            selectedDays.includes(index + 1)
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {day}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Capacity
                    </label>
                    <input
                      type="number"
                      required
                      value={newClass.capacity}
                      onChange={(e) =>
                        setNewClass({
                          ...newClass,
                          capacity: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      value={newClass.price}
                      onChange={(e) =>
                        setNewClass({
                          ...newClass,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Instructor
                  </label>
                  <select
                    value={newClass.instructor}
                    onChange={(e) =>
                      setNewClass({ ...newClass, instructor: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select an Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor._id} value={instructor._id}>
                        {`${instructor.firstName} ${instructor.lastName} (${instructor.email})`}
                      </option>
                    ))}
                  </select>
                </div>


              </div>

              {/* Right Column - Equipment & Image */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                  Equipment & Image
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Equipment Needed
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Add equipment..."
                    />
                    <button
                      type="button"
                      onClick={handleEquipmentAdd}
                      className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newClass.equipmentNeeded.map((item, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() =>
                            setNewClass((prev) => ({
                              ...prev,
                              equipmentNeeded: prev.equipmentNeeded.filter(
                                (_, i) => i !== index
                              ),
                            }))
                          }
                          className="ml-2 text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Class Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 relative">
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                              setNewClass((prev) => ({ ...prev, image: null }));
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <div className="h-32 w-32 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <UploadCloud className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        {imagePreview ? "Replace Image" : "Upload Image"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newClass.renewal}
                      onChange={(e) =>
                        setNewClass({ ...newClass, renewal: e.target.checked })
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Allow Renewal
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedClass(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {selectedClass ? "Update Class" : "Add Class"}
              </button>
            </div>
          </form>
        </Modal>

        {/* delete */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedClass(null);
          }}
          title="Delete Class"
        >
          <div className="mt-2">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this class? This action cannot be
              undone.
            </p>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedClass(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteClass(selectedClass.id)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>

        <TableSection
          title="Active Classes"
          icon={BookOpen}
          searchTerm={mainSearchTerm}
          onSearchChange={setMainSearchTerm}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Class Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Capacity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Lessions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredClasses.map((cls) => (
                  <tr
                    key={cls._id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                      cls.id % 2 === 0
                        ? "dark:bg-gray-700"
                        : "dark:bg-slate-800"
                    }`}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {cls.className}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {cls.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {cls.scheduleDetails.startDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {cls.scheduleDetails.endDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {cls.capacity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            cls.status === "In Progress"
                              ? "bg-green-100 text-green-800"
                              : cls.status === "Upcoming"
                              ? "bg-blue-100 text-blue-800"
                              : cls.status === "Completed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {cls.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <Link
                        to={`/video/${cls._id}`}
                        state={{ classData: cls }}
                        className="text-indigo-600 hover:text-indigo-700 flex items-center"
                      >
                        <Video className="mr-1" size={16} />
                        View Lessons
                      </Link>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(cls)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClass(cls);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableSection>

        {/* Classes Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Class Information */}
          <TableSection
            title="Class Schedule"
            icon={Calendar}
            searchTerm={mainSearchTerm}
            onSearchChange={setMainSearchTerm}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Days
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Instructor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredClasses.map((cls) => (
                    <tr
                      key={cls._id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                        cls.id % 2 === 0
                          ? "dark:bg-gray-700"
                          : "dark:bg-slate-800"
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {cls.schedule}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {cls.duration}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {cls.scheduleDetails.days}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {cls.formattedInstructor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableSection>

          {/* Enrollment Details */}
          <TableSection
            title="Enrollment Overview"
            icon={Users}
            searchTerm={mainSearchTerm}
            onSearchChange={setMainSearchTerm}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Class
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Enrolled
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Attendance
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Difficulty
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredClasses.map((cls) => (
                    <tr
                      key={cls._id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                        cls.id % 2 === 0
                          ? "dark:bg-gray-700"
                          : "dark:bg-slate-800"
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {cls.className}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {cls.students} students
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {cls.attendance || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {cls.difficulty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableSection>

          {/* Equipment and Resources */}
          <TableSection
            title="Room and Equipment"
            icon={Info}
            searchTerm={mainSearchTerm}
            onSearchChange={setMainSearchTerm}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Room
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Capacity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Equipment Required
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredClasses.map((cls) => (
                    <tr
                      key={cls._id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-600 ${
                        cls.id % 2 === 0
                          ? "dark:bg-gray-700"
                          : "dark:bg-slate-800"
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {cls.room}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {cls.capacity} people
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {cls.type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {cls.resources.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TableSection>
        </div>
      </div>
    </div>
  );
};

export default ClassManagement;
