import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Star, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  Clock,
  Target,
  Award,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ReviewForm = ({ reviewId, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [overallRating, setOverallRating] = useState(0);
  const [strengths, setStrengths] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [goals, setGoals] = useState('');
  const [valuesAlignment, setValuesAlignment] = useState({});
  
  const queryClient = useQueryClient();

  // Fetch review details
  const { data: reviewData, isLoading } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5001/api/reviews/${reviewId}`);
      return response.data;
    }
  });

  const review = reviewData?.review;
  const questions = review?.template?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Start review mutation
  const startReviewMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`http://localhost:5001/api/reviews/${reviewId}/start`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['review', reviewId]);
    }
  });

  // Submit response mutation
  const submitResponseMutation = useMutation({
    mutationFn: async ({ questionId, response }) => {
      const response = await axios.post(`http://localhost:5001/api/reviews/${reviewId}/responses`, {
        questionId,
        response
      });
      return response.data;
    }
  });

  // Complete review mutation
  const completeReviewMutation = useMutation({
    mutationFn: async (completionData) => {
      const response = await axios.post(`http://localhost:5001/api/reviews/${reviewId}/complete`, completionData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Review completed! You earned ${data.pointsEarned} points!`);
      queryClient.invalidateQueries(['reviews']);
      if (onComplete) onComplete();
    }
  });

  useEffect(() => {
    if (review && review.status === 'pending') {
      startReviewMutation.mutate();
    }
  }, [review]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitResponse = () => {
    if (!currentQuestion) return;

    const response = {
      questionText: currentQuestion.text,
      category: currentQuestion.category,
      responseType: currentQuestion.responseType,
      ...responses[currentQuestion.questionId]
    };

    if (currentQuestion.responseType === 'voice' && audioBlob) {
      response.voiceRecording = {
        url: URL.createObjectURL(audioBlob),
        duration: recordingTime
      };
    }

    submitResponseMutation.mutate({
      questionId: currentQuestion.questionId,
      response
    });

    handleNext();
  };

  const handleCompleteReview = () => {
    const completionData = {
      overallRating,
      strengths: strengths.split('\n').filter(s => s.trim()),
      areasForImprovement: areasForImprovement.split('\n').filter(s => s.trim()),
      goals: goals.split('\n').filter(s => s.trim()),
      valuesAlignment: Object.entries(valuesAlignment).map(([value, data]) => ({
        value,
        ...data
      }))
    };

    completeReviewMutation.mutate(completionData);
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  const getPointsForQuestion = () => {
    return review?.template?.gamification?.pointsPerQuestion || 10;
  };

  const getTotalPoints = () => {
    return questions.length * getPointsForQuestion();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary-600">Review not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Review for {review.reviewee?.name}</h2>
            <p className="text-primary-100 mt-1">
              {review.template?.description || 'Provide feedback on collaboration, communication, execution, and ownership.'}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-primary-100">
              <Trophy className="h-5 w-5" />
              <span className="text-lg font-semibold">{getTotalPoints()} points</span>
            </div>
            <div className="flex items-center space-x-2 text-primary-100 mt-1">
              <Clock className="h-4 w-4" />
              <span>{review.template?.estimatedTime || 5} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-secondary-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-secondary-600">
            {Math.round(getProgressPercentage())}% Complete
          </span>
        </div>
        <div className="w-full bg-secondary-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="bg-white rounded-lg border border-secondary-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                  {currentQuestion.category}
                </span>
                <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs font-medium rounded-full">
                  {getPointsForQuestion()} points
                </span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {currentQuestion.text}
              </h3>
              {currentQuestion.helpText && (
                <p className="text-sm text-secondary-600">{currentQuestion.helpText}</p>
              )}
            </div>
          </div>

          {/* Response Input */}
          <div className="space-y-4">
            {currentQuestion.responseType === 'rating' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-secondary-600">Rating:</span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleResponseChange(currentQuestion.questionId, { rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (responses[currentQuestion.questionId]?.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-secondary-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-secondary-600 ml-2">
                  {responses[currentQuestion.questionId]?.rating || 0}/5
                </span>
              </div>
            )}

            {currentQuestion.responseType === 'text' && (
              <textarea
                value={responses[currentQuestion.questionId]?.textResponse || ''}
                onChange={(e) => handleResponseChange(currentQuestion.questionId, { textResponse: e.target.value })}
                className="w-full h-32 px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={currentQuestion.placeholder || 'Enter your response...'}
              />
            )}

            {currentQuestion.responseType === 'voice' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium ${
                      isRecording
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                  </button>
                  
                  {isRecording && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </div>

                {audioBlob && (
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Recording saved</span>
                    <button
                      onClick={() => {
                        const audio = new Audio(URL.createObjectURL(audioBlob));
                        audio.play();
                      }}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentQuestion.responseType === 'multiple_choice' && (
              <div className="space-y-2">
                {currentQuestion.options?.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.questionId}`}
                      value={option}
                      checked={responses[currentQuestion.questionId]?.multipleChoiceResponse === option}
                      onChange={(e) => handleResponseChange(currentQuestion.questionId, { multipleChoiceResponse: e.target.value })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                    />
                    <span className="text-secondary-700">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn btn-outline flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-secondary-400" />
          <span className="text-sm text-secondary-600">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleSubmitResponse}
            className="btn btn-primary flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleCompleteReview}
            className="btn btn-primary flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Complete Review</span>
          </button>
        )}
      </div>

      {/* Completion Summary (shown on last question) */}
      {currentQuestionIndex === questions.length - 1 && (
        <div className="mt-8 bg-secondary-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Review Summary</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Overall Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setOverallRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= overallRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-secondary-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm text-secondary-600 ml-2">
                  {overallRating}/5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Strengths
              </label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                className="w-full h-20 px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="What are their key strengths? (one per line)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Areas for Improvement
              </label>
              <textarea
                value={areasForImprovement}
                onChange={(e) => setAreasForImprovement(e.target.value)}
                className="w-full h-20 px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="What could they improve? (one per line)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Goals
              </label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="w-full h-20 px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="What goals should they focus on? (one per line)"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
