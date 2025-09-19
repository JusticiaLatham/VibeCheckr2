const { google } = require('googleapis');
const CalendarEvent = require('../models/CalendarEvent');
const aiService = require('./aiService');

class CalendarService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Get Google Calendar authorization URL
   */
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events.readonly'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw new Error('Failed to get calendar tokens');
    }
  }

  /**
   * Set credentials for API calls
   */
  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  /**
   * Fetch and analyze calendar events
   */
  async syncCalendarEvents(companyId, tokens) {
    try {
      this.setCredentials(tokens);
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      // Get events from the last 30 days and next 30 days
      const timeMin = new Date();
      timeMin.setDate(timeMin.getDate() - 30);
      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + 30);

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = response.data.items || [];
      const processedEvents = [];

      for (const event of events) {
        // Skip if already processed
        const existingEvent = await CalendarEvent.findOne({
          company: companyId,
          eventId: event.id
        });

        if (existingEvent) {
          processedEvents.push(existingEvent);
          continue;
        }

        // Analyze event with AI
        const eventData = {
          title: event.summary || 'Untitled Event',
          description: event.description || '',
          attendees: event.attendees || [],
          startTime: event.start?.dateTime || event.start?.date,
          endTime: event.end?.dateTime || event.end?.date,
          location: event.location || ''
        };

        const aiAnalysis = await aiService.analyzeCalendarEvent(eventData);

        // Create calendar event record
        const calendarEvent = new CalendarEvent({
          company: companyId,
          eventId: event.id,
          title: eventData.title,
          description: eventData.description,
          startTime: new Date(eventData.startTime),
          endTime: new Date(eventData.endTime),
          attendees: eventData.attendees.map(attendee => ({
            email: attendee.email,
            name: attendee.displayName || attendee.email,
            responseStatus: attendee.responseStatus || 'needsAction'
          })),
          location: eventData.location,
          meetingType: this.determineMeetingType(eventData),
          aiAnalysis: aiAnalysis,
          processed: true
        });

        await calendarEvent.save();
        processedEvents.push(calendarEvent);
      }

      return processedEvents;
    } catch (error) {
      console.error('Error syncing calendar events:', error);
      throw new Error('Failed to sync calendar events');
    }
  }

  /**
   * Determine meeting type based on event data
   */
  determineMeetingType(eventData) {
    const title = eventData.title.toLowerCase();
    const description = (eventData.description || '').toLowerCase();
    const attendeeCount = eventData.attendees?.length || 0;

    // All-hands detection
    if (title.includes('all hands') || title.includes('all-hands') || 
        title.includes('company meeting') || title.includes('town hall')) {
      return 'all_hands';
    }

    // Product launch detection
    if (title.includes('launch') || title.includes('release') || 
        title.includes('product') || description.includes('launch')) {
      return 'product_launch';
    }

    // Marketing campaign detection
    if (title.includes('marketing') || title.includes('campaign') || 
        title.includes('brand') || description.includes('marketing')) {
      return 'marketing_campaign';
    }

    // Team meeting detection
    if (attendeeCount >= 5 && attendeeCount <= 20) {
      return 'team_meeting';
    }

    // 1-on-1 detection
    if (attendeeCount === 2) {
      return '1on1';
    }

    return 'other';
  }

  /**
   * Get high-interest events that should trigger surveys
   */
  async getHighInterestEvents(companyId) {
    try {
      const events = await CalendarEvent.find({
        company: companyId,
        'aiAnalysis.isHighInterest': true,
        surveyTriggered: false,
        startTime: { $gte: new Date() }
      }).sort({ startTime: 1 });

      return events;
    } catch (error) {
      console.error('Error getting high-interest events:', error);
      throw new Error('Failed to get high-interest events');
    }
  }

  /**
   * Mark event as having triggered a survey
   */
  async markSurveyTriggered(eventId, surveyId) {
    try {
      await CalendarEvent.findByIdAndUpdate(eventId, {
        surveyTriggered: true,
        surveyId: surveyId
      });
    } catch (error) {
      console.error('Error marking survey triggered:', error);
      throw new Error('Failed to mark survey triggered');
    }
  }

  /**
   * Process slide deck upload for all-hands meetings
   */
  async processSlideDeck(eventId, slideContent, companyContext) {
    try {
      const aiQuestions = await aiService.generateQuestionsFromSlideDeck(
        slideContent, 
        companyContext
      );

      await CalendarEvent.findByIdAndUpdate(eventId, {
        'slideDeck.uploaded': true,
        'slideDeck.processed': true,
        'slideDeck.aiQuestions': aiQuestions.questions,
        'slideDeck.uploadedAt': new Date()
      });

      return aiQuestions;
    } catch (error) {
      console.error('Error processing slide deck:', error);
      throw new Error('Failed to process slide deck');
    }
  }

  /**
   * Get upcoming all-hands meetings
   */
  async getUpcomingAllHands(companyId) {
    try {
      const events = await CalendarEvent.find({
        company: companyId,
        meetingType: 'all_hands',
        startTime: { $gte: new Date() },
        'slideDeck.uploaded': false
      }).sort({ startTime: 1 });

      return events;
    } catch (error) {
      console.error('Error getting upcoming all-hands:', error);
      throw new Error('Failed to get upcoming all-hands meetings');
    }
  }
}

module.exports = new CalendarService();
