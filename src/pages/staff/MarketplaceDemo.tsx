import React from 'react';
import { SimpleMarketplace } from '../../components/gamification/SimpleMarketplace';

export const MarketplaceDemo: React.FC = () => {
  const demoPoints = 50000; // Demo points for testing

  const handlePurchase = (item: any) => {
    alert(`🎉 Purchase successful! You've ordered ${item.name} for ${item.pointsCost} points.\n\nYour remaining balance: ${demoPoints - item.pointsCost} points`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🛒 Tech Marketplace Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Test the marketplace with {demoPoints.toLocaleString()} demo points
          </p>
        </div>

        <SimpleMarketplace 
          userPoints={demoPoints}
          onPurchase={handlePurchase}
        />

        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🎯 How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Earn Points</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Resolve tickets, get good ratings, and help colleagues to earn points
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Browse Rewards</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose from premium tech items, office perks, and experiences
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Get Rewarded</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Spend your points and enjoy your hard-earned rewards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};