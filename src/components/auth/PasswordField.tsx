import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
  label: string;
}

const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One uppercase letter');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One lowercase letter');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('One number');
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One special character');
  }

  let color = '';
  let label = '';

  switch (score) {
    case 0:
    case 1:
      color = 'text-red-600 dark:text-red-400';
      label = 'Very Weak';
      break;
    case 2:
      color = 'text-orange-600 dark:text-orange-400';
      label = 'Weak';
      break;
    case 3:
      color = 'text-yellow-600 dark:text-yellow-400';
      label = 'Fair';
      break;
    case 4:
      color = 'text-blue-600 dark:text-blue-400';
      label = 'Good';
      break;
    case 5:
      color = 'text-green-600 dark:text-green-400';
      label = 'Strong';
      break;
    default:
      color = 'text-gray-600 dark:text-gray-400';
      label = 'Unknown';
  }

  return { score, feedback, color, label };
};

export const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  placeholder = 'Enter your password',
  showStrength = false,
  error,
  label = 'Password',
  required = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const strength = checkPasswordStrength(value);
  const showStrengthIndicator = showStrength && (isFocused || value.length > 0);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
        </div>
        
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            block w-full pl-10 pr-12 py-3 border-2 rounded-xl placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100
            bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70
            ${error 
              ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
              : 'border-gray-200 dark:border-dark-600'
            }
          `}
          placeholder={placeholder}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {showStrengthIndicator && (
        <div className="animate-slide-down">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex-1 bg-gray-200 dark:bg-dark-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength.score === 0 ? 'w-0' :
                  strength.score === 1 ? 'w-1/5 bg-red-500' :
                  strength.score === 2 ? 'w-2/5 bg-orange-500' :
                  strength.score === 3 ? 'w-3/5 bg-yellow-500' :
                  strength.score === 4 ? 'w-4/5 bg-blue-500' :
                  'w-full bg-green-500'
                }`}
              />
            </div>
            <span className={`text-xs font-semibold ${strength.color}`}>
              {strength.label}
            </span>
          </div>
          
          {strength.feedback.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">Password must include:</p>
              <ul className="space-y-1">
                {strength.feedback.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2 text-xs">
                    <X className="w-3 h-3 text-red-500 dark:text-red-400" />
                    <span className="text-gray-600 dark:text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {strength.score === 5 && (
            <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
              <Check className="w-3 h-3" />
              <span>Password meets all requirements!</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down">{error}</p>
      )}
    </div>
  );
};