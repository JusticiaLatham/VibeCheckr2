const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const Company = require('../models/Company');
const aiService = require('../services/aiService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/handbooks/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, Word, and text files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get company information
router.get('/', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      company: company
    });
  } catch (error) {
    console.error('Error getting company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get company information',
      error: error.message
    });
  }
});

// Update company information
router.put('/', auth, async (req, res) => {
  try {
    const {
      name,
      industry,
      size,
      settings,
      coreValues
    } = req.body;

    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (name) company.name = name;
    if (industry) company.industry = industry;
    if (size) company.size = size;
    if (settings) company.settings = { ...company.settings, ...settings };
    if (coreValues) company.coreValues = coreValues;

    await company.save();

    res.json({
      success: true,
      message: 'Company updated successfully',
      company: company
    });
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update company',
      error: error.message
    });
  }
});

// Upload company handbook
router.post('/upload-handbook', auth, upload.single('handbook'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Handbook file is required'
      });
    }

    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // For now, we'll simulate handbook content extraction
    // In production, you'd use a service to extract text from PDF/DOC
    const handbookContent = `Company handbook content extracted from ${req.file.originalname}`;

    company.handbook = {
      content: handbookContent,
      uploadedAt: new Date(),
      processed: true
    };

    await company.save();

    res.json({
      success: true,
      message: 'Handbook uploaded and processed successfully',
      handbook: {
        uploadedAt: company.handbook.uploadedAt,
        processed: company.handbook.processed
      }
    });
  } catch (error) {
    console.error('Error uploading handbook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload handbook',
      error: error.message
    });
  }
});

// Add core values
router.post('/core-values', auth, async (req, res) => {
  try {
    const { values } = req.body;
    
    if (!values || !Array.isArray(values)) {
      return res.status(400).json({
        success: false,
        message: 'Values array is required'
      });
    }

    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    company.coreValues = values;
    await company.save();

    res.json({
      success: true,
      message: 'Core values updated successfully',
      coreValues: company.coreValues
    });
  } catch (error) {
    console.error('Error updating core values:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update core values',
      error: error.message
    });
  }
});

// Get AI insights for company
router.get('/insights', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
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
      recommendations: [],
      blindSpots: []
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
      if (analysis.blindSpots) {
        aggregatedInsights.blindSpots.push(...analysis.blindSpots);
      }
    });

    // Remove duplicates
    aggregatedInsights.keyThemes = [...new Set(aggregatedInsights.keyThemes)];
    aggregatedInsights.positiveTrends = [...new Set(aggregatedInsights.positiveTrends)];
    aggregatedInsights.recommendations = [...new Set(aggregatedInsights.recommendations)];
    aggregatedInsights.blindSpots = [...new Set(aggregatedInsights.blindSpots)];

    // Update company AI insights
    company.aiInsights = {
      lastAnalysis: new Date(),
      keyThemes: aggregatedInsights.keyThemes,
      riskAreas: aggregatedInsights.riskAreas,
      opportunities: aggregatedInsights.positiveTrends
    };
    await company.save();

    res.json({
      success: true,
      insights: aggregatedInsights
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

// Get company dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Get survey statistics
    const Survey = require('../models/Survey');
    const Response = require('../models/Response');
    const User = require('../models/User');
    
    const totalSurveys = await Survey.countDocuments({ company: req.user.company });
    const activeSurveys = await Survey.countDocuments({ 
      company: req.user.company, 
      status: 'active' 
    });
    const totalResponses = await Response.countDocuments({ company: req.user.company });
    const totalEmployees = await User.countDocuments({ 
      company: req.user.company, 
      isActive: true 
    });

    // Get recent surveys
    const recentSurveys = await Survey.find({ company: req.user.company })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'firstName lastName');

    // Get response trends (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentResponses = await Response.find({
      company: req.user.company,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const responseTrends = recentResponses.reduce((acc, response) => {
      const date = response.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      dashboard: {
        stats: {
          totalSurveys,
          activeSurveys,
          totalResponses,
          totalEmployees,
          responseRate: totalEmployees > 0 ? (totalResponses / totalEmployees * 100).toFixed(1) : 0
        },
        recentSurveys,
        responseTrends,
        aiInsights: company.aiInsights
      }
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
});

module.exports = router;
