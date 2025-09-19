const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  answer: mongoose.Schema.Types.Mixed, // Can be string, number, or array
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const responseSchema = new mongoose.Schema({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  respondent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerSchema],
  isAnonymous: {
    type: Boolean,
    default: true
  },
  completionTime: {
    type: Number, // in seconds
    required: true
  },
  deviceInfo: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop'
  },
  sentiment: {
    overall: {
      type: Number,
      min: -1,
      max: 1
    },
    categories: {
      engagement: Number,
      satisfaction: Number,
      culture: Number,
      growth: Number
    }
  },
  flagged: {
    type: Boolean,
    default: false
  },
  flagReason: String
}, {
  timestamps: true
});

// Index for efficient queries
responseSchema.index({ survey: 1, company: 1 });
responseSchema.index({ respondent: 1 });
responseSchema.index({ createdAt: -1 });
responseSchema.index({ 'sentiment.overall': 1 });

module.exports = mongoose.model('Response', responseSchema);
