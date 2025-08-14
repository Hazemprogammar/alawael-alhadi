import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navbar } from "./components/layout/Navbar";

import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { StudentDashboard } from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import NotFound from "./pages/NotFound";
import BuyPoints from "./pages/BuyPoints";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import { Community } from "./pages/Community";
import { Exams } from "./pages/Exams";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

// Dashboard Route Component
const DashboardRoute = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/auth/login" replace />;
  
  // Route based on user role
  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'institution':
      return <div className="p-8 text-center">تم إلغاء صفحة المؤسسة التعليمية</div>;
    case 'parent':
      return <div className="p-8 text-center">Parent Dashboard - Coming Soon</div>;
    case 'admin':
      return <div className="p-8 text-center">Admin Dashboard - Coming Soon</div>;
    default:
      return <Navigate to="/auth/login" replace />;
  }
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/auth/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div>
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <DashboardRoute />
              </main>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/courses" element={<Courses />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/community" element={<Community />} />
        <Route path="/buy-points" element={<BuyPoints />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <div>
              <Profile />
            </div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
