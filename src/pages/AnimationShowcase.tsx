import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Heart, 
  Star, 
  RefreshCw,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { AnimatedTicketCard } from '../components/tickets/AnimatedTicketCard';
import { SwipeableTicketCard } from '../components/tickets/SwipeableTicketCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { Ticket } from '../types';

// Mock ticket data
const mockTicket: Ticket = {
  id: 'DEMO-001',
  subject: 'Animation Demo Ticket',
  description: 'This is a demo ticket to showcase the new animation features including flip effects, hover interactions, and gesture controls.',
  status: 'open',
  priority: 'high',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customerId: '1',
  categoryId: '1',
  customer: {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com'
  },
  category: {
    id: '1',
    name: 'Technical Support'
  },
  _count: {
    messages: 3
  }
};

export const AnimationShowcase: React.FC = () => {
  const [showSkeletons, setShowSkeletons] = useState(false);
  const [cardDemo, setCardDemo] = useState<'animated' | 'swipeable'>('animated');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-800 p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.div
            className="inline-flex items-center space-x-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Animation Showcase
            </h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-8 h-8 text-blue-500" />
            </motion.div>
          </motion.div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Experience the power of Framer Motion animations and micro-interactions
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants} className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSkeletons(!showSkeletons)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            {showSkeletons ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{showSkeletons ? 'Hide' : 'Show'} Loading Skeletons</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCardDemo(cardDemo === 'animated' ? 'swipeable' : 'animated')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Switch to {cardDemo === 'animated' ? 'Swipeable' : 'Animated'} Cards</span>
          </motion.button>
        </motion.div>

        {/* Page Transition Demo */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <span>Page Transitions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Marketplace', 'Leaderboard', 'Tickets'].map((page, index) => (
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 50, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "tween",
                  ease: "anticipate",
                  duration: 0.4 
                }}
                className="p-6 bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {page} Animation
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smooth {page.toLowerCase()} page transition with unique entry effects
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Card Animations */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500" />
            <span>{cardDemo === 'animated' ? 'Animated' : 'Swipeable'} Ticket Cards</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cardDemo === 'animated' ? (
              <AnimatedTicketCard
                ticket={mockTicket}
                onClick={() => console.log('Card clicked')}
                onEdit={() => console.log('Edit clicked')}
                onDelete={() => console.log('Delete clicked')}
              />
            ) : (
              <SwipeableTicketCard
                ticket={mockTicket}
                onClick={() => console.log('Card clicked')}
                onEdit={() => console.log('Edit clicked')}
                onDelete={() => console.log('Delete clicked')}
                onArchive={() => console.log('Archive clicked')}
              />
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Features:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {cardDemo === 'animated' ? (
                  <>
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Hover to reveal action buttons</span>
                    </motion.li>
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Click eye icon to flip and see details</span>
                    </motion.li>
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>3D hover effects with mouse tracking</span>
                    </motion.li>
                  </>
                ) : (
                  <>
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Swipe left to reveal delete actions</span>
                    </motion.li>
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Swipe right to reveal edit actions</span>
                    </motion.li>
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Velocity-based gesture recognition</span>
                    </motion.li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Loading Skeletons */}
        {showSkeletons && (
          <motion.section 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
              <span>Loading Skeletons with Shimmer</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Card Skeletons</h3>
                <LoadingSkeleton variant="card" count={2} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">List Skeletons</h3>
                <LoadingSkeleton variant="list" count={3} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Marketplace Skeleton</h3>
                <LoadingSkeleton variant="marketplace" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Table Skeleton</h3>
                <LoadingSkeleton variant="table" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Chart Skeleton</h3>
                <LoadingSkeleton variant="chart" />
              </div>
            </div>
          </motion.section>
        )}

        {/* Micro-interactions Demo */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Micro-interactions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Heart, color: 'text-red-500', name: 'Like' },
              { icon: Star, color: 'text-yellow-500', name: 'Favorite' },
              { icon: Zap, color: 'text-blue-500', name: 'Quick' },
              { icon: Sparkles, color: 'text-purple-500', name: 'Magic' }
            ].map((item, index) => (
              <motion.button
                key={item.name}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.3 }
                }}
                whileTap={{ 
                  scale: 0.9,
                  rotate: -5
                }}
                className="p-6 bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 text-center space-y-2 hover:shadow-xl transition-shadow"
              >
                <item.icon className={`w-8 h-8 ${item.color} mx-auto`} />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Animation Tips */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Performance Tips
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-dark-800 dark:to-dark-700 rounded-2xl p-6 border border-blue-200 dark:border-dark-600">
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>GPU Acceleration:</strong> All animations use transform3d for hardware acceleration</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Spring Physics:</strong> Natural feeling animations with spring physics</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Gesture Recognition:</strong> Velocity-based interactions for intuitive UX</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Staggered Animations:</strong> Sequential reveals for better perceived performance</span>
              </li>
            </ul>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};