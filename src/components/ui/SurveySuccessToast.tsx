import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, Sparkles, Trophy, Heart } from 'lucide-react';

interface SurveySuccessToastProps {
  isVisible: boolean;
  averageRating: number;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const SurveySuccessToast: React.FC<SurveySuccessToastProps> = ({
  isVisible,
  averageRating,
  onClose,
  autoClose = true,
  duration = 4000
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, onClose, autoClose, duration]);

  const getRatingMessage = (rating: number) => {
    if (rating >= 4.5) return { message: "Outstanding feedback! 🌟", color: "from-green-500 to-emerald-500" };
    if (rating >= 4) return { message: "Great experience! 👏", color: "from-blue-500 to-cyan-500" };
    if (rating >= 3) return { message: "Thanks for your feedback! 💪", color: "from-yellow-500 to-orange-500" };
    return { message: "We'll do better! 🚀", color: "from-purple-500 to-pink-500" };
  };

  const ratingInfo = getRatingMessage(averageRating);

  // Generate confetti particles
  const confettiParticles = Array.from({ length: 12 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 rounded-full"
      style={{
        backgroundColor: ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6'][i % 5],
        left: `${20 + (i * 5)}%`,
        top: '20%'
      }}
      initial={{ y: 0, x: 0, opacity: 1, scale: 0 }}
      animate={showConfetti ? {
        y: Math.random() * 200 + 100,
        x: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: [0, 1, 0],
        rotate: Math.random() * 360
      } : {}}
      transition={{
        duration: 2,
        delay: Math.random() * 0.5,
        ease: "easeOut"
      }}
    />
  ));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className={`
            relative overflow-hidden rounded-2xl shadow-2xl
            bg-gradient-to-br ${ratingInfo.color}
            border border-white/20 backdrop-blur-sm
          `}>
            {/* Confetti particles */}
            <div className="absolute inset-0 pointer-events-none">
              {confettiParticles}
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer" />

            <div className="relative p-6">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center"
                >
                  {averageRating >= 4 ? (
                    <Trophy className="w-6 h-6 text-white" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.h4
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg font-bold text-white mb-1"
                  >
                    Survey Completed!
                  </motion.h4>
                  
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/90 text-sm mb-3"
                  >
                    {ratingInfo.message}
                  </motion.p>

                  {/* Rating display */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center space-x-2"
                  >
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            delay: 0.6 + (i * 0.1), 
                            type: "spring", 
                            stiffness: 300 
                          }}
                        >
                          <Star 
                            className={`w-4 h-4 ${
                              i < Math.floor(averageRating) 
                                ? 'text-yellow-300 fill-yellow-300' 
                                : 'text-white/50'
                            }`} 
                          />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-white font-semibold text-sm">
                      {averageRating.toFixed(1)}
                    </span>
                  </motion.div>
                </div>

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className="flex-shrink-0 p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              {/* Bottom highlight */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
              />
            </div>

            {/* Floating hearts for high ratings */}
            {averageRating >= 4 && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${20 + (i * 30)}%`,
                      top: '60%'
                    }}
                    initial={{ y: 0, opacity: 0, scale: 0 }}
                    animate={{
                      y: -60,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0.8]
                    }}
                    transition={{
                      duration: 3,
                      delay: 1 + (i * 0.5),
                      ease: "easeOut"
                    }}
                  >
                    <Heart className="w-3 h-3 text-pink-300 fill-pink-300" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};