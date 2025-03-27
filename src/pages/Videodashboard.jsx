import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Upload,
  Edit,
  Trash2,
  Plus,
  Video,
  ArrowLeft,
  X,
  Loader,
} from "lucide-react";
import { getClassById, uploadClassVideo } from "../api/api";

const LoadingSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map((n) => (
      <div
        key={n}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
        style={{
          animation: `fadeIn 0.5s ease-in-out ${n * 0.2}s both`,
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-full">
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="mt-2 w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="mt-4 w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

const AnimatedLoading = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      <div className="w-16 h-16 border-4 border-transparent border-b-purple-600 rounded-full animate-pulse absolute top-0" />
    </div>
    <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse">
      Loading your content...
    </p>
  </div>
);

const VideoManagement = () => {
  const { id: classId } = useParams();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    classNumber: "",
    file: null,
  });

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setIsLoading(true);
        const response = await getClassById(classId);
        if (response.success) {
          setClassData(response.data);
        } else {
          setError(response.message || "Failed to fetch class data");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching class data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (classId) {
      fetchClassData();
    }
  }, [classId]);

  const handlePlayVideo = (video) => {
    setCurrentVideo(video);
    setIsVideoPlayerOpen(true);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      setFormSubmitting(true);
      setUploadLoading(true);

      const formData = new FormData();
      formData.append("title", newVideo.title);
      formData.append("description", newVideo.description);
      formData.append("classNumber", newVideo.classNumber);
      formData.append("video", newVideo.file);

      const response = await uploadClassVideo(classId, formData);

      if (response.success) {
        const updatedClass = await getClassById(classId);
        if (updatedClass.success) {
          setClassData(updatedClass.data);
        }
        setIsModalOpen(false);
        setNewVideo({
          title: "",
          description: "",
          classNumber: "",
          file: null,
        });
      } else {
        setError(response.message || "Failed to upload video");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error uploading video:", err);
    } finally {
      setFormSubmitting(false);
      setUploadLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400 text-center p-4">
          <div className="mb-3">Error: {error}</div>
          <button
            onClick={() => navigate("/class-management")}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            ← Go back to Class Management
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <AnimatedLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!classData) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/class-management")}
              className="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
                <Video
                  className="inline-block mr-2 text-purple-600 dark:text-purple-400"
                  size={32}
                />
                {classData?.className || "Loading..."} - Lessons
              </h1>
              {classData && (
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Category: {classData.category} | Remaining Classes:{" "}
                  {classData.remainingClasses}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="mr-2" size={20} />
              Add New Lesson
            </button>
          </div>

          {/* Video Grid */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {!classData?.videos || classData.videos.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  No lessons available for this class yet. Click "Add New
                  Lesson" to get started.
                </div>
              ) : (
                classData.videos.map((video) => (
                  <div
                    key={video._id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-2 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                          Class {video.classNumber}
                        </span>
                        <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
                          {video.title}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>
                        <strong>Uploaded:</strong>{" "}
                        {new Date(video.uploadedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {video.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlayVideo(video)}
                      className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Play className="mr-2" size={16} />
                      Play Lesson
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      {isVideoPlayerOpen && currentVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentVideo.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Class {currentVideo.classNumber}
                  </p>
                </div>
                <button
                  onClick={() => setIsVideoPlayerOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-colors duration-200 group"
                  aria-label="Close video"
                >
                  <X
                    size={24}
                    className="text-gray-500 dark:text-gray-400 
                          group-hover:text-gray-700 dark:group-hover:text-gray-200 
                          transition-colors duration-200"
                  />
                </button>
              </div>

              <div
                className="relative bg-black"
                style={{ paddingBottom: "56.25%" }}
              >
                <video
                  className="absolute inset-0 w-full h-full"
                  controls
                  autoPlay
                  src={currentVideo.url}
                >
                  <p className="text-white text-center p-4">
                    Your browser does not support the video tag.
                  </p>
                </video>
              </div>

              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-slate-50 mb-2">
                    About this lesson
                  </h4>
                  <p className="text-md text-gray-600 dark:text-gray-300 leading-relaxed">
                    {currentVideo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Add New Lesson
            </h2>
            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Class Number
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={classData.totalClasses}
                  value={newVideo.classNumber}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, classNumber: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newVideo.title}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  required
                  onChange={(e) =>
                    setNewVideo({
                      ...newVideo,
                      file: e.target.files[0],
                    })
                  }
                  className="mt-1 block w-full text-gray-700 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  required
                  value={newVideo.description}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 dark:bg-purple-500 rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {formSubmitting ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Uploading...
                    </>
                  ) : (
                    "Add Lesson"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManagement;
