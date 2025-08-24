import React, { useState } from 'react';
import { FileText, Zap, Bug, HelpCircle, Settings, CreditCard, Smartphone } from 'lucide-react';
export interface TicketTemplate {
  id: string;
  name: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  tags: string[];
}
const ticketTemplates: TicketTemplate[] = [
  {
    id: 'login-issue',
    name: 'Login Problem',
    category: '1', 
    priority: 'high',
    subject: 'Unable to access my account',
    description: 'I am experiencing difficulties logging into my account. Please help me resolve this issue.\n\nSteps I\'ve tried:\n- Clearing browser cache\n- Trying different browsers\n- Checking my internet connection\n\nError message (if any): [Please describe any error messages you see]',
    icon: Bug,
    color: 'from-red-500 to-red-600',
    tags: ['login', 'authentication', 'access']
  },
  {
    id: 'billing-inquiry',
    name: 'Billing Question',
    category: '2', 
    priority: 'medium',
    subject: 'Question about my billing',
    description: 'I have a question regarding my recent invoice or billing statement.\n\nSpecific concern:\n[Please describe your billing question]\n\nInvoice number (if applicable): \nBilling period: \n\nPlease provide clarification on the charges or help resolve any discrepancies.',
    icon: CreditCard,
    color: 'from-blue-500 to-blue-600',
    tags: ['billing', 'invoice', 'payment']
  },
  {
    id: 'feature-request',
    name: 'Feature Request',
    category: '3', 
    priority: 'low',
    subject: 'Feature suggestion for improvement',
    description: 'I would like to suggest a new feature or improvement to the system.\n\nFeature description:\n[Please describe the feature you\'d like to see]\n\nBusiness justification:\n[Explain how this would benefit users]\n\nExpected behavior:\n[Describe how the feature should work]',
    icon: Zap,
    color: 'from-purple-500 to-purple-600',
    tags: ['feature', 'enhancement', 'suggestion']
  },
  {
    id: 'technical-support',
    name: 'Technical Support',
    category: '1', 
    priority: 'high',
    subject: 'Technical issue requiring assistance',
    description: 'I need technical assistance with a system issue.\n\nProblem description:\n[Describe the technical issue you\'re experiencing]\n\nSteps to reproduce:\n1. [First step]\n2. [Second step]\n3. [Third step]\n\nExpected result: [What should happen]\nActual result: [What actually happens]\n\nBrowser/Device information:\n- Browser: \n- Operating System: \n- Device: ',
    icon: Settings,
    color: 'from-orange-500 to-orange-600',
    tags: ['technical', 'bug', 'system']
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Issue',
    category: '1', 
    priority: 'medium',
    subject: 'Mobile application problem',
    description: 'I\'m experiencing an issue with the mobile application.\n\nDevice information:\n- Device model: \n- Operating system version: \n- App version: \n\nProblem description:\n[Describe the issue you\'re experiencing]\n\nScreenshots (if applicable): [Please attach screenshots if helpful]',
    icon: Smartphone,
    color: 'from-green-500 to-green-600',
    tags: ['mobile', 'app', 'ios', 'android']
  },
  {
    id: 'general-help',
    name: 'General Help',
    category: '3', 
    priority: 'low',
    subject: 'General question or help request',
    description: 'I need general assistance or have a question about the service.\n\nQuestion/Request:\n[Please describe what you need help with]\n\nAdditional context:\n[Any additional information that might be helpful]',
    icon: HelpCircle,
    color: 'from-indigo-500 to-indigo-600',
    tags: ['help', 'question', 'general']
  }
];
interface TicketTemplatesProps {
  onSelectTemplate: (template: TicketTemplate) => void;
  className?: string;
}
export const TicketTemplates: React.FC<TicketTemplatesProps> = ({ onSelectTemplate, className = '' }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const handleTemplateSelect = (template: TicketTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Choose a Template
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select a template to get started quickly with pre-filled content
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ticketTemplates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          return (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-105 hover:shadow-xl
                ${isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 hover:border-primary-300 dark:hover:border-primary-600'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${template.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {template.subject}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center animate-scale-in">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300">Custom Template</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Don't see what you need? You can also create a custom ticket from scratch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export { ticketTemplates };