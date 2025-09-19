import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Bell, 
  Settings, 
  Mail, 
  Smartphone, 
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  TestTube
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [testType, setTestType] = useState('push');

  const { data: notifications, isLoading: notificationsLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => axios.get('/api/notifications').then(res => res.data.notifications),
    refetchInterval: 30000
  });

  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['notificationPreferences'],
    queryFn: () => axios.get('/api/notifications/preferences').then(res => res.data.preferences)
  });

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      await axios.put('/api/notifications/preferences', newPreferences);
      toast.success('Notification preferences updated');
      refetch();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const sendTestNotification = async () => {
    try {
      await axios.post('/api/notifications/test', {
        type: testType,
        title: 'Test Notification',
        body: 'This is a test notification from VibeCheckr'
      });
      toast.success('Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
    }
  };

  if (notificationsLoading || preferencesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Notifications</h1>
          <p className="text-secondary-600">Manage your notification preferences and view recent alerts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Test Notification */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Test Notifications</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="input"
                >
                  <option value="push">Push Notification</option>
                  <option value="email">Email Notification</option>
                </select>
                <button
                  onClick={sendTestNotification}
                  className="btn btn-outline btn-md"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Send Test
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900">Recent Notifications</h3>
                <span className="text-sm text-secondary-600">
                  {notifications?.length || 0} notifications
                </span>
              </div>
              
              {notifications && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read 
                          ? 'bg-secondary-50 border-secondary-200' 
                          : 'bg-white border-primary-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-secondary-900">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-secondary-600 mb-2">
                            {notification.body}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-secondary-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(notification.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {notification.data?.type && (
                              <span className="px-2 py-1 bg-secondary-100 rounded-full">
                                {notification.data.type}
                              </span>
                            )}
                          </div>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="ml-4 text-primary-600 hover:text-primary-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">No notifications yet</p>
                  <p className="text-sm text-secondary-500">You'll receive notifications about important survey insights and milestones</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Notification Preferences</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-secondary-700 mb-4">Notification Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-secondary-400" />
                        <div>
                          <p className="font-medium text-secondary-900">Email Notifications</p>
                          <p className="text-sm text-secondary-600">Receive notifications via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences?.email !== false}
                          onChange={(e) => updatePreferences({ email: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-secondary-400" />
                        <div>
                          <p className="font-medium text-secondary-900">Push Notifications</p>
                          <p className="text-sm text-secondary-600">Receive push notifications on your device</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences?.push !== false}
                          onChange={(e) => updatePreferences({ push: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-secondary-400" />
                        <div>
                          <p className="font-medium text-secondary-900">Survey Reminders</p>
                          <p className="text-sm text-secondary-600">Get reminded about pending surveys</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences?.surveyReminders !== false}
                          onChange={(e) => updatePreferences({ surveyReminders: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-secondary-200 pt-6">
                  <h4 className="font-medium text-secondary-700 mb-4">Notification Frequency</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="frequency-realtime"
                        name="frequency"
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="frequency-realtime" className="text-sm text-secondary-700">
                        Real-time (immediate notifications)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="frequency-daily"
                        name="frequency"
                        className="text-primary-600 focus:ring-primary-500"
                        defaultChecked
                      />
                      <label htmlFor="frequency-daily" className="text-sm text-secondary-700">
                        Daily digest (once per day)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="frequency-weekly"
                        name="frequency"
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="frequency-weekly" className="text-sm text-secondary-700">
                        Weekly digest (once per week)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Types Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">What You'll Be Notified About</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-secondary-900">High-Interest Events</h4>
                    <p className="text-sm text-secondary-600">When AI detects important milestones or all-hands meetings</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-secondary-900">Survey Insights</h4>
                    <p className="text-sm text-secondary-600">Important findings from survey responses that need attention</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-secondary-900">Survey Reminders</h4>
                    <p className="text-sm text-secondary-600">Reminders to complete pending surveys</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Settings className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-secondary-900">System Updates</h4>
                    <p className="text-sm text-secondary-600">Important updates about your VibeCheckr account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
