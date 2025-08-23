import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTickets } from '../../hooks/useApi';
import { AnimatedBackground } from '../../components/ui/AnimatedBackground';
import { GlassmorphismCard } from '../../components/ui/GlassmorphismCard';
import { HeroSection } from '../../components/ui/HeroSection';
import { SwipeableTicketCard } from '../../components/tickets/SwipeableTicketCard';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';

export const MyTickets: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: tickets = [], isLoading, error } = useTickets({});

  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const stats = {
    totalTickets: tickets?.length || 0,
    resolvedTickets: tickets?.filter(t => t.status === 'resolved').length || 0,
    points: user?.points || 0,
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

  if (error) {
    return (
      <AnimatedBackground variant="minimal">
        <div className="min-h-screen flex items-center justify-center">
          <GlassmorphismCard variant="intense" className="text-center">
            <div className="text-red-400 text-xl font-semibold mb-2">Error loading tickets</div>
            <p className="text-white/70">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </GlassmorphismCard>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground variant="dashboard">
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection 
          userRole="customer" 
          userName={user?.name || 'User'}
          stats={stats}
        />

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-6 pb-16"
        >
          {/* Search and Filter Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <GlassmorphismCard variant="subtle" className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 flex items-center space-x-4 w-full md:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="all" className="bg-gray-800">All Status</option>
                      <option value="open" className="bg-gray-800">Open</option>
                      <option value="in_progress" className="bg-gray-800">In Progress</option>
                      <option value="resolved" className="bg-gray-800">Resolved</option>
                      <option value="closed" className="bg-gray-800">Closed</option>
                    </select>
                  </div>
                </div>

                {/* New Ticket Button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/my/tickets/new')}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Ticket</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Tickets Grid */}
          <motion.div variants={itemVariants}>
            {isLoading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <LoadingSkeleton variant="card" count={6} />
                </div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <GlassmorphismCard variant="colorful" size="lg" className="max-w-md mx-auto">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {searchTerm || statusFilter !== 'all' ? 'No matching tickets' : 'No tickets yet'}
                  </h3>
                  <p className="text-white/70 mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Create your first support ticket to get started'
                    }
                  </p>
                  {(!searchTerm && statusFilter === 'all') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/my/tickets/new')}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold"
                    >
                      Create First Ticket
                    </motion.button>
                  )}
                </GlassmorphismCard>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    variants={itemVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <SwipeableTicketCard
                      ticket={ticket}
                      onClick={() => navigate(`/my/tickets/${ticket.id}`)}
                      onEdit={() => console.log('Edit ticket:', ticket.id)}
                      onDelete={() => console.log('Delete ticket:', ticket.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="mt-12">
            <GlassmorphismCard variant="subtle" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Quick Actions</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Browse Marketplace', action: () => navigate('/my/marketplace'), color: 'from-purple-600 to-pink-600' },
                  { label: 'View Notifications', action: () => navigate('/my/notifications'), color: 'from-blue-600 to-cyan-600' },
                  { label: 'Contact Support', action: () => navigate('/my/tickets/new'), color: 'from-green-600 to-blue-600' }
                ].map((item, index) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.action}
                    className={`p-4 bg-gradient-to-r ${item.color} rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </GlassmorphismCard>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
};