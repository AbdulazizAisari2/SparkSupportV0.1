import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, CheckCircle, AlertCircle, Save, Shield, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotificationService } from '../hooks/useNotificationService';

interface NotificationPreferences {
  emailNotificationsEnabled: boolean;
  inAppNotificationsEnabled: boolean;
  notifyOnTicketSubmitted: boolean;
  notifyOnStaffReply: boolean;
  notifyOnStatusChange: boolean;
}

export const NotificationPreferences: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { updateNotificationPreferences, getNotificationPreferences } = useNotificationService();
  
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotificationsEnabled: true,
    inAppNotificationsEnabled: true,
    notifyOnTicketSubmitted: true,
    notifyOnStaffReply: true,
    notifyOnStatusChange: true,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const result = await getNotificationPreferences();
      if (result.success && result.preferences) {
        setPreferences(result.preferences);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      addToast('Failed to load notification preferences', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateNotificationPreferences(preferences);
      if (result.success) {
        addToast('Notification preferences saved successfully!', 'success');
      } else {
        throw new Error(result.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      addToast('Failed to save notification preferences', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const PreferenceToggle: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    checked: boolean;
    onChange: () => void;
    color: string;
  }> = ({ title, description, icon: Icon, checked, onChange, color }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Notification Preferences
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Customize how you receive notifications from SparkSupport
            </p>
          </div>
        </div>

        {/* Global Settings */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Global Notification Settings
          </h2>
          <div className="space-y-4">
            <PreferenceToggle
              title="Email Notifications"
              description="Receive notifications via email"
              icon={Mail}
              checked={preferences.emailNotificationsEnabled}
              onChange={() => handleToggle('emailNotificationsEnabled')}
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <PreferenceToggle
              title="In-App Notifications"
              description="Show notifications within the SparkSupport app"
              icon={Smartphone}
              checked={preferences.inAppNotificationsEnabled}
              onChange={() => handleToggle('inAppNotificationsEnabled')}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
          </div>
        </div>

        {/* Specific Notification Types */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-purple-600" />
            Notification Types
          </h2>
          <div className="space-y-4">
            <PreferenceToggle
              title="Ticket Submitted"
              description="Get notified when you submit a new support ticket"
              icon={CheckCircle}
              checked={preferences.notifyOnTicketSubmitted}
              onChange={() => handleToggle('notifyOnTicketSubmitted')}
              color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            />
            <PreferenceToggle
              title="Staff Reply"
              description="Get notified when support staff replies to your ticket"
              icon={MessageSquare}
              checked={preferences.notifyOnStaffReply}
              onChange={() => handleToggle('notifyOnStaffReply')}
              color="bg-gradient-to-r from-cyan-500 to-cyan-600"
            />
            <PreferenceToggle
              title="Status Change"
              description="Get notified when your ticket status changes"
              icon={AlertCircle}
              checked={preferences.notifyOnStatusChange}
              onChange={() => handleToggle('notifyOnStatusChange')}
              color="bg-gradient-to-r from-orange-500 to-orange-600"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Changes are saved automatically when you toggle preferences
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-indigo-600" />
          How You'll Be Notified
        </h2>
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                preferences.notifyOnTicketSubmitted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  preferences.notifyOnTicketSubmitted ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                }`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Ticket Submitted</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {preferences.notifyOnTicketSubmitted ? 'You\'ll be notified' : 'No notifications'}
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                preferences.notifyOnStaffReply ? 'bg-cyan-100 dark:bg-cyan-900/30' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <MessageSquare className={`w-6 h-6 ${
                  preferences.notifyOnStaffReply ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400'
                }`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Staff Reply</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {preferences.notifyOnStaffReply ? 'You\'ll be notified' : 'No notifications'}
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                preferences.notifyOnStatusChange ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <AlertCircle className={`w-6 h-6 ${
                  preferences.notifyOnStatusChange ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                }`} />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Status Change</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {preferences.notifyOnStatusChange ? 'You\'ll be notified' : 'No notifications'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};