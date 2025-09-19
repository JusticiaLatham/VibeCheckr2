const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'rating', 'text', 'yes_no', 'scale'],
    required: true
  },
  options: [String], // For multiple choice questions
  required: {
    type: Boolean,
    default: true
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['engagement', 'culture', 'growth', 'communication', 'leadership', 'workload', 'satisfaction'],
    required: true
  }
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: [
      'onboarding_1week',
      'onboarding_60day', 
      'onboarding_90day',
      'onboarding_6month',
      'onboarding_1year',
      'monthly_pulse',
      'milestone_survey',
      'all_hands_followup',
      'custom'
    ],
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  targetAudience: {
    type: String,
    enum: ['all_employees', 'specific_department', 'leadership', 'new_hires'],
    default: 'all_employees'
  },
  department: String, // If targeting specific department
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'closed', 'archived'],
    default: 'draft'
  },
  scheduledDate: Date,
  endDate: Date,
  settings: {
    anonymous: {
      type: Boolean,
      default: true
    },
    allowMultipleResponses: {
      type: Boolean,
      default: false
    },
    reminderFrequency: {
      type: String,
      enum: ['none', 'daily', 'weekly'],
      default: 'daily'
    }
  },
  aiInsights: {
    generatedQuestions: [String],
    suggestedImprovements: [String],
    riskIndicators: [String]
  },
  triggerConditions: {
    calendarEvents: [String], // Keywords that trigger this survey
    timeBased: Boolean,
    milestoneBased: Boolean
  },
  responseCount: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
surveySchema.index({ company: 1, status: 1 });
surveySchema.index({ type: 1 });
surveySchema.index({ scheduledDate: 1 });
surveySchema.index({ createdBy: 1 });

module.exports = mongoose.model('Survey', surveySchema);
