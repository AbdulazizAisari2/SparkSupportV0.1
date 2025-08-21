import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Zap, Brain, MessageSquare, Star, Rocket, Clock, Users, Target, Shield, Crown } from 'lucide-react';

export const AISupport: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [animatedText, setAnimatedText] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);

  const aiFeatures = [
    {
      icon: Brain,
      title: 'Smart Ticket Analysis',
      description: 'AI analyzes ticket content and suggests optimal solutions',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Instant Response Generator',
      description: 'Generate professional responses in seconds',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Target,
      title: 'Priority Prediction',
      description: 'AI determines ticket urgency automatically',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Customer Sentiment Analysis',
      description: 'Understand customer emotions and tone',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Knowledge Base Assistant',
      description: 'Find relevant solutions from your knowledge base',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const comingSoonText = "AI Support Assistant";

  useEffect(() => {
    // Animate coming soon text
    let i = 0;
    const timer = setInterval(() => {
      if (i <= comingSoonText.length) {
        setAnimatedText(comingSoonText.slice(0, i));
        i++;
      } else {
        setShowComingSoon(true);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Cycle through features
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % aiFeatures.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const currentAIFeature = aiFeatures[currentFeature];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-dark-950 dark:via-purple-950 dark:to-pink-950"></div>
      
      {/* Floating AI Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-3xl blur-2xl opacity-60 animate-glow"></div>
                <div className="relative bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-dark-700/50">
                  <Bot className="w-20 h-20 text-purple-600 dark:text-purple-400 animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
                {animatedText}
              </span>
              <span className="animate-pulse">|</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI-powered assistant to supercharge your support team with intelligent insights, 
              automated responses, and predictive analytics.
            </p>

            {showComingSoon && (
              <div className="animate-slide-up">
                <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-6 h-6 animate-spin" />
                  <span className="text-xl font-bold">Coming Soon</span>
                  <Sparkles className="w-6 h-6 animate-spin" style={{ animationDirection: 'reverse' }} />
                </div>
              </div>
            )}
          </div>

          {/* AI Features Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Feature Showcase */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                🚀 Powered by Advanced AI
              </h2>

              <div className="space-y-6">
                {aiFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = index === currentFeature;
                  
                  return (
                    <div
                      key={index}
                      className={`
                        p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer
                        ${isActive
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-xl scale-105'
                          : 'border-gray-200 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 hover:border-purple-300 dark:hover:border-purple-600'
                        }
                      `}
                      onClick={() => setCurrentFeature(index)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`
                          p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg
                          ${isActive ? 'animate-bounce-gentle' : ''}
                        `}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="text-purple-500 animate-pulse">
                            <Sparkles className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Interface Preview */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-dark-700/50 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Bot className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">AI Assistant</h3>
                      <p className="text-purple-100 text-sm">Ready to help you resolve tickets faster</p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages Preview */}
                <div className="p-6 space-y-4 h-96 overflow-hidden">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-tl-none p-4 max-w-xs">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        Hi! I'm your AI assistant. How can I help you with this ticket?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl rounded-tr-none p-4 max-w-xs text-white">
                      <p className="text-sm">
                        Can you help me draft a response for an angry customer?
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">M</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-tl-none p-4 max-w-sm">
                      <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                        I'll help you craft a professional, empathetic response. Here's a suggestion:
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border-l-4 border-blue-500">
                        <p className="text-xs text-blue-800 dark:text-blue-300 italic">
                          "I sincerely apologize for the inconvenience you've experienced..."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-tl-none p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input Preview */}
                <div className="border-t border-gray-200 dark:border-dark-600 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-100 dark:bg-dark-700 rounded-xl p-3 opacity-50">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ask AI anything about this ticket...</p>
                    </div>
                    <button className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl opacity-50">
                      <Rocket className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center p-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Smart Conversations</h3>
              <p className="text-gray-600 dark:text-gray-400">Natural language processing for intelligent ticket discussions</p>
            </div>

            <div className="text-center p-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Quality Assurance</h3>
              <p className="text-gray-600 dark:text-gray-400">AI reviews responses for tone, accuracy, and professionalism</p>
            </div>

            <div className="text-center p-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Productivity Boost</h3>
              <p className="text-gray-600 dark:text-gray-400">Resolve tickets 3x faster with AI-powered assistance</p>
            </div>
          </div>

          {/* Coming Soon Timeline */}
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                🚀 Launch Timeline
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We're working hard to bring you the most advanced AI support system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-white font-bold">✓</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phase 1</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">UI Design Complete</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-pulse">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phase 2</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gemini API Integration</p>
              </div>

              <div className="text-center opacity-50">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phase 3</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Smart Features</p>
              </div>

              <div className="text-center opacity-30">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phase 4</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Full Launch</p>
              </div>
            </div>
          </div>

          {/* Notify Me Section */}
          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Be the First to Know!</h3>
              <p className="mb-6 text-purple-100">
                Get notified when AI Support launches and be among the first to experience the future of customer support.
              </p>
              
              <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email for updates..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  disabled
                />
                <button
                  className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg opacity-50 cursor-not-allowed"
                  disabled
                >
                  Notify Me
                </button>
              </div>
              
              <p className="text-xs text-purple-200 mt-4">
                * Email notifications will be available when AI Support launches
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Google Gemini AI • Built with ❤️ for SparkSupport
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};