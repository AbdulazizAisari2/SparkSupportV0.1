import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, UserPlus, User, Mail, Phone, ArrowRight, Star, Zap, Sparkles, Heart, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SimpleThemeToggle } from '../components/ui/SimpleThemeToggle';
import { PasswordField } from '../components/auth/PasswordField';
import { useSignup } from '../hooks/useApi';

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
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const result = await signupMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone
      });

      signup(result.accessToken, result.refreshToken, result.user);
      
      addToast(`🎉 Welcome ${result.user.name}! Your account has been created successfully.`, 'success');
      navigate('/my/tickets');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Signup failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 dark:bg-slate-900">
      {/* Epic Animated Background - Complementary to login */}
      <div className="absolute inset-0">
                  {/* Base gradient with different colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"></div>
        
        {/* Animated gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-blue-500/30 to-purple-500/20 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-pink-400/10 via-purple-500/20 to-blue-500/30 animate-gradient-y" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/15 via-cyan-500/25 to-purple-400/15 animate-gradient-xy" style={{ animationDelay: '4s' }}></div>
        
        {/* Floating orbs with different colors */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 animate-float blur-xl"></div>
        <div className="absolute top-40 left-32 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-25 animate-float blur-lg" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-16 w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float blur-lg" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-15 animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-32 right-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-twinkle"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-purple-300 rounded-full opacity-80 animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-70 animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-300 rounded-full opacity-60 animate-twinkle" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-30">
        <SimpleThemeToggle />
      </div>

      {/* Enhanced Logo */}
      <div className="absolute top-6 left-6 z-30">
        <div className="group cursor-pointer">
          <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight drop-shadow-lg">SparkSupport</span>
              <div className="text-white/70 text-xs font-medium">Support System</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 animate-pulse transition-opacity duration-700"></div>
                
                {/* Main icon container */}
                <div className="relative bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/50 group-hover:scale-110 transition-transform duration-700">
                  <div className="bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-400 p-4 rounded-2xl shadow-inner">
                    <UserPlus className="w-12 h-12 text-white drop-shadow-2xl" />
                  </div>
                </div>
                
                {/* Floating particles */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-70 animate-float"></div>
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
            
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight drop-shadow-2xl">
              <span className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 dark:from-cyan-100 dark:via-purple-100 dark:to-pink-100 bg-clip-text text-transparent">
                Join SparkSupport
              </span>
            </h1>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white/95 mb-3 drop-shadow-lg">
              Create Your Account 🚀
            </h2>
            <p className="text-gray-700 dark:text-white/80 text-base font-medium drop-shadow-sm">
              Get started with our amazing support system
            </p>
          </div>

          {/* Enhanced Form Container */}
          <div className="relative group">
            {/* Outer glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            
            {/* Main form container */}
            <div className="relative bg-gradient-to-br from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-white/50 p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Enhanced Name Field */}
                <div className="space-y-3">
                                      <label htmlFor="name" className="block text-sm font-bold text-gray-800 dark:text-white flex items-center space-x-2 drop-shadow-sm">
                      <div className="p-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg shadow-lg">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span>Full Name</span>
                    </label>
                    <div className="relative group">
                      <input
                        {...register('name')}
                        id="name"
                        type="text"
                        autoComplete="name"
                        className={`
                          block w-full px-5 py-4 border-2 rounded-2xl text-gray-900 dark:text-white text-base font-medium 
                          placeholder-gray-500 dark:placeholder-white/60
                          bg-gradient-to-r from-white/70 to-white/60 dark:from-white/20 dark:to-white/15 
                          backdrop-blur-xl border-gray-300 dark:border-white/40
                          focus:outline-none focus:ring-4 focus:ring-cyan-400/30 focus:border-cyan-500 dark:focus:border-white/70
                          hover:bg-gradient-to-r hover:from-white/80 hover:to-white/70 dark:hover:from-white/25 dark:hover:to-white/20 
                          hover:border-cyan-400 dark:hover:border-white/50
                          transition-all duration-300 shadow-xl hover:shadow-2xl
                          ${errors.name ? 'border-red-500 dark:border-red-400/70 focus:ring-red-400/30' : ''}
                        `}
                        placeholder="Enter your full name"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {errors.name && (
                      <div className="bg-red-100 dark:bg-red-500/20 backdrop-blur-sm border border-red-300 dark:border-red-400/50 rounded-xl p-3 animate-slide-down">
                        <p className="text-red-700 dark:text-red-200 text-sm font-medium flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></div>
                          <span>{errors.name.message}</span>
                        </p>
                      </div>
                    )}
                </div>

                                 {/* Enhanced Email Field */}
                 <div className="space-y-3">
                   <label htmlFor="email" className="block text-sm font-bold text-gray-800 dark:text-white flex items-center space-x-2 drop-shadow-sm">
                    <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span>Email Address</span>
                  </label>
                  <div className="relative group">
                    <input
                      {...register('email')}
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`
                        block w-full px-5 py-4 border-2 rounded-2xl text-white text-base font-medium placeholder-white/60
                        bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-xl border-white/40
                        focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:border-white/70
                        hover:bg-gradient-to-r hover:from-white/25 hover:to-white/20 hover:border-white/50
                        transition-all duration-300 shadow-xl hover:shadow-2xl
                        ${errors.email ? 'border-red-400/70 focus:ring-red-400/30' : ''}
                      `}
                      placeholder="Enter your email address"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.email && (
                    <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-xl p-3 animate-slide-down">
                      <p className="text-red-200 text-sm font-medium flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span>{errors.email.message}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Enhanced Phone Field */}
                <div className="space-y-3">
                  <label htmlFor="phone" className="block text-sm font-bold text-white flex items-center space-x-2 drop-shadow-sm">
                    <div className="p-1.5 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg shadow-lg">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span>Phone Number <span className="text-white/60 font-normal">(optional)</span></span>
                  </label>
                  <div className="relative group">
                    <input
                      {...register('phone')}
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      className="block w-full px-5 py-4 border-2 rounded-2xl text-white text-base font-medium placeholder-white/60 bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-xl border-white/40 focus:outline-none focus:ring-4 focus:ring-pink-400/30 focus:border-white/70 hover:bg-gradient-to-r hover:from-white/25 hover:to-white/20 hover:border-white/50 transition-all duration-300 shadow-xl hover:shadow-2xl"
                      placeholder="Enter your phone number"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400/20 to-red-400/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Enhanced Password Field */}
                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-bold text-white flex items-center space-x-2 drop-shadow-sm">
                    <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                    <span>Password</span>
                  </label>
                  <div className="relative group">
                    <PasswordField
                      value={password}
                      onChange={(value) => {
                        setPassword(value);
                        setValue('password', value);
                      }}
                      placeholder="Create a strong password"
                      required
                      showStrength
                      error={errors.password?.message}
                      className="block w-full px-5 py-4 border-2 rounded-2xl text-white text-base font-medium placeholder-white/60 bg-gradient-to-r from-white/20 to-white/15 backdrop-blur-xl border-white/40 focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-white/70 hover:bg-gradient-to-r hover:from-white/25 hover:to-white/20 hover:border-white/50 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    />
                    <input type="hidden" {...register('password')} />
                  </div>
                  {errors.password && (
                    <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-xl p-3 animate-slide-down">
                      <p className="text-red-200 text-sm font-medium flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span>{errors.password.message}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Spectacular Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="group relative w-full overflow-hidden focus:outline-none focus:ring-0 focus:ring-offset-0"
                  >
                    {/* Button background with animated gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-500/25"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Button content */}
                    <div className="relative flex justify-center items-center py-4 px-6 text-white font-bold text-lg tracking-wide transition-transform duration-300 group-hover:scale-105 disabled:group-hover:scale-100">
                      {signupMutation.isPending ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating your account...</span>
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <UserPlus className="w-6 h-6 group-hover:animate-pulse transition-all duration-300" />
                          <span>Create Account</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      )}
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>

                {/* Customer Account Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/30">
                  <div className="text-center">
                    <div className="text-blue-100 text-sm font-semibold mb-2 flex items-center justify-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Customer Account Registration</span>
                      <Zap className="w-4 h-4" />
                    </div>
                    <p className="text-blue-200/90 text-xs">
                      Creating a customer account gives you access to submit tickets, track progress, and communicate with our support team.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sign in link */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-xl">
              <p className="text-white/80 text-sm mb-2">Already have an account?</p>
              <Link
                to="/login"
                className="group inline-flex items-center space-x-2 text-white font-semibold hover:text-purple-200 transition-colors duration-300"
              >
                <span>Sign in here</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};