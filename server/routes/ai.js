const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aiService = require('../services/aiService');
const Company = require('../models/Company');
const Survey = require('../models/Survey');

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'AI routes are working!' });
});

// Development route - no auth required
router.post('/dev/generate-survey', async (req, res) => {
  try {
    const { surveyType } = req.body;
    
    // Simple mock responses for development
    const mockSurveys = {
      'onboarding_1week': {
        title: 'First Week Onboarding Experience',
        description: 'Help us understand your first week experience and identify areas for improvement in our onboarding process.',
        questions: [
          {
            text: 'How would you rate your overall first week experience?',
            type: 'rating',
            options: [],
            category: 'satisfaction',
            required: true
          },
          {
            text: 'Did you receive all the necessary information to get started?',
            type: 'yes_no',
            options: [],
            category: 'communication',
            required: true
          },
          {
            text: 'How well do you understand your role and responsibilities?',
            type: 'scale',
            options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
            category: 'communication',
            required: true
          },
          {
            text: 'What was the most helpful part of your onboarding?',
            type: 'text',
            options: [],
            category: 'satisfaction',
            required: false
          },
          {
            text: 'What could we improve about the onboarding process?',
            type: 'text',
            options: [],
            category: 'growth',
            required: false
          }
        ]
      },
      'onboarding_60day': {
        title: '60-Day Check-in Survey',
        description: 'Mid-point assessment of your onboarding journey and early experience with our team.',
        questions: [
          {
            text: 'How confident do you feel in your role after 60 days?',
            type: 'rating',
            options: [],
            category: 'growth',
            required: true
          },
          {
            text: 'How well do you feel integrated with your team?',
            type: 'scale',
            options: ['Not at all', 'Slightly', 'Moderately', 'Very well', 'Extremely well'],
            category: 'culture',
            required: true
          },
          {
            text: 'Have you received adequate support and resources?',
            type: 'yes_no',
            options: [],
            category: 'leadership',
            required: true
          },
          {
            text: 'What challenges have you faced so far?',
            type: 'text',
            options: [],
            category: 'growth',
            required: false
          }
        ]
      },
      'monthly_pulse': {
        title: 'Monthly Team Pulse Survey',
        description: 'Regular check-in to understand team sentiment and identify areas for improvement.',
        questions: [
          {
            text: 'How satisfied are you with your current role?',
            type: 'rating',
            options: [],
            category: 'satisfaction',
            required: true
          },
          {
            text: 'How would you rate team collaboration this month?',
            type: 'rating',
            options: [],
            category: 'culture',
            required: true
          },
          {
            text: 'Do you feel your work is aligned with company values?',
            type: 'scale',
            options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
            category: 'culture',
            required: true
          },
          {
            text: 'What is working well in our team?',
            type: 'text',
            options: [],
            category: 'positive',
            required: false
          },
          {
            text: 'What would you like to see improved?',
            type: 'text',
            options: [],
            category: 'growth',
            required: false
          }
        ]
      }
    };

    const survey = mockSurveys[surveyType] || mockSurveys['monthly_pulse'];
    
    res.json({
      success: true,
      survey: {
        title: survey.title,
        description: survey.description,
        questions: survey.questions
      }
    });
  } catch (error) {
    console.error('Error generating survey:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate survey',
      error: error.message 
    });
  }
});

// Generate survey questions based on company data
router.post('/generate-survey-questions', auth, async (req, res) => {
  try {
    const { surveyType } = req.body;
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const companyData = {
      handbook: company.handbook?.content,
      coreValues: company.coreValues,
      industry: company.industry,
      size: company.size
    };

    const aiResponse = await aiService.generateSurveyQuestions(surveyType, companyData);
    
    res.json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    console.error('Error generating survey questions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate survey questions',
      error: error.message 
    });
  }
});

// Generate questions from slide deck
router.post('/generate-slide-questions', auth, async (req, res) => {
  try {
    const { slideContent, eventId } = req.body;
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const companyContext = {
      industry: company.industry,
      size: company.size,
      coreValues: company.coreValues
    };

    const aiResponse = await aiService.generateQuestionsFromSlideDeck(
      slideContent, 
      companyContext
    );
    
    res.json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    console.error('Error generating slide questions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate slide questions',
      error: error.message 
    });
  }
});

// Analyze survey responses
router.post('/analyze-responses', auth, async (req, res) => {
  try {
    const { surveyId, responses } = req.body;
    
    const aiResponse = await aiService.analyzeSurveyResponses(surveyId, responses);
    
    res.json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    console.error('Error analyzing responses:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to analyze responses',
      error: error.message 
    });
  }
});

// Generate growth-based survey suggestions
router.get('/growth-suggestions', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get recent calendar events for context
    const CalendarEvent = require('../models/CalendarEvent');
    const recentEvents = await CalendarEvent.find({
      company: req.user.company,
      startTime: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).limit(10);

    const companyData = {
      name: company.name,
      industry: company.industry,
      size: company.size
    };

    const aiResponse = await aiService.generateGrowthBasedSuggestions(
      companyData, 
      recentEvents
    );
    
    res.json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    console.error('Error generating growth suggestions:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate growth suggestions',
      error: error.message 
    });
  }
});

// Get AI insights for company
router.get('/company-insights', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get recent survey data for analysis
    const Survey = require('../models/Survey');
    const Response = require('../models/Response');
    
    const recentSurveys = await Survey.find({
      company: req.user.company,
      status: 'closed',
      createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
    }).limit(5);

    const surveyIds = recentSurveys.map(s => s._id);
    const responses = await Response.find({
      survey: { $in: surveyIds }
    }).populate('survey');

    // Analyze responses
    const analysisPromises = responses.map(response => 
      aiService.analyzeSurveyResponses(response.survey._id, [response])
    );

    const analyses = await Promise.all(analysisPromises);
    
    // Aggregate insights
    const aggregatedInsights = {
      overallSentiment: 'neutral',
      keyThemes: [],
      riskAreas: [],
      positiveTrends: [],
      recommendations: []
    };

    analyses.forEach(analysis => {
      if (analysis.keyThemes) {
        aggregatedInsights.keyThemes.push(...analysis.keyThemes);
      }
      if (analysis.riskAreas) {
        aggregatedInsights.riskAreas.push(...analysis.riskAreas);
      }
      if (analysis.positiveTrends) {
        aggregatedInsights.positiveTrends.push(...analysis.positiveTrends);
      }
      if (analysis.executiveRecommendations) {
        aggregatedInsights.recommendations.push(...analysis.executiveRecommendations);
      }
    });

    // Remove duplicates
    aggregatedInsights.keyThemes = [...new Set(aggregatedInsights.keyThemes)];
    aggregatedInsights.positiveTrends = [...new Set(aggregatedInsights.positiveTrends)];
    aggregatedInsights.recommendations = [...new Set(aggregatedInsights.recommendations)];
    
    res.json({
      success: true,
      data: aggregatedInsights
    });
  } catch (error) {
    console.error('Error getting company insights:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get company insights',
      error: error.message 
    });
  }
});

module.exports = router;
