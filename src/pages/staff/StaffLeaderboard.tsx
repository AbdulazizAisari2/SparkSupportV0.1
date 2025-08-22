import React, { useState } from 'react';
import { Leaderboard } from '../../components/gamification/Leaderboard';
import { useLeaderboard } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, RefreshCw } from 'lucide-react';

export const StaffLeaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [metric, setMetric] = useState<'points' | 'resolved' | 'satisfaction' | 'growth'>('points');
  const { user } = useAuth();

  const { 
    data: leaderboardData, 
    isLoading, 
    error, 
    refetch 
  } = useLeaderboard({ timeframe, metric, limit: 50 });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:bg-slate-900">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/30 to-cyan-500/20 animate-gradient-x"></div>
        </div>

        <div className="relative text-center z-10">
          <div className="relative mb-8">
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>

            {/* Main icon */}
            <div className="relative bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/50">
              <div className="bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 p-4 rounded-2xl shadow-inner">
                <MessageSquare className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Loading Leaderboard...
          </h2>

          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Fetching latest rankings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:bg-slate-900">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-200 via-orange-200 to-yellow-200 dark:from-red-900 dark:via-orange-900 dark:to-yellow-900"></div>
        </div>

        <div className="relative text-center z-10 max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Failed to Load Leaderboard
          </h1>
          
          <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-2xl border border-red-200 dark:border-orange-400/30 p-6 mb-6">
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
              {error instanceof Error ? error.message : 'Unable to fetch leaderboard data'}
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Leaderboard
        staffStats={leaderboardData?.leaderboard || []}
        currentUserId={user?.id}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        metric={metric}
        onMetricChange={setMetric}
        topPerformer={leaderboardData?.topPerformer}
        isLoading={isLoading}
        onRefresh={() => refetch()}
      />
    </div>
  );
};