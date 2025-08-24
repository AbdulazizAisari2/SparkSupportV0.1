import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Users, 
  Shield, 
  CheckCircle, 
  Heart,
  Award,
  CalendarDays
} from 'lucide-react';
import { StarRating } from './StarRating';

interface SurveyResultsProps {
  surveyData?: {
    overallRating: number;
    responseTime: number;
    helpfulness: number;
    professionalism: number;
    resolutionQuality: number;
    submittedAt: string;
    customerName?: string;
  };
  isVisible?: boolean;
}

export const SurveyResults: React.FC<SurveyResultsProps> = ({ 
  surveyData, 
  isVisible = true 
}) => {
  if (!surveyData || !isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Survey Data Yet</h3>
          <p className="text-sm">Customer satisfaction survey will appear here once submitted</p>
        </div>
      </motion.div>
    );
  }

  const categories = [
    {
      label: 'Overall Experience',
      icon: Star,
      rating: surveyData.overallRating,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      label: 'Response Time',
      icon: Clock,
      rating: surveyData.responseTime,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Staff Helpfulness',
      icon: Users,
      rating: surveyData.helpfulness,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Professionalism',
      icon: Shield,
      rating: surveyData.professionalism,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      label: 'Solution Quality',
      icon: CheckCircle,
      rating: surveyData.resolutionQuality,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const averageRating = categories.reduce((sum, cat) => sum + cat.rating, 0) / categories.length;
  
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
    if (rating >= 4) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400';
    if (rating >= 2) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRatingMessage = (rating: number) => {
    if (rating >= 4.5) return { message: 'Excellent!', emoji: '🌟' };
    if (rating >= 4) return { message: 'Very Good', emoji: '👏' };
    if (rating >= 3) return { message: 'Good', emoji: '👍' };
    if (rating >= 2) return { message: 'Fair', emoji: '👌' };
    return { message: 'Needs Improvement', emoji: '💪' };
  };

  const ratingInfo = getRatingMessage(averageRating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 overflow-hidden"
    >
      {          /* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Customer Satisfaction Survey</h3>
                  <div className="flex items-center space-x-3 text-white/90 text-sm">
                    <div className="flex items-center space-x-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>{new Date(surveyData.submittedAt).toLocaleDateString()}</span>
                    </div>
                    {surveyData.customerName && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{surveyData.customerName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-3xl font-bold text-white">
                    {averageRating.toFixed(1)}
                  </span>
                  <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
                </div>
                <div className="flex items-center justify-end space-x-2 text-white/90 text-sm">
                  <span className="text-lg">{ratingInfo.emoji}</span>
                  <span className="font-medium">{ratingInfo.message}</span>
                </div>
              </div>
            </div>
          </div>

      {/* Ratings Grid */}
      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`${category.bgColor} rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${category.bgColor}`}>
                            <category.icon className={`w-5 h-5 ${category.color}`} />
                          </div>
                        </div>
                        <span className={`text-2xl font-bold ${getRatingColor(category.rating)}`}>
                          {category.rating}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {category.label}
                        </span>
                      </div>
                      
                      <StarRating
                        rating={category.rating}
                        onRatingChange={() => {}}
                        size="sm"
                        readonly
                        showValue={false}
                      />
                    </motion.div>
                  ))}
                </div>

        {/* Performance Indicator */}
        {averageRating >= 4.5 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-5"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-full">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 text-base">
                  Outstanding Performance! 🎉
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  This customer had an exceptional experience with our support.
                </p>
              </div>
            </div>
          </motion.div>
        ) : averageRating < 3 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 rounded-xl p-5"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-full">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 dark:text-orange-200 text-base">
                  Room for Improvement 💪
                </h4>
                <p className="text-sm text-orange-600 dark:text-orange-300">
                  This feedback highlights areas where we can enhance our service quality.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};