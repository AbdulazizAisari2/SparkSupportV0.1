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
    <div className="h-screen relative overflow-hidden flex items-center justify-center">
      {/* Live Animated Gradient Background - matching login */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 animate-gradient-xy"></div>
      
      {/* Secondary animated gradient layer - matching login */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-pink-400/40 via-transparent to-blue-400/40 animate-gradient-y opacity-70"
          style={{ animationDuration: '8s' }}
        ></div>
        <div 
          className="absolute inset-0 bg-gradient-to-bl from-yellow-400/30 via-transparent to-purple-400/30 animate-gradient-x opacity-60"
          style={{ animationDuration: '12s' }}
        ></div>
      </div>

      {/* Floating elements - matching login */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-3 h-3 bg-white/30 rounded-full animate-float opacity-70"></div>
        <div className="absolute top-32 right-24 w-2 h-2 bg-white/40 rounded-full animate-float opacity-50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-white/25 rounded-full animate-float opacity-60" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-white/35 rounded-full animate-float opacity-80" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-ping opacity-90" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <SimpleThemeToggle />
      </div>

      {/* Logo in top left - matching login */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center space-x-2 px-3 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
          <div className="w-6 h-6 bg-gradient-to-br from-white to-white/80 rounded-full flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-white font-bold text-sm">SparkSupport</span>
        </div>
      </div>

      {/* Main content - no scroll design */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Compact header for no-scroll */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/20 to-white/30 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-glow transition-opacity duration-500"></div>
              <div className="relative bg-white/20 backdrop-blur-xl p-4 rounded-full shadow-2xl border border-white/30 group-hover:scale-110 transition-transform duration-500">
                <MessageSquare className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
            SparkSupport
          </h1>
          <h2 className="text-xl font-bold text-white/90 mb-2">
            Join Our Platform
          </h2>
          <p className="text-white/80 text-sm">
            Create your customer support account
          </p>
        </div>

          {/* Perfect form container - matching login page */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-bold text-white flex items-center space-x-2">
                    <User className="w-4 h-4 text-white/80" />
                    <span>Full Name</span>
                  </label>
                  <input
                    {...register('name')}
                    id="name"
                    type="text"
                    autoComplete="name"
                    className={`
                      block w-full px-4 py-3 border-2 rounded-xl placeholder-white/60 text-white text-base
                      bg-white/20 backdrop-blur-sm border-white/30
                      focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60
                      transition-all duration-300 hover:bg-white/30 hover:shadow-lg
                      ${errors.name ? 'border-red-300 focus:ring-red-400/50' : ''}
                    `}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-200 animate-slide-down flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse"></div>
                      <span>{errors.name.message}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-white flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-white/80" />
                    <span>Email Address</span>
                  </label>
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`
                      block w-full px-4 py-3 border-2 rounded-xl placeholder-white/60 text-white text-base
                      bg-white/20 backdrop-blur-sm border-white/30
                      focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60
                      transition-all duration-300 hover:bg-white/30 hover:shadow-lg
                      ${errors.email ? 'border-red-300 focus:ring-red-400/50' : ''}
                    `}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-200 animate-slide-down flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse"></div>
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
                    placeholder="Create a secure password"
                    label="Password"
                    required
                    showStrength
                    error={errors.password?.message}
                  />
                  <input type="hidden" {...register('password')} />
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-bold text-white flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-white/80" />
                    <span>Phone <span className="text-white/60 font-normal">(optional)</span></span>
                  </label>
                  <input
                    {...register('phone')}
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className={`
                      block w-full px-4 py-3 border-2 rounded-xl placeholder-white/60 text-white text-base
                      bg-white/20 backdrop-blur-sm border-white/30
                      focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/60
                      transition-all duration-300 hover:bg-white/30 hover:shadow-lg
                      ${errors.phone ? 'border-red-300 focus:ring-red-400/50' : ''}
                    `}
                    placeholder="Enter your phone number (optional)"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-200 animate-slide-down flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-300 rounded-full animate-pulse"></div>
                      <span>{errors.phone.message}</span>
                    </p>
                  )}
                </div>

                {/* Spectacular Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center items-center py-3 px-6 border border-transparent text-base font-bold rounded-xl text-indigo-600 bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:hover:scale-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                        <span>Creating your account...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 group-hover:animate-pulse transition-all duration-300" />
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Customer benefits info */}
              <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="w-3 h-3 text-white/80 animate-pulse" />
                    <span className="text-xs font-bold text-white">What You Get</span>
                    <Heart className="w-3 h-3 text-pink-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <div className="text-xs text-white/80 space-y-1">
                    <div>✨ Submit & track support tickets</div>
                    <div>⚡ Real-time updates and notifications</div>
                    <div>🎯 Priority support and expert help</div>
                  </div>
                </div>
              </div>

              {/* Enhanced login link */}
              <div className="mt-4 text-center">
                <p className="text-white/80 text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-white hover:text-white/80 transition-all duration-300 relative group"
                  >
                    Sign In
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
  );
};