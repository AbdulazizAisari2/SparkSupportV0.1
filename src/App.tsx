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

// Pages
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
import { AdminPriorities } from './pages/admin/AdminPriorities';
import { AdminStaff } from './pages/admin/AdminStaff';
import { AdminSlack } from './pages/admin/AdminSlack';
import { AdminSurveyAnalytics } from './pages/admin/AdminSurveyAnalytics';
import { NotificationsPage } from './pages/NotificationsPage';
import { NotificationPreferences } from './pages/NotificationPreferences';
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

                          {/* Security Routes - Block direct access to base paths */}
                          <Route path="/my" element={<Navigate to="/my/tickets" replace />} />
                          <Route path="/staff" element={<Navigate to="/staff/tickets" replace />} />
                          <Route path="/admin" element={<Navigate to="/admin/categories" replace />} />

                          {/* Customer Routes */}
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
                            path="/my/notification-preferences" 
                            element={
                              <ProtectedRoute allowedRoles={['customer']}>
                                <AppShell>
                                  <PageTransition>
                                    <NotificationPreferences />
                                  </PageTransition>
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

                          {/* Admin Routes */}
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
                            path="/admin/priorities" 
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AppShell>
                                  <PageTransition>
                                    <AdminPriorities />
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
                            path="/admin/survey-analytics" 
                            element={
                              <ProtectedRoute allowedRoles={['admin']}>
                                <AppShell>
                                  <AdminSurveyAnalytics />
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

                          {/* Catch-all route for 404 and unauthorized access */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </div>
                      <ToastContainer />
                    </RouteGuard>
                  </Router>
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