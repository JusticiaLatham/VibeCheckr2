import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  BarChart3, 
  Users, 
  Clock,
  Eye,
  Edit,
  Trash2,
  Share2,
  Copy
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const SurveyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: survey, isLoading, refetch } = useQuery({
    queryKey: ['survey', id],
    queryFn: () => axios.get(`/api/surveys/${id}`).then(res => res.data.survey),
    refetchInterval: 30000
  });

  const { data: responses, isLoading: responsesLoading } = useQuery({
    queryKey: ['surveyResponses', id],
    queryFn: () => axios.get(`/api/surveys/${id}/responses`).then(res => res.data),
    refetchInterval: 30000
  });

  const handleLaunch = async () => {
    try {
      await axios.post(`/api/surveys/${id}/launch`);
      toast.success('Survey launched successfully!');
      refetch();
    } catch (error) {
      console.error('Error launching survey:', error);
      toast.error('Failed to launch survey');
    }
  };

  const handleClose = async () => {
    try {
      await axios.post(`/api/surveys/${id}/close`);
      toast.success('Survey closed successfully!');
      refetch();
    } catch (error) {
      console.error('Error closing survey:', error);
      toast.error('Failed to close survey');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/surveys/${id}`);
      toast.success('Survey deleted successfully!');
      navigate('/surveys');
    } catch (error) {
      console.error('Error deleting survey:', error);
      toast.error('Failed to delete survey');
    }
  };

  const copySurveyLink = () => {
    const link = `${window.location.origin}/survey/${id}`;
    navigator.clipboard.writeText(link);
    toast.success('Survey link copied to clipboard!');
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

  if (!survey) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-4">Survey Not Found</h2>
        <p className="text-secondary-600 mb-4">The survey you're looking for doesn't exist or has been deleted.</p>
        <button
          onClick={() => navigate('/surveys')}
          className="btn btn-primary btn-md"
        >
          Back to Surveys
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'questions', label: 'Questions' },
    { id: 'responses', label: 'Responses' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/surveys')}
            className="p-2 text-secondary-400 hover:text-secondary-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">{survey.title}</h1>
            <p className="text-secondary-600">{getTypeLabel(survey.type)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(survey.status)}
          <div className="flex items-center space-x-2">
            {survey.status === 'draft' && (
              <button
                onClick={handleLaunch}
                className="btn btn-primary btn-md"
              >
                <Play className="h-4 w-4 mr-2" />
                Launch
              </button>
            )}
            {survey.status === 'active' && (
              <button
                onClick={handleClose}
                className="btn btn-secondary btn-md"
              >
                <Pause className="h-4 w-4 mr-2" />
                Close
              </button>
            )}
            <button
              onClick={copySurveyLink}
              className="btn btn-outline btn-md"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            <button
              onClick={() => navigate(`/surveys/${id}/edit`)}
              className="btn btn-outline btn-md"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-outline btn-md text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Survey Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Description</label>
                    <p className="text-secondary-900">
                      {survey.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Target Audience</label>
                      <p className="text-secondary-900">
                        {survey.targetAudience?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    <div>
                      <label className="label">Department</label>
                      <p className="text-secondary-900">
                        {survey.department || 'All departments'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Created</label>
                      <p className="text-secondary-900">
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="label">Created By</label>
                      <p className="text-secondary-900">
                        {survey.createdBy?.firstName} {survey.createdBy?.lastName}
                      </p>
                    </div>
                  </div>

                  {survey.scheduledDate && (
                    <div>
                      <label className="label">Scheduled Date</label>
                      <p className="text-secondary-900">
                        {new Date(survey.scheduledDate).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {survey.endDate && (
                    <div>
                      <label className="label">End Date</label>
                      <p className="text-secondary-900">
                        {new Date(survey.endDate).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Anonymous responses</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      survey.settings?.anonymous 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {survey.settings?.anonymous ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Allow multiple responses</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      survey.settings?.allowMultipleResponses 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {survey.settings?.allowMultipleResponses ? 'Yes' : 'No'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Reminder frequency</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {survey.settings?.reminderFrequency || 'Daily'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-secondary-400" />
                      <span className="text-secondary-600">Responses</span>
                    </div>
                    <span className="text-lg font-semibold text-secondary-900">
                      {survey.responseCount || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-secondary-400" />
                      <span className="text-secondary-600">Completion Rate</span>
                    </div>
                    <span className="text-lg font-semibold text-secondary-900">
                      {survey.completionRate || 0}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-secondary-400" />
                      <span className="text-secondary-600">Questions</span>
                    </div>
                    <span className="text-lg font-semibold text-secondary-900">
                      {survey.questions?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {survey.aiInsights && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">AI Insights</h3>
                  <div className="space-y-3">
                    {survey.aiInsights.generatedQuestions && (
                      <div>
                        <h4 className="text-sm font-medium text-secondary-700 mb-2">Generated Questions</h4>
                        <p className="text-sm text-secondary-600">
                          {survey.aiInsights.generatedQuestions.length} AI-generated questions
                        </p>
                      </div>
                    )}
                    
                    {survey.aiInsights.suggestedImprovements && (
                      <div>
                        <h4 className="text-sm font-medium text-secondary-700 mb-2">Suggestions</h4>
                        <p className="text-sm text-secondary-600">
                          {survey.aiInsights.suggestedImprovements.length} improvement suggestions
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Survey Questions</h3>
            <div className="space-y-4">
              {survey.questions?.map((question, index) => (
                <div key={index} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-secondary-900">
                      Question {index + 1}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
                        {question.type.replace('_', ' ').toUpperCase()}
                      </span>
                      {question.required && (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          REQUIRED
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-secondary-900 mb-3">{question.text}</p>
                  
                  {question.options && question.options.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-secondary-700 mb-2">Options:</h5>
                      <ul className="space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <li key={optionIndex} className="text-sm text-secondary-600">
                            • {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-secondary-500">
                    Category: {question.category} • 
                    {question.aiGenerated ? ' AI Generated' : ' Manual'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Responses Tab */}
        {activeTab === 'responses' && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">Survey Responses</h3>
              <span className="text-sm text-secondary-600">
                {responses?.totalResponses || 0} total responses
              </span>
            </div>
            
            {responsesLoading ? (
              <div className="flex items-center justify-center h-32">
                <LoadingSpinner />
              </div>
            ) : responses && responses.responses.length > 0 ? (
              <div className="space-y-4">
                {responses.responses.map((response, index) => (
                  <div key={response._id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-secondary-900">
                          Response #{index + 1}
                        </span>
                        {response.isAnonymous && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Anonymous
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {new Date(response.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {response.answers.map((answer, answerIndex) => {
                        const question = survey.questions.find(q => q._id.toString() === answer.questionId.toString());
                        return (
                          <div key={answerIndex} className="text-sm">
                            <span className="font-medium text-secondary-700">
                              {question?.text}:
                            </span>
                            <span className="ml-2 text-secondary-900">
                              {Array.isArray(answer.answer) 
                                ? answer.answer.join(', ') 
                                : answer.answer
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600">No responses yet</p>
                <p className="text-sm text-secondary-500">Responses will appear here once people start taking the survey</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">Analytics coming soon</p>
            <p className="text-sm text-secondary-500">Detailed analytics will be available here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyDetails;
