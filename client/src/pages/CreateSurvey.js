import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Trash2, 
  Save, 
  Play, 
  ArrowLeft,
  Sparkles,
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateSurvey = () => {
  const [surveyType, setSurveyType] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  const surveyTypes = [
    { value: 'onboarding_1week', label: '1 Week Onboarding', description: 'Check-in with new hires after their first week' },
    { value: 'onboarding_60day', label: '60 Day Check-in', description: 'Mid-point onboarding assessment' },
    { value: 'onboarding_90day', label: '90 Day Check-in', description: 'End of probation period review' },
    { value: 'onboarding_6month', label: '6 Month Review', description: 'Half-year performance and culture fit' },
    { value: 'onboarding_1year', label: '1 Year Review', description: 'Annual engagement and growth assessment' },
    { value: 'monthly_pulse', label: 'Monthly Pulse', description: 'Regular team sentiment tracking' },
    { value: 'milestone_survey', label: 'Milestone Survey', description: 'Event-specific feedback collection' },
    { value: 'all_hands_followup', label: 'All-Hands Follow-up', description: 'Post-meeting comprehension and sentiment' },
    { value: 'custom', label: 'Custom Survey', description: 'Create your own survey from scratch' }
  ];

  const questionTypes = [
    { value: 'rating', label: 'Rating Scale', description: '1-5 or 1-10 rating' },
    { value: 'multiple_choice', label: 'Multiple Choice', description: 'Select one option' },
    { value: 'yes_no', label: 'Yes/No', description: 'Simple yes or no question' },
    { value: 'text', label: 'Text Response', description: 'Open-ended text answer' },
    { value: 'scale', label: 'Scale', description: 'Agreement scale (Strongly Disagree to Strongly Agree)' }
  ];

  const generateAISurvey = async () => {
    if (!surveyType) {
      toast.error('Please select a survey type first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/ai/dev/generate-survey', {
        surveyType: surveyType
      });

      const aiSurvey = response.data.survey;
      const questionsWithIds = aiSurvey.questions.map((q, index) => ({
        ...q,
        id: Date.now() + index
      }));
      setQuestions(questionsWithIds);
      setValue('title', aiSurvey.title);
      setValue('description', aiSurvey.description);
      
      // Mark all AI-generated questions as completed
      const questionIds = questionsWithIds.map(q => q.id);
      setCompletedQuestions(new Set(questionIds));
      
      toast.success('AI survey generated successfully!');
    } catch (error) {
      console.error('Error generating AI survey:', error);
      toast.error('Failed to generate AI survey. Make sure the backend is running.');
    } finally {
      setAiLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      text: '',
      type: 'rating',
      options: [],
      required: true,
      category: 'engagement'
    };
    setQuestions([...questions, newQuestion]);
  };

  const isQuestionComplete = (question) => {
    if (!question.text.trim()) return false;
    if (question.type === 'multiple_choice' && question.options.length < 2) return false;
    if (question.type === 'multiple_choice' && question.options.some(opt => !opt.trim())) return false;
    return true;
  };

  const markQuestionComplete = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (isQuestionComplete(question)) {
      setCompletedQuestions(prev => new Set([...prev, questionId]));
      toast.success('Question completed!');
    } else {
      toast.error('Please complete all required fields before marking as done');
    }
  };

  const canAddNextQuestion = () => {
    if (questions.length === 0) return true;
    return questions.every(q => completedQuestions.has(q.id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...question.options, ''];
      updateQuestion(questionId, 'options', newOptions);
    }
  };

  const updateOption = (questionId, optionIndex, value) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, 'options', newOptions);
    }
  };

  const removeOption = (questionId, optionIndex) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, 'options', newOptions);
    }
  };

  const onSubmit = async (data) => {
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setSaving(true);
    try {
      const surveyData = {
        ...data,
        type: surveyType,
        questions: questions.map(q => ({
          text: q.text,
          type: q.type,
          options: q.options.filter(opt => opt.trim() !== ''),
          required: q.required,
          category: q.category
        })),
        targetAudience: data.targetAudience || 'all_employees'
      };

      const response = await axios.post('/api/surveys', surveyData);
      
      toast.success('Survey created successfully!');
      navigate(`/surveys/${response.data.survey._id}`);
    } catch (error) {
      console.error('Error creating survey:', error);
      toast.error('Failed to create survey');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-secondary-900">Create Survey</h1>
            <p className="text-secondary-600">Build an AI-powered pulse survey for your team</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => navigate('/surveys')}
            className="btn btn-outline btn-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="survey-form"
            className="btn btn-primary btn-md"
            disabled={saving}
          >
            {saving ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </div>

      <form id="survey-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Survey Type Selection */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Survey Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surveyTypes.map((type) => (
              <div
                key={type.value}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  surveyType === type.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
                onClick={() => setSurveyType(type.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    surveyType === type.value
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-secondary-300'
                  }`}>
                    {surveyType === type.value && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-secondary-900">{type.label}</h4>
                    <p className="text-sm text-secondary-600">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Generation */}
        {surveyType && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">AI-Powered Generation</h3>
              <button
                type="button"
                onClick={generateAISurvey}
                disabled={aiLoading}
                className="btn btn-primary btn-md"
              >
                {aiLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {aiLoading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
            <p className="text-sm text-secondary-600">
              Let AI generate intelligent questions based on your company's values, culture, and the selected survey type.
            </p>
          </div>
        )}

        {/* Survey Details */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Survey Details</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Survey Title</label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="input"
                placeholder="Enter survey title"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="label">Description (Optional)</label>
              <textarea
                {...register('description')}
                className="input"
                rows={3}
                placeholder="Describe the purpose of this survey"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Target Audience</label>
                <select {...register('targetAudience')} className="input">
                  <option value="all_employees">All Employees</option>
                  <option value="specific_department">Specific Department</option>
                  <option value="leadership">Leadership Team</option>
                  <option value="new_hires">New Hires Only</option>
                </select>
              </div>

              <div>
                <label className="label">Department (if applicable)</label>
                <input
                  {...register('department')}
                  className="input"
                  placeholder="e.g., Engineering, Marketing"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Questions</h3>
            <button
              type="button"
              onClick={addQuestion}
              disabled={!canAddNextQuestion()}
              className={`btn btn-outline btn-md ${!canAddNextQuestion() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </button>
          </div>
          {!canAddNextQuestion() && questions.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ Please complete all current questions before adding new ones
              </p>
            </div>
          )}

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className={`border rounded-lg p-4 ${
                completedQuestions.has(question.id) 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-secondary-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-secondary-900">Question {index + 1}</h4>
                    {completedQuestions.has(question.id) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!completedQuestions.has(question.id) && (
                      <button
                        type="button"
                        onClick={() => markQuestionComplete(question.id)}
                        disabled={!isQuestionComplete(question)}
                        className={`btn btn-sm ${
                          isQuestionComplete(question) 
                            ? 'btn-primary' 
                            : 'btn-outline opacity-50 cursor-not-allowed'
                        }`}
                      >
                        Done
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">Question Text *</label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                      className={`input ${!question.text.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                      placeholder="Enter your question"
                    />
                    {!question.text.trim() && (
                      <p className="text-red-600 text-sm mt-1">Question text is required</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Question Type</label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                        className="input"
                      >
                        {questionTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Category</label>
                      <select
                        value={question.category}
                        onChange={(e) => updateQuestion(question.id, 'category', e.target.value)}
                        className="input"
                      >
                        <option value="engagement">Engagement</option>
                        <option value="culture">Culture</option>
                        <option value="growth">Growth</option>
                        <option value="communication">Communication</option>
                        <option value="leadership">Leadership</option>
                        <option value="workload">Workload</option>
                        <option value="satisfaction">Satisfaction</option>
                      </select>
                    </div>
                  </div>

                  {(question.type === 'multiple_choice') && (
                    <div>
                      <label className="label">Options *</label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              className={`input flex-1 ${!option.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeOption(question.id, optionIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(question.id)}
                          className="btn btn-outline btn-sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Option
                        </button>
                        {question.type === 'multiple_choice' && question.options.length < 2 && (
                          <p className="text-red-600 text-sm">At least 2 options are required for multiple choice questions</p>
                        )}
                        {question.type === 'multiple_choice' && question.options.some(opt => !opt.trim()) && (
                          <p className="text-red-600 text-sm">All options must have text</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor={`required-${question.id}`} className="text-sm text-secondary-700">
                      Required question
                    </label>
                  </div>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600 mb-4">No questions added yet</p>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn btn-primary btn-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Question
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSurvey;
