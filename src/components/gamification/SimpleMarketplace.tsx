import React, { useState } from 'react';
import { Gift, Star, Zap, Crown, CheckCircle, AlertCircle } from 'lucide-react';

interface TechItem {
  id: string;
  name: string;
  pointsCost: number;
  brand: string;
  description: string;
  isExclusive?: boolean;
  stock?: number;
}

const techItems: TechItem[] = [
  {
    id: 'airpods-pro',
    name: 'AirPods Pro 2nd Gen',
    pointsCost: 15000,
    brand: 'Apple',
    description: 'Noise cancellation, Spatial audio',
    stock: 5
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro 128GB',
    pointsCost: 45000,
    brand: 'Apple',
    description: 'A17 Pro chip, 48MP camera',
    isExclusive: true,
    stock: 2
  },
  {
    id: 'macbook-air',
    name: 'MacBook Air M2 13"',
    pointsCost: 60000,
    brand: 'Apple',
    description: 'M2 chip, 18 hours battery',
    isExclusive: true,
    stock: 1
  },
  {
    id: 'ps5',
    name: 'PlayStation 5 Digital',
    pointsCost: 35000,
    brand: 'Sony',
    description: '4K gaming, Ultra-fast SSD',
    isExclusive: true,
    stock: 1
  },
  {
    id: 'airpods-max',
    name: 'AirPods Max',
    pointsCost: 20000,
    brand: 'Apple',
    description: 'High-fidelity audio',
    stock: 3
  },
  {
    id: 'ipad-air',
    name: 'iPad Air 5th Gen',
    pointsCost: 25000,
    brand: 'Apple',
    description: 'M1 chip, Apple Pencil support',
    stock: 8
  }
];

interface SimpleMarketplaceProps {
  userPoints: number;
  onPurchase: (item: TechItem) => void;
}

export const SimpleMarketplace: React.FC<SimpleMarketplaceProps> = ({
  userPoints,
  onPurchase
}) => {
  const [purchasingItem, setPurchasingItem] = useState<TechItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const canAfford = (item: TechItem) => userPoints >= item.pointsCost;

  const handlePurchase = async (item: TechItem) => {
    if (!canAfford(item)) return;
    
    setPurchasingItem(item);
    
    // Simulate purchase processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onPurchase(item);
    setShowSuccess(true);
    setPurchasingItem(null);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🛒 Tech Marketplace
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Spend your points on premium tech
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full px-4 py-2 text-white font-bold">
          {userPoints.toLocaleString()} pts
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-slide-up">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Purchase Successful! 🎉
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your order has been confirmed. You'll receive an email with delivery details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techItems.map((item) => (
          <div
            key={item.id}
            className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
              purchasingItem?.id === item.id ? 'ring-2 ring-blue-500 scale-105' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {item.brand}
                </p>
              </div>
              {item.isExclusive && (
                <div className="flex items-center space-x-1">
                  <Crown className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">EXCLUSIVE</span>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {item.pointsCost.toLocaleString()} pts
              </span>
              {item.stock && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.stock > 3 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 
                  item.stock > 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {item.stock} left
                </span>
              )}
            </div>

            <button
              onClick={() => handlePurchase(item)}
              disabled={!canAfford(item) || purchasingItem?.id === item.id}
              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                canAfford(item)
                  ? purchasingItem?.id === item.id
                    ? 'bg-blue-400 cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              {purchasingItem?.id === item.id ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : !canAfford(item) ? (
                <div className="flex items-center justify-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Need More Points</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Gift className="w-4 h-4" />
                  <span>Purchase</span>
                </div>
              )}
            </button>

            {!canAfford(item) && (
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                Need {item.pointsCost - userPoints} more points
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="mb-2">💡 <strong>Pro Tip:</strong> Focus on quick ticket resolution and high customer satisfaction to earn points faster!</p>
          <p>🎯 <strong>Goal:</strong> Save up for exclusive items like the iPhone 15 Pro or MacBook Air!</p>
        </div>
      </div>
    </div>
  );
};