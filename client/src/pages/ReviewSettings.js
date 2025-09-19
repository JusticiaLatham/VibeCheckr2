import React, { useState } from 'react';
import { 
  Settings, Clock, Target, Award, Users, 
  Calendar, Bell, Save, RotateCcw, AlertCircle
} from 'lucide-react';

const ReviewSettings = () => {
  const [settings, setSettings] = useState({
    // Review Frequency
    frequency: 'weekly',
    dayOfWeek: 'monday',
    timeOfDay: '09:00',
    
    // Points & Rewards
    pointsPerQuestion: 10,
    bonusPoints: 50,
    pointsForCompletion: 100,
    pointsForQuality: 25,
    
    // Promotion Rules
    reviewsForPromotion: 6,
    minRatingForPromotion: 4.0,
    timeInRole: 12, // months
    
    // Notifications
    reminderEnabled: true,
    reminderDays: 2,
    overdueEnabled: true,
    achievementEnabled: true,
    
    // Review Types
    peerReviewEnabled: true,
    managerReviewEnabled: true,
    selfReviewEnabled: true,
    upwardReviewEnabled: false,
    
    // Quality Settings
    minResponseLength: 50,
    requireExamples: true,
    autoSave: true,
    draftTimeout: 30 // minutes
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      frequency: 'weekly',
      dayOfWeek: 'monday',
      timeOfDay: '09:00',
      pointsPerQuestion: 10,
      bonusPoints: 50,
      pointsForCompletion: 100,
      pointsForQuality: 25,
      reviewsForPromotion: 6,
      minRatingForPromotion: 4.0,
      timeInRole: 12,
      reminderEnabled: true,
      reminderDays: 2,
      overdueEnabled: true,
      achievementEnabled: true,
      peerReviewEnabled: true,
      managerReviewEnabled: true,
      selfReviewEnabled: true,
      upwardReviewEnabled: false,
      minResponseLength: 50,
      requireExamples: true,
      autoSave: true,
      draftTimeout: 30
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">⚙️ Review Settings</h1>
          <p className="text-secondary-600">Configure your review system and gamification rules</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="btn btn-outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="btn btn-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Review Frequency */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-secondary-900">Review Frequency</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">Frequency</label>
            <select
              value={settings.frequency}
              onChange={(e) => handleSettingChange('frequency', e.target.value)}
              className="input"
            >
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          
          <div>
            <label className="label">Day of Week</label>
            <select
              value={settings.dayOfWeek}
              onChange={(e) => handleSettingChange('dayOfWeek', e.target.value)}
              className="input"
            >
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
            </select>
          </div>
          
          <div>
            <label className="label">Time of Day</label>
            <input
              type="time"
              value={settings.timeOfDay}
              onChange={(e) => handleSettingChange('timeOfDay', e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Points & Rewards */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Award className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-secondary-900">Points & Rewards</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="label">Points per Question</label>
            <input
              type="number"
              value={settings.pointsPerQuestion}
              onChange={(e) => handleSettingChange('pointsPerQuestion', parseInt(e.target.value))}
              className="input"
              min="1"
              max="100"
            />
          </div>
          
          <div>
            <label className="label">Bonus Points</label>
            <input
              type="number"
              value={settings.bonusPoints}
              onChange={(e) => handleSettingChange('bonusPoints', parseInt(e.target.value))}
              className="input"
              min="0"
              max="1000"
            />
          </div>
          
          <div>
            <label className="label">Completion Points</label>
            <input
              type="number"
              value={settings.pointsForCompletion}
              onChange={(e) => handleSettingChange('pointsForCompletion', parseInt(e.target.value))}
              className="input"
              min="0"
              max="1000"
            />
          </div>
          
          <div>
            <label className="label">Quality Points</label>
            <input
              type="number"
              value={settings.pointsForQuality}
              onChange={(e) => handleSettingChange('pointsForQuality', parseInt(e.target.value))}
              className="input"
              min="0"
              max="1000"
            />
          </div>
        </div>
      </div>

      {/* Promotion Rules */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-secondary-900">Promotion Rules</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">Reviews for Promotion</label>
            <input
              type="number"
              value={settings.reviewsForPromotion}
              onChange={(e) => handleSettingChange('reviewsForPromotion', parseInt(e.target.value))}
              className="input"
              min="1"
              max="50"
            />
            <p className="text-sm text-secondary-500 mt-1">
              Number of successful review cycles needed
            </p>
          </div>
          
          <div>
            <label className="label">Minimum Rating</label>
            <input
              type="number"
              step="0.1"
              value={settings.minRatingForPromotion}
              onChange={(e) => handleSettingChange('minRatingForPromotion', parseFloat(e.target.value))}
              className="input"
              min="1"
              max="5"
            />
            <p className="text-sm text-secondary-500 mt-1">
              Minimum average rating required
            </p>
          </div>
          
          <div>
            <label className="label">Time in Role (months)</label>
            <input
              type="number"
              value={settings.timeInRole}
              onChange={(e) => handleSettingChange('timeInRole', parseInt(e.target.value))}
              className="input"
              min="1"
              max="60"
            />
            <p className="text-sm text-secondary-500 mt-1">
              Minimum time in current role
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-secondary-900">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Review Reminders</p>
              <p className="text-sm text-secondary-500">Send reminders before reviews are due</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.reminderEnabled}
                onChange={(e) => handleSettingChange('reminderEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          {settings.reminderEnabled && (
            <div className="ml-6">
              <label className="label">Remind how many days before?</label>
              <select
                value={settings.reminderDays}
                onChange={(e) => handleSettingChange('reminderDays', parseInt(e.target.value))}
                className="input w-32"
              >
                <option value="1">1 day</option>
                <option value="2">2 days</option>
                <option value="3">3 days</option>
                <option value="7">1 week</option>
              </select>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Overdue Alerts</p>
              <p className="text-sm text-secondary-500">Notify when reviews are overdue</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.overdueEnabled}
                onChange={(e) => handleSettingChange('overdueEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Achievement Notifications</p>
              <p className="text-sm text-secondary-500">Celebrate when employees earn badges or points</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.achievementEnabled}
                onChange={(e) => handleSettingChange('achievementEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Review Types */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-secondary-900">Review Types</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Peer Reviews</p>
              <p className="text-sm text-secondary-500">Allow employees to review their colleagues</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.peerReviewEnabled}
                onChange={(e) => handleSettingChange('peerReviewEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Manager Reviews</p>
              <p className="text-sm text-secondary-500">Managers review their direct reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.managerReviewEnabled}
                onChange={(e) => handleSettingChange('managerReviewEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Self Reviews</p>
              <p className="text-sm text-secondary-500">Employees review their own performance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.selfReviewEnabled}
                onChange={(e) => handleSettingChange('selfReviewEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Upward Reviews</p>
              <p className="text-sm text-secondary-500">Employees review their managers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.upwardReviewEnabled}
                onChange={(e) => handleSettingChange('upwardReviewEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Quality Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-secondary-900">Quality Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Minimum Response Length</label>
            <input
              type="number"
              value={settings.minResponseLength}
              onChange={(e) => handleSettingChange('minResponseLength', parseInt(e.target.value))}
              className="input"
              min="10"
              max="500"
            />
            <p className="text-sm text-secondary-500 mt-1">
              Minimum characters required for text responses
            </p>
          </div>
          
          <div>
            <label className="label">Draft Timeout (minutes)</label>
            <input
              type="number"
              value={settings.draftTimeout}
              onChange={(e) => handleSettingChange('draftTimeout', parseInt(e.target.value))}
              className="input"
              min="5"
              max="120"
            />
            <p className="text-sm text-secondary-500 mt-1">
              Auto-save drafts every X minutes
            </p>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Require Examples</p>
              <p className="text-sm text-secondary-500">Ask for specific examples in feedback</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireExamples}
                onChange={(e) => handleSettingChange('requireExamples', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900">Auto-save</p>
              <p className="text-sm text-secondary-500">Automatically save progress as users type</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Status */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800">You have unsaved changes. Don't forget to save!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSettings;
