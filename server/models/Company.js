const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  industry: {
    type: String,
    required: true
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    required: true
  },
  handbook: {
    content: String,
    uploadedAt: Date,
    processed: { type: Boolean, default: false }
  },
  coreValues: [{
    value: String,
    description: String,
    importance: { type: Number, min: 1, max: 10 }
  }],
  settings: {
    surveyFrequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly'],
      default: 'monthly'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    workingHours: {
      start: String,
      end: String
    }
  },
  calendarIntegration: {
    provider: {
      type: String,
      enum: ['google', 'outlook', 'apple'],
      default: null
    },
    accessToken: String,
    refreshToken: String,
    lastSync: Date,
    enabled: { type: Boolean, default: false }
  },
  aiInsights: {
    lastAnalysis: Date,
    keyThemes: [String],
    riskAreas: [String],
    opportunities: [String]
  },
  subscription: {
    plan: {
      type: String,
      enum: ['starter', 'professional', 'enterprise'],
      default: 'starter'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'suspended'],
      default: 'active'
    },
    startDate: Date,
    endDate: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
companySchema.index({ domain: 1 });
companySchema.index({ createdBy: 1 });
companySchema.index({ 'subscription.status': 1 });

module.exports = mongoose.model('Company', companySchema);
