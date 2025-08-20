import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MyTickets } from './pages/customer/MyTickets';
import { NewTicket } from './pages/customer/NewTicket';
import { TicketDetail } from './pages/customer/TicketDetail';
import { StaffTickets } from './pages/staff/StaffTickets';
import { StaffTicketDetail } from './pages/staff/StaffTicketDetail';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminPriorities } from './pages/admin/AdminPriorities';
import { AdminStaff } from './pages/admin/AdminStaff';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-600 rounded-full blur opacity-75 animate-glow"></div>
            <div className="relative w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading SparkSupport...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'customer':
      return <Navigate to="/my/tickets" replace />;
    case 'staff':
      return <Navigate to="/staff/tickets" replace />;
    case 'admin':
      return <Navigate to="/admin/categories" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <ToastProvider>
            <Router>
            <div className="min-h-screen transition-all duration-300">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                <Route path="/" element={<RoleBasedRedirect />} />

                {/* Customer Routes */}
                <Route 
                  path="/my/tickets" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <AppShell>
                        <MyTickets />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my/tickets/new" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <AppShell>
                        <NewTicket />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my/tickets/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <AppShell>
                        <TicketDetail />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />

                {/* Staff Routes */}
                <Route 
                  path="/staff/tickets" 
                  element={
                    <ProtectedRoute allowedRoles={['staff', 'admin']}>
                      <AppShell>
                        <StaffTickets />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/tickets/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['staff', 'admin']}>
                      <AppShell>
                        <StaffTicketDetail />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['staff', 'admin']}>
                      <AppShell>
                        <StaffDashboard />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Routes */}
                <Route 
                  path="/admin/categories" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AppShell>
                        <AdminCategories />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/priorities" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AppShell>
                        <AdminPriorities />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/staff" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AppShell>
                        <AdminStaff />
                      </AppShell>
                    </ProtectedRoute>
                  } 
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <ToastContainer />
          </Router>
        </ToastProvider>
      </AuthProvider>
      </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;