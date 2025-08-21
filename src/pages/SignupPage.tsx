import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, UserPlus, User, Mail, Phone, ArrowRight, Star, Zap, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SimpleThemeToggle } from '../components/ui/SimpleThemeToggle';
import { PasswordField } from '../components/auth/PasswordField';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  phone: z.string().optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // Auto-set role to customer since signup is customer-only
      const signupData = { ...data, role: 'customer' };
      
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      const result = await response.json();
      signup(result.token, result.user);
      
      addToast(`🎉 Welcome ${result.user.name}! Your account has been created successfully.`, 'success');
      navigate('/my/tickets');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Signup failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stunning gradient background - matching login page */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 dark:from-gray-950 dark:via-indigo-950 dark:to-purple-950"></div>
      
      {/* Animated gradient orbs - matching login page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Floating sparkles - matching login page */}
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
          {/* Magnificent header - matching login page */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-glow transition-opacity duration-500"></div>
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-full shadow-2xl border border-white/50 dark:border-gray-700/50 group-hover:scale-110 transition-transform duration-500">
                  <MessageSquare className="w-16 h-16 text-transparent bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 bg-clip-text drop-shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-sm">
              SparkSupport
            </h1>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Join Our Platform
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
              Create your customer support account
            </p>
            <div className="flex items-center justify-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
              <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span>Professional customer support platform</span>
              <Zap className="w-4 h-4 text-indigo-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Stunning form container - matching login page */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>Full Name</span>
                  </label>
                  <div className="relative group">
                    <input
                      {...register('name')}
                      id="name"
                      type="text"
                      autoComplete="name"
                      className={`
                        block w-full px-4 py-4 border-2 rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 text-lg
                        bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
                        focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-500
                        transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-lg hover:scale-[1.02]
                        ${errors.name 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-200/50' 
                          : 'border-gray-200 dark:border-gray-600'
                        }
                      `}
                      placeholder="Enter your full name"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      <span>{errors.name.message}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span>Email Address</span>
                  </label>
                  <div className="relative group">
                    <input
                      {...register('email')}
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`
                        block w-full px-4 py-4 border-2 rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 text-lg
                        bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
                        focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-500
                        transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-lg hover:scale-[1.02]
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
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <PasswordField
                    value={password}
                    onChange={(value) => {
                      setPassword(value);
                      setValue('password', value);
                    }}
                    placeholder="Create a secure password"
                    label="Password"
                    required
                    showStrength
                    error={errors.password?.message}
                  />
                  <input type="hidden" {...register('password')} />
                </div>

                {/* Phone Field */}
                <div className="space-y-3">
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    <span>Phone Number <span className="text-gray-500 dark:text-gray-400 font-normal">(optional)</span></span>
                  </label>
                  <div className="relative group">
                    <input
                      {...register('phone')}
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      className={`
                        block w-full px-4 py-4 border-2 rounded-2xl placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 text-lg
                        bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm
                        focus:outline-none focus:ring-4 focus:ring-indigo-200/50 focus:border-indigo-500
                        transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-lg hover:scale-[1.02]
                        ${errors.phone 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-200/50' 
                          : 'border-gray-200 dark:border-gray-600'
                        }
                      `}
                      placeholder="Enter your phone number (optional)"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      <span>{errors.phone.message}</span>
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
                    <UserPlus className="h-6 w-6 text-white/80 group-hover:text-white group-hover:animate-pulse transition-all duration-300" />
                  </span>
                  <div className="flex items-center space-x-3">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating your account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                  {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/50 to-purple-500/50 animate-pulse"></div>
                  )}
                </button>
              </form>

              {/* Customer benefits info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-600/50">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-green-700 dark:text-green-300">Customer Benefits</span>
                    <Heart className="w-4 h-4 text-pink-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-xs text-green-600 dark:text-green-400">
                    <div>✨ Submit & track support tickets</div>
                    <div>⚡ Real-time updates and notifications</div>
                    <div>🎯 Priority support and expert help</div>
                  </div>
                </div>
              </div>

              {/* Enhanced login link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 relative group"
                  >
                    Sign In
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Professional customer support platform • Secure & Beautiful
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};