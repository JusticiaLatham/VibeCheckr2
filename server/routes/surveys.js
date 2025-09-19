const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Survey = require('../models/Survey');
const Response = require('../models/Response');
const aiService = require('../services/aiService');
const calendarService = require('../services/calendarService');

// Get all surveys for company
router.get('/', auth, async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = { company: req.user.company };
    
    if (status) query.status = status;
    if (type) query.type = type;

    const surveys = await Survey.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      surveys: surveys
    });
  } catch (error) {
    console.error('Error getting surveys:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get surveys',
      error: error.message
    });
  }
});

// Get survey by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      company: req.user.company
    }).populate('createdBy', 'firstName lastName email');

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    res.json({
      success: true,
      survey: survey
    });
  } catch (error) {
    console.error('Error getting survey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get survey',
      error: error.message
    });
  }
});

// Create new survey
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('type').isIn([
    'onboarding_1week',
    'onboarding_60day', 
    'onboarding_90day',
    'onboarding_6month',
    'onboarding_1year',
    'monthly_pulse',
    'milestone_survey',
    'all_hands_followup',
    'custom'
  ]).withMessage('Invalid survey type'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      type,
      questions,
      targetAudience,
      department,
      scheduledDate,
      settings
    } = req.body;

    const survey = new Survey({
      title,
      description,
      type,
      company: req.user.company,
      createdBy: req.user.id,
      questions,
      targetAudience: targetAudience || 'all_employees',
      department,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      settings: {
        anonymous: settings?.anonymous !== false,
        allowMultipleResponses: settings?.allowMultipleResponses || false,
        reminderFrequency: settings?.reminderFrequency || 'daily'
      }
    });

    await survey.save();

    res.status(201).json({
      success: true,
      message: 'Survey created successfully',
      survey: survey
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create survey',
      error: error.message
    });
  }
});

// Create AI-generated survey
router.post('/ai-generate', auth, async (req, res) => {
  try {
    const { surveyType, customPrompt } = req.body;
    
    if (!surveyType) {
      return res.status(400).json({
        success: false,
        message: 'Survey type is required'
      });
    }

    // Get company data for AI context
    const Company = require('../models/Company');
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const companyData = {
      handbook: company.handbook?.content,
      coreValues: company.coreValues,
      industry: company.industry,
      size: company.size
    };

    // Generate questions using AI
    const aiResponse = await aiService.generateSurveyQuestions(surveyType, companyData);
    
    // Create survey with AI-generated questions
    const survey = new Survey({
      title: `${surveyType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Survey`,
      description: `AI-generated survey based on your company's values and culture`,
      type: surveyType,
      company: req.user.company,
      createdBy: req.user.id,
      questions: aiResponse.questions.map(q => ({
        text: q.text,
        type: q.type,
        options: q.options || [],
        required: q.required !== false,
        category: q.category,
        aiGenerated: true
      })),
      targetAudience: 'all_employees',
      aiInsights: {
        generatedQuestions: aiResponse.questions.map(q => q.text),
        suggestedImprovements: aiResponse.insights || [],
        riskIndicators: aiResponse.riskAreas || []
      }
    });

    await survey.save();

    res.status(201).json({
      success: true,
      message: 'AI-generated survey created successfully',
      survey: survey,
      aiInsights: aiResponse
    });
  } catch (error) {
    console.error('Error creating AI survey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create AI survey',
      error: error.message
    });
  }
});

// Update survey
router.put('/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      company: req.user.company
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    // Only allow updates if survey is in draft status
    if (survey.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only update surveys in draft status'
      });
    }

    const updates = req.body;
    Object.assign(survey, updates);
    await survey.save();

    res.json({
      success: true,
      message: 'Survey updated successfully',
      survey: survey
    });
  } catch (error) {
    console.error('Error updating survey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update survey',
      error: error.message
    });
  }
});

// Launch survey
router.post('/:id/launch', auth, async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      company: req.user.company
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    if (survey.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Survey is not in draft status'
      });
    }

    survey.status = 'active';
    survey.scheduledDate = new Date();
    await survey.save();

    res.json({
      success: true,
      message: 'Survey launched successfully',
      survey: survey
    });
  } catch (error) {
    console.error('Error launching survey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to launch survey',
      error: error.message
    });
  }
});

// Close survey
router.post('/:id/close', auth, async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      company: req.user.company
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    survey.status = 'closed';
    survey.endDate = new Date();
    await survey.save();

    res.json({
      success: true,
      message: 'Survey closed successfully',
      survey: survey
    });
  } catch (error) {
    console.error('Error closing survey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close survey',
      error: error.message
    });
  }
});

// Submit survey response
router.post('/:id/respond', auth, async (req, res) => {
  try {
    const { answers, completionTime } = req.body;
    
    const survey = await Survey.findOne({
      _id: req.params.id,
      company: req.user.company,
      status: 'active'
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found or not active'
      });
    }

    // Check if user already responded (if not allowed)
    if (!survey.settings.allowMultipleResponses) {
      const existingResponse = await Response.findOne({
        survey: survey._id,
        respondent: req.user.id
      });

      if (existingResponse) {
        return res.status(400).json({
          success: false,
          message: 'You have already responded to this survey'
        });
      }
    }

    const response = new Response({
      survey: survey._id,
      company: req.user.company,
      respondent: req.user.id,
      answers: answers.map(answer => ({
        questionId: answer.questionId,
        answer: answer.answer
      })),
      isAnonymous: survey.settings.anonymous,
      completionTime: completionTime || 0,
      deviceInfo: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop'
    });

    await response.save();

    // Update survey response count
    survey.responseCount += 1;
    await survey.save();

    res.json({
      success: true,
      message: 'Response submitted successfully',
      response: response
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit response',
      error: error.message
    });
  }
});

// Get survey responses
router.get('/:id/responses', auth, async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      company: req.user.company
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    const responses = await Response.find({
      survey: survey._id
    }).populate('respondent', 'firstName lastName email department');

    res.json({
      success: true,
      responses: responses,
      totalResponses: responses.length,
      completionRate: survey.completionRate
    });
  } catch (error) {
    console.error('Error getting responses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get responses',
      error: error.message
    });
  }
});

// Delete survey
router.delete('/:id', auth, async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      company: req.user.company
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    // Only allow deletion of draft surveys
    if (survey.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete surveys in draft status'
      });
    }

    await Survey.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Survey deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete survey',
      error: error.message
    });
  }
});

module.exports = router;
