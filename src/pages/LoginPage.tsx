import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, LogIn, Mail, ArrowRight, Star, Zap, Sparkles, Heart, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SimpleThemeToggle } from '../components/ui/SimpleThemeToggle';
import { PasswordField } from '../components/auth/PasswordField';
import { useLogin } from '../hooks/useApi';
import { useSmartNavigation } from '../hooks/useNavigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { navigateTo, getDashboardPath } = useSmartNavigation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Form submission data:', data);
    
    try {
      const result = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password
      });

      console.log('Login successful:', result);
      
      // Handle case where result might be null (empty response)
      if (!result) {
        throw new Error('Empty response from server');
      }

      if (!result.accessToken || !result.user) {
        throw new Error('Invalid login response: missing required data');
      }

      login(result.accessToken, result.refreshToken, result.user);
      
      addToast(`Welcome back, ${result.user.name}! 🎉`, 'success');
      
      // Navigate to role-appropriate dashboard
      const dashboardPath = result.user.role === 'customer' ? '/my/tickets'
        : result.user.role === 'staff' ? '/staff/tickets'
        : '/admin/categories';
        
      navigateTo(dashboardPath, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Please check your credentials';
      if (error instanceof Error) {
        if (error.message.includes('Too many requests')) {
          errorMessage = 'Server is busy, but we\'re automatically retrying. Please wait a moment...';
        } else {
          errorMessage = error.message;
        }
      }
      
      addToast(`Login failed: ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:bg-slate-900">
      {/* Epic Animated Background */}
      <div className="absolute inset-0">
                  {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900"></div>
        
        {/* Animated gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/30 to-cyan-500/20 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-400/10 via-red-500/20 to-pink-500/30 animate-gradient-y" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 via-purple-500/25 to-teal-400/15 animate-gradient-xy" style={{ animationDelay: '4s' }}></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-25 animate-float blur-lg" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-float blur-lg" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-15 animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-32 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-twinkle"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-300 rounded-full opacity-80 animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-70 animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-yellow-300 rounded-full opacity-60 animate-twinkle" style={{ animationDelay: '3s' }}></div>
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
            </div>
            <div>
              <span className="text-gray-800 dark:text-white font-bold text-lg tracking-tight drop-shadow-lg">SparkSupport</span>
              <div className="text-gray-600 dark:text-white/70 text-xs font-medium">Support System</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 animate-pulse transition-opacity duration-700"></div>
                
                {/* Main icon container */}
                <div className="relative bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/50 group-hover:scale-110 transition-transform duration-700">
                  <div className="bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 p-4 rounded-2xl shadow-inner">
                    <MessageSquare className="w-12 h-12 text-white drop-shadow-2xl" />
                  </div>
                </div>
                
                {/* Floating particles */}
                <div className="absolute -top-2 -left-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70 animate-float"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
            
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight drop-shadow-2xl">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-white dark:via-purple-100 dark:to-cyan-100 bg-clip-text text-transparent">
                SparkSupport
              </span>
            </h1>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white/95 mb-3 drop-shadow-lg">
              Welcome Back! 👋
            </h2>
            <p className="text-gray-700 dark:text-white/80 text-base font-medium drop-shadow-sm">
              Sign in to access your support dashboard
            </p>
          </div>

          {/* Enhanced Form Container */}
          <div className="relative group">
            {/* Outer glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            
            {/* Main form container */}
            <div className="relative bg-gradient-to-br from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-white/50 p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Enhanced Email Field */}
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-800 dark:text-white flex items-center space-x-2 drop-shadow-sm">
                    <div className="p-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg">
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
                        block w-full px-5 py-4 border-2 rounded-2xl 
                        text-gray-900 dark:text-white text-base font-medium 
                        placeholder-gray-500 dark:placeholder-white/60
                        bg-gradient-to-r from-white/90 to-white/85 dark:from-white/20 dark:to-white/15 
                        backdrop-blur-xl border-gray-300 dark:border-white/40
                        focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:border-purple-500 dark:focus:border-white/70
                        hover:bg-gradient-to-r hover:from-white/95 hover:to-white/90 dark:hover:from-white/25 dark:hover:to-white/20 
                        hover:border-purple-400 dark:hover:border-white/50
                        transition-all duration-300 shadow-xl hover:shadow-2xl
                        ${errors.email ? 'border-red-500 dark:border-red-400/70 focus:ring-red-400/30' : ''}
                      `}
                      placeholder="Enter your email address"
                    />
                    {/* Input highlight effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.email && (
                    <div className="bg-red-100 dark:bg-red-500/20 backdrop-blur-sm border border-red-300 dark:border-red-400/50 rounded-xl p-3 animate-slide-down">
                      <p className="text-red-700 dark:text-red-200 text-sm font-medium flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></div>
                        <span>{errors.email.message}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Enhanced Password Field */}
                <div className="space-y-3">
                  <label htmlFor="password" className="block text-sm font-bold text-gray-800 dark:text-white flex items-center space-x-2 drop-shadow-sm">
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
                      placeholder="Enter your password"
                      required
                      error={errors.password?.message}
                      className="
                        block w-full px-5 py-4 border-2 rounded-2xl 
                        text-gray-900 dark:text-white text-base font-medium 
                        placeholder-gray-500 dark:placeholder-white/60
                        bg-gradient-to-r from-white/90 to-white/85 dark:from-white/20 dark:to-white/15 
                        backdrop-blur-xl border-gray-300 dark:border-white/40
                        focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-500 dark:focus:border-white/70
                        hover:bg-gradient-to-r hover:from-white/95 hover:to-white/90 dark:hover:from-white/25 dark:hover:to-white/20 
                        hover:border-blue-400 dark:hover:border-white/50
                        transition-all duration-300 shadow-xl hover:shadow-2xl
                      "
                    />
                    <input type="hidden" {...register('password')} />
                  </div>
                  {errors.password && (
                    <div className="bg-red-100 dark:bg-red-500/20 backdrop-blur-sm border border-red-300 dark:border-red-400/50 rounded-xl p-3 animate-slide-down">
                      <p className="text-red-700 dark:text-red-200 text-sm font-medium flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></div>
                        <span>{errors.password.message}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Spectacular Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="
                      group relative w-full overflow-hidden 
                      rounded-2xl bg-transparent
                      focus:outline-none focus:ring-0 focus:ring-offset-0 
                      outline-none border-none
                    "
                    style={{ 
                      outline: 'none', 
                      border: 'none',
                      background: 'transparent',
                      boxShadow: 'none'
                    }}
                  >
                    {/* Button background with animated gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/25"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Button content */}
                    <div className="relative flex justify-center items-center py-4 px-6 text-white font-bold text-lg tracking-wide transition-transform duration-300 group-hover:scale-105 disabled:group-hover:scale-100">
                      {loginMutation.isPending ? (
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Signing you in...</span>
                          <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <LogIn className="w-6 h-6 group-hover:animate-pulse transition-all duration-300" />
                          <span>Sign In to SparkSupport</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      )}
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
                  </button>
                </div>

                                 {/* Demo Accounts Info */}
                 <div className="mt-6 p-4 bg-gradient-to-r from-emerald-100/70 to-teal-100/70 dark:from-emerald-500/20 dark:to-teal-500/20 backdrop-blur-sm rounded-2xl border border-emerald-300 dark:border-emerald-400/30">
                   <div className="text-center">
                     <div className="text-emerald-700 dark:text-emerald-100 text-sm font-semibold mb-3 flex items-center justify-center space-x-2">
                       <Star className="w-4 h-4" />
                       <span>Live Demo Accounts</span>
                       <Star className="w-4 h-4" />
                     </div>
                     <div className="text-emerald-600 dark:text-emerald-200/90 text-xs space-y-2">
                       {/* Customer Account */}
                       <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-lg p-2">
                         <div className="font-semibold text-emerald-700 dark:text-emerald-200 mb-1">👤 Customer</div>
                         <div><span className="font-mono bg-emerald-200 dark:bg-emerald-900/30 px-2 py-1 rounded">test@customer.com</span> / <span className="font-mono bg-emerald-200 dark:bg-emerald-900/30 px-2 py-1 rounded">password</span></div>
                       </div>
                       
                       {/* Staff Account */}
                       <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-lg p-2">
                         <div className="font-semibold text-blue-700 dark:text-blue-200 mb-1">👨‍💼 Staff</div>
                         <div><span className="font-mono bg-blue-200 dark:bg-blue-900/30 px-2 py-1 rounded">staff1@example.com</span> / <span className="font-mono bg-blue-200 dark:bg-blue-900/30 px-2 py-1 rounded">password</span></div>
                         <div className="text-xs text-blue-600 dark:text-blue-300 mt-1">Mohammed • 2,860 pts • Level 6</div>
                       </div>
                       
                       {/* Admin Account */}
                       <div className="bg-purple-50/50 dark:bg-purple-900/20 rounded-lg p-2">
                         <div className="font-semibold text-purple-700 dark:text-purple-200 mb-1">👨‍💻 Administrator</div>
                         <div><span className="font-mono bg-purple-200 dark:bg-purple-900/30 px-2 py-1 rounded">admin@example.com</span> / <span className="font-mono bg-purple-200 dark:bg-purple-900/30 px-2 py-1 rounded">password</span></div>
                         <div className="text-xs text-purple-600 dark:text-purple-300 mt-1">Abdulaziz • 1,780 pts • Level 5</div>
                       </div>
                     </div>
                   </div>
                 </div>
              </form>
            </div>
          </div>

                     {/* Sign up link */}
           <div className="mt-8 text-center">
             <div className="bg-gradient-to-r from-white/80 to-white/70 dark:from-white/20 dark:to-white/10 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/30 p-4 shadow-xl">
               <p className="text-gray-700 dark:text-white/80 text-sm mb-2">New to SparkSupport?</p>
               <Link
                 to="/signup"
                 className="group inline-flex items-center space-x-2 text-purple-600 dark:text-white font-semibold hover:text-purple-700 dark:hover:text-cyan-200 transition-colors duration-300"
               >
                 <span>Create your account</span>
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
               </Link>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};