const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Review metadata
  reviewId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Participants
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Review cycle
  reviewCycle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReviewCycle',
    required: true
  },
  
  // Review template used
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReviewTemplate',
    required: true
  },
  
  // Review status
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending'
  },
  
  // Review responses
  responses: [{
    questionId: {
      type: String,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    responseType: {
      type: String,
      enum: ['rating', 'text', 'voice', 'multiple_choice'],
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    textResponse: String,
    voiceRecording: {
      url: String,
      duration: Number,
      transcript: String
    },
    multipleChoiceResponse: String,
    options: [String]
  }],
  
  // Overall review data
  overallRating: {
    type: Number,
    min: 1,
    max: 5
  },
  strengths: [String],
  areasForImprovement: [String],
  goals: [String],
  
  // Company values alignment
  valuesAlignment: [{
    value: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  }],
  
  // Timestamps
  assignedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: Date,
  completedAt: Date,
  dueDate: {
    type: Date,
    required: true
  },
  
  // Gamification
  pointsEarned: {
    type: Number,
    default: 0
  },
  badgesEarned: [String],
  completionTime: Number, // in minutes
  
  // Metadata
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Slack integration
  slackMessageId: String,
  slackChannelId: String,
  
  // AI insights
  aiInsights: {
    sentiment: String,
    keyThemes: [String],
    recommendations: [String],
    riskAreas: [String]
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ reviewer: 1, status: 1 });
reviewSchema.index({ reviewee: 1, status: 1 });
reviewSchema.index({ company: 1, status: 1 });
reviewSchema.index({ reviewCycle: 1 });
reviewSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Review', reviewSchema);
