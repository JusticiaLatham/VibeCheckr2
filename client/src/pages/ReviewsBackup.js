import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Zap
} from 'lucide-react';
import axios from 'axios';

const Reviews = () => {
  const [activeTab, setActiveTab] = useState('my-reviews');
  
  // Debug: Log tab changes
  console.log('Current active tab:', activeTab);

  // Fetch user's reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Employee Reviews</h1>
          <p className="text-secondary-600 mt-1">
            Gamified feedback that's fun to complete
          </p>
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
              <Target className="h-6 w-6 text-blue-600" />
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
              onClick={() => setActiveTab(tab.id)}
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

      {/* Content */}
      {activeTab === 'my-reviews' && (
        <div className="space-y-4">
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-secondary-600 mt-2">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No pending reviews</h3>
              <p className="text-secondary-600">You're all caught up! Check back later for new review assignments.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg border border-secondary-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(review.status)}
                        <h3 className="text-lg font-semibold text-secondary-900">
                          Review for {review.reviewee?.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                          {review.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-secondary-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{getTimeUntilDue(review.dueDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{review.template?.estimatedTime || 5} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4" />
                          <span>{review.template?.gamification?.pointsPerQuestion * (review.template?.questions?.length || 5) || 50} points</span>
                        </div>
                      </div>

                      <p className="text-secondary-600 mb-4">
                        {review.template?.description || 'Provide feedback on collaboration, communication, execution, and ownership.'}
                      </p>

                      <div className="flex items-center space-x-3">
                        <button className="btn btn-primary">
                          {review.status === 'pending' ? 'Start Review' : 'Continue Review'}
                        </button>
                        {review.template?.questions?.some(q => q.responseType === 'voice') && (
                          <div className="flex items-center space-x-1 text-sm text-secondary-600">
                            <Mic className="h-4 w-4" />
                            <span>Voice feedback available</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No completed reviews</h3>
              <p className="text-secondary-600">Complete some reviews to see them here.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg border border-secondary-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h3 className="text-lg font-semibold text-secondary-900">
                          Review for {review.reviewee?.name}
                        </h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-secondary-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Completed {formatDate(review.completedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{review.completionTime || 0} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4" />
                          <span>{review.pointsEarned || 0} points</span>
                        </div>
                      </div>

                      {review.overallRating && (
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-sm font-medium text-secondary-600">Overall Rating:</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.overallRating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-secondary-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-secondary-600 ml-1">
                              {review.overallRating}/5
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <button className="btn btn-outline">
                          View Details
                        </button>
                        <button className="btn btn-outline">
                          View Insights
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'cycles' && (
        <div className="space-y-4">
          {cycles.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No review cycles</h3>
              <p className="text-secondary-600">Create a new review cycle to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {cycles.map((cycle) => (
                <div key={cycle._id} className="bg-white rounded-lg border border-secondary-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-secondary-900">{cycle.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          cycle.status === 'active' ? 'bg-green-100 text-green-800' :
                          cycle.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cycle.status}
                        </span>
                      </div>
                      
                      <p className="text-secondary-600 mb-4">{cycle.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-secondary-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(cycle.startDate)} - {formatDate(cycle.endDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{cycle.progress?.completionRate || 0}% complete</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{cycle.progress?.completedReviews || 0}/{cycle.progress?.totalReviews || 0} reviews</span>
                        </div>
                      </div>

                      <div className="w-full bg-secondary-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${cycle.progress?.completionRate || 0}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button className="btn btn-outline">
                          View Details
                        </button>
                        <button className="btn btn-outline">
                          View Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Debug indicator */}
          <div className="bg-red-500 text-white p-4 rounded-lg">
            🎉 ANALYTICS TAB IS WORKING! 🎉
          </div>
          
          {/* Review Analytics Header */}
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
                  <Clock className="h-6 w-6 text-blue-600" />
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
              <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Performance Trends
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-medium text-secondary-900">Collaboration</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">4.9</div>
                    <div className="text-sm text-secondary-600">+0.3 this month</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="font-medium text-secondary-900">Communication</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">4.6</div>
                    <div className="text-sm text-secondary-600">+0.2 this month</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span className="font-medium text-secondary-900">Execution</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">4.7</div>
                    <div className="text-sm text-secondary-600">+0.1 this month</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                    <span className="font-medium text-secondary-900">Ownership</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">4.5</div>
                    <div className="text-sm text-secondary-600">+0.4 this month</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
              <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Top Performers
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
                    <div>
                      <div className="font-semibold text-secondary-900">Sarah Johnson</div>
                      <div className="text-sm text-secondary-600">Engineering</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-600">4.9</div>
                    <div className="text-sm text-secondary-600">⭐ Perfect</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
                    <div>
                      <div className="font-semibold text-secondary-900">Alex Chen</div>
                      <div className="text-sm text-secondary-600">Design</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-600">4.8</div>
                    <div className="text-sm text-secondary-600">⭐ Excellent</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
                    <div>
                      <div className="font-semibold text-secondary-900">Maria Rodriguez</div>
                      <div className="text-sm text-secondary-600">Marketing</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-orange-600">4.7</div>
                    <div className="text-sm text-secondary-600">⭐ Great</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-3">🤖</span>
              AI-Powered Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3">💡 Key Insights</h4>
                <ul className="space-y-2 text-purple-100">
                  <li>• Team collaboration scores are consistently high</li>
                  <li>• Communication feedback shows positive trends</li>
                  <li>• Execution quality has improved 15% this quarter</li>
                  <li>• Ownership scores are trending upward</li>
                </ul>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-3">🎯 Recommendations</h4>
                <ul className="space-y-2 text-purple-100">
                  <li>• Continue current review frequency</li>
                  <li>• Focus on cross-team collaboration</li>
                  <li>• Celebrate high performers publicly</li>
                  <li>• Address any communication gaps</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Debug indicator */}
          <div className="bg-green-500 text-white p-4 rounded-lg">
            🔔 NOTIFICATIONS TAB IS WORKING! 🔔
          </div>
          
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
              <span className="mr-2">⚙️</span>
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
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Achievement Alerts</div>
                      <div className="text-sm text-secondary-600">Celebrate your wins and badges</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Progress Updates</div>
                      <div className="text-sm text-secondary-600">Weekly performance summaries</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Deadline Alerts</div>
                      <div className="text-sm text-secondary-600">Urgent review deadlines</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-pink-100 rounded-lg mr-3">
                      <MessageSquare className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Team Updates</div>
                      <div className="text-sm text-secondary-600">Team performance highlights</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                      <Zap className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900">Quick Actions</div>
                      <div className="text-sm text-secondary-600">Instant review shortcuts</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
              <span className="mr-2">📱</span>
              Recent Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <div className="p-2 bg-green-100 rounded-full mr-4">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-secondary-900">🎉 Achievement Unlocked!</h4>
                    <span className="text-sm text-secondary-500">2 hours ago</span>
                  </div>
                  <p className="text-secondary-600 mt-1">You earned the "Quick Reviewer" badge for completing reviews in record time!</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="p-2 bg-blue-100 rounded-full mr-4">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-secondary-900">⏰ Review Reminder</h4>
                    <span className="text-sm text-secondary-500">4 hours ago</span>
                  </div>
                  <p className="text-secondary-600 mt-1">You have 2 pending reviews due tomorrow. Don't forget to complete them!</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="p-2 bg-purple-100 rounded-full mr-4">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-secondary-900">📈 Performance Update</h4>
                    <span className="text-sm text-secondary-500">1 day ago</span>
                  </div>
                  <p className="text-secondary-600 mt-1">Your collaboration score improved by 0.3 points this week. Great job!</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="p-2 bg-orange-100 rounded-full mr-4">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-secondary-900">⚡ Quick Action</h4>
                    <span className="text-sm text-secondary-500">2 days ago</span>
                  </div>
                  <p className="text-secondary-600 mt-1">Complete your review for Alex Chen in just 2 minutes using voice feedback!</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                <div className="p-2 bg-pink-100 rounded-full mr-4">
                  <MessageSquare className="h-5 w-5 text-pink-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-secondary-900">👥 Team Highlight</h4>
                    <span className="text-sm text-secondary-500">3 days ago</span>
                  </div>
                  <p className="text-secondary-600 mt-1">Your team's overall performance score reached 4.7 this month. Outstanding work!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-3">🎛️</span>
              Advanced Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">Push Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">Slack Integration</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">SMS Alerts</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">Desktop Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">Weekly Digest</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
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
