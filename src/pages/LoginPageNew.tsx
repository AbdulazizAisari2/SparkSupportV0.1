import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, LogIn, Mail, Shield, Sparkles, ArrowRight, Star, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SimpleThemeToggle } from '../components/ui/SimpleThemeToggle';
import { PasswordField } from '../components/auth/PasswordField';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'staff', 'admin'], {
    required_error: 'Please select a role',
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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
    console.log('Form submission data:', data);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Login error:', errorData);
        throw new Error(errorData.error || 'Login failed');
      }

      const result = await response.json();
      console.log('Login successful:', result);
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
      console.error('Login error:', error);
      addToast(`Login failed: ${error instanceof Error ? error.message : 'Please check your credentials'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stunning gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-bl from-purple-400 to-pink-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-32 right-24 w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-16 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-ping opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-60" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <SimpleThemeToggle />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Stunning header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 animate-glow transition-opacity duration-500"></div>
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 group-hover:scale-105 transition-transform duration-300">
                  <MessageSquare className="w-16 h-16 text-transparent bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 bg-clip-text" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-3xl"></div>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4 tracking-tight">
              SparkSupport
            </h1>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
              Sign in to access your support dashboard
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>Professional customer support platform</span>
              <Zap className="w-4 h-4 text-indigo-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Beautiful form container */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 animate-slide-up">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                  </div>
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`
                      block w-full pl-12 pr-4 py-4 border-2 rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 text-lg
                      bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
                      focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-500
                      transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-lg
                      ${errors.email 
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-200/50' 
                        : 'border-gray-200 dark:border-gray-600'
                      }
                    `}
                    placeholder="Enter your email address"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <PasswordField
                  value={password}
                  onChange={(value) => {
                    setPassword(value);
                    setValue('password', value);
                  }}
                  placeholder="Enter your password"
                  label="Password"
                  required
                  error={errors.password?.message}
                />
                <input type="hidden" {...register('password')} />
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Account Type
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
                  </div>
                  <select
                    {...register('role')}
                    id="role"
                    className={`
                      block w-full pl-12 pr-4 py-4 border-2 rounded-2xl text-gray-900 dark:text-gray-100 text-lg
                      bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
                      focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-500
                      transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-lg
                      ${errors.role 
                        ? 'border-red-300 dark:border-red-600 focus:ring-red-200/50' 
                        : 'border-gray-200 dark:border-gray-600'
                      }
                    `}
                  >
                    <option value="">Select account type</option>
                    <option value="customer">Customer</option>
                    <option value="staff">Staff Member</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down flex items-center space-x-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    <span>{errors.role.message}</span>
                  </p>
                )}
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                  <LogIn className="h-6 w-6 text-white/80 group-hover:text-white group-hover:animate-pulse transition-all duration-300" />
                </span>
                <div className="flex items-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing you in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
                {isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/50 to-purple-500/50 animate-pulse"></div>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 relative group"
                >
                  Create Account
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Professional customer support platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};