import React, { useState } from 'react';
import { Trophy, Medal, Award, Star, Zap, Target, Crown, TrendingUp, Calendar, Users } from 'lucide-react';
import { User } from '../../types';
import { AchievementBadge, Achievement } from '../ui/Badge';

export interface StaffStats {
  userId: string;
  name: string;
  department: string;
  ticketsResolved: number;
  averageResolutionTime: number; // in hours
  customerSatisfaction: number; // 1-5 rating
  points: number;
  achievements: Achievement[];
  streak: number; // consecutive days with resolved tickets
  level: number;
  totalTicketsHandled: number;
  responseTime: number; // average first response time in minutes
}

interface LeaderboardProps {
  staffStats: StaffStats[];
  currentUserId?: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void;
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
    color: 'purple'
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintained 30-day resolution streak',
    icon: 'target',
    color: 'blue',
    unlockedAt: new Date('2024-01-25')
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
    achievements: [sampleAchievements[0], sampleAchievements[1], sampleAchievements[3]],
    streak: 23,
    level: 8,
    totalTicketsHandled: 189,
    responseTime: 12
  },
  {
    userId: '3',
    name: 'Sarah',
    department: 'Customer Success',
    ticketsResolved: 134,
    averageResolutionTime: 3.8,
    customerSatisfaction: 4.9,
    points: 2680,
    achievements: [sampleAchievements[0], sampleAchievements[2]],
    streak: 18,
    level: 7,
    totalTicketsHandled: 156,
    responseTime: 8
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
    responseTime: 15
  }
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  staffStats = mockStaffStats, 
  currentUserId,
  timeframe,
  onTimeframeChange 
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'points' | 'resolved' | 'satisfaction'>('points');

  const sortedStats = [...staffStats].sort((a, b) => {
    switch (selectedMetric) {
      case 'points':
        return b.points - a.points;
      case 'resolved':
        return b.ticketsResolved - a.ticketsResolved;
      case 'satisfaction':
        return b.customerSatisfaction - a.customerSatisfaction;
      default:
        return b.points - a.points;
    }
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
      case 2: return { icon: Medal, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/30' };
      case 3: return { icon: Award, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' };
      default: return { icon: Star, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    }
  };

  const getLevel = (points: number) => {
    return Math.floor(points / 500) + 1;
  };

  const getLevelProgress = (points: number) => {
    const currentLevelPoints = points % 500;
    return (currentLevelPoints / 500) * 100;
  };

  const timeframeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const metricOptions = [
    { value: 'points', label: 'Points', icon: Star },
    { value: 'resolved', label: 'Resolved', icon: Target },
    { value: 'satisfaction', label: 'Satisfaction', icon: Trophy }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
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
                Top performers and achievements
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Timeframe Selector */}
            <select
              value={timeframe}
              onChange={(e) => onTimeframeChange(e.target.value as any)}
              className="px-4 py-2 bg-white/50 dark:bg-dark-700/50 border border-gray-200 dark:border-dark-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            >
              {timeframeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex space-x-2">
          {metricOptions.map(option => {
            const Icon = option.icon;
            const isSelected = selectedMetric === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => setSelectedMetric(option.value as any)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 border
                  ${isSelected
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg border-transparent'
                    : 'bg-white/50 dark:bg-dark-700/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        {sortedStats.map((staff, index) => {
          const rank = index + 1;
          const rankConfig = getRankIcon(rank);
          const RankIcon = rankConfig.icon;
          const isCurrentUser = currentUserId === staff.userId;
          const levelProgress = getLevelProgress(staff.points);

          return (
            <div
              key={staff.userId}
              className={`
                bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-xl shadow-lg border transition-all duration-200 hover:shadow-xl hover:scale-[1.01] animate-slide-up
                ${isCurrentUser 
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-800' 
                  : 'border-gray-200/50 dark:border-dark-700/50'
                }
                ${rank <= 3 ? 'border-l-4 border-l-yellow-500' : ''}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-xl ${rankConfig.bg} flex items-center justify-center shadow-lg`}>
                    <RankIcon className={`w-6 h-6 ${rankConfig.color}`} />
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">
                        {staff.name}
                        {isCurrentUser && (
                          <span className="ml-2 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-lg">
                            You
                          </span>
                        )}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        #{rank}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {staff.department} • Level {staff.level}
                    </p>

                    {/* Level Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Level {staff.level}</span>
                        <span>{staff.points} points</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                        <div
                          className="h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                          style={{ width: `${levelProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {staff.ticketsResolved}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Resolved</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {staff.customerSatisfaction.toFixed(1)}★
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {staff.streak}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">Achievements</div>
                    <div className="flex space-x-1">
                      {staff.achievements.slice(0, 3).map((achievement) => (
                        <AchievementBadge
                          key={achievement.id}
                          achievement={achievement}
                          size="sm"
                          showTooltip={true}
                        />
                      ))}
                      {staff.achievements.length > 3 && (
                        <div className="w-8 h-8 bg-gray-200 dark:bg-dark-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                          +{staff.achievements.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Challenges */}
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl blur opacity-75 animate-glow"></div>
            <div className="relative bg-white dark:bg-dark-800 p-3 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Team Challenges</h2>
            <p className="text-gray-600 dark:text-gray-400">Active competitions and goals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weekly Challenge */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-3 mb-3">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">Weekly Sprint</h3>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
              Resolve 50 tickets as a team this week
            </p>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mb-2">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '76%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-blue-600 dark:text-blue-400">
              <span>38/50 tickets</span>
              <span>2 days left</span>
            </div>
          </div>

          {/* Customer Satisfaction Challenge */}
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-900 dark:text-green-300">Satisfaction Goal</h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400 mb-3">
              Maintain 4.5+ average rating this month
            </p>
            <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mb-2">
              <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-green-600 dark:text-green-400">
              <span>4.6/5.0 rating</span>
              <span>On track!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Points calculation hook
export const usePointsSystem = () => {
  const calculatePoints = (action: string, ticketPriority?: string, resolutionTime?: number) => {
    let points = 0;
    
    switch (action) {
      case 'ticket_resolved':
        points = 10;
        if (ticketPriority === 'urgent') points += 15;
        else if (ticketPriority === 'high') points += 10;
        else if (ticketPriority === 'medium') points += 5;
        
        // Bonus for quick resolution
        if (resolutionTime && resolutionTime < 2) points += 10; // < 2 hours
        else if (resolutionTime && resolutionTime < 4) points += 5; // < 4 hours
        break;
        
      case 'first_response':
        points = 5;
        break;
        
      case 'customer_satisfaction_5':
        points = 20;
        break;
        
      case 'customer_satisfaction_4':
        points = 10;
        break;
        
      case 'streak_day':
        points = 5;
        break;
        
      default:
        points = 0;
    }
    
    return points;
  };

  const checkAchievements = (stats: StaffStats): Achievement[] => {
    const newAchievements: Achievement[] = [];
    
    // First resolution
    if (stats.ticketsResolved >= 1) {
      newAchievements.push(sampleAchievements[0]);
    }
    
    // Speed demon (high resolution rate)
    if (stats.ticketsResolved >= 100 && stats.averageResolutionTime < 4) {
      newAchievements.push(sampleAchievements[1]);
    }
    
    // Customer hero (high satisfaction)
    if (stats.customerSatisfaction >= 4.8 && stats.ticketsResolved >= 50) {
      newAchievements.push(sampleAchievements[2]);
    }
    
    // Streak master
    if (stats.streak >= 30) {
      newAchievements.push(sampleAchievements[3]);
    }
    
    return newAchievements;
  };

  return { calculatePoints, checkAchievements };
};