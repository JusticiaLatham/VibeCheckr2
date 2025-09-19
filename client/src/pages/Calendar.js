import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar as CalendarIcon, 
  Upload, 
  Link, 
  Unlink,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Calendar = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: calendarStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['calendarStatus'],
    queryFn: () => axios.get('/api/calendar/status').then(res => res.data.integration)
  });

  const { data: highInterestEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['highInterestEvents'],
    queryFn: () => axios.get('/api/calendar/high-interest-events').then(res => res.data.events),
    refetchInterval: 30000
  });

  const { data: allHandsEvents, isLoading: allHandsLoading } = useQuery({
    queryKey: ['allHandsEvents'],
    queryFn: () => axios.get('/api/calendar/all-hands').then(res => res.data.events),
    refetchInterval: 30000
  });

  const handleConnectCalendar = async () => {
    try {
      const response = await axios.get('/api/calendar/auth-url');
      window.open(response.data.authUrl, '_blank');
    } catch (error) {
      console.error('Error getting auth URL:', error);
      toast.error('Failed to get calendar authorization URL');
    }
  };

  const handleDisconnectCalendar = async () => {
    try {
      await axios.delete('/api/calendar/disconnect');
      toast.success('Calendar disconnected successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast.error('Failed to disconnect calendar');
    }
  };

  const handleSlideDeckUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!selectedEvent) {
      toast.error('Please select an event first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('slideDeck', file);
    formData.append('eventId', selectedEvent._id);

    try {
      const response = await axios.post('/api/calendar/upload-slidedeck', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Slide deck processed successfully!');
      setSelectedEvent({
        ...selectedEvent,
        slideDeck: {
          ...selectedEvent.slideDeck,
          uploaded: true,
          processed: true
        }
      });
    } catch (error) {
      console.error('Error uploading slide deck:', error);
      toast.error('Failed to process slide deck');
    } finally {
      setUploading(false);
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'all_hands':
        return <Users className="h-4 w-4" />;
      case 'product_launch':
        return <Sparkles className="h-4 w-4" />;
      case 'marketing_campaign':
        return <FileText className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'all_hands':
        return 'bg-blue-100 text-blue-800';
      case 'product_launch':
        return 'bg-green-100 text-green-800';
      case 'marketing_campaign':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (statusLoading) {
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
          <h1 className="text-2xl font-bold text-secondary-900">Calendar Integration</h1>
          <p className="text-secondary-600">Connect your calendar for automatic milestone detection and survey triggers</p>
        </div>
      </div>

      {/* Calendar Status */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              calendarStatus?.enabled ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {calendarStatus?.enabled ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <CalendarIcon className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                {calendarStatus?.enabled ? 'Calendar Connected' : 'Calendar Not Connected'}
              </h3>
              <p className="text-secondary-600">
                {calendarStatus?.enabled 
                  ? `Last synced: ${calendarStatus.lastSync ? new Date(calendarStatus.lastSync).toLocaleString() : 'Never'}`
                  : 'Connect your calendar to enable automatic milestone detection'
                }
              </p>
            </div>
          </div>
          <div>
            {calendarStatus?.enabled ? (
              <button
                onClick={handleDisconnectCalendar}
                className="btn btn-outline btn-md"
              >
                <Unlink className="h-4 w-4 mr-2" />
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnectCalendar}
                className="btn btn-primary btn-md"
              >
                <Link className="h-4 w-4 mr-2" />
                Connect Calendar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* High-Interest Events */}
      {calendarStatus?.enabled && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">High-Interest Events</h3>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-secondary-600">AI-detected milestones</span>
            </div>
          </div>
          
          {eventsLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner />
            </div>
          ) : highInterestEvents && highInterestEvents.length > 0 ? (
            <div className="space-y-4">
              {highInterestEvents.map((event) => (
                <div key={event._id} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getEventTypeIcon(event.meetingType)}
                        <h4 className="font-medium text-secondary-900">{event.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.meetingType)}`}>
                          {event.meetingType.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(event.startTime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees?.length || 0} attendees</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <span>📍 {event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-right">
                        <div className="text-sm text-secondary-600">Confidence</div>
                        <div className="text-lg font-semibold text-primary-600">
                          {Math.round((event.aiAnalysis?.confidence || 0) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {event.aiAnalysis?.reasoning && (
                    <div className="mt-3 p-3 bg-secondary-50 rounded-lg">
                      <p className="text-sm text-secondary-700">
                        <strong>AI Analysis:</strong> {event.aiAnalysis.reasoning}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600">No high-interest events detected</p>
              <p className="text-sm text-secondary-500">AI will analyze your calendar events and highlight important milestones</p>
            </div>
          )}
        </div>
      )}

      {/* All-Hands Meetings */}
      {calendarStatus?.enabled && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">All-Hands Meetings</h3>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-secondary-600">Upload slide decks for AI analysis</span>
            </div>
          </div>
          
          {allHandsLoading ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner />
            </div>
          ) : allHandsEvents && allHandsEvents.length > 0 ? (
            <div className="space-y-4">
              {allHandsEvents.map((event) => (
                <div key={event._id} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium text-secondary-900">{event.title}</h4>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          ALL HANDS
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(event.startTime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees?.length || 0} attendees</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {event.slideDeck?.uploaded ? (
                        <div className="text-right">
                          <div className="flex items-center text-green-600 mb-1">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Slide deck uploaded</span>
                          </div>
                          <div className="text-xs text-secondary-500">
                            {event.slideDeck.uploadedAt && 
                              `Uploaded ${new Date(event.slideDeck.uploadedAt).toLocaleDateString()}`
                            }
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-sm text-secondary-600 mb-2">Upload slide deck</div>
                          <input
                            type="file"
                            accept=".pdf,.pptx,.ppt"
                            onChange={handleSlideDeckUpload}
                            disabled={uploading}
                            className="hidden"
                            id={`slideDeck-${event._id}`}
                          />
                          <label
                            htmlFor={`slideDeck-${event._id}`}
                            className="btn btn-outline btn-sm cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                          >
                            {uploading ? (
                              <LoadingSpinner size="sm" className="mr-1" />
                            ) : (
                              <Upload className="h-4 w-4 mr-1" />
                            )}
                            {uploading ? 'Uploading...' : 'Upload'}
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {event.slideDeck?.aiQuestions && event.slideDeck.aiQuestions.length > 0 && (
                    <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                      <h5 className="text-sm font-medium text-primary-900 mb-2">AI-Generated Questions</h5>
                      <div className="space-y-1">
                        {event.slideDeck.aiQuestions.slice(0, 3).map((question, index) => (
                          <p key={index} className="text-sm text-primary-700">
                            • {question}
                          </p>
                        ))}
                        {event.slideDeck.aiQuestions.length > 3 && (
                          <p className="text-xs text-primary-600">
                            +{event.slideDeck.aiQuestions.length - 3} more questions
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600">No all-hands meetings detected</p>
              <p className="text-sm text-secondary-500">AI will identify all-hands meetings from your calendar</p>
            </div>
          )}
        </div>
      )}

      {/* Integration Instructions */}
      {!calendarStatus?.enabled && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">How Calendar Integration Works</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">Connect Your Calendar</h4>
                <p className="text-sm text-secondary-600">Authorize VibeCheckr to access your Google Calendar</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">AI Analysis</h4>
                <p className="text-sm text-secondary-600">Our AI analyzes your calendar events to identify high-interest milestones</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">Automatic Surveys</h4>
                <p className="text-sm text-secondary-600">Surveys are automatically triggered based on detected events and milestones</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-medium text-primary-600">4</span>
              </div>
              <div>
                <h4 className="font-medium text-secondary-900">Slide Deck Analysis</h4>
                <p className="text-sm text-secondary-600">Upload all-hands slide decks for AI to generate follow-up questions</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
