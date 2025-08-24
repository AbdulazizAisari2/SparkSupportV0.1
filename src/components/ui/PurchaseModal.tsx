import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Coins, Star, Check, Sparkles, Gift, TrendingUp } from 'lucide-react';
interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item: {
    id: string;
    name: string;
    description: string;
    points: number;
    category: string;
    rating: number;
    image: string;
    vendor: string;
    originalPrice?: number;
  };
  userPoints: number;
}
const SimpleConfetti: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 ${
            ['bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-red-400', 'bg-purple-400'][i % 5]
          } animate-bounce`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random()}s`
          }}
        />
      ))}
    </div>
  );
};
export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  userPoints
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const remainingPoints = userPoints - item.points;
  const canAfford = userPoints >= item.points;
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsPurchased(false);
      setShowConfetti(false);
    }
  }, [isOpen]);
  const handlePurchase = async () => {
    if (!canAfford) return;
    setIsProcessing(true);
    try {
      await onConfirm();
      setIsPurchased(true);
      setShowConfetti(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };
  if (!isOpen) return null;
  return (
    <>
        <div className="relative bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-dark-700/50 max-w-md w-full mx-4 overflow-hidden animate-modal-enter">
              {showConfetti && <SimpleConfetti />}
            <>
              <div className="p-6">
                <div className="bg-gray-50 dark:bg-dark-700/50 rounded-2xl p-4 mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-3 mb-3">
                    {renderStars(item.rating)}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      by {item.vendor}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    {item.originalPrice && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ${item.originalPrice} retail value
                      </div>
                    )}
                  </div>
                </div>
                {!canAfford && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-200">
                          Insufficient Points
                        </h4>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          You need {(item.points - userPoints).toLocaleString()} more points to make this purchase.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                      <button 
                        onClick={() => window.location.href = '/staff/leaderboard'}
                        className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>Earn more points on the leaderboard</span>
                      </button>
                    </div>
                  </div>
                )}
