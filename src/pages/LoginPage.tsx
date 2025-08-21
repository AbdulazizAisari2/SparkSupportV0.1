import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, LogIn, Mail, ArrowRight, Star, Zap, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SimpleThemeToggle } from '../components/ui/SimpleThemeToggle';
import { PasswordField } from '../components/auth/PasswordField';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
    
    // Auto-determine role based on email
    const allUsers = [
      { email: 'customer@example.com', role: 'customer' },
      { email: 'staff1@example.com', role: 'staff' },
      { email: 'staff2@example.com', role: 'staff' },
      { email: 'admin@example.com', role: 'admin' }
    ];
    
    const userRole = allUsers.find(u => u.email === data.email)?.role || 'customer';
    const loginData = { ...data, role: userRole };
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
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
    <div className="h-screen relative overflow-hidden flex items-center justify-center">
      {/* Live Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-cyan-400 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 animate-gradient-xy"></div>
      
      {/* Secondary animated gradient layer */}
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

      {/* Floating elements */}
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

      {/* Logo in top left */}
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
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
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
            Welcome Back
          </h2>
          <p className="text-white/80 text-sm">
            Sign in to access your support dashboard
          </p>
        </div>

          {/* Perfect form container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                  {/* Enhanced Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-bold text-white flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-white/80" />
                      <span>Email Address</span>
                    </label>
                    <div className="relative group">
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
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-white/5 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
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
                    placeholder="Enter your password"
                    label="Password"
                    required
                    error={errors.password?.message}
                  />
                  <input type="hidden" {...register('password')} />
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
                        <span>Signing you in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 group-hover:animate-pulse transition-all duration-300" />
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                </button>
              </form>



              {/* Beautiful demo credentials */}
              <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Sparkles className="w-3 h-3 text-white/80 animate-pulse" />
                    <span className="text-xs font-bold text-white">Demo Accounts</span>
                    <Heart className="w-3 h-3 text-pink-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <div className="text-xs text-white/80 space-y-1">
                    <div><strong>Customer:</strong> customer@example.com • Customer123!</div>
                    <div><strong>Staff:</strong> staff1@example.com • Staff123!</div>
                    <div><strong>Admin:</strong> admin@example.com • Admin123!</div>
                  </div>
                </div>
              </div>

              {/* Enhanced sign up link */}
              <div className="mt-4 text-center">
                <p className="text-white/80 text-sm">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-bold text-white hover:text-white/80 transition-all duration-300 relative group"
                  >
                    Create Account
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