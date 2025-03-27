import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Tag,
  Calendar,
  MapPin,
  Clock,
  User,
  FileText,
  Image,
  X,
  Plus,
  PlusCircle,
  Edit,
  Trash2,
  Loader,
} from "lucide-react";


const BlogManagementSystem = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    id: Date.now(),
    title: "",
    category: "Yoga",
    author: "",
    authorRole: "",
    date: "",
    location: "",
    excerpt: "",
    content: "",
    readTime: "",
    tags: [],
    featured: false,
    image: null,
    views: 0,
    likes: 0,
    comments: 0,
    bookmarks: 0,
    authorImage: "/api/placeholder/100/100",
  });

  // Tag input state
  const [currentTag, setCurrentTag] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Blog data state
  const [blogs, setBlogs] = useState([]);
  const BASE_URL = "http://localhost:4000/api";


  // Categories
  const categories = [
    "All",
    "Yoga",
    "Wellness",
    "Fitness",
    "Meditation",
    "Mindfulness",
    "Nutrition",
    "Lifestyle",
  ];

  // Filter blogs based on active category
  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((blog) => blog.category === activeCategory);

  // Fetch blogs when component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/blog/get`, {
        withCredentials: true,
      });
      
      if (response.data && response.data.data) {
        setBlogs(response.data.data);
      } else {
        // Handle case where no blogs are returned or format is unexpected
        setBlogs([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file, 
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding tags
  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  // Handle removing tags
  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object for multipart/form-data submission
      const blogFormData = new FormData();
      
      // Add all text fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && key !== 'tags') {
          blogFormData.append(key, formData[key]);
        }
      });
      
      // Add tags as a comma-separated string or as individual entries
      if (formData.tags && formData.tags.length > 0) {
        blogFormData.append('tags', formData.tags.join(','));
      }
      
      // Add image if it exists and is a File object
      if (formData.image && formData.image instanceof File) {
        blogFormData.append('image', formData.image);
      }
      
      let response;
      
      if (editingBlog) {
        // Update existing blog
        // Assuming your API has an endpoint for updating blogs
        response = await axios.put(
          `${BASE_URL}/blog/${editingBlog.id}`, 
          blogFormData, 
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Create new blog
        response = await axios.post(
          `${BASE_URL}/blog`, 
          blogFormData, 
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }
      
      // If successful, refresh the blog list
      if (response.data && response.data.success) {
        await fetchBlogs();
        
        // Reset form and view
        resetForm();
        setShowAddForm(false);
        setEditingBlog(null);
      } else {
        throw new Error(response.data.message || 'Unknown error occurred');
      }
    } catch (err) {
      console.error("Error saving blog:", err);
      setError(err.response?.data?.message || "Failed to save blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a blog
  const handleEditBlog = (blog) => {
    // Create a copy of the blog
    const blogToEdit = { ...blog };
    
    // If image is a URL, keep it for preview but we'll handle it specially in the submission
    if (typeof blogToEdit.image === 'string') {
      setPreviewImage(blogToEdit.image);
    }
    
    setFormData(blogToEdit);
    setEditingBlog(blog);
    setShowAddForm(true);
  };

  // Handle deleting a blog
  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      setLoading(true);
      try {
        await axios.delete(`${BASE_URL}/blog/${blogId}`, {
          withCredentials: true,
        });
        
        // Update local state
        setBlogs(blogs.filter((blog) => blog.id !== blogId));
        window.location.reload();
      } catch (err) {
        console.error("Error deleting blog:", err);
        setError("Failed to delete blog. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: Date.now(),
      title: "",
      category: "Yoga",
      author: "",
      authorRole: "",
      date: "",
      location: "",
      excerpt: "",
      content: "",
      readTime: "",
      tags: [],
      featured: false,
      image: null,
      views: 0,
      likes: 0,
      comments: 0,
      bookmarks: 0,
      authorImage: "/api/placeholder/100/100",
    });
    setPreviewImage(null);
    setCurrentTag("");
  };

  // Cancel form
  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
    setEditingBlog(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with title and add button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Blog Management System
          </h1>
          
          {!showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <PlusCircle size={20} />
              <span>Add New Post</span>
            </button>
          )}
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-4">
            <Loader className="animate-spin h-6 w-6 text-purple-600" />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Loading...</span>
          </div>
        )}

        {showAddForm ? (
          /* Blog Form */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Blog Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter blog title"
                />
              </div>

              {/* Two column layout for category and date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <Tag size={16} />
                      <span>Category</span>
                    </div>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Date</span>
                    </div>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Two column layout for author and role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Author */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>Author Name</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Author name"
                  />
                </div>

                {/* Author Role */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Author Role
                  </label>
                  <input
                    type="text"
                    name="authorRole"
                    value={formData.authorRole}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Senior Yoga Instructor"
                  />
                </div>
              </div>

              {/* Two column layout for location and read time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>Location</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. Rishikesh, India"
                  />
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Read Time</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. 8 min read"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Brief description of the blog post"
                ></textarea>
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>Content</span>
                  </div>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Write your blog content here..."
                ></textarea>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    <span>Tags</span>
                  </div>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Featured Post */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple-600 dark:text-purple-400 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 text-gray-700 dark:text-gray-300 font-medium"
                >
                  Feature this post
                </label>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Image size={16} />
                    <span>Featured Image</span>
                  </div>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-contain p-2"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData({
                              ...formData,
                              image: null,
                            });
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Image className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or
                          drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-300"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : editingBlog ? (
                    <>
                      <Edit size={18} />
                      <span>Update Post</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      <span>Create Post</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Blog List View */
          <>
            {/* Category Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
                        ${
                          activeCategory === category
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700"
                        }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            {/* Featured Posts */}
            {activeCategory === "All" && blogs.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {blogs
                  .filter((blog) => blog.featured)
                  .map((blog) => (
                    <div
                      key={blog.id || blog._id}
                      className="relative group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative h-64">
                        <img
                          src={blog.image || "/api/placeholder/800/600"}
                          alt={blog.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <div className="flex items-center space-x-2 mb-2">
                            <Tag size={16} />
                            <span className="text-sm font-medium">
                              {blog.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                          <p className="text-sm text-gray-200 line-clamp-2">
                            {blog.excerpt}
                          </p>
                        </div>
                      </div>
                      
                      {/* Edit and Delete buttons */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        {/* <button 
                          onClick={() => handleEditBlog(blog)}
                          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
                        >
                          <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </button> */}
                        <button 
                          onClick={() => handleDeleteBlog(blog.id || blog._id)}
                          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
                        >
                          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Regular Posts Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <div
                    key={blog.id || blog._id}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={blog.image || "/api/placeholder/800/600"}
                        alt={blog.title}
                        className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 px-3 py-1 rounded-full flex items-center space-x-1">
                        <Tag
                          size={14}
                          className="text-purple-600 dark:text-purple-400"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {blog.category}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 flex space-x-2">
                        {/* <button 
                          onClick={() => handleEditBlog(blog)}
                          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
                        >
                          <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </button> */}
                        <button
                          onClick={() => handleDeleteBlog(blog.id || blog._id)}
                          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg"
                        >
                          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                         
                          <div>
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {blog.author}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {blog.authorRole}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {blog.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-20 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No blog posts found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {error ? error : "There are no blog posts in this category yet."}
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    <span>Create your first post</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogManagementSystem;