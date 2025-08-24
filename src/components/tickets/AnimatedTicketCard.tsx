import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  Clock, 
  User, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Ticket } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface AnimatedTicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const priorityColors = {
  low: 'from-green-500 to-emerald-600',
  medium: 'from-yellow-500 to-orange-600', 
  high: 'from-orange-500 to-red-600',
  urgent: 'from-red-500 to-pink-600'
};

const statusIcons = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: XCircle,
  reopened: RotateCcw
};

const statusColors = {
  open: 'text-blue-500',
  in_progress: 'text-yellow-500',
  resolved: 'text-green-500',
  closed: 'text-gray-500',
  reopened: 'text-orange-500'
};

export const AnimatedTicketCard: React.FC<AnimatedTicketCardProps> = ({
  ticket,
  onClick,
  onEdit,
  onDelete,
  className = ''
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for advanced hover effects
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const StatusIcon = statusIcons[ticket.status as keyof typeof statusIcons];

  const cardVariants = {
    initial: { 
      scale: 1,
      rotateY: 0,
      z: 0
    },
    hover: { 
      scale: 1.02,
      z: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const flipVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((event.clientX - centerX) / 10);
    y.set((event.clientY - centerY) / 10);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className={`relative perspective-1000 ${className}`}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        style={{
          rotateX,
          rotateY: isFlipped ? 180 : rotateY,
        }}
        className="relative w-full h-48 transform-gpu"
      >
        {/* Front of card */}
        <motion.div
          variants={flipVariants}
          animate={isFlipped ? "back" : "front"}
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative h-full bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 overflow-hidden group">
            {/* Priority gradient bar */}
            <div className={`h-2 bg-gradient-to-r ${priorityColors[ticket.priority as keyof typeof priorityColors]}`} />
            
            {/* Hover overlay with actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute top-4 right-4 flex space-x-2 z-10"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                className="p-2 bg-white/90 dark:bg-dark-700/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-2 bg-blue-500/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Edit className="w-4 h-4 text-white" />
                </motion.button>
              )}
              
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-2 bg-red-500/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </motion.button>
              )}
            </motion.div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                      {ticket.id}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${ticket.priority}-100 dark:bg-${ticket.priority}-900/30 text-${ticket.priority}-700 dark:text-${ticket.priority}-300`}>
                      {ticket.priority}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {ticket.subject}
                  </h3>
                </div>
                
                <div className={`p-2 rounded-full ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                  <StatusIcon className="w-5 h-5" />
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                {ticket.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{ticket.customer?.name || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{ticket._count?.messages || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back of card - Detailed view */}
        <motion.div
          variants={flipVariants}
          animate={isFlipped ? "front" : "back"}
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-800 dark:to-dark-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-dark-600 bg-white/50 dark:bg-dark-700/50">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  Ticket Details
                </h4>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFlipped(false)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-full transition-colors"
                >
                  <XCircle className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Status
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <StatusIcon className={`w-4 h-4 ${statusColors[ticket.status as keyof typeof statusColors]}`} />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Assigned To
                </label>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {ticket.assignedStaff?.name || 'Unassigned'}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Category
                </label>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {ticket.category?.name || 'Uncategorized'}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Created
                </label>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Action button */}
            <div className="absolute bottom-4 left-4 right-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onClick && onClick()}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                View Full Details
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};