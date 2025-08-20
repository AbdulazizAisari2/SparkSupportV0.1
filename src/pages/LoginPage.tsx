import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, LogIn, Mail, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['customer', 'staff', 'admin'], {
    required_error: 'Please select a role',
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Demo user credentials
const demoUsers = [
  { email: 'customer@example.com', role: 'customer', name: 'Ahmed', color: 'from-blue-500 to-cyan-500' },
  { email: 'staff1@example.com', role: 'staff', name: 'Mohammed', color: 'from-green-500 to-emerald-500' },
  { email: 'staff2@example.com', role: 'staff', name: 'Sarah', color: 'from-purple-500 to-pink-500' },
  { email: 'admin@example.com', role: 'admin', name: 'Abdulaziz', color: 'from-orange-500 to-red-500' },
];

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      login(result.token, result.user);
      
      addToast(`Welcome back, ${result.user.name}! 🎉`, 'success');
      
      // Redirect based on role
      switch (result.user.role) {
        case 'customer':
          navigate('/my/tickets');
          break;
        case 'staff':
          navigate('/staff/tickets');
          break;
        case 'admin':
          navigate('/admin/categories');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      addToast('Login failed. Please check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (demoUser: typeof demoUsers[0]) => {
    setValue('email', demoUser.email);
    setValue('role', demoUser.role as any);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle showLabel />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur opacity-75 animate-glow"></div>
                <div className="relative bg-white dark:bg-dark-800 p-4 rounded-2xl shadow-xl">
                  <MessageSquare className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent mb-2">
              SparkSupport
            </h1>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to access your support dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="mt-8 animate-slide-up">
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-dark-700/50 p-8">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      {...register('email')}
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`
                        block w-full pl-10 pr-4 py-3 border-2 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 
                        bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70
                        ${errors.email 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-dark-600'
                        }
                      `}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down">{errors.email.message}</p>
                  )}
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Account Type
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <select
                      {...register('role')}
                      id="role"
                      className={`
                        block w-full pl-10 pr-4 py-3 border-2 rounded-xl text-gray-900 dark:text-gray-100
                        bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                        transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70
                        ${errors.role 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-dark-600'
                        }
                      `}
                    >
                      <option value="">Select Account Type</option>
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {errors.role && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down">{errors.role.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LogIn className="h-5 w-5 text-primary-300 group-hover:text-primary-200 transition-colors" />
                  </span>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Demo Accounts Section */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-dark-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 dark:bg-dark-800/80 text-gray-500 dark:text-gray-400 font-medium">
                      Quick Demo Access
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {demoUsers.map((user) => (
                    <button
                      key={user.email}
                      type="button"
                      onClick={() => fillDemoCredentials(user)}
                      className={`
                        relative overflow-hidden p-3 rounded-xl text-white font-medium text-sm
                        bg-gradient-to-r ${user.color} hover:shadow-lg transform transition-all duration-200 
                        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                        group
                      `}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <div className="relative flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>{user.name}</span>
                      </div>
                      <div className="relative text-xs opacity-90 mt-1 capitalize">
                        {user.role}
                      </div>
                    </button>
                  ))}
                </div>
                
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                  Click any demo account to auto-fill credentials
                </p>
              </div>

              {/* Sign up link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200 relative group"
                  >
                    Sign up here
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Secure • Reliable • Always Available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};