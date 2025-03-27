import React, { useState, useEffect } from "react";
import { Users, Search, Edit, Trash2, UserPlus, X, Eye } from "lucide-react";
import { getAdminProfile, getAllProfile } from "../api/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("admin");

  const [editForm, setEditForm] = useState({
    Fname: "",
    Lname: "",
    email: "",
    phone_Number: "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString();
    } catch (error) {
      return "N/A";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleString();
    } catch (error) {
      return "N/A";
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [userType]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (userType === "admin") {
        response = await getAdminProfile();
      } else {
        response = await getAllProfile();
      }

      if (response.success && response.user) {
        const transformedUsers = response.user.map((user) =>
          user.Fname || user.Lname
            ? transformAdminUser(user)
            : transformNormalUser(user)
        );
        setUsers(transformedUsers);
      } else {
        setError("No user data found");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setError("Failed to load profiles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const transformAdminUser = (user) => ({
    id: user._id,
    name: `${user.Fname || ""} ${user.Lname || ""}`.trim(),
    Fname: user.Fname,
    Lname: user.Lname,
    email: user.email,
    phone: user.phone_Number || "N/A",
    role: user.role,
    joinDate: formatDate(user.createdAt),
    lastLogin: formatDate(user.lastLogin),
    status: "active",
  });

  const transformNormalUser = (user) => ({
    id: user._id,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "N/A",
    role: user.role,
    membershipType: user.membershipType,
    joinDate: formatDate(user.joinedDate),
    lastLogin: formatDate(user.lastLogin),
    status: user.accountStatus,
    additionalDetails: {
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      medicalConditions: user.medicalConditions,
      experienceLevel: user.experienceLevel,
      preferredStyle: user.preferredStyle,
      fitnessGoals: user.fitnessGoals,
      preferredTime: user.preferredTime,
      occupation: user.occupation,
      subscriptionStatus: user.subscriptionStatus,
    },
  });

  const DetailRow = ({ label, value, icon }) => (
    <div className="flex items-center space-x-3">
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className="font-medium text-gray-900 dark:text-white">
          {value || "N/A"}
        </div>
      </div>
    </div>
  );

  const DetailCard = ({ title, details }) => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400 border-b pb-2">
        {title}
      </h3>
      <div className="space-y-3">
        {details.map((detail, index) => (
          <DetailRow key={index} label={detail.label} value={detail.value} />
        ))}
      </div>
    </div>
  );

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      Fname: user.Fname || user.firstName,
      Lname: user.Lname || user.lastName,
      email: user.email,
      phone_Number: user.phone,
    });
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Implement actual update logic here
    setIsEditModalOpen(false);
  };

  // Filter users
  // const filteredUsers = users.filter((user) => {
  //   const matchesSearch =
  //     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesStatus =
  //     statusFilter === "all" ? true : user.status === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 text-gray-700 dark:text-white">
        {/* Header Section */}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="mr-2" />
            {userType === "admin" ? "Admin Profiles" : "User Profiles"}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                setUserType(userType === "admin" ? "user" : "admin")
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Switch to {userType === "admin" ? "User" : "Admin"} View
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && <div className="text-center py-8">Loading profile...</div>}

        {error && (
          <div className="text-center py-8 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
            <table className="w-full">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Contact
                  </th>
                  {userType === "user" && (
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Membership
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {/* User column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            {user.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined: {user.joinDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Contact column */}
                    <td className="px-6 py-4">
                      <div className="text-sm">{user.phone}</div>
                    </td>
                    {/* Membership column (for user view) */}
                    {userType === "user" && (
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {user.membershipType || "N/A"}
                        </div>
                      </td>
                    )}
                    {/* Status column */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    {/* Actions column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isDetailsModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 mr-3 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  User Details Information
                </h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content with Scrollable Area */}
              <div className="overflow-y-auto max-h-[70vh] p-6">
                {userType === "admin" ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information Card */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 shadow-md">
                      <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400 border-b pb-2">
                        Personal Information
                      </h3>
                      <div className="space-y-3">
                        <DetailRow
                          label="Full Name"
                          value={selectedUser.name}
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-indigo-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          }
                        />
                        <DetailRow
                          label="Email"
                          value={selectedUser.email}
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-indigo-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          }
                        />
                        <DetailRow
                          label="Phone"
                          value={selectedUser.phone}
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-indigo-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                          }
                        />
                      </div>
                    </div>

                    {/* Account Details Card */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 shadow-md">
                      <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400 border-b pb-2">
                        Account Details
                      </h3>
                      <div className="space-y-3">
                        <DetailRow
                          label="Role"
                          value={selectedUser.role}
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-indigo-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                          }
                        />
                        <DetailRow
                          label="Join Date"
                          value={selectedUser.joinDate}
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-indigo-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          }
                        />
                        <DetailRow
                          label="Last Login"
                          value={selectedUser.lastLogin}
                          icon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-indigo-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <DetailCard
                      title="Personal Information"
                      details={[
                        { label: "Full Name", value: selectedUser.name },
                        { label: "Email", value: selectedUser.email },
                        { label: "Phone", value: selectedUser.phone },
                        {
                          label: "Date of Birth",
                          value: formatDate(
                            selectedUser.additionalDetails.dateOfBirth
                          ),
                        },
                        {
                          label: "Gender",
                          value: selectedUser.additionalDetails.gender,
                        },
                      ]}
                    />

                    {/* Fitness Profile */}
                    <DetailCard
                      title="Fitness Profile"
                      details={[
                        {
                          label: "Experience Level",
                          value: selectedUser.additionalDetails.experienceLevel,
                        },
                        {
                          label: "Preferred Style",
                          value: selectedUser.additionalDetails.preferredStyle,
                        },
                        {
                          label: "Fitness Goals",
                          value:
                            selectedUser.additionalDetails.fitnessGoals?.join(
                              ", "
                            ) || "N/A",
                        },
                        {
                          label: "Medical Conditions",
                          value:
                            selectedUser.additionalDetails.medicalConditions?.join(
                              ", "
                            ) || "None",
                        },
                      ]}
                    />

                    {/* Membership Details */}
                    <DetailCard
                      title="Membership Details"
                      details={[
                        {
                          label: "Membership Type",
                          value: selectedUser.membershipType,
                        },
                        {
                          label: "Join Date",
                          value: selectedUser.joinDate,
                        },
                        {
                          label: "Account Status",
                          value: selectedUser.status,
                        },
                        {
                          label: "Subscription Status",
                          value:
                            selectedUser.additionalDetails.subscriptionStatus,
                        },
                      ]}
                    />

                    {/* Additional Information */}
                    <DetailCard
                      title="Additional Information"
                      details={[
                        {
                          label: "Height",
                          value: `${selectedUser.additionalDetails.height} cm`,
                        },
                        {
                          label: "Weight",
                          value: `${selectedUser.additionalDetails.weight} kg`,
                        },
                        {
                          label: "Preferred Time",
                          value: selectedUser.additionalDetails.preferredTime,
                        },
                        {
                          label: "Occupation",
                          value: selectedUser.additionalDetails.occupation,
                        },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
