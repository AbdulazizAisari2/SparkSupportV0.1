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

  // Fetch Slack status
  const { data: slackStatus, isLoading, error, refetch } = useQuery<SlackStatus>({
    queryKey: ['slack-status'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/slack/status', {
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
    staleTime: 30 * 1000, // 30 seconds
  });

  // Test Slack message mutation
  const testSlackMutation = useMutation({
    mutationFn: async (channel: string) => {
      const response = await fetch('http://localhost:8000/api/slack/test', {
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

  // Send team summary mutation
  const teamSummaryMutation = useMutation({
    mutationFn: async (period: string) => {
      const response = await fetch('http://localhost:8000/api/slack/summary', {
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
      {/* Header */}
      <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-white/50 p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur opacity-75 animate-pulse"></div>
            <div className="relative bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg">
              <Bot className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Slack Integration
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect SparkSupport with your Slack workspace for team collaboration
            </p>
          </div>
        </div>

        {/* Status Card */}
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

      {/* Configuration Info */}
      <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-white/50 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
          <Settings className="w-6 h-6" />
          <span>Configuration Status</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Channel Settings */}
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

          {/* Integration Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Available Features</span>
            </h3>
            
            <div className="space-y-2">
              {[
                { icon: Bell, text: 'New ticket notifications', color: 'text-blue-600' },
                { icon: BarChart3, text: 'Status update alerts', color: 'text-green-600' },
                { icon: Trophy, text: 'Achievement celebrations', color: 'text-yellow-600' },
                { icon: Zap, text: 'Urgent ticket alerts', color: 'text-red-600' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                  <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testing Section */}
      <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-white/50 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
          <TestTube className="w-6 h-6" />
          <span>Test Integration</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Message */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Send Test Message</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Channel:
                </label>
                <input
                  type="text"
                  value={testChannel}
                  onChange={(e) => setTestChannel(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="#sparksupport"
                />
              </div>
              
              <button
                onClick={handleTestMessage}
                disabled={testSlackMutation.isPending || !slackStatus?.configured}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {testSlackMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Test Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Team Summary */}
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

      {/* Setup Instructions */}
      {!slackStatus?.configured && (
        <div className="bg-gradient-to-r from-white/90 to-white/80 dark:from-white/25 dark:to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200/50 dark:border-white/50 p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
            <Settings className="w-6 h-6" />
            <span>Setup Instructions</span>
          </h2>

          <div className="prose dark:prose-invert max-w-none">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                🔧 How to Set Up Slack Integration:
              </h3>
              
              <ol className="space-y-4 text-blue-700 dark:text-blue-300">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <strong>Create Slack App:</strong> Go to <code>https://api.slack.com/apps</code> and create a new app called "SparkSupport Bot"
                  </div>
                </li>
                
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <strong>Add Bot Scopes:</strong> OAuth & Permissions → Add scopes: <code>chat:write</code>, <code>channels:read</code>, <code>users:read</code>, <code>commands</code>
                  </div>
                </li>
                
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <strong>Install to Workspace:</strong> Install the app to your workspace and copy the Bot User OAuth Token
                  </div>
                </li>
                
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <strong>Update .env:</strong> Add <code>SLACK_BOT_TOKEN=xoxb-your-token</code> and <code>SLACK_ENABLED=true</code>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  <div>
                    <strong>Create Channels:</strong> Create <code>#sparksupport</code> and <code>#sparksupport-alerts</code> channels and invite the bot
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
              <h4 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">💡 Pro Tip:</h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Once configured, SparkSupport will automatically send beautiful rich messages to Slack when tickets are created, updated, or resolved. Staff can interact with tickets directly from Slack using buttons!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Demo Section */}
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