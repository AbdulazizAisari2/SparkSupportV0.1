import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'profile' | 'table' | 'chart' | 'marketplace';
  count?: number;
  className?: string;
}

// Shimmer animation
const shimmerVariants = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      x: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear'
      }
    }
  }
};

const pulseVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

const SkeletonBox: React.FC<{ 
  width?: string; 
  height?: string; 
  className?: string; 
  rounded?: string;
}> = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '', 
  rounded = 'rounded-md' 
}) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-dark-700 ${width} ${height} ${rounded} ${className}`}>
    <motion.div
      variants={shimmerVariants}
      animate="animate"
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-500/20 to-transparent"
    />
  </div>
);

// Card Skeleton
const CardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-6 space-y-4"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-3 flex-1">
        <div className="flex items-center space-x-2">
          <SkeletonBox width="w-16" height="h-3" />
          <SkeletonBox width="w-12" height="h-5" rounded="rounded-full" />
        </div>
        <SkeletonBox width="w-3/4" height="h-6" />
      </div>
      <SkeletonBox width="w-8" height="h-8" rounded="rounded-full" />
    </div>
    
    <SkeletonBox width="w-full" height="h-16" />
    
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <SkeletonBox width="w-3" height="h-3" rounded="rounded-full" />
          <SkeletonBox width="w-16" height="h-3" />
        </div>
        <div className="flex items-center space-x-2">
          <SkeletonBox width="w-3" height="h-3" rounded="rounded-full" />
          <SkeletonBox width="w-8" height="h-3" />
        </div>
      </div>
      <SkeletonBox width="w-20" height="h-3" />
    </div>
  </motion.div>
);

// List Item Skeleton
const ListSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center space-x-4 p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-200/50 dark:border-dark-700/50"
  >
    <SkeletonBox width="w-12" height="h-12" rounded="rounded-full" />
    <div className="flex-1 space-y-2">
      <SkeletonBox width="w-1/3" height="h-4" />
      <SkeletonBox width="w-2/3" height="h-3" />
    </div>
    <SkeletonBox width="w-16" height="h-8" rounded="rounded-lg" />
  </motion.div>
);

// Profile Skeleton
const ProfileSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-6"
  >
    <div className="flex items-center space-x-4 mb-6">
      <SkeletonBox width="w-16" height="h-16" rounded="rounded-full" />
      <div className="space-y-2 flex-1">
        <SkeletonBox width="w-1/3" height="h-5" />
        <SkeletonBox width="w-1/2" height="h-4" />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <SkeletonBox width="w-full" height="h-3" />
          <SkeletonBox width="w-2/3" height="h-6" />
        </div>
      ))}
    </div>
  </motion.div>
);

// Table Skeleton
const TableSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 overflow-hidden"
  >
    {/* Header */}
    <div className="border-b border-gray-200 dark:border-dark-600 p-4">
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonBox key={i} width="w-full" height="h-4" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200 dark:divide-dark-600">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-4"
        >
          <div className="grid grid-cols-5 gap-4 items-center">
            <SkeletonBox width="w-full" height="h-3" />
            <SkeletonBox width="w-2/3" height="h-3" />
            <SkeletonBox width="w-16" height="h-6" rounded="rounded-full" />
            <SkeletonBox width="w-1/2" height="h-3" />
            <SkeletonBox width="w-8" height="h-8" rounded="rounded-lg" />
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Chart Skeleton
const ChartSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-6"
  >
    <div className="flex items-center justify-between mb-6">
      <SkeletonBox width="w-1/3" height="h-6" />
      <SkeletonBox width="w-24" height="h-8" rounded="rounded-lg" />
    </div>
    
    <div className="h-64 flex items-end justify-between space-x-2">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${Math.random() * 100}%` }}
          transition={{ delay: i * 0.1, duration: 0.8, ease: 'easeOut' }}
          className="flex-1 bg-gradient-to-t from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-600 rounded-t-md min-h-4"
        />
      ))}
    </div>
    
    <div className="flex justify-between mt-4">
      {[...Array(6)].map((_, i) => (
        <SkeletonBox key={i} width="w-8" height="h-3" />
      ))}
    </div>
  </motion.div>
);

// Marketplace Skeleton
const MarketplaceSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 overflow-hidden"
  >
    {/* Image area */}
    <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-dark-700 dark:to-dark-600">
      <motion.div
        variants={pulseVariants}
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <div className="absolute top-4 right-4">
        <SkeletonBox width="w-8" height="h-8" rounded="rounded-full" />
      </div>
      <div className="absolute bottom-4 left-4">
        <SkeletonBox width="w-12" height="h-12" rounded="rounded-2xl" />
      </div>
    </div>
    
    {/* Content */}
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <SkeletonBox width="w-3/4" height="h-6" />
        <SkeletonBox width="w-12" height="h-5" rounded="rounded-full" />
      </div>
      
      <SkeletonBox width="w-full" height="h-12" />
      
      <div className="flex items-center space-x-4">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <SkeletonBox key={i} width="w-3" height="h-3" rounded="rounded-full" />
          ))}
        </div>
        <SkeletonBox width="w-20" height="h-3" />
      </div>
      
      <div className="flex items-center justify-between">
        <SkeletonBox width="w-16" height="h-3" />
        <div className="text-right space-y-1">
          <div className="flex items-center justify-end space-x-2">
            <SkeletonBox width="w-4" height="h-4" rounded="rounded-full" />
            <SkeletonBox width="w-16" height="h-6" />
          </div>
          <SkeletonBox width="w-12" height="h-3" />
        </div>
      </div>
      
      <SkeletonBox width="w-full" height="h-12" rounded="rounded-xl" />
    </div>
  </motion.div>
);

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'list':
        return <ListSkeleton />;
      case 'profile':
        return <ProfileSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'chart':
        return <ChartSkeleton />;
      case 'marketplace':
        return <MarketplaceSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  if (variant === 'table' || variant === 'chart' || variant === 'profile') {
    return <div className={className}>{renderSkeleton()}</div>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};