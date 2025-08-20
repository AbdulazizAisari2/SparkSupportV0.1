import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['customer', 'staff', 'admin'], {
    required_error: 'Please select a role',
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Demo user credentials
const demoUsers = [
  { email: 'customer@example.com', role: 'customer', name: 'Ahmed' },
  { email: 'staff1@example.com', role: 'staff', name: 'Mohammed' },
  { email: 'staff2@example.com', role: 'staff', name: 'Sarah' },
  { email: 'admin@example.com', role: 'admin', name: 'Ahmed' },
];

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
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
      
      addToast('Successfully logged in!', 'success');
      
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
    // This is a simple demo - in a real app, you'd use form.setValue
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const roleSelect = document.getElementById('role') as HTMLSelectElement;
    
    if (emailInput) emailInput.value = demoUser.email;
    if (roleSelect) roleSelect.value = demoUser.role;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-12 h-12 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Support Desk</h1>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Customer Support Ticket System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className={`
                  relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:placeholder-gray-400 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 transition-colors duration-200
                  ${errors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
                `}
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                {...register('role')}
                id="role"
                className={`
                  relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 dark:text-gray-100 dark:placeholder-gray-400 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800 transition-colors duration-200
                  ${errors.role ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}
                `}
              >
                <option value="">Select Role</option>
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {(errors.email || errors.role) && (
            <div className="text-red-600 dark:text-red-400 text-sm space-y-1">
              {errors.email && <p>{errors.email.message}</p>}
              {errors.role && <p>{errors.role.message}</p>}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => fillDemoCredentials(user)}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {user.name}
                </button>
              ))}
            </div>
            
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              Click a demo account to fill credentials, then sign in
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};