import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Users, 
  Shield, 
  CheckCircle, 
  Heart,
  TrendingUp,
  Award
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
        className="bg-gray-50 dark:bg-dark-700 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-600"
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No customer feedback yet</p>
          <p className="text-xs">Survey will appear when ticket is resolved</p>
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Customer Satisfaction</h3>
              <p className="text-blue-100 text-sm">
                Submitted {new Date(surveyData.submittedAt).toLocaleDateString()}
                {surveyData.customerName && ` by ${surveyData.customerName}`}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                {averageRating.toFixed(1)}
              </span>
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            </div>
            <div className="flex items-center space-x-1 text-white/90 text-sm">
              <span>{ratingInfo.emoji}</span>
              <span>{ratingInfo.message}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`${category.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-600`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <category.icon className={`w-4 h-4 ${category.color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.label}
                  </span>
                </div>
                <span className={`text-lg font-bold ${getRatingColor(category.rating)}`}>
                  {category.rating}
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
        {averageRating >= 4.5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-full">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">
                  Outstanding Performance! 🎉
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  This ticket received excellent ratings across all categories.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Improvement Suggestion */}
        {averageRating < 3.5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500 rounded-full">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Room for Improvement
                </h4>
                <p className="text-sm text-yellow-600 dark:text-yellow-300">
                  Consider reviewing this case to identify areas for enhancement.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};