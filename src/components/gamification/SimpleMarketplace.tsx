import React, { useState } from 'react';
import { Gift, Star, Zap, Crown } from 'lucide-react';

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
  const [selectedItem, setSelectedItem] = useState<TechItem | null>(null);

  const canAfford = (item: TechItem) => userPoints >= item.pointsCost;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
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
                <Crown className="w-5 h-5 text-purple-500" />
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
                  item.stock > 3 ? 'bg-green-100 text-green-800' : 
                  item.stock > 1 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.stock} left
                </span>
              )}
            </div>

            <button
              onClick={() => onPurchase(item)}
              disabled={!canAfford(item)}
              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                canAfford(item)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canAfford(item) ? 'Purchase' : 'Need More Points'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};