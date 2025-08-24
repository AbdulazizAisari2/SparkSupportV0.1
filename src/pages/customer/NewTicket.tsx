import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Send, MessageSquare, Tag, AlertTriangle, HelpCircle, CreditCard, Settings, Sparkles, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCreateTicket, useCategories } from '../../hooks/useApi';
import { TicketTemplate } from '../../components/tickets/TicketTemplates';
import { UploadedFile } from '../../components/ui/FileUpload';
import { useNotificationService } from '../../hooks/useNotificationService';

const ticketSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  subject: z.string().min(1, 'Subject is required').max(255, 'Subject too long'),
  description: z.string().min(1, 'Description is required'),
});

type TicketFormData = z.infer<typeof ticketSchema>;

// Helper function to get category icon by name
const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case 'technical support': return Settings;
    case 'billing': return CreditCard;
    case 'account access': return Tag;
    case 'feature request': return Star;
    case 'bug report': return HelpCircle;
    default: return MessageSquare;
  }
};

// Helper function to get priority styling
const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-600';
    case 'medium':
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-600';
    case 'high':
      return 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-600';
    case 'urgent':
      return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-600';
    default:
      return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  }
};

export const NewTicket: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const createTicketMutation = useCreateTicket();
  const { data: categories = [] } = useCategories();
  const { sendNotification } = useNotificationService();
  


  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: 'medium',
    },
  });

  const watchedCategory = watch('categoryId');
  const watchedPriority = watch('priority');

  // Helper functions
  const getCategoryConfig = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'technical support': 
        return { icon: Settings, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-600', text: 'text-blue-700 dark:text-blue-300' };
      case 'billing': 
        return { icon: CreditCard, color: 'from-green-500 to-emerald-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-600', text: 'text-green-700 dark:text-green-300' };
      case 'account access': 
        return { icon: Tag, color: 'from-orange-500 to-red-600', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-600', text: 'text-orange-700 dark:text-orange-300' };
      case 'feature request': 
        return { icon: Star, color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-600', text: 'text-yellow-700 dark:text-yellow-300' };
      case 'bug report': 
        return { icon: HelpCircle, color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-600', text: 'text-purple-700 dark:text-purple-300' };
      default: 
        return { icon: MessageSquare, color: 'from-gray-500 to-slate-600', bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200 dark:border-gray-600', text: 'text-gray-700 dark:text-gray-300' };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'low':
        return { icon: Star, color: 'from-green-400 to-emerald-500', label: 'Low Priority', desc: 'Can wait, not urgent' };
      case 'medium':
        return { icon: MessageSquare, color: 'from-blue-400 to-cyan-500', label: 'Medium Priority', desc: 'Normal response time' };
      case 'high':
        return { icon: AlertTriangle, color: 'from-orange-400 to-yellow-500', label: 'High Priority', desc: 'Needs quick attention' };
      case 'urgent':
        return { icon: Sparkles, color: 'from-red-400 to-pink-500', label: 'Urgent', desc: 'Critical - immediate help needed' };
      default:
        return { icon: MessageSquare, color: 'from-blue-400 to-cyan-500', label: 'Medium Priority', desc: 'Normal response time' };
    }
  };

  const onSubmit = async (data: TicketFormData) => {
    if (!user) return;

    try {
      console.log('🎫 Creating ticket with data:', data);
      
      const result = await createTicketMutation.mutateAsync({
        categoryId: data.categoryId,
        priority: data.priority,
        subject: data.subject,
        description: data.description
      });

      console.log('✅ Ticket created:', result);
      
      // Send notification for ticket submission
      if (result.ticket?.id) {
        await sendNotification({
          type: 'ticket_submitted',
          ticketId: result.ticket.id,
          ticketSubject: data.subject,
          recipientUserId: user.id,
          metadata: {
            description: data.description
          }
        });
      }
      
      addToast(`🎉 Ticket ${result.ticket?.id} created successfully! Our team will respond soon.`, 'success');
      navigate('/my/tickets'); // Navigate to tickets list instead of detail page
    } catch (error) {
      console.error('❌ Ticket creation failed:', error);
      addToast(`Failed to create ticket: ${error instanceof Error ? error.message : 'Please try again.'}`, 'error');
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setValue('categoryId', categoryId);
  };

  const handlePrioritySelect = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    setSelectedPriority(priority);
    setValue('priority', priority);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-purple-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-200 dark:bg-primary-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate('/my/tickets')}
            className="group p-3 rounded-xl bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm border border-gray-200 dark:border-dark-600 hover:bg-white dark:hover:bg-dark-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Create New Ticket</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Tell us how we can help you today</p>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 dark:bg-dark-700/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-dark-600">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick & Easy</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-dark-600/50 shadow-2xl p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Category Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-primary-500" />
                    <label className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      What type of help do you need? *
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {categories.map((category) => {
                      const config = getCategoryConfig(category.name);
                      const Icon = config.icon;
                      const isSelected = watchedCategory === category.id;
                      
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategorySelect(category.id)}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all duration-300 group text-left
                            ${isSelected 
                              ? `${config.bg} ${config.border} ${config.text} shadow-lg ring-2 ring-primary-200 dark:ring-primary-700` 
                              : 'bg-white dark:bg-dark-700 border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`
                              p-3 rounded-lg bg-gradient-to-r ${config.color} text-white shadow-lg
                              ${isSelected ? 'animate-pulse' : 'group-hover:scale-110'}
                              transition-transform duration-200
                            `}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {category.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {category.description}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Selected</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.categoryId && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-slide-down">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.categoryId.message}</span>
                    </p>
                  )}
                  <input type="hidden" {...register('categoryId')} />
                </div>

                {/* Priority Selection */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-primary-500" />
                    <label className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      How urgent is this issue? *
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => {
                      const config = getPriorityConfig(priority);
                      const Icon = config.icon;
                      const isSelected = watchedPriority === priority;
                      
                      return (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => handlePrioritySelect(priority)}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all duration-300 group text-center
                            ${isSelected 
                              ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-lg scale-105 ring-2 ring-primary-200 dark:ring-primary-700' 
                              : 'bg-white dark:bg-dark-700 border-gray-200 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md hover:scale-102'
                            }
                          `}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className={`
                              p-2 rounded-lg bg-gradient-to-r ${config.color} text-white shadow-lg
                              ${isSelected ? 'animate-pulse' : 'group-hover:scale-110'}
                              transition-transform duration-200
                            `}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                {config.label}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {config.desc}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1">
                              <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.priority && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-slide-down">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.priority.message}</span>
                    </p>
                  )}
                  <input type="hidden" {...register('priority')} />
                </div>

                {/* Subject */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-primary-500" />
                    <label htmlFor="subject" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      What's the main issue? *
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      {...register('subject')}
                      id="subject"
                      type="text"
                      placeholder="Brief, clear description of your issue..."
                      className={`
                        w-full px-4 py-3 text-lg border-2 rounded-xl transition-all duration-300 
                        bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm
                        placeholder-gray-400 dark:placeholder-gray-500
                        text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                        hover:bg-white dark:hover:bg-dark-700 hover:shadow-md
                        ${errors.subject 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-dark-600'
                        }
                      `}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.subject && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-slide-down">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.subject.message}</span>
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-primary-500" />
                    <label htmlFor="description" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Tell us more details *
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      {...register('description')}
                      id="description"
                      rows={6}
                      placeholder="Please provide as much detail as possible. What happened? What were you trying to do? Any error messages?"
                      className={`
                        w-full px-4 py-3 border-2 rounded-xl resize-none transition-all duration-300
                        bg-white/80 dark:bg-dark-700/80 backdrop-blur-sm
                        placeholder-gray-400 dark:placeholder-gray-500
                        text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                        hover:bg-white dark:hover:bg-dark-700 hover:shadow-md
                        ${errors.description 
                          ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                          : 'border-gray-200 dark:border-dark-600'
                        }
                      `}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1 animate-slide-down">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.description.message}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-dark-600">
                  <button
                    type="button"
                    onClick={() => navigate('/my/tickets')}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-600 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-500 transition-all duration-300 hover:shadow-md font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTicketMutation.isPending}
                    className="group relative flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl hover:from-primary-600 hover:to-purple-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Send className="w-5 h-5 group-hover:animate-pulse" />
                    <span>{createTicketMutation.isPending ? 'Creating Your Ticket...' : 'Create Ticket'}</span>
                    {createTicketMutation.isPending && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-400/50 to-purple-500/50 animate-pulse"></div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar with Live Preview & Tips */}
          <div className="space-y-6">
            {/* Selected Category Preview */}
            {watchedCategory && (
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-dark-600/50 shadow-xl p-6 animate-slide-down">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryConfig(watchedCategory).color} text-white shadow-lg`}>
                    {React.createElement(getCategoryConfig(watchedCategory).icon, { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Selected Category</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {categories.find(c => c.id === watchedCategory)?.name}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {categories.find(c => c.id === watchedCategory)?.description}
                </p>
              </div>
            )}

            {/* Selected Priority Preview */}
            {watchedPriority && (
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-dark-600/50 shadow-xl p-6 animate-slide-down">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getPriorityConfig(watchedPriority).color} text-white shadow-lg`}>
                    {React.createElement(getPriorityConfig(watchedPriority).icon, { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Priority Level</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getPriorityConfig(watchedPriority).label}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getPriorityConfig(watchedPriority).desc}
                </p>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 backdrop-blur-xl rounded-2xl border border-primary-200/50 dark:border-primary-600/50 shadow-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-primary-700 dark:text-primary-300">Tips for faster help</h3>
              </div>
              <ul className="space-y-3 text-sm text-primary-600 dark:text-primary-400">
                <li className="flex items-start space-x-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Be specific about what you were trying to do</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Include any error messages you saw</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>Mention your browser or device if relevant</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span>The more details, the faster we can help!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};