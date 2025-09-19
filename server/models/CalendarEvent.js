const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  eventId: {
    type: String,
    required: true // External calendar event ID
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  attendees: [{
    email: String,
    name: String,
    responseStatus: {
      type: String,
      enum: ['accepted', 'declined', 'tentative', 'needsAction'],
      default: 'needsAction'
    }
  }],
  location: String,
  meetingType: {
    type: String,
    enum: ['all_hands', 'team_meeting', '1on1', 'client_meeting', 'product_launch', 'marketing_campaign', 'other'],
    default: 'other'
  },
  aiAnalysis: {
    isHighInterest: {
      type: Boolean,
      default: false
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    keywords: [String],
    suggestedSurveyType: String,
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    }
  },
  surveyTriggered: {
    type: Boolean,
    default: false
  },
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey'
  },
  slideDeck: {
    uploaded: {
      type: Boolean,
      default: false
    },
    url: String,
    processed: {
      type: Boolean,
      default: false
    },
    aiQuestions: [String],
    uploadedAt: Date
  },
  processed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
calendarEventSchema.index({ company: 1, startTime: 1 });
calendarEventSchema.index({ 'aiAnalysis.isHighInterest': 1 });
calendarEventSchema.index({ meetingType: 1 });
calendarEventSchema.index({ 'surveyTriggered': 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
