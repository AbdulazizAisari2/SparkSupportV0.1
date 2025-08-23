import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Shield,
  Zap,
  Star,
  Award
} from 'lucide-react';
import { GlassmorphismCard } from './GlassmorphismCard';

interface HeroSectionProps {
  userRole: 'customer' | 'staff' | 'admin';
  userName: string;
  stats?: {
    totalTickets?: number;
    resolvedTickets?: number;
    points?: number;
    level?: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  userRole,
  userName,
  stats = {}
}) => {
  const getRoleConfig = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Command Center',
          subtitle: 'Oversee and optimize your support ecosystem',
          icon: Shield,
          gradient: 'from-purple-600 via-blue-600 to-cyan-600',
          stats: [
            { label: 'Total Users', value: '2,847', icon: Users, color: 'text-green-400' },
            { label: 'Active Tickets', value: stats.totalTickets || '156', icon: MessageSquare, color: 'text-blue-400' },
            { label: 'Resolution Rate', value: '94.2%', icon: TrendingUp, color: 'text-purple-400' },
            { label: 'Team Performance', value: 'Excellent', icon: Award, color: 'text-yellow-400' }
          ]
        };
      case 'staff':
        return {
          title: 'Support Hub',
          subtitle: 'Deliver exceptional customer experiences',
          icon: Zap,
          gradient: 'from-orange-600 via-red-600 to-pink-600',
          stats: [
            { label: 'Tickets Resolved', value: stats.resolvedTickets || '89', icon: MessageSquare, color: 'text-green-400' },
            { label: 'Current Level', value: stats.level || '7', icon: Star, color: 'text-yellow-400' },
            { label: 'Points Earned', value: stats.points || '2,340', icon: Sparkles, color: 'text-purple-400' },
            { label: 'Rating', value: '4.9/5', icon: Award, color: 'text-blue-400' }
          ]
        };
      default:
        return {
          title: 'Support Portal',
          subtitle: 'Get help when you need it most',
          icon: Sparkles,
          gradient: 'from-blue-600 via-purple-600 to-indigo-600',
          stats: [
            { label: 'My Tickets', value: stats.totalTickets || '3', icon: MessageSquare, color: 'text-blue-400' },
            { label: 'Resolved', value: stats.resolvedTickets || '12', icon: TrendingUp, color: 'text-green-400' },
            { label: 'Support Points', value: stats.points || '450', icon: Sparkles, color: 'text-purple-400' },
            { label: 'Satisfaction', value: 'Excellent', icon: Star, color: 'text-yellow-400' }
          ]
        };
    }
  };

  const config = getRoleConfig();
  const IconComponent = config.icon;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative py-16 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                className="inline-flex items-center space-x-2 text-white/80"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <IconComponent className="w-6 h-6" />
                </motion.div>
                <span className="text-sm font-medium tracking-wide uppercase">
                  {getGreeting()}, {userName}
                </span>
              </motion.div>

              <h1 className={`text-5xl lg:text-7xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent leading-tight`}>
                {config.title}
              </h1>
              
              <p className="text-xl text-white/70 max-w-2xl leading-relaxed">
                {config.subtitle}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-lg border border-white/30 rounded-2xl text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                View Analytics
              </motion.button>
            </motion.div>
          </div>

          {/* Right side - Stats grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
            {config.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <GlassmorphismCard 
                  variant="intense" 
                  glow={index === 0}
                  className="text-center space-y-4 group-hover:bg-white/25 transition-all duration-300"
                >
                  <motion.div
                    className={`mx-auto w-12 h-12 ${stat.color} flex items-center justify-center rounded-2xl bg-white/10`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-6 h-6" />
                  </motion.div>
                  
                  <div>
                    <motion.div
                      className="text-2xl font-bold text-white"
                      animate={{ 
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-white/70 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                </GlassmorphismCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating action indicators */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center space-x-2 text-white/60 text-sm"
          >
            <span>Scroll to explore</span>
            <motion.div
              animate={{ rotate: 180 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              ↓
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};