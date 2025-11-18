import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Bell,
  Plus,
  ArrowRight,
  Activity,
  Star,
  Award,
  MessageSquare
} from 'lucide-react';
import api from '../config/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { data: dashboardData, isLoading, error: dashboardError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/api/company/dashboard').then(res => res.data.dashboard),
    refetchInterval: 30000,
    retry: false,
    onError: (error) => {
      console.error('Dashboard data error:', error);
    }
  });

  const { data: aiInsights, error: aiError } = useQuery({
    queryKey: ['aiInsights'],
    queryFn: () => api.get('/api/ai/company-insights').then(res => res.data.insights),
    refetchInterval: 60000,
    retry: false,
    onError: (error) => {
      console.error('AI insights error:', error);
    }
  });

  // Fetch Reviews data
  const { data: reviewsData, error: reviewsError } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => api.get('/api/reviews/dev').then(res => res.data),
    refetchInterval: 30000,
    retry: false,
    onError: (error) => {
      console.error('Reviews data error:', error);
    }
  });

  const { data: reviewsAnalytics, error: reviewsAnalyticsError } = useQuery({
    queryKey: ['reviewsAnalytics'],
    queryFn: () => api.get('/api/reviews/dev/analytics/overview').then(res => res.data),
    refetchInterval: 30000,
    retry: false,
    onError: (error) => {
      console.error('Reviews analytics error:', error);
    }
  });

  // Show loading only if we're actually loading and have no data
  if (isLoading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Use default values if data is not available
  const stats = dashboardData?.stats || {
    totalSurveys: 0,
    totalResponses: 0,
    totalReviews: 0,
    averageRating: 0
  };
  const recentSurveys = dashboardData?.recentSurveys || [];
  const responseTrends = dashboardData?.responseTrends || {};
  const reviews = reviewsData?.reviews || [];
  const reviewsStats = reviewsAnalytics?.analytics || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">Welcome back! Here's what's happening with your team.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/surveys/create"
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Survey
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Surveys Stats */}
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Surveys</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalSurveys || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Survey Responses</p>
              <p className="text-2xl font-bold text-secondary-900">{stats.totalResponses || 0}</p>
            </div>
          </div>
        </div>

        {/* Reviews Stats */}
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Reviews</p>
              <p className="text-2xl font-bold text-secondary-900">{reviewsStats.totalReviews || 0}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Completed Reviews</p>
              <p className="text-2xl font-bold text-secondary-900">{reviewsStats.completedReviews || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Surveys */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Surveys</h3>
            <Link
              to="/surveys"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentSurveys.length > 0 ? (
              recentSurveys.map((survey) => (
                <div key={survey._id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div>
                    <p className="font-medium text-secondary-900">{survey.title}</p>
                    <p className="text-sm text-secondary-600">
                      {survey.responseCount} responses • {survey.completionRate}% completion
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      survey.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-secondary-100 text-secondary-800'
                    }`}>
                      {survey.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600">No surveys yet</p>
                <Link
                  to="/surveys/create"
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  Create your first survey
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Reviews</h3>
            <Link
              to="/reviews"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((review) => (
                <div key={review._id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div>
                    <p className="font-medium text-secondary-900">Review for {review.reviewee.name}</p>
                    <p className="text-sm text-secondary-600">
                      {review.template.name} • {review.pointsEarned || 0} points
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      review.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : review.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-secondary-100 text-secondary-800'
                    }`}>
                      {review.status}
                    </span>
                    {review.overallRating && (
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-secondary-600 ml-1">{review.overallRating}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600">No reviews yet</p>
                <Link
                  to="/reviews"
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  View reviews
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">AI Insights</h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {aiInsights ? (
              <>
                {aiInsights.keyThemes && aiInsights.keyThemes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-secondary-700 mb-2">Key Themes</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiInsights.keyThemes.slice(0, 3).map((theme, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-secondary-700 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {aiInsights.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="text-sm text-secondary-600">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiInsights.blindSpots && aiInsights.blindSpots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-secondary-700 mb-2">Blind Spots</h4>
                    <ul className="space-y-1">
                      {aiInsights.blindSpots.slice(0, 2).map((spot, index) => (
                        <li key={index} className="text-sm text-red-600">
                          ⚠️ {spot}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600">No insights available yet</p>
                <p className="text-sm text-secondary-500">Complete some surveys to see AI insights</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/surveys/create"
            className="flex items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <Plus className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-secondary-900">Create Survey</p>
              <p className="text-sm text-secondary-600">Launch a new pulse survey</p>
            </div>
          </Link>
          
          <Link
            to="/reviews"
            className="flex items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-secondary-900">Employee Reviews</p>
              <p className="text-sm text-secondary-600">Manage peer reviews</p>
            </div>
          </Link>
          
          <Link
            to="/calendar"
            className="flex items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-secondary-900">Calendar Integration</p>
              <p className="text-sm text-secondary-600">Connect your calendar</p>
            </div>
          </Link>
          
          <Link
            to="/analytics"
            className="flex items-center p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-secondary-900">View Analytics</p>
              <p className="text-sm text-secondary-600">See detailed insights</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
