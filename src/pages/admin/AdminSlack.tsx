import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  MessageSquare, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Send,
  Hash,
  Bot,
  Zap,
  Trophy,
  BarChart3,
  Bell,
  Sparkles
} from 'lucide-react';
interface SlackStatus {
  enabled: boolean;
  configured: boolean;
  defaultChannel: string;
  alertsChannel: string;
  hasWebhook: boolean;
  frontendUrl: string;
  message: string;
}
export const AdminSlack: React.FC = () => {
  const [testChannel, setTestChannel] = useState('#sparksupport');
  const { token } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const { data: slackStatus, isLoading, error, refetch } = useQuery<SlackStatus>({
    queryKey: ['slack-status'],
    queryFn: async () => {
      const response = await fetch('http:
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Slack status');
      }
      return response.json();
    },
    enabled: !!token,
    staleTime: 30 * 1000, 
  });
  const testSlackMutation = useMutation({
    mutationFn: async (channel: string) => {
      const response = await fetch('http:
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channel })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send test message');
      }
      return response.json();
    },
    onSuccess: (data) => {
      addToast(`✅ Test message sent to ${data.channel}! Check your Slack workspace.`, 'success');
    },
    onError: (error) => {
      addToast(`❌ ${error instanceof Error ? error.message : 'Test failed'}`, 'error');
    }
  });
  const teamSummaryMutation = useMutation({
    mutationFn: async (period: string) => {
      const response = await fetch('http:
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ period })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send team summary');
      }
      return response.json();
    },
    onSuccess: (data) => {
      addToast(`📊 ${data.message}`, 'success');
    },
    onError: (error) => {
      addToast(`❌ ${error instanceof Error ? error.message : 'Summary failed'}`, 'error');
    }
  });
  const handleTestMessage = () => {
    testSlackMutation.mutate(testChannel);
  };
  const handleTeamSummary = (period: string) => {
    teamSummaryMutation.mutate(period);
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:bg-slate-900">
        <div className="relative text-center z-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/50">
              <div className="bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 p-4 rounded-2xl shadow-inner">
                <Bot className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Loading Slack Settings...
          </h2>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:bg-slate-900">
        <div className="relative text-center z-10 max-w-md mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Failed to Load Slack Settings
          </h1>
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
    <div className="space-y-8">
        <div className={`p-6 rounded-2xl border-2 ${
          slackStatus?.configured 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700' 
            : 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${
              slackStatus?.configured 
                ? 'bg-green-500' 
                : 'bg-orange-500'
            }`}>
              {slackStatus?.configured ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <XCircle className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${
                slackStatus?.configured 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-orange-800 dark:text-orange-200'
              }`}>
                {slackStatus?.configured ? 'Slack Connected' : 'Slack Not Configured'}
              </h3>
              <p className={`${
                slackStatus?.configured 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-orange-700 dark:text-orange-300'
              }`}>
                {slackStatus?.message}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="p-3 bg-white/50 dark:bg-white/10 rounded-xl hover:bg-white/70 dark:hover:bg-white/20 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Hash className="w-5 h-5" />
              <span>Channel Configuration</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <span className="text-blue-700 dark:text-blue-300 font-medium">Default Channel:</span>
                <code className="text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-800/30 px-2 py-1 rounded">
                  {slackStatus?.defaultChannel || '#sparksupport'}
                </code>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <span className="text-orange-700 dark:text-orange-300 font-medium">Alerts Channel:</span>
                <code className="text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-800/30 px-2 py-1 rounded">
                  {slackStatus?.alertsChannel || '#sparksupport-alerts'}
                </code>
              </div>
            </div>
          </div>
      <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-white/50 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
          <TestTube className="w-6 h-6" />
          <span>Test Integration</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Team Summary</h3>
            <div className="space-y-3">
              {['daily', 'weekly', 'monthly'].map((period) => (
                <button
                  key={period}
                  onClick={() => handleTeamSummary(period)}
                  disabled={teamSummaryMutation.isPending || !slackStatus?.configured}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Send {period.charAt(0).toUpperCase() + period.slice(1)} Summary</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {slackStatus?.configured && (
        <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-white/50 p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
            <Zap className="w-6 h-6" />
            <span>Live Integration Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'New Tickets',
                description: 'Automatic notifications when customers create tickets',
                icon: Bell,
                color: 'from-blue-500 to-cyan-500',
                active: true
              },
              {
                title: 'Status Updates', 
                description: 'Alerts when tickets are assigned, updated, or resolved',
                icon: BarChart3,
                color: 'from-green-500 to-emerald-500',
                active: true
              },
              {
                title: 'Achievements',
                description: 'Celebrate when staff unlock new achievements',
                icon: Trophy,
                color: 'from-yellow-500 to-orange-500',
                active: true
              },
              {
                title: 'Urgent Alerts',
                description: 'Special notifications for high-priority tickets',
                icon: Zap,
                color: 'from-red-500 to-pink-500',
                active: true
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-white/60 to-white/40 dark:from-white/10 dark:to-white/5 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                <div className="mt-3 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400 text-xs font-medium">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};