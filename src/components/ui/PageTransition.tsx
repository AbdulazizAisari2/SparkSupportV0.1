import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Animation variants for different page types
const pageVariants = {
  initial: {
    opacity: 0,
    x: 50,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    x: -50,
    scale: 0.98,
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

// Special animations for different routes
const getRouteAnimation = (pathname: string) => {
  if (pathname.includes('/marketplace')) {
    return {
      initial: { opacity: 0, y: 30, rotateX: -15 },
      in: { opacity: 1, y: 0, rotateX: 0 },
      out: { opacity: 0, y: -30, rotateX: 15 }
    };
  }
  
  if (pathname.includes('/leaderboard')) {
    return {
      initial: { opacity: 0, scale: 0.9, rotateY: -10 },
      in: { opacity: 1, scale: 1, rotateY: 0 },
      out: { opacity: 0, scale: 1.1, rotateY: 10 }
    };
  }
  
  if (pathname.includes('/tickets')) {
    return {
      initial: { opacity: 0, x: 100 },
      in: { opacity: 1, x: 0 },
      out: { opacity: 0, x: -100 }
    };
  }
  
  return pageVariants;
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const variants = getRouteAnimation(location.pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        transition={pageTransition}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};