import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Play, 
  Pause, 
  BarChart3,
  Users,
  Calendar,
  Eye
} from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Surveys = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: surveys, isLoading, refetch } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => axios.get('/api/surveys').then(res => res.data.surveys),
    refetchInterval: 30000
  });

  const filteredSurveys = surveys?.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleLaunchSurvey = async (surveyId) => {
    try {
      await axios.post(`/api/surveys/${surveyId}/launch`);
      refetch();
    } catch (error) {
      console.error('Error launching survey:', error);
    }
  };

  const handleCloseSurvey = async (surveyId) => {
    try {
      await axios.post(`/api/surveys/${surveyId}/close`);
      refetch();
    } catch (error) {
      console.error('Error closing survey:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      closed: { color: 'bg-gray-100 text-gray-800', label: 'Closed' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      onboarding_1week: '1 Week Onboarding',
      onboarding_60day: '60 Day Check-in',
      onboarding_90day: '90 Day Check-in',
      onboarding_6month: '6 Month Review',
      onboarding_1year: '1 Year Review',
      monthly_pulse: 'Monthly Pulse',
      milestone_survey: 'Milestone Survey',
      all_hands_followup: 'All-Hands Follow-up',
      custom: 'Custom Survey'
    };
    return typeLabels[type] || type;
  };

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-secondary-900">Surveys</h1>
          <p className="text-secondary-600">Manage and track your employee pulse surveys</p>
        </div>
        <Link
          to="/surveys/create"
          className="btn btn-primary btn-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Survey
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search surveys..."
              className="input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <div key={survey._id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                  {survey.title}
                </h3>
                <p className="text-sm text-secondary-600 mb-2">
                  {getTypeLabel(survey.type)}
                </p>
                {getStatusBadge(survey.status)}
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 text-secondary-400 hover:text-secondary-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Questions</span>
                <span className="font-medium">{survey.questions?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Responses</span>
                <span className="font-medium">{survey.responseCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Completion Rate</span>
                <span className="font-medium">{survey.completionRate || 0}%</span>
              </div>

              {survey.createdBy && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary-600">Created by</span>
                  <span className="font-medium">
                    {survey.createdBy.firstName} {survey.createdBy.lastName}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Created</span>
                <span className="font-medium">
                  {new Date(survey.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="flex items-center justify-between">
                <Link
                  to={`/surveys/${survey._id}`}
                  className="btn btn-outline btn-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
                
                <div className="flex items-center space-x-2">
                  {survey.status === 'draft' && (
                    <button
                      onClick={() => handleLaunchSurvey(survey._id)}
                      className="btn btn-primary btn-sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Launch
                    </button>
                  )}
                  
                  {survey.status === 'active' && (
                    <button
                      onClick={() => handleCloseSurvey(survey._id)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Close
                    </button>
                  )}
                  
                  <Link
                    to={`/analytics/survey/${survey._id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSurveys.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No surveys found</h3>
          <p className="text-secondary-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first survey'
            }
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <Link
              to="/surveys/create"
              className="btn btn-primary btn-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Survey
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Surveys;
