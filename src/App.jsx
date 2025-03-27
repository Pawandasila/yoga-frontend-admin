import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ClassManagement from "./pages/Bookings";
import Setting from "./pages/Setting";
import Blogs from "./pages/Blogs"
import SubscriptionManagement from "./pages/SubscriptionManagement";
import InstructorManagement from "./pages/InstructorManagement"
import PaymentManagement from "./pages/PaymentManagement";
import SupportFeedback from "./pages/SupportFeedback";
import Analytics from "./pages/Analytics";
import PageNotFound from "./pages/PageNotFound";
import UserManagement from "./pages/Clients";
import YogaDashboard from "./pages/Overview";
import AdminLoginPage from "./pages/login";
import AdminSignupPage from "./pages/Signup";
import { useAuth } from "./components/AuthContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { RoleProvider } from "./context/RoleContext";
import Header from "./components/Header";
import ImageSlider from "./pages/test";
import VideoManagement from "./pages/Videodashboard";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider>
      <RoleProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              {/* Routes for Login and Signup don't need Sidebar */}
              <Route path="/login" element={<AdminLoginPage />} />
              <Route path="/signup" element={<AdminSignupPage />} />
              <Route path="/test" element={<ImageSlider />} />

              {/* Private Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <YogaDashboard />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/class-management"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <ClassManagement />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/user-management"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <UserManagement />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/subscription-management"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <SubscriptionManagement />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <Analytics />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/payment-management"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <PaymentManagement />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/support-feedback"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <SupportFeedback />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/blog-management"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <Blogs />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <Setting />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />

              <Route
                path="/video/:id"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <VideoManagement />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />
              <Route
                path="/instructor-management"
                element={
                  <PrivateRoute>
                    <div className="flex">
                      <div className="fixed inset-y-0 z-50">
                        {isAuthenticated && (
                          <Sidebar
                            isCollapsed={isSidebarCollapsed}
                            onToggleCollapse={() =>
                              setIsSidebarCollapsed(!isSidebarCollapsed)
                            }
                          />
                        )}
                      </div>
                      <main
                        className={`flex-1 transition-all duration-200 ease-in-out ${
                          isAuthenticated
                            ? isSidebarCollapsed
                              ? "ml-20"
                              : "ml-64"
                            : ""
                        }`}
                      >
                        <Header />
                        <InstructorManagement />
                      </main>
                    </div>
                  </PrivateRoute>
                }
              />

              {/* 404 Page Not Found */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </Router>
      </RoleProvider>
    </ThemeProvider>
  );
};

export default App;
