import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, UserPlus, User, Mail, Phone, Shield, CheckCircle } from 'lucide-react';
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
  role: z.enum(['customer', 'staff'], {
    required_error: 'Please select a role',
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const roleOptions = [
  {
    value: 'customer',
    label: 'Customer Account',
    description: 'Submit tickets, track progress, and get support',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    features: ['Submit Support Tickets', 'Track Ticket Progress', 'Real-time Updates', 'Priority Support']
  },
  {
    value: 'staff',
    label: 'Staff Account',
    description: 'Manage tickets, assist customers, and access tools',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    features: ['Manage All Tickets', 'Staff Dashboard', 'Internal Notes', 'Team Collaboration']
  }
];

export const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
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
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      const result = await response.json();
      signup(result.token, result.user);
      
      addToast(`🎉 Welcome ${result.user.name}! Your account has been created successfully.`, 'success');
      
      // Redirect based on role
      switch (result.user.role) {
        case 'customer':
          navigate('/my/tickets');
          break;
        case 'staff':
          navigate('/staff/tickets');
          break;
        default:
          navigate('/');
      }
    } catch {
      addToast(error instanceof Error ? error.message : 'Signup failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setValue('role', role as "customer" | "staff" | "admin");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-purple-950"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 right-1/3 w-72 h-72 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-20">
        <SimpleThemeToggle />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center animate-fade-in mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-primary-600 rounded-2xl blur opacity-75 animate-glow"></div>
                <div className="relative bg-white dark:bg-dark-800 p-4 rounded-2xl shadow-xl">
                  <MessageSquare className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-primary-800 dark:from-purple-400 dark:to-primary-300 bg-clip-text text-transparent mb-2">
              Join SparkSupport
            </h1>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get started with our premium support experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Account Type Selection */}
            <div className="animate-slide-up">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Choose Account Type
              </h3>
              <div className="space-y-4">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedRole === option.value;
                  
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleRoleSelect(option.value)}
                      className={`
                        relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 group
                        ${isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`
                          p-3 rounded-xl bg-gradient-to-r ${option.color} text-white shadow-lg
                          ${isSelected ? 'animate-bounce-gentle' : ''}
                        `}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {option.label}
                            </h4>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 animate-scale-in" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {option.description}
                          </p>
                          <ul className="mt-3 space-y-1">
                            {option.features.map((feature, index) => (
                              <li key={index} className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                                <div className="w-1 h-1 bg-primary-500 rounded-full mr-2"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registration Form */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-dark-700/50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Account Details
                </h3>
                
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      </div>
                      <input
                        {...register('name')}
                        id="name"
                        type="text"
                        autoComplete="name"
                        className={`
                          block w-full pl-10 pr-4 py-3 border-2 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100
                          bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70
                          ${errors.name 
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                            : 'border-gray-200 dark:border-dark-600'
                          }
                        `}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down">{errors.name.message}</p>
                    )}
                  </div>

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
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Phone Number <span className="text-gray-500 dark:text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                      </div>
                      <input
                        {...register('phone')}
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Hidden Role Field */}
                  <input type="hidden" {...register('role')} value={selectedRole} />
                  {errors.role && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down">{errors.role.message}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !selectedRole}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-primary-700 hover:from-purple-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <UserPlus className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" />
                    </span>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                {/* Sign in link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200 relative group"
                    >
                      Sign in here
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 group-hover:w-full transition-all duration-200"></span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Secure Registration • Privacy Protected • GDPR Compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};