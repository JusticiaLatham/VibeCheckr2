import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const { data: companyAnalytics, isLoading: companyLoading } = useQuery({
    queryKey: ['companyAnalytics', timeframe],
    queryFn: () => axios.get(`/api/analytics/company?timeframe=${timeframe}`).then(res => res.data.analytics),
    refetchInterval: 60000
  });

  const { data: executiveData, isLoading: executiveLoading } = useQuery({
    queryKey: ['executiveDashboard'],
    queryFn: () => axios.get('/api/analytics/executive').then(res => res.data.executiveDashboard),
    refetchInterval: 60000
  });

  const { data: surveys } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => axios.get('/api/surveys').then(res => res.data.surveys)
  });

  const { data: surveyAnalytics, isLoading: surveyLoading } = useQuery({
    queryKey: ['surveyAnalytics', selectedSurvey],
    queryFn: () => selectedSurvey ? 
      axios.get(`/api/analytics/survey/${selectedSurvey}`).then(res => res.data.analytics) : 
      null,
    enabled: !!selectedSurvey
  });

  if (companyLoading || executiveLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const engagement = companyAnalytics?.engagement || {};
  const distribution = companyAnalytics?.distribution || {};
  const aiInsights = companyAnalytics?.aiInsights || {};

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-600">Insights and trends from your team surveys</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="input"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Executive Overview */}
      {executiveData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Employees</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {executiveData.overview?.totalEmployees || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Response Rate</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {executiveData.overview?.responseRate || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Active Surveys</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {executiveData.overview?.activeSurveys || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Responses</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {executiveData.overview?.totalResponses || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Indicators */}
      {executiveData?.riskIndicators && executiveData.riskIndicators.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Risk Indicators</h3>
          <div className="space-y-3">
            {executiveData.riskIndicators.map((risk, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                risk.severity === 'high' 
                  ? 'border-red-500 bg-red-50' 
                  : risk.severity === 'medium'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex items-start">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 mr-3 ${
                    risk.severity === 'high' 
                      ? 'text-red-600' 
                      : risk.severity === 'medium'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">{risk.message}</p>
                    <p className="text-sm text-secondary-600 mt-1">{risk.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Response Trends</h3>
          {engagement.responseTrends && Object.keys(engagement.responseTrends).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={Object.entries(engagement.responseTrends).map(([date, count]) => ({
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                responses: count
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="responses" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-secondary-500">
              No response data available
            </div>
          )}
        </div>

        {/* Survey Type Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Survey Types</h3>
          {distribution.surveyTypes && Object.keys(distribution.surveyTypes).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(distribution.surveyTypes).map(([type, count]) => ({
                    name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    value: count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(distribution.surveyTypes).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-secondary-500">
              No survey data available
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">AI Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiInsights.keyThemes && aiInsights.keyThemes.length > 0 && (
              <div>
                <h4 className="font-medium text-secondary-700 mb-3">Key Themes</h4>
                <div className="space-y-2">
                  {aiInsights.keyThemes.slice(0, 5).map((theme, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-sm text-secondary-600">{theme}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-secondary-700 mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {aiInsights.recommendations.slice(0, 5).map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-secondary-600">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiInsights.riskAreas && aiInsights.riskAreas.length > 0 && (
              <div>
                <h4 className="font-medium text-secondary-700 mb-3">Areas of Concern</h4>
                <div className="space-y-2">
                  {aiInsights.riskAreas.slice(0, 5).map((risk, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-secondary-600">{risk.area || risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Individual Survey Analytics */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Individual Survey Analytics</h3>
          <select
            value={selectedSurvey || ''}
            onChange={(e) => setSelectedSurvey(e.target.value || null)}
            className="input"
          >
            <option value="">Select a survey</option>
            {surveys?.map((survey) => (
              <option key={survey._id} value={survey._id}>
                {survey.title}
              </option>
            ))}
          </select>
        </div>

        {selectedSurvey && surveyLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : selectedSurvey && surveyAnalytics ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <p className="text-2xl font-bold text-secondary-900">
                  {surveyAnalytics.totalResponses}
                </p>
                <p className="text-sm text-secondary-600">Total Responses</p>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <p className="text-2xl font-bold text-secondary-900">
                  {surveyAnalytics.completionRate}%
                </p>
                <p className="text-sm text-secondary-600">Completion Rate</p>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <p className="text-2xl font-bold text-secondary-900">
                  {Math.round(surveyAnalytics.averageCompletionTime / 60)}m
                </p>
                <p className="text-sm text-secondary-600">Avg. Time</p>
              </div>
            </div>

            {surveyAnalytics.questionAnalytics && surveyAnalytics.questionAnalytics.length > 0 && (
              <div>
                <h4 className="font-medium text-secondary-700 mb-4">Question Analysis</h4>
                <div className="space-y-4">
                  {surveyAnalytics.questionAnalytics.map((qa, index) => (
                    <div key={index} className="border border-secondary-200 rounded-lg p-4">
                      <h5 className="font-medium text-secondary-900 mb-2">{qa.questionText}</h5>
                      <div className="text-sm text-secondary-600">
                        <p>Type: {qa.questionType} • Responses: {qa.responseCount}</p>
                        {qa.analytics && (
                          <div className="mt-2">
                            {qa.analytics.average && (
                              <p>Average: {qa.analytics.average.toFixed(1)}</p>
                            )}
                            {qa.analytics.yesPercentage && (
                              <p>Yes: {qa.analytics.yesPercentage}%</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : selectedSurvey ? (
          <div className="text-center py-8 text-secondary-500">
            No analytics data available for this survey
          </div>
        ) : (
          <div className="text-center py-8 text-secondary-500">
            Select a survey to view detailed analytics
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
