import React, { useState } from 'react';
import { Trophy, Medal, Award, Star, Zap, Target, Crown, TrendingUp, Calendar, Users, Sparkles, Gift, Flame } from 'lucide-react';
import { Achievement } from '../ui/Badge';
export interface StaffStats {
  userId: string;
  name: string;
  department: string;
  ticketsResolved: number;
  averageResolutionTime: number; 
  customerSatisfaction: number; 
  points: number;
  achievements: Achievement[];
  streak: number; 
  level: number;
  totalTicketsHandled: number;
  responseTime: number; 
  monthlyGrowth: number; 
  specialRecognition?: string;
}
interface LeaderboardProps {
  staffStats: StaffStats[];
  currentUserId?: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void;
  metric?: 'points' | 'resolved' | 'satisfaction' | 'growth';
  onMetricChange?: (metric: 'points' | 'resolved' | 'satisfaction' | 'growth') => void;
  topPerformer?: StaffStats;
  isLoading?: boolean;
  onRefresh?: () => void;
}
const sampleAchievements: Achievement[] = [
  {
    id: 'first-resolve',
    name: 'First Resolution',
    description: 'Resolved your first ticket',
    icon: 'star',
    color: 'bronze',
    unlockedAt: new Date('2024-01-15')
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Resolved 10 tickets in one day',
    icon: 'zap',
    color: 'gold',
    unlockedAt: new Date('2024-01-20')
  },
  {
    id: 'customer-hero',
    name: 'Customer Hero',
    description: 'Achieved 5-star rating from 50 customers',
    icon: 'crown',
    color: 'purple',
    unlockedAt: new Date('2024-01-18')
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintained 30-day resolution streak',
    icon: 'target',
    color: 'blue',
    unlockedAt: new Date('2024-01-25')
  },
  {
    id: 'team-player',
    name: 'Team Player',
    description: 'Helped colleagues with 20+ tickets',
    icon: 'award',
    color: 'green',
    unlockedAt: new Date('2024-01-22')
  }
];
const mockStaffStats: StaffStats[] = [
  {
    userId: '2',
    name: 'Mohammed',
    department: 'Technical Support',
    ticketsResolved: 147,
    averageResolutionTime: 4.2,
    customerSatisfaction: 4.8,
    points: 2940,
    achievements: [sampleAchievements[0], sampleAchievements[1], sampleAchievements[3], sampleAchievements[4]],
    streak: 23,
    level: 8,
    totalTicketsHandled: 189,
    responseTime: 12,
    monthlyGrowth: 15.3,
    specialRecognition: 'Staff of the Month'
  },
  {
    userId: '3',
    name: 'Sarah',
    department: 'Customer Success',
    ticketsResolved: 134,
    averageResolutionTime: 3.8,
    customerSatisfaction: 4.9,
    points: 2680,
    achievements: [sampleAchievements[0], sampleAchievements[2], sampleAchievements[4]],
    streak: 18,
    level: 7,
    totalTicketsHandled: 156,
    responseTime: 8,
    monthlyGrowth: 12.7
  },
  {
    userId: '4',
    name: 'Abdulaziz',
    department: 'IT Administration',
    ticketsResolved: 89,
    averageResolutionTime: 2.1,
    customerSatisfaction: 4.7,
    points: 1780,
    achievements: [sampleAchievements[0], sampleAchievements[1]],
    streak: 12,
    level: 6,
    totalTicketsHandled: 95,
    responseTime: 15,
    monthlyGrowth: 8.9
  }
];
export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  staffStats = [], 
  currentUserId,
  timeframe,
  onTimeframeChange,
  metric = 'points',
  onMetricChange,
  topPerformer,
  isLoading = false,
  onRefresh
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'points' | 'resolved' | 'satisfaction' | 'growth'>(metric);
  const [showAchievements, setShowAchievements] = useState(false);
  const handleMetricChange = (newMetric: 'points' | 'resolved' | 'satisfaction' | 'growth') => {
    setSelectedMetric(newMetric);
    if (onMetricChange) {
      onMetricChange(newMetric);
    }
  };
  const sortedStats = [...staffStats].sort((a, b) => {
    switch (selectedMetric) {
      case 'points':
        return b.points - a.points;
      case 'resolved':
        return b.ticketsResolved - a.ticketsResolved;
      case 'satisfaction':
        return b.customerSatisfaction - a.customerSatisfaction;
      case 'growth':
        return b.monthlyGrowth - a.monthlyGrowth;
      default:
        return b.points - a.points;
    }
  });
  const staffOfTheMonth = topPerformer || staffStats.find(s => s.specialRecognition === 'Staff of the Month');
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return { icon: Crown, color: 'text-yellow-500', bg: 'from-yellow-400 to-yellow-600', shadow: 'shadow-yellow-500/25' };
      case 2: return { icon: Medal, color: 'text-gray-500', bg: 'from-gray-400 to-gray-600', shadow: 'shadow-gray-500/25' };
      case 3: return { icon: Award, color: 'text-orange-600', bg: 'from-orange-400 to-orange-600', shadow: 'shadow-orange-500/25' };
      default: return { icon: Star, color: 'text-blue-500', bg: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/25' };
    }
  };
  const getLevelProgress = (points: number) => {
    const currentLevelPoints = points % 500;
    return (currentLevelPoints / 500) * 100;
  };
  const timeframeOptions = [
    { value: 'week', label: 'This Week', icon: Calendar },
    { value: 'month', label: 'This Month', icon: Calendar },
    { value: 'quarter', label: 'This Quarter', icon: TrendingUp },
    { value: 'year', label: 'This Year', icon: TrendingUp }
  ];
  const metricOptions = [
    { value: 'points', label: 'Points', icon: Star, color: 'from-yellow-500 to-yellow-600' },
    { value: 'resolved', label: 'Resolved', icon: Target, color: 'from-green-500 to-green-600' },
    { value: 'satisfaction', label: 'Satisfaction', icon: Trophy, color: 'from-purple-500 to-purple-600' },
    { value: 'growth', label: 'Growth', icon: TrendingUp, color: 'from-blue-500 to-blue-600' }
  ];
  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur opacity-75 animate-glow"></div>
              <div className="relative bg-white dark:bg-dark-800 p-3 rounded-xl shadow-lg">
                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                Staff Leaderboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Performance rankings and achievements
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metricOptions.map(option => {
            const Icon = option.icon;
            const isSelected = selectedMetric === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleMetricChange(option.value as "points" | "resolved" | "satisfaction" | "growth")}
                className={`
                  relative overflow-hidden p-4 rounded-xl font-medium text-sm transition-all duration-200 border-2 group
                  ${isSelected
                    ? 'border-transparent shadow-lg transform scale-105'
                    : 'border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
                  }
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${option.color} ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'} transition-opacity duration-200`}></div>
                <div className="relative flex items-center space-x-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span className={isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}>{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative mb-4">
              <div className="w-20 h-16 bg-gradient-to-t from-gray-400 to-gray-500 rounded-t-lg flex items-end justify-center pb-2 shadow-lg">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full blur opacity-50"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Sarah</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">2,680 points</p>
            <div className="mt-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">
              Customer Success
            </div>
          </div>
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative mb-4">
              <div className="w-20 h-12 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg flex items-end justify-center pb-2 shadow-lg">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur opacity-50"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Abdulaziz</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">1,780 points</p>
            <div className="mt-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-medium">
              IT Administration
            </div>
          </div>
        </div>
      </div>
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${rankConfig.bg} flex items-center justify-center shadow-xl ${rankConfig.shadow}`}>
                      <RankIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">
                      {rank}
                    </div>
                  </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>Level {staff.level} Progress</span>
                        <span>{staff.points} points</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 relative overflow-hidden"
                          style={{ width: `${levelProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  {showAchievements && (
                    <div className="flex flex-col items-center space-y-3 animate-slide-up">
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">Achievements</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {staff.achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                            title={achievement.name}
                          >
                            🏆
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {staff.achievements.length}/10 unlocked
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-blue-900 dark:text-blue-300">Weekly Sprint</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400 mb-4">
                Resolve 50 tickets as a team this week
              </p>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3 mb-3">
                <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style={{ width: '76%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400 font-medium">
                <span>38/50 tickets</span>
                <span>2 days left</span>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-purple-900 dark:text-purple-300">Speed Challenge</h3>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-400 mb-4">
                Average resolution under 3 hours
              </p>
              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3 mb-3">
                <div className="h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-purple-600 dark:text-purple-400 font-medium">
                <span>3.2hr average</span>
                <span>⚡ Almost there!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};