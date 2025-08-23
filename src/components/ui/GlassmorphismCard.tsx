import React from 'react';
import { motion } from 'framer-motion';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'intense' | 'subtle' | 'colorful';
  hover?: boolean;
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  glow = false,
  size = 'md'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'intense':
        return 'bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20';
      case 'subtle':
        return 'bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 dark:border-white/10';
      case 'colorful':
        return 'bg-gradient-to-br from-white/20 via-purple-500/10 to-blue-500/20 dark:from-white/10 dark:via-purple-500/5 dark:to-blue-500/10 backdrop-blur-lg border border-white/20 dark:border-white/10';
      default:
        return 'bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-4 rounded-lg';
      case 'lg':
        return 'p-8 rounded-3xl';
      case 'xl':
        return 'p-12 rounded-3xl';
      default:
        return 'p-6 rounded-2xl';
    }
  };

  const getGlowClasses = () => {
    if (!glow) return '';
    return 'shadow-[0_0_50px_rgba(139,92,246,0.3)] dark:shadow-[0_0_50px_rgba(139,92,246,0.2)]';
  };

  const cardVariants = {
    initial: { 
      scale: 1,
      rotateX: 0,
      rotateY: 0,
    },
    hover: hover ? { 
      scale: 1.02,
      rotateX: 5,
      rotateY: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    } : {}
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getGlowClasses()}
        shadow-xl
        transition-all duration-300
        relative
        overflow-hidden
        ${className}
      `}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-inherit opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-inherit blur-xl" />
      </div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          opacity: [0, 0.3, 0],
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut'
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          transform: 'skewX(-20deg)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </motion.div>
  );
};