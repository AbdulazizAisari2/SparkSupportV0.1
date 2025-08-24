import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Trash2, Edit, Archive, Clock, User } from 'lucide-react';
import { Ticket } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface SwipeableTicketCardProps {
  ticket: Ticket;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onClick?: () => void;
}

const SWIPE_THRESHOLD = 100;
const ACTION_THRESHOLD = 150;

export const SwipeableTicketCard: React.FC<SwipeableTicketCardProps> = ({
  ticket,
  onEdit,
  onDelete,
  onArchive,
  onClick
}) => {
  const [isRevealed, setIsRevealed] = useState<'left' | 'right' | null>(null);
  
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.3, 0.8, 1, 0.8, 0.3]);
  const scale = useTransform(x, [-300, -150, 0, 150, 300], [0.8, 0.95, 1, 0.95, 0.8]);
  
  // Background color changes based on swipe direction
  const backgroundColor = useTransform(
    x,
    [-300, -150, 0, 150, 300],
    [
      'rgba(239, 68, 68, 0.1)', // Red for delete
      'rgba(239, 68, 68, 0.05)',
      'rgba(255, 255, 255, 1)',
      'rgba(59, 130, 246, 0.05)',
      'rgba(59, 130, 246, 0.1)' // Blue for edit
    ]
  );

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeVelocity = Math.abs(info.velocity.x);
    const swipeDistance = Math.abs(info.offset.x);
    
    // Fast swipe or long distance
    if (swipeVelocity > 500 || swipeDistance > ACTION_THRESHOLD) {
      if (info.offset.x > 0) {
        // Swiped right - Edit action
        if (onEdit) {
          onEdit();
          x.set(0);
          return;
        }
      } else {
        // Swiped left - Delete action
        if (onDelete) {
          // Animate out before deleting
          x.set(-400);
          setTimeout(() => onDelete(), 200);
          return;
        }
      }
    }
    
    // Reveal actions if swipe was significant but not complete
    if (swipeDistance > SWIPE_THRESHOLD) {
      if (info.offset.x > 0) {
        setIsRevealed('right');
        x.set(120);
      } else {
        setIsRevealed('left');
        x.set(-120);
      }
    } else {
      // Snap back to center
      setIsRevealed(null);
      x.set(0);
    }
  };

  const resetPosition = () => {
    setIsRevealed(null);
    x.set(0);
  };

  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-orange-500',
    urgent: 'border-l-red-500'
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left Action (Delete) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealed === 'left' ? 1 : 0 }}
        className="absolute right-0 top-0 h-full flex items-center space-x-2 pr-4 bg-red-500"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            resetPosition();
            onDelete && onDelete();
          }}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full"
        >
          <Trash2 className="w-5 h-5 text-white" />
        </motion.button>
        
        {onArchive && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              resetPosition();
              onArchive();
            }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full"
          >
            <Archive className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </motion.div>

      {/* Right Action (Edit) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isRevealed === 'right' ? 1 : 0 }}
        className="absolute left-0 top-0 h-full flex items-center space-x-2 pl-4 bg-blue-500"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            resetPosition();
            onEdit && onEdit();
          }}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full"
        >
          <Edit className="w-5 h-5 text-white" />
        </motion.button>
      </motion.div>

      {/* Main Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ 
          x, 
          opacity, 
          scale, 
          backgroundColor 
        }}
        whileTap={{ cursor: 'grabbing' }}
        className="relative bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Priority indicator */}
        <div className={`absolute left-0 top-0 w-1 h-full ${priorityColors[ticket.priority as keyof typeof priorityColors]}`} />
        
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                  {ticket.id}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
              
              <h3 
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={onClick}
              >
                {ticket.subject}
              </h3>
            </div>
            
            <motion.div
              animate={{ 
                rotate: isRevealed ? [0, -10, 10, 0] : 0,
                scale: isRevealed ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.3 }}
              className="text-gray-400"
            >
              <Clock className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {ticket.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{ticket.customer?.name || 'Unknown'}</span>
            </div>
            
            <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Swipe Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: Math.abs(x.get()) > 20 && !isRevealed ? 1 : 0 
          }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {x.get() > 0 ? '👉 Swipe to edit' : '👈 Swipe to delete'}
          </div>
        </motion.div>

        {/* Haptic feedback indicator */}
        <motion.div
          animate={{
            scale: Math.abs(x.get()) > SWIPE_THRESHOLD ? [1, 1.2, 1] : 1,
            opacity: Math.abs(x.get()) > SWIPE_THRESHOLD ? [0.5, 1, 0.5] : 0
          }}
          transition={{ duration: 0.1 }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-500/10 via-transparent to-red-500/10"
        />
      </motion.div>

      {/* Reset button when revealed */}
      {isRevealed && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={resetPosition}
          className="absolute top-2 right-2 z-10 p-2 bg-gray-500/80 backdrop-blur-sm text-white rounded-full text-xs"
        >
          ✕
        </motion.button>
      )}
    </div>
  );
};