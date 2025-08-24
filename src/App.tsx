import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/ui/Toast';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute, RouteGuard } from './components/ProtectedRoute';
import { UnauthorizedPage } from './components/AuthGuard';
import { NotFound } from './components/NotFound';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PageTransition } from './components/ui/PageTransition';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MyTickets } from './pages/customer/MyTickets';
import { NewTicket } from './pages/customer/NewTicket';
import { TicketDetail } from './pages/customer/TicketDetail';
import { StaffTickets } from './pages/staff/StaffTickets';
import { StaffTicketDetail } from './pages/staff/StaffTicketDetail';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffLeaderboard } from './pages/staff/StaffLeaderboard';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminStaff } from './pages/admin/AdminStaff';
import { AdminSlack } from './pages/admin/AdminSlack';
import { NotificationsPage } from './pages/NotificationsPage';
import { AISupport } from './pages/AISupport';
import { Marketplace } from './pages/Marketplace';
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
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/categories" replace />;
    case 'staff':
      return <Navigate to="/staff/tickets" replace />;
    case 'customer':
      return <Navigate to="/my/tickets" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};
const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
      <div className="max-w-md w-full bg-white dark:bg-dark-800 shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
            <MessageSquare className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
            Access Denied
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
          {user && (
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Current role: {user.role}
            </p>
          )}
          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <SessionProvider>
                <ToastProvider>
                  <Router>
                    <RouteGuard>
                      <div className="min-h-screen transition-all duration-300">
                        <Routes>
                          <Route path="/login" element={
                            <PageTransition>
                              <LoginPage />
                            </PageTransition>
                          } />
                          <Route path="/signup" element={
                            <PageTransition>
                              <SignupPage />
                            </PageTransition>
                          } />
                          <Route path="/" element={<RoleBasedRedirect />} />
                          <Route path="/my" element={<Navigate to="/my/tickets" replace />} />
                          <Route path="/staff" element={<Navigate to="/staff/tickets" replace />} />
                          <Route path="/admin" element={<Navigate to="/admin/categories" replace />} />
                          <Route
                            path="/my/tickets"
                            element={
                              <ProtectedRoute allowedRoles={['customer']}>
                                <AppShell>
                                  <PageTransition>
                                    <MyTickets />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/my/tickets/new"
                            element={
                              <ProtectedRoute allowedRoles={['customer']}>
                                <AppShell>
                                  <PageTransition>
                                    <NewTicket />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/my/tickets/:id"
                            element={
                              <ProtectedRoute allowedRoles={['customer']}>
                                <AppShell>
                                  <PageTransition>
                                    <TicketDetail />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/my/marketplace"
                            element={
                              <ProtectedRoute allowedRoles={['customer']}>
                                <AppShell>
                                  <PageTransition>
                                    <Marketplace />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/my/notifications"
                            element={
                              <ProtectedRoute allowedRoles={['customer']}>
                                <AppShell>
                                  <PageTransition>
                                    <NotificationsPage />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/staff/tickets"
                            element={
                              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <StaffTickets />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/staff/tickets/:id"
                            element={
                              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <StaffTicketDetail />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/staff/dashboard"
                            element={
                              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <StaffDashboard />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/staff/ai-support"
                            element={
                              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <AISupport />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/staff/marketplace"
                            element={
                              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <Marketplace />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/staff/leaderboard"
                            element={
                              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <StaffLeaderboard />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/staff/notifications"
                            element={
                              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <NotificationsPage />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/admin/categories"
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <AdminCategories />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/admin/staff"
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <AdminStaff />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/admin/slack"
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <AdminSlack />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/admin/ai-support"
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <AISupport />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/admin/marketplace"
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <Marketplace />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/admin/leaderboard"
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <StaffLeaderboard />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route
                            path="/admin/notifications"
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <NotificationsPage />
                                  </PageTransition>
                                </AppShell>
                              </ProtectedRoute>
                            } 
                          />
                          <Route path="/unauthorized" element={<UnauthorizedPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                    </RouteGuard>
                  </Router>
                  <ToastContainer />
                </ToastProvider>
              </SessionProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
export default App;