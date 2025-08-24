import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Star,
  Award,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets, useUsers } from '../../hooks/useApi';
import { AnimatedBackground } from '../../components/ui/AnimatedBackground';
import { GlassmorphismCard } from '../../components/ui/GlassmorphismCard';
import { HeroSection } from '../../components/ui/HeroSection';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';

export const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: tickets = [], isLoading: ticketsLoading } = useTickets({});
  const { data: users = [], isLoading: usersLoading } = useUsers();

  const myTickets = tickets?.filter(ticket => ticket.assignedStaffId === user?.id) || [];
  const resolvedTickets = myTickets.filter(ticket => ticket.status === 'resolved');
  
  const stats = {
    totalTickets: myTickets.length,
    resolvedTickets: resolvedTickets.length,
    points: user?.points || 0,
    level: Math.floor((user?.points || 0) / 100) + 1,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  const performanceData = [
    { label: 'Response Time', value: '2.3 min', trend: '+12%', color: 'text-green-400', icon: Clock },
    { label: 'Resolution Rate', value: '96.8%', trend: '+5%', color: 'text-blue-400', icon: Target },
    { label: 'Customer Rating', value: '4.9/5', trend: '+0.2', color: 'text-yellow-400', icon: Star },
    { label: 'Team Rank', value: '#3', trend: '+2', color: 'text-purple-400', icon: Award }
  ];

  const quickActions = [
    { 
      label: 'View My Tickets', 
      action: () => navigate('/staff/tickets'),
      icon: MessageSquare,
      color: 'from-blue-600 to-cyan-600',
      count: myTickets.length 
    },
    { 
      label: 'Leaderboard', 
      action: () => navigate('/staff/leaderboard'),
      icon: Award,
      color: 'from-yellow-600 to-orange-600',
      count: stats.level 
    },
    { 
      label: 'AI Assistant', 
      action: () => navigate('/staff/ai-support'),
      icon: Zap,
      color: 'from-purple-600 to-pink-600',
      count: '24/7' 
    }
  ];

  const recentActivity = [
    { action: 'Resolved ticket #TKT-001', time: '2 minutes ago', type: 'success' },
    { action: 'Assigned new ticket #TKT-045', time: '15 minutes ago', type: 'info' },
    { action: 'Customer rated 5 stars', time: '1 hour ago', type: 'success' },
    { action: 'Level up! Reached Level ' + stats.level, time: '3 hours ago', type: 'achievement' }
  ];

  if (ticketsLoading || usersLoading) {
    return (
      <AnimatedBackground variant="tickets">
        <div className="dashboard-container pb-16">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <LoadingSkeleton variant="profile" />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <LoadingSkeleton variant="card" count={4} />
            </div>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground variant="tickets">
      <div className="dashboard-container pb-16">
        {/* Hero Section */}
        <HeroSection 
          userRole="staff" 
          userName={user?.name || 'Staff Member'}
          stats={stats}
        />

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-6 pb-16"
        >
          {/* Performance Metrics */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Activity className="w-6 h-6 text-orange-400" />
              <span>Performance Metrics</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceData.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <GlassmorphismCard 
                    variant="intense" 
                    glow={index === 0}
                    className="text-center space-y-4 group-hover:bg-white/25 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <motion.div
                        className={`w-12 h-12 ${metric.color} flex items-center justify-center rounded-2xl bg-white/10`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <metric.icon className="w-6 h-6" />
                      </motion.div>
                      <div className="text-right">
                        <div className="text-green-400 text-sm font-medium">
                          {metric.trend}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <motion.div
                        className="text-3xl font-bold text-white"
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        {metric.value}
                      </motion.div>
                      <div className="text-white/70 text-sm font-medium">
                        {metric.label}
                      </div>
                    </div>
                  </GlassmorphismCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span>Quick Actions</span>
              </h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.action}
                    className="w-full group"
                  >
                    <GlassmorphismCard variant="subtle" className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div
                            className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                            whileHover={{ rotate: 15 }}
                          >
                            <action.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div className="text-left">
                            <div className="text-lg font-semibold text-white">
                              {action.label}
                            </div>
                            <div className="text-white/60 text-sm">
                              Quick access to {action.label.toLowerCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {action.count}
                          </div>
                          <div className="text-white/60 text-xs">
                            Current
                          </div>
                        </div>
                      </div>
                    </GlassmorphismCard>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Clock className="w-6 h-6 text-blue-400" />
                <span>Recent Activity</span>
              </h2>
              <GlassmorphismCard variant="subtle" className="p-6 space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-400' :
                      activity.type === 'achievement' ? 'bg-yellow-400' : 'bg-blue-400'
                    }`} />
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">
                        {activity.action}
                      </div>
                      <div className="text-white/60 text-xs">
                        {activity.time}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </GlassmorphismCard>
            </motion.div>
          </div>

          {/* Team Overview */}
          <motion.div variants={itemVariants} className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-400" />
              <span>Team Overview</span>
            </h2>
            <GlassmorphismCard variant="colorful" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {users?.filter(u => u.role === 'staff').length || 0}
                  </motion.div>
                  <div className="text-white/70">Active Staff Members</div>
                </div>
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    {tickets?.filter(t => t.status === 'open').length || 0}
                  </motion.div>
                  <div className="text-white/70">Open Tickets</div>
                </div>
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    94.2%
                  </motion.div>
                  <div className="text-white/70">Team Resolution Rate</div>
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
};