import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Layout } from "./components/Layout";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import StudentRequests from "./pages/StudentRequests";
import StudentHistory from "./pages/StudentHistory";
import HolidayAdvance from "./pages/HolidayAdvance";

// Faculty Pages
import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyRequests from "./pages/FacultyRequests";
import FacultyStudents from "./pages/FacultyStudents";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminReports from "./pages/AdminReports";
import SecurityDashboard from "./pages/SecurityDashboard";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({
  element,
  requiredRole,
}: {
  element: React.ReactNode;
  requiredRole?: string | string[];
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role!)) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Layout>{element as React.ReactElement}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      {!user && <Route path="/login" element={<Login />} />}

      {/* Redirect to login if not authenticated */}
      {!user && <Route path="/" element={<Navigate to="/login" replace />} />}

      {/* Student Routes */}
      {user?.role === "student" && (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<StudentDashboard />}
                requiredRole="student"
              />
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute
                element={<StudentDashboard />}
                requiredRole="student"
              />
            }
          />
          <Route
            path="/student/requests"
            element={
              <ProtectedRoute
                element={<StudentRequests />}
                requiredRole="student"
              />
            }
          />
          <Route
            path="/student/requests/new"
            element={
              <ProtectedRoute
                element={<StudentRequests />}
                requiredRole="student"
              />
            }
          />
          <Route
            path="/student/requests/holiday"
            element={
              <ProtectedRoute
                element={<HolidayAdvance />}
                requiredRole="student"
              />
            }
          />
          <Route
            path="/student/history"
            element={
              <ProtectedRoute
                element={<StudentHistory />}
                requiredRole="student"
              />
            }
          />
        </>
      )}

      {/* Faculty Routes */}
      {user?.role === "faculty" && (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<FacultyDashboard />}
                requiredRole="faculty"
              />
            }
          />
          <Route
            path="/faculty/dashboard"
            element={
              <ProtectedRoute
                element={<FacultyDashboard />}
                requiredRole="faculty"
              />
            }
          />
          <Route
            path="/faculty/requests"
            element={
              <ProtectedRoute
                element={<FacultyRequests />}
                requiredRole="faculty"
              />
            }
          />
          <Route
            path="/faculty/students"
            element={
              <ProtectedRoute
                element={<FacultyStudents />}
                requiredRole="faculty"
              />
            }
          />
        </>
      )}

      {/* Admin Routes */}
      {user?.role === "admin" && (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                requiredRole="admin"
              />
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                requiredRole="admin"
              />
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                element={<AdminUsers />}
                requiredRole="admin"
              />
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute
                element={<AdminSettings />}
                requiredRole="admin"
              />
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute
                element={<AdminReports />}
                requiredRole="admin"
              />
            }
          />
        </>
      )}

      {/* Security Guard Routes */}
      {user?.role === "security_guard" && (
        <Route
          path="/security/dashboard"
          element={
            <ProtectedRoute
              element={<SecurityDashboard />}
              requiredRole="security_guard"
            />
          }
        />
      )}

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

// Initialize app only once
const container = document.getElementById("root");
if (container && !container.hasChildNodes()) {
  createRoot(container).render(<App />);
}
