import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, CreditCard, Gift, Clock, Truck, Shield, Star } from 'lucide-react';
import { MarketplaceItem } from './Marketplace';

interface PurchaseModalProps {
  item: MarketplaceItem | null;
  userPoints: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: MarketplaceItem) => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  item,
  userPoints,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<'confirm' | 'processing' | 'success'>('confirm');

  if (!item || !isOpen) return null;

  const canAfford = userPoints >= item.pointsCost;
  const remainingPoints = userPoints - item.pointsCost;

  const handlePurchase = async () => {
    if (!canAfford) return;
    
    setIsProcessing(true);
    setPurchaseStep('processing');
    
    // Simulate purchase processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPurchaseStep('success');
    
    // Auto-close after success
    setTimeout(() => {
      onConfirm(item);
      onClose();
      setPurchaseStep('confirm');
      setIsProcessing(false);
    }, 3000);
  };

  const getAvailabilityColor = () => {
    switch (item.availability) {
      case 'exclusive':
        return 'text-purple-600 dark:text-purple-400';
      case 'limited':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const getAvailabilityIcon = () => {
    switch (item.availability) {
      case 'exclusive':
        return <Crown className="w-4 h-4" />;
      case 'limited':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Confirm Purchase
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {purchaseStep === 'confirm' && (
            <>
              {/* Item Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-2xl">📱</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {item.name}
                    </h3>
                    {item.brand && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {item.brand}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Points Information */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Balance
                  </span>
                  <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {userPoints.toLocaleString()} pts
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Item Cost
                  </span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    -{item.pointsCost.toLocaleString()} pts
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-yellow-200 dark:border-yellow-800">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Remaining Balance
                  </span>
                  <span className={`text-lg font-bold ${canAfford ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {remainingPoints.toLocaleString()} pts
                  </span>
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Availability</span>
                  <span className={`flex items-center space-x-1 font-medium ${getAvailabilityColor()}`}>
                    {getAvailabilityIcon()}
                    <span className="capitalize">{item.availability}</span>
                  </span>
                </div>
                
                {item.stockQuantity && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Stock</span>
                    <span className={`font-medium ${
                      item.stockQuantity > 5 ? 'text-green-600 dark:text-green-400' : 
                      item.stockQuantity > 2 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {item.stockQuantity} left
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.estimatedDelivery}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Popularity</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < item.popularity
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Warning for Limited/Exclusive Items */}
              {item.availability !== 'unlimited' && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-orange-800 dark:text-orange-200">
                      <p className="font-medium">
                        {item.availability === 'exclusive' ? 'Exclusive Item' : 'Limited Stock'}
                      </p>
                      <p className="mt-1">
                        {item.availability === 'exclusive' 
                          ? 'This is an exclusive reward with very limited availability. Secure it now!'
                          : 'Only a few items left in stock. Don\'t miss out!'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={!canAfford || isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  canAfford
                    ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {!canAfford ? (
                  'Not Enough Points'
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span>Purchase for {item.pointsCost.toLocaleString()} Points</span>
                  </div>
                )}
              </button>

              {!canAfford && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
                  You need {item.pointsCost - userPoints} more points to purchase this item
                </p>
              )}
            </>
          )}

          {purchaseStep === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Processing Purchase...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we process your order
              </p>
            </div>
          )}

          {purchaseStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Purchase Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your {item.name} has been ordered successfully
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  You will receive an email confirmation shortly. 
                  Estimated delivery: {item.estimatedDelivery}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {purchaseStep === 'confirm' && (
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Track Order</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};