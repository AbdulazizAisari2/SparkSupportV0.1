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

// Simple inline confetti component to avoid import issues
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

  // Reset state when modal opens/closes
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
      
      // Auto-close after success animation
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
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-dark-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-dark-700/50 max-w-md w-full mx-4 overflow-hidden animate-modal-enter">
          
          {/* Success State */}
          {isPurchased ? (
            <div className="relative p-8 text-center">
              {/* Confetti Effect */}
              {showConfetti && <SimpleConfetti />}
              
              {/* Success Animation */}
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce-in shadow-2xl">
                  <Check className="w-12 h-12 text-white animate-checkmark" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full animate-ping" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                🎉 Purchase Successful!
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                <strong>{item.name}</strong> has been added to your rewards!
              </p>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-3 text-emerald-700 dark:text-emerald-300">
                  <Coins className="w-5 h-5" />
                  <span className="font-semibold">
                    {item.points.toLocaleString()} points redeemed
                  </span>
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                  Remaining balance: {remainingPoints.toLocaleString()} points
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Gift className="w-4 h-4" />
                <span>Check your email for delivery details</span>
              </div>
            </div>
          ) : (
            /* Purchase Confirmation State */
            <>
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-white/50 dark:hover:bg-dark-700/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <div className="text-6xl mb-4">{item.image}</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Confirm Purchase
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ready to redeem your points?
                  </p>
                </div>
              </div>

              {/* Product Details */}
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

                {/* Points Breakdown */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span>Points Summary</span>
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Current Balance:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {userPoints.toLocaleString()} points
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        -{item.points.toLocaleString()} points
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          Remaining Balance:
                        </span>
                        <span className={`font-bold text-lg ${
                          remainingPoints >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {remainingPoints.toLocaleString()} points
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insufficient Points Warning */}
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

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handlePurchase}
                    disabled={!canAfford || isProcessing}
                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      canAfford && !isProcessing
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Confirm Purchase</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};