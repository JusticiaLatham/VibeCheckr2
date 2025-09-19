import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Users, 
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Mic,
  Award,
  Bell,
  MessageSquare,
  Zap,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  BarChart3,
  Settings,
  Activity,
  TrendingDown,
  UserCheck,
  Timer,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Mail,
  Smartphone,
  Volume2
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('my-reviews');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['my-reviews', 'completed', 'cycles', 'analytics', 'notifications'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Fetch user's reviews
  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', activeTab],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5001/api/reviews/dev');
      return response.data;
    }
  });

  // Fetch review cycles
  const { data: cyclesData } = useQuery({
    queryKey: ['review-cycles'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5001/api/reviews/dev/cycles');
      return response.data;
    }
  });

  // Fetch analytics
  const { data: analyticsData } = useQuery({
    queryKey: ['review-analytics'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5001/api/reviews/dev/analytics/overview');
      return response.data;
    }
  });

  const reviews = reviewsData?.reviews || [];
  const cycles = cyclesData?.cycles || [];
  const analytics = analyticsData?.analytics || {};

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const completedReviews = reviews.filter(r => r.status === 'completed');

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.reviewee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      in_progress: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      overdue: { color: 'bg-red-100 text-red-800', label: 'Overdue' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      peer_review: 'Peer Review',
      manager_review: 'Manager Review',
      self_review: 'Self Review',
      '360_review': '360 Review'
    };
    return typeLabels[type] || type;
  };

  if (reviewsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Employee Reviews</h1>
          <p className="text-secondary-600">Gamified feedback that's fun to complete</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-secondary-600">
            <Trophy className="h-4 w-4" />
            <span>1,250 points earned</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-secondary-600">
            <Award className="h-4 w-4" />
            <span>5 badges</span>
          </div>
          <Link
            to="/reviews/create"
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Review
          </Link>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Reviews</p>
              <p className="text-2xl font-bold text-secondary-900">{analytics.totalReviews || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{analytics.completedReviews || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{analytics.pendingReviews || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Avg Rating</p>
              <p className="text-2xl font-bold text-secondary-900">
                {analytics.averageRating ? analytics.averageRating.toFixed(1) : '0.0'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'my-reviews', label: 'My Reviews', count: reviews.filter(r => r.status === 'pending' || r.status === 'in_progress').length },
            { id: 'completed', label: 'Completed', count: reviews.filter(r => r.status === 'completed').length },
            { id: 'cycles', label: 'Review Cycles', count: cycles.length },
            { id: 'analytics', label: 'Analytics', count: null, icon: '📊' },
            { id: 'notifications', label: 'Notifications', count: null, icon: '🔔' }
          ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                      }`}
                    >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-secondary-100 text-secondary-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'my-reviews' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full sm:w-48"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review._id} className="bg-white shadow rounded-lg p-6 border border-secondary-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary-900">Review for {review.reviewee.name}</h3>
                    {getStatusBadge(review.status)}
                  </div>
                  <p className="text-secondary-600 text-sm mb-2">
                    Template: {review.template.name} ({getTypeLabel(review.template.type)})
                  </p>
                  <p className="text-secondary-600 text-sm mb-4">
                    Due: {new Date(review.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center text-secondary-700 text-sm mb-4">
                    <Clock className="h-4 w-4 mr-2 text-primary-500" />
                    Estimated time: {review.template.estimatedTime} mins
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-secondary-600">
                      <Award className="h-4 w-4 mr-1" />
                      {review.pointsEarned || 0} points
                    </div>
                    <button className="btn btn-primary btn-sm">Start Review</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No reviews found</h3>
                <p className="text-secondary-600">No reviews match your current filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search completed reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full sm:w-48"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Completed Reviews Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedReviews.length > 0 ? (
              completedReviews.map((review) => (
                <div key={review._id} className="bg-white shadow rounded-lg p-6 border border-secondary-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary-900">Review for {review.reviewee.name}</h3>
                    {getStatusBadge(review.status)}
                  </div>
                  <p className="text-secondary-600 text-sm mb-2">
                    Template: {review.template.name} ({getTypeLabel(review.template.type)})
                  </p>
                  <p className="text-secondary-600 text-sm mb-4">
                    Completed on: {new Date(review.completedAt).toLocaleDateString()}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-secondary-700 text-sm">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      Overall Rating: {review.overallRating || 'N/A'}
                    </div>
                    <div className="flex items-center text-secondary-700 text-sm">
                      <Award className="h-4 w-4 mr-2 text-purple-500" />
                      Points Earned: {review.pointsEarned}
                    </div>
                    <div className="flex items-center text-secondary-700 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-primary-500" />
                      Completion Time: {review.completionTime} mins
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {review.badgesEarned?.map((badge, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {badge}
                        </span>
                      ))}
                    </div>
                    <button className="btn btn-outline btn-sm">View Details</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <CheckCircle className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No completed reviews</h3>
                <p className="text-secondary-600">Complete some reviews to see them here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'cycles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-secondary-900">Review Cycles</h2>
            <button className="btn btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Cycle
            </button>
          </div>

          {cycles.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No review cycles</h3>
              <p className="text-secondary-600">Create a new review cycle to get started.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {cycles.map((cycle) => (
                <div key={cycle._id} className="bg-white shadow rounded-lg p-6 border border-secondary-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-secondary-900">{cycle.name}</h3>
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                      cycle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-secondary-100 text-secondary-800'
                    }`}>
                      {cycle.status}
                    </span>
                  </div>
                  <p className="text-secondary-600 text-sm mb-2">{cycle.description}</p>
                  <p className="text-secondary-600 text-sm mb-4">
                    {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                  </p>
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-secondary-800 mb-2">Progress:</h4>
                    <div className="w-full bg-secondary-200 rounded-full h-2.5">
                      <div
                        className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${cycle.progress?.completionRate || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-secondary-600 mt-1">
                      {cycle.progress?.completedReviews || 0} of {cycle.progress?.totalReviews || 0} reviews completed ({cycle.progress?.completionRate || 0}%)
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4">
                    <button className="btn btn-outline">
                      View Details
                    </button>
                    <button className="btn btn-outline">
                      View Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">📊 Review Analytics</h2>
                <p className="text-purple-100 text-lg">Insights that drive performance and engagement</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">4.7</div>
                <div className="text-purple-100">Overall Rating</div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">Completion Rate</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">94%</p>
              <p className="text-sm text-secondary-600">+12% from last month</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Timer className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">Avg. Time</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">3.2m</p>
              <p className="text-sm text-secondary-600">Faster than target</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">Quality Score</h3>
              <p className="text-3xl font-bold text-purple-600 mb-2">4.8</p>
              <p className="text-sm text-secondary-600">Excellent feedback</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">Engagement</h3>
              <p className="text-3xl font-bold text-orange-600 mb-2">89%</p>
              <p className="text-sm text-secondary-600">Highly engaged</p>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Performance Trends</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-600">Collaboration</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-secondary-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-semibold text-secondary-900">4.2</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-600">Communication</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-secondary-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-semibold text-secondary-900">3.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-600">Execution</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-secondary-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-semibold text-secondary-900">4.6</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-600">Ownership</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-secondary-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                    <span className="text-sm font-semibold text-secondary-900">4.4</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">Top Performers</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      A
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">Alex Chen</p>
                      <p className="text-sm text-secondary-600">Engineering</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">4.8</p>
                    <p className="text-xs text-secondary-500">avg rating</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      M
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">Maria Rodriguez</p>
                      <p className="text-sm text-secondary-600">Design</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">4.6</p>
                    <p className="text-xs text-secondary-500">avg rating</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      S
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">Sarah Johnson</p>
                      <p className="text-sm text-secondary-600">Marketing</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">4.5</p>
                    <p className="text-xs text-secondary-500">avg rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Powered Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                <Zap className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">AI-Powered Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <h4 className="font-semibold text-secondary-900 mb-2">🎯 Focus Areas</h4>
                <p className="text-sm text-secondary-600">Team collaboration scores are trending up 15% this quarter. Consider recognizing top collaborators.</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-indigo-100">
                <h4 className="font-semibold text-secondary-900 mb-2">📈 Growth Opportunities</h4>
                <p className="text-sm text-secondary-600">Communication feedback suggests room for improvement in cross-team coordination.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Notifications Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">🔔 Review Notifications</h2>
                <p className="text-green-100 text-lg">Stay on top of your feedback game</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">12</div>
                <div className="text-green-100">Active Alerts</div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Notification Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Review Reminders</div>
                      <div className="text-sm text-secondary-600">Get notified about pending reviews</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Completion Alerts</div>
                      <div className="text-sm text-secondary-600">When reviews are completed</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Overdue Warnings</div>
                      <div className="text-sm text-secondary-600">When reviews are overdue</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Achievement Badges</div>
                      <div className="text-sm text-secondary-600">When you earn new badges</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <Activity className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Weekly Digest</div>
                      <div className="text-sm text-secondary-600">Summary of review activity</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-pink-100 rounded-lg mr-3">
                      <TrendingUp className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Performance Insights</div>
                      <div className="text-sm text-secondary-600">AI-generated insights and trends</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Recent Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-secondary-900">New Review Assigned</h4>
                    <span className="text-xs text-secondary-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-1">You have a new peer review for Alex Chen due in 3 days.</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="p-2 bg-green-100 rounded-full mr-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-secondary-900">Review Completed</h4>
                    <span className="text-xs text-secondary-500">1 day ago</span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-1">Your review for Maria Rodriguez has been completed. You earned 150 points!</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="p-2 bg-purple-100 rounded-full mr-4">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-secondary-900">Badge Earned</h4>
                    <span className="text-xs text-secondary-500">3 days ago</span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-1">Congratulations! You earned the "Quick Reviewer" badge for completing reviews ahead of schedule.</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="p-2 bg-yellow-100 rounded-full mr-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-secondary-900">Review Overdue</h4>
                    <span className="text-xs text-secondary-500">5 days ago</span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-1">Your review for Sarah Johnson is overdue. Please complete it as soon as possible.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Preferences */}
          <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Advanced Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Notification Frequency</label>
                  <select className="input w-full">
                    <option>Immediate</option>
                    <option>Hourly</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Quiet Hours</label>
                  <div className="flex space-x-2">
                    <input type="time" className="input flex-1" defaultValue="22:00" />
                    <span className="flex items-center text-secondary-500">to</span>
                    <input type="time" className="input flex-1" defaultValue="08:00" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Preferred Channels</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-sm text-secondary-700 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-sm text-secondary-700 flex items-center">
                        <Smartphone className="h-4 w-4 mr-1" />
                        Push Notifications
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-secondary-700 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Slack
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;