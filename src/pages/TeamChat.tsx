import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Zap, Heart, Shield, Star, Rocket, Clock, Target, Bell, Crown, Send, Smile, Paperclip, Video, Phone } from 'lucide-react';

export const TeamChat: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [animatedText, setAnimatedText] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [typingDots, setTypingDots] = useState(0);

  const teamChatFeatures = [
    {
      icon: MessageCircle,
      title: 'Real-time Team Communication',
      description: 'Instant messaging with your support team members',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Performance',
      description: 'Optimized for speed with instant message delivery',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'End-to-end encryption for all team conversations',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: 'Context-Aware Threads',
      description: 'Organize discussions around specific tickets and topics',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Star,
      title: 'Smart Notifications',
      description: 'Intelligent alerts that keep you informed without overwhelming',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const comingSoonText = "Team Chat Hub";

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
      setCurrentFeature((prev) => (prev + 1) % teamChatFeatures.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Animate typing dots
    const timer = setInterval(() => {
      setTypingDots((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const currentTeamFeature = teamChatFeatures[currentFeature];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-dark-950 dark:via-blue-950 dark:to-purple-950"></div>
      
      {/* Floating Chat Bubbles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-7xl w-full">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-60 animate-glow"></div>
                <div className="relative bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-dark-700/50">
                  <Users className="w-20 h-20 text-blue-600 dark:text-blue-400 animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {animatedText}
              </span>
              <span className="animate-pulse">|</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect, collaborate, and communicate with your team like never before. 
              Experience seamless real-time messaging designed for modern support teams.
            </p>

            {showComingSoon && (
              <div className="animate-slide-up">
                <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Heart className="w-6 h-6 animate-pulse text-pink-300" />
                  <span className="text-xl font-bold">Coming Soon</span>
                  <Heart className="w-6 h-6 animate-pulse text-pink-300" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Features & Chat Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Feature Showcase */}
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                🚀 Next-Gen Team Communication
              </h2>

              <div className="space-y-6">
                {teamChatFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = index === currentFeature;
                  
                  return (
                    <div
                      key={index}
                      className={`
                        p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer
                        ${isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-xl scale-105'
                          : 'border-gray-200 dark:border-dark-600 bg-white/50 dark:bg-dark-800/50 hover:border-blue-300 dark:hover:border-blue-600'
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
                          <div className="text-blue-500 animate-pulse">
                            <Star className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Chat Interface Preview */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-dark-700/50 overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Support Team Alpha</h3>
                        <p className="text-blue-100 text-sm flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>5 members online</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages Preview */}
                <div className="p-6 space-y-4 h-96 overflow-hidden">
                  {/* System Message */}
                  <div className="text-center">
                    <div className="inline-block bg-gray-100 dark:bg-dark-700 px-4 py-2 rounded-full text-xs text-gray-600 dark:text-gray-400">
                      Sarah joined the team chat
                    </div>
                  </div>

                  {/* Team Member Message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">S</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Sarah</span>
                        <span className="text-xs text-gray-500">Just now</span>
                      </div>
                      <div className="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-tl-sm p-4 max-w-sm">
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          Hey team! Just resolved the urgent ticket #1247. Customer was really happy with our response time! 🎉
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Another Team Member Message */}
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">M</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Mike</span>
                        <span className="text-xs text-gray-500">2 min ago</span>
                      </div>
                      <div className="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-tl-sm p-4 max-w-sm">
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          Awesome work Sarah! 🚀 I'm working on the follow-up documentation for that issue.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current User Message */}
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="flex-1 flex justify-end">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl rounded-tr-sm p-4 max-w-sm text-white">
                        <p className="text-sm">
                          Great teamwork everyone! This is exactly why our team rocks 💪
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">You</span>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-dark-700 rounded-2xl rounded-tl-sm p-4">
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <span className="text-sm">Alex is typing</span>
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((dot) => (
                            <div
                              key={dot}
                              className={`w-2 h-2 bg-gray-400 rounded-full transition-opacity duration-300 ${
                                dot < typingDots ? 'opacity-100' : 'opacity-30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input Preview */}
                <div className="border-t border-gray-200 dark:border-dark-600 p-4">
                  <div className="flex items-center space-x-3">
                    <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-50">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 bg-gray-100 dark:bg-dark-700 rounded-xl p-3 opacity-50">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Type your message to the team...</p>
                    </div>
                    <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-50">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl opacity-50">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center p-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Rich Messaging</h3>
              <p className="text-gray-600 dark:text-gray-400">Emojis, file sharing, and formatted text support</p>
            </div>

            <div className="text-center p-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Smart Notifications</h3>
              <p className="text-gray-600 dark:text-gray-400">Customizable alerts for mentions and important messages</p>
            </div>

            <div className="text-center p-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Team Productivity</h3>
              <p className="text-gray-600 dark:text-gray-400">Boost collaboration and reduce response times</p>
            </div>
          </div>

          {/* Coming Soon Timeline */}
          <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-700/50 p-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                🚀 Development Timeline
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Building the most intuitive team communication platform for support teams
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-white font-bold">✓</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phase 1</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">UI/UX Design Complete</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg animate-pulse">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phase 2</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time Infrastructure</p>
              </div>

              <div className="text-center opacity-50">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phase 3</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Core Chat Features</p>
              </div>

              <div className="text-center opacity-30">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Phase 4</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Launch & Polish</p>
              </div>
            </div>
          </div>

          {/* Beta Access Section */}
          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Join the Beta Program!</h3>
              <p className="mb-6 text-blue-100">
                Be among the first to experience Team Chat and help shape the future of team communication in SparkSupport.
              </p>
              
              <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email for early access..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  disabled
                />
                <button
                  className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg opacity-50 cursor-not-allowed"
                  disabled
                >
                  Join Beta
                </button>
              </div>
              
              <p className="text-xs text-blue-200 mt-4">
                * Beta program will open when Phase 2 is complete
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by WebSockets & Real-time Technology • Built with 💙 for SparkSupport
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};