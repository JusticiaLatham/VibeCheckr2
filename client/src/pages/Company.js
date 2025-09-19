import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, 
  Upload, 
  Plus, 
  Save, 
  Users, 
  FileText,
  Target,
  Settings,
  Sparkles,
  Star,
  Trophy,
  Gift,
  Clock,
  Award
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Company = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);

  const { data: company, isLoading, refetch } = useQuery({
    queryKey: ['company'],
    queryFn: () => axios.get('/api/company').then(res => res.data.company),
    refetchInterval: 30000
  });

  const { data: insights } = useQuery({
    queryKey: ['companyInsights'],
    queryFn: () => axios.get('/api/company/insights').then(res => res.data.insights),
    refetchInterval: 60000
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('handbook', file);

    try {
      await axios.post('/api/company/upload-handbook', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Handbook uploaded successfully!');
      refetch();
    } catch (error) {
      console.error('Error uploading handbook:', error);
      toast.error('Failed to upload handbook');
    } finally {
      setUploading(false);
    }
  };

  const handleCoreValuesUpdate = async (values) => {
    try {
      await axios.post('/api/company/core-values', { values });
      toast.success('Core values updated successfully!');
      refetch();
    } catch (error) {
      console.error('Error updating core values:', error);
      toast.error('Failed to update core values');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'values', label: 'Core Values', icon: Target },
    { id: 'handbook', label: 'Handbook', icon: FileText },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'reviews', label: 'Review Settings', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Company</h1>
          <p className="text-secondary-600">Manage your company profile and AI configuration</p>
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
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Company Name</label>
                  <p className="text-secondary-900 font-medium">{company?.name}</p>
                </div>
                <div>
                  <label className="label">Industry</label>
                  <p className="text-secondary-900 font-medium">{company?.industry}</p>
                </div>
                <div>
                  <label className="label">Company Size</label>
                  <p className="text-secondary-900 font-medium">{company?.size} employees</p>
                </div>
                <div>
                  <label className="label">Domain</label>
                  <p className="text-secondary-900 font-medium">{company?.domain}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">AI Configuration Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Company Handbook</span>
                  <div className="flex items-center space-x-2">
                    {company?.handbook?.processed ? (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Uploaded
                      </div>
                    ) : (
                      <div className="flex items-center text-secondary-400">
                        <div className="w-2 h-2 bg-secondary-300 rounded-full mr-2"></div>
                        Not uploaded
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Core Values</span>
                  <div className="flex items-center space-x-2">
                    {company?.coreValues && company.coreValues.length > 0 ? (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {company.coreValues.length} values
                      </div>
                    ) : (
                      <div className="flex items-center text-secondary-400">
                        <div className="w-2 h-2 bg-secondary-300 rounded-full mr-2"></div>
                        Not set
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Calendar Integration</span>
                  <div className="flex items-center space-x-2">
                    {company?.calendarIntegration?.enabled ? (
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Connected
                      </div>
                    ) : (
                      <div className="flex items-center text-secondary-400">
                        <div className="w-2 h-2 bg-secondary-300 rounded-full mr-2"></div>
                        Not connected
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Core Values Tab */}
        {activeTab === 'values' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Core Values</h3>
            <p className="text-secondary-600 mb-6">
              Define your company's core values to help AI generate more relevant and aligned survey questions.
            </p>
            
            <CoreValuesForm 
              values={company?.coreValues || []} 
              onSave={handleCoreValuesUpdate}
            />
          </div>
        )}

        {/* Handbook Tab */}
        {activeTab === 'handbook' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Company Handbook</h3>
            <p className="text-secondary-600 mb-6">
              Upload your company handbook to help AI understand your culture, policies, and values for better survey generation.
            </p>
            
            <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-secondary-900 mb-2">
                {company?.handbook?.processed ? 'Handbook Uploaded' : 'Upload Company Handbook'}
              </h4>
              <p className="text-secondary-600 mb-4">
                {company?.handbook?.processed 
                  ? `Uploaded on ${new Date(company.handbook.uploadedAt).toLocaleDateString()}`
                  : 'Upload a PDF, Word document, or text file'
                }
              </p>
              
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="handbook-upload"
              />
              <label
                htmlFor="handbook-upload"
                className="btn btn-primary btn-md cursor-pointer"
              >
                {uploading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {uploading ? 'Uploading...' : 'Upload Handbook'}
              </label>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">AI-Generated Insights</h3>
              {insights ? (
                <div className="space-y-6">
                  {insights.keyThemes && insights.keyThemes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-secondary-700 mb-3">Key Themes</h4>
                      <div className="flex flex-wrap gap-2">
                        {insights.keyThemes.map((theme, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {insights.recommendations && insights.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-secondary-700 mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {insights.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-secondary-600">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insights.blindSpots && insights.blindSpots.length > 0 && (
                    <div>
                      <h4 className="font-medium text-secondary-700 mb-3">Blind Spots</h4>
                      <ul className="space-y-2">
                        {insights.blindSpots.map((spot, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-secondary-600">{spot}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600">No AI insights available yet</p>
                  <p className="text-sm text-secondary-500">Complete some surveys to see AI-generated insights</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Review Settings Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Review Frequency Settings */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary-600" />
                Review Frequency
              </h3>
              <p className="text-secondary-600 mb-6">
                Configure how often reviews are scheduled and the review cycle structure.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Review Frequency</label>
                  <select className="input">
                    <option value="quarterly">Quarterly (Every 3 months)</option>
                    <option value="bi-annual">Bi-Annual (Every 6 months)</option>
                    <option value="annual">Annual (Every 12 months)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="label">Review Types</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox checkbox-primary mr-3" defaultChecked />
                      <span className="text-sm">360° Reviews (Managers, Peers, Direct Reports)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox checkbox-primary mr-3" defaultChecked />
                      <span className="text-sm">Self-Assessment</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="checkbox checkbox-primary mr-3" />
                      <span className="text-sm">Manager-Only Reviews</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Gamification Settings */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Gamification & Rewards
              </h3>
              <p className="text-secondary-600 mb-6">
                Set up the alien ladder progression system and points-to-cash rewards.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Points per Review Performance</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Exceeds Expectations</span>
                      <input type="number" className="input w-20" defaultValue="100" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Meets Expectations</span>
                      <input type="number" className="input w-20" defaultValue="75" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Needs Improvement</span>
                      <input type="number" className="input w-20" defaultValue="25" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="label">Bonus Points</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">On-time Completion</span>
                      <input type="number" className="input w-20" defaultValue="25" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Detailed Feedback</span>
                      <input type="number" className="input w-20" defaultValue="50" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Voice Recording</span>
                      <input type="number" className="input w-20" defaultValue="75" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotion Ladder Settings */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-600" />
                Alien Promotion Ladder
              </h3>
              <p className="text-secondary-600 mb-6">
                Configure how many successful review cycles are needed for promotions and compensation changes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Promotion Requirements</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Junior → Mid Level</span>
                      <input type="number" className="input w-20" defaultValue="2" />
                      <span className="text-sm text-secondary-500">cycles</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Mid → Senior Level</span>
                      <input type="number" className="input w-20" defaultValue="3" />
                      <span className="text-sm text-secondary-500">cycles</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Senior → Lead</span>
                      <input type="number" className="input w-20" defaultValue="4" />
                      <span className="text-sm text-secondary-500">cycles</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="label">Performance Threshold</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Minimum Rating for Promotion</span>
                      <select className="input w-32">
                        <option value="3.5">3.5+ Stars</option>
                        <option value="4.0">4.0+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Consecutive Cycles Required</span>
                      <input type="number" className="input w-20" defaultValue="2" min="1" max="5" />
                      <span className="text-sm text-secondary-500">cycles</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash-Out Rewards */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <Gift className="h-5 w-5 mr-2 text-green-600" />
                Points to Cash Rewards
              </h3>
              <p className="text-secondary-600 mb-6">
                Set up the points-to-cash conversion system for employee rewards.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Reward Tiers</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">$25 Gift Card</span>
                      <input type="number" className="input w-24" defaultValue="75000" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">$50 Gift Card</span>
                      <input type="number" className="input w-24" defaultValue="150000" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">$100 Gift Card</span>
                      <input type="number" className="input w-24" defaultValue="300000" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">$250 Gift Card</span>
                      <input type="number" className="input w-24" defaultValue="750000" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="label">Reward Settings</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Minimum Cash-Out</span>
                      <input type="number" className="input w-24" defaultValue="25000" />
                      <span className="text-sm text-secondary-500">points</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Points Expire After</span>
                      <input type="number" className="input w-20" defaultValue="12" />
                      <span className="text-sm text-secondary-500">months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Monthly Cash-Out Limit</span>
                      <input type="number" className="input w-20" defaultValue="500" />
                      <span className="text-sm text-secondary-500">dollars</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="btn btn-primary btn-lg">
                <Save className="h-4 w-4 mr-2" />
                Save Review Settings
              </button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Company Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="label">Survey Frequency</label>
                <select className="input">
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="label">Timezone</label>
                <select className="input">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Working Hours Start</label>
                  <input type="time" className="input" defaultValue="09:00" />
                </div>
                <div>
                  <label className="label">Working Hours End</label>
                  <input type="time" className="input" defaultValue="17:00" />
                </div>
              </div>

              <button className="btn btn-primary btn-md">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Core Values Form Component
const CoreValuesForm = ({ values, onSave }) => {
  const [coreValues, setCoreValues] = useState(values);

  const addValue = () => {
    setCoreValues([...coreValues, { value: '', description: '', importance: 5 }]);
  };

  const updateValue = (index, field, value) => {
    const newValues = [...coreValues];
    newValues[index] = { ...newValues[index], [field]: value };
    setCoreValues(newValues);
  };

  const removeValue = (index) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const validValues = coreValues.filter(v => v.value.trim() !== '');
    onSave(validValues);
  };

  return (
    <div className="space-y-4">
      {coreValues.map((value, index) => (
        <div key={index} className="border border-secondary-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Value</label>
              <input
                type="text"
                value={value.value}
                onChange={(e) => updateValue(index, 'value', e.target.value)}
                className="input"
                placeholder="e.g., Innovation"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <input
                type="text"
                value={value.description}
                onChange={(e) => updateValue(index, 'description', e.target.value)}
                className="input"
                placeholder="Brief description"
              />
            </div>
            <div>
              <label className="label">Importance (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={value.importance}
                onChange={(e) => updateValue(index, 'importance', parseInt(e.target.value))}
                className="input"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeValue(index)}
            className="mt-2 text-red-600 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addValue}
          className="btn btn-outline btn-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Value
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="btn btn-primary btn-md"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Values
        </button>
      </div>
    </div>
  );
};

export default Company;
