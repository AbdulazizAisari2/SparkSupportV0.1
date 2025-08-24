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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
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
