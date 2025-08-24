import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly?: boolean;
  showValue?: boolean;
  label?: string;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 'md',
  readonly = false,
  showValue = false,
  label,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeConfig = {
    sm: { size: 'w-4 h-4', text: 'text-sm', spacing: 'space-x-0.5' },
    md: { size: 'w-6 h-6', text: 'text-base', spacing: 'space-x-1' },
    lg: { size: 'w-8 h-8', text: 'text-lg', spacing: 'space-x-1.5' },
    xl: { size: 'w-10 h-10', text: 'text-xl', spacing: 'space-x-2' },
  };

  const config = sizeConfig[size];
  const currentRating = hoverRating || rating;

  const handleStarClick = (starRating: number) => {
    if (readonly) return;
    
    setIsAnimating(true);
    onRatingChange(starRating);
    
    // Reset animation state
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleStarHover = (starRating: number) => {
    if (readonly) return;
    setHoverRating(starRating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const getRatingText = (rating: number) => {
    const ratingTexts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratingTexts[rating as keyof typeof ratingTexts] || '';
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-red-500';
    if (rating <= 3) return 'text-yellow-500';
    if (rating <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex items-center space-x-3">
        <div 
          className={`flex items-center ${config.spacing}`}
          onMouseLeave={handleMouseLeave}
        >
          {[...Array(maxRating)].map((_, index) => {
            const starRating = index + 1;
            const isFilled = starRating <= currentRating;
            const isHovered = hoverRating >= starRating;
            
            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleStarClick(starRating)}
                onMouseEnter={() => handleStarHover(starRating)}
                disabled={readonly}
                className={`
                  relative transition-all duration-200 transform hover:scale-110 
                  ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded
                  ${isAnimating ? 'animate-bounce' : ''}
                `}
                whileHover={!readonly ? { scale: 1.1 } : {}}
                whileTap={!readonly ? { scale: 0.95 } : {}}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: index * 0.1
                }}
              >
                <Star
                  className={`
                    ${config.size} transition-all duration-200
                    ${isFilled 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                    }
                    ${isHovered && !readonly ? 'text-yellow-300 fill-yellow-300' : ''}
                  `}
                />
                
                {/* Glow effect for filled stars */}
                {isFilled && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {/* Hover sparkle effect */}
                <AnimatePresence>
                  {isHovered && !readonly && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Rating text and value */}
        <div className="flex items-center space-x-2">
          <AnimatePresence mode="wait">
            {(currentRating > 0 || rating > 0) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
              >
                {showValue && (
                  <span className={`font-bold ${config.text} ${getRatingColor(currentRating || rating)}`}>
                    {currentRating || rating}
                  </span>
                )}
                
                <span className={`${config.text} font-medium ${getRatingColor(currentRating || rating)}`}>
                  {getRatingText(currentRating || rating)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress bar under stars */}
      {!readonly && (
        <motion.div
          className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentRating || rating) / maxRating) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </div>
  );
};