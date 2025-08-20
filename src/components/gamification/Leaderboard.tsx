import React, { useState } from 'react';
import { Trophy, Medal, Award, Star, Zap, Target, Crown, TrendingUp, Calendar, Users, Sparkles, Gift, Fire, Clock } from 'lucide-react';
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
  monthlyGrowth: number; // percentage growth from last month
  specialRecognition?: string;
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
  staffStats = mockStaffStats, 
  currentUserId,
  timeframe,
  onTimeframeChange 
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'points' | 'resolved' | 'satisfaction' | 'growth'>('points');
  const [showAchievements, setShowAchievements] = useState(false);

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

  const staffOfTheMonth = staffStats.find(s => s.specialRecognition === 'Staff of the Month');
  const topPerformer = sortedStats[0];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return { icon: Crown, color: 'text-yellow-500', bg: 'from-yellow-400 to-yellow-600', shadow: 'shadow-yellow-500/25' };
      case 2: return { icon: Medal, color: 'text-gray-500', bg: 'from-gray-400 to-gray-600', shadow: 'shadow-gray-500/25' };
      case 3: return { icon: Award, color: 'text-orange-600', bg: 'from-orange-400 to-orange-600', shadow: 'shadow-orange-500/25' };
      default: return { icon: Star, color: 'text-blue-500', bg: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/25' };
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
      {/* Staff of the Month Spotlight */}
      {staffOfTheMonth && (
        <div className="relative overflow-hidden bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl shadow-2xl animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <div className="relative p-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Crown className="w-10 h-10 text-yellow-600 animate-bounce-gentle" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  <h2 className="text-white font-bold text-xl">Staff of the Month</h2>
                </div>
                <h3 className="text-2xl font-black text-white mb-1">{staffOfTheMonth.name}</h3>
                <p className="text-yellow-100 font-medium">{staffOfTheMonth.department}</p>
                <div className="flex items-center space-x-4 mt-3 text-white/90 text-sm">
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{staffOfTheMonth.ticketsResolved} resolved</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{staffOfTheMonth.customerSatisfaction.toFixed(1)} rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Fire className="w-4 h-4" />
                    <span>{staffOfTheMonth.streak} day streak</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-white mb-1">{staffOfTheMonth.points}</div>
                <div className="text-yellow-100 text-sm font-medium">Total Points</div>
                <div className="flex items-center space-x-1 mt-2 text-white/90 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{staffOfTheMonth.monthlyGrowth}% this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                Performance rankings and achievements
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Timeframe Selector */}
            <div className="flex items-center bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-1">
              {timeframeOptions.map(option => {
                const Icon = option.icon;
                const isSelected = timeframe === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => onTimeframeChange(option.value as any)}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isSelected
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
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
        </div>

        {/* Metric Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metricOptions.map(option => {
            const Icon = option.icon;
            const isSelected = selectedMetric === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => setSelectedMetric(option.value as any)}
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

      {/* Top 3 Podium */}
      <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          🏆 Top Performers
        </h2>
        
        <div className="flex items-end justify-center space-x-8">
          {/* 2nd Place */}
          {sortedStats[1] && (
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative mb-4">
                <div className="w-20 h-16 bg-gradient-to-t from-gray-400 to-gray-500 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{sortedStats[1].name.charAt(0)}</span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{sortedStats[1].name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sortedStats[1].points} points</p>
            </div>
          )}

          {/* 1st Place */}
          {sortedStats[0] && (
            <div className="text-center animate-slide-up">
              <div className="relative mb-4">
                <div className="w-24 h-20 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-75 animate-glow"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                      <span className="text-white font-bold text-xl">{sortedStats[0].name.charAt(0)}</span>
                    </div>
                  </div>
                </div>
                <Crown className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-6 h-6 text-yellow-400 animate-bounce-gentle" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{sortedStats[0].name}</h3>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">{sortedStats[0].points} points</p>
              {sortedStats[0].specialRecognition && (
                <div className="mt-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-bold">
                  {sortedStats[0].specialRecognition}
                </div>
              )}
            </div>
          )}

          {/* 3rd Place */}
          {sortedStats[2] && (
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative mb-4">
                <div className="w-20 h-12 bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{sortedStats[2].name.charAt(0)}</span>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{sortedStats[2].name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sortedStats[2].points} points</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Rankings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Detailed Rankings</h2>
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium text-sm"
          >
            {showAchievements ? 'Hide' : 'Show'} Achievements
          </button>
        </div>

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
                <div className="flex items-center space-x-6">
                  {/* Rank Badge */}
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${rankConfig.bg} flex items-center justify-center shadow-xl ${rankConfig.shadow}`}>
                      <RankIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">
                      {rank}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {staff.name}
                        {isCurrentUser && (
                          <span className="ml-2 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-lg font-medium">
                            You
                          </span>
                        )}
                      </h3>
                      {staff.specialRecognition && (
                        <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full font-bold animate-pulse">
                          <Gift className="w-3 h-3 inline mr-1" />
                          {staff.specialRecognition}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {staff.department} • Level {staff.level}
                    </p>

                    {/* Level Progress */}
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

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-xl font-bold text-green-700 dark:text-green-300">
                          {staff.ticketsResolved}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">Resolved</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                          {staff.customerSatisfaction.toFixed(1)}★
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Rating</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="text-xl font-bold text-orange-700 dark:text-orange-300">
                          {staff.streak}
                        </div>
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">Day Streak</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-xl font-bold text-blue-700 dark:text-blue-300 flex items-center justify-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>+{staff.monthlyGrowth}%</span>
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Growth</div>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {showAchievements && (
                    <div className="flex flex-col items-center space-y-3 animate-slide-up">
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">Achievements</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {staff.achievements.map((achievement) => (
                          <AchievementBadge
                            key={achievement.id}
                            achievement={achievement}
                            size="sm"
                            showTooltip={true}
                          />
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weekly Challenge */}
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

          {/* Customer Satisfaction Challenge */}
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="font-bold text-green-900 dark:text-green-300">Satisfaction Goal</h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                Maintain 4.5+ average rating this month
              </p>
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-3 mb-3">
                <div className="h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
                <span>4.6/5.0 rating</span>
                <span>🎯 On track!</span>
              </div>
            </div>
          </div>

          {/* Speed Challenge */}
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