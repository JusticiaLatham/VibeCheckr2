const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

class AIService {
  constructor() {
    this.model = 'gpt-4-turbo-preview';
  }

  /**
   * Generate survey questions based on company handbook and values
   */
  async generateSurveyQuestions(surveyType, companyData) {
    if (!openai) {
      // Return mock data for development
      return this.getMockSurveyQuestions(surveyType, companyData);
    }
    
    const { handbook, coreValues, industry, size } = companyData;
    
    const prompt = `
    You are an expert HR consultant creating employee pulse surveys for a ${industry} company with ${size} employees.
    
    Company Core Values:
    ${coreValues.map(cv => `- ${cv.value}: ${cv.description}`).join('\n')}
    
    Company Handbook Context:
    ${handbook || 'No handbook provided'}
    
    Generate 10-15 questions for a ${surveyType} survey that:
    1. Align with the company's core values and culture
    2. Are appropriate for the company size and industry
    3. Focus on actionable insights for leadership
    4. Include a mix of question types (rating, multiple choice, text)
    5. Address potential blind spots executives should know about
    
    Return as JSON with this structure:
    {
      "questions": [
        {
          "text": "Question text",
          "type": "rating|multiple_choice|text|yes_no|scale",
          "options": ["option1", "option2"] // only for multiple_choice
          "category": "engagement|culture|growth|communication|leadership|workload|satisfaction",
          "required": true
        }
      ],
      "insights": ["key insight 1", "key insight 2"],
      "riskAreas": ["potential risk 1", "potential risk 2"]
    }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating survey questions:', error);
      throw new Error('Failed to generate AI survey questions');
    }
  }

  /**
   * Analyze calendar events for high-interest milestones
   */
  async analyzeCalendarEvent(eventData) {
    if (!openai) {
      return {
        isHighInterest: false,
        confidence: 0,
        keywords: [],
        suggestedSurveyType: null,
        riskLevel: 'low',
        reasoning: 'AI analysis not available - OpenAI API key not configured'
      };
    }
    
    const prompt = `
    Analyze this calendar event for high-interest business milestones:
    
    Title: ${eventData.title}
    Description: ${eventData.description || 'No description'}
    Attendees: ${eventData.attendees?.length || 0} people
    Duration: ${eventData.duration || 'Unknown'}
    
    Determine if this event represents a significant business milestone that should trigger an employee survey.
    Consider factors like:
    - All-hands meetings
    - Product launches
    - Major announcements
    - Team restructuring
    - Strategic initiatives
    - High attendance (10+ people)
    
    Return JSON:
    {
      "isHighInterest": boolean,
      "confidence": number (0-1),
      "keywords": ["keyword1", "keyword2"],
      "suggestedSurveyType": "milestone_survey|all_hands_followup|team_feedback",
      "riskLevel": "low|medium|high",
      "reasoning": "explanation of why this is/isn't high interest"
    }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing calendar event:', error);
      return {
        isHighInterest: false,
        confidence: 0,
        keywords: [],
        suggestedSurveyType: null,
        riskLevel: 'low',
        reasoning: 'Analysis failed'
      };
    }
  }

  /**
   * Generate questions from all-hands slide deck
   */
  async generateQuestionsFromSlideDeck(slideContent, companyContext) {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.');
    }
    
    const prompt = `
    Analyze this all-hands meeting slide deck and generate 15 survey questions to evaluate:
    1. How well employees understood the information
    2. Their excitement about the roadmap
    3. Concerns or questions they might have
    4. Alignment with company direction
    
    Slide Content:
    ${slideContent}
    
    Company Context:
    - Industry: ${companyContext.industry}
    - Size: ${companyContext.size}
    - Core Values: ${companyContext.coreValues?.map(cv => cv.value).join(', ') || 'Not provided'}
    
    Generate questions that will help leadership understand:
    - Information clarity and comprehension
    - Employee sentiment and excitement
    - Potential concerns or resistance
    - Alignment with company goals
    - Areas needing more communication
    
    Return as JSON:
    {
      "questions": [
        {
          "text": "Question text",
          "type": "rating|multiple_choice|text|yes_no|scale",
          "options": ["option1", "option2"] // only for multiple_choice
          "category": "comprehension|sentiment|alignment|concerns|communication",
          "required": true
        }
      ],
      "keyThemes": ["theme1", "theme2"],
      "executiveInsights": ["insight1", "insight2"]
    }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 1500
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating questions from slide deck:', error);
      throw new Error('Failed to generate questions from slide deck');
    }
  }

  /**
   * Analyze survey responses for insights and trends
   */
  async analyzeSurveyResponses(surveyId, responses) {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.');
    }
    
    const prompt = `
    Analyze these survey responses and provide executive-level insights:
    
    Survey ID: ${surveyId}
    Total Responses: ${responses.length}
    
    Response Data:
    ${JSON.stringify(responses, null, 2)}
    
    Provide analysis focusing on:
    1. Key themes and patterns
    2. Risk areas requiring attention
    3. Positive trends to celebrate
    4. Actionable recommendations
    5. Blind spots executives should know about
    
    Return JSON:
    {
      "overallSentiment": "positive|neutral|negative",
      "keyThemes": ["theme1", "theme2"],
      "riskAreas": [
        {
          "area": "risk description",
          "severity": "low|medium|high",
          "recommendation": "action to take"
        }
      ],
      "positiveTrends": ["trend1", "trend2"],
      "executiveRecommendations": ["rec1", "rec2"],
      "blindSpots": ["blind spot 1", "blind spot 2"],
      "confidence": 0.85
    }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1000
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing survey responses:', error);
      throw new Error('Failed to analyze survey responses');
    }
  }

  /**
   * Generate personalized survey suggestions based on company growth
   */
  async generateGrowthBasedSuggestions(companyData, recentEvents) {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.');
    }
    
    const prompt = `
    Based on this company's growth trajectory and recent events, suggest survey topics:
    
    Company: ${companyData.name}
    Industry: ${companyData.industry}
    Size: ${companyData.size}
    Recent Events: ${recentEvents.map(e => e.title).join(', ')}
    
    Suggest 5-7 survey topics that would be valuable for a scaling business:
    1. Focus on growth-related challenges
    2. Address scaling pains
    3. Identify cultural evolution needs
    4. Capture team dynamics during growth
    
    Return JSON:
    {
      "suggestions": [
        {
          "title": "Survey title",
          "description": "Why this survey matters",
          "priority": "high|medium|low",
          "timing": "immediate|next_month|quarterly",
          "targetAudience": "all_employees|leadership|new_hires"
        }
      ],
      "growthInsights": ["insight1", "insight2"]
    }
    `;

    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 800
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Error generating growth-based suggestions:', error);
      throw new Error('Failed to generate growth-based suggestions');
    }
  }

  /**
   * Mock survey questions for development
   */
  getMockSurveyQuestions(surveyType, companyData) {
    const { coreValues, industry } = companyData;
    
    const surveyTemplates = {
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

    const template = surveyTemplates[surveyType] || surveyTemplates['monthly_pulse'];
    
    return {
      title: template.title,
      description: template.description,
      questions: template.questions,
      insights: [
        'Focus on areas with low satisfaction scores',
        'Identify patterns in open-ended responses',
        'Track trends over time for continuous improvement'
      ],
      riskAreas: [
        'Low engagement scores may indicate cultural issues',
        'Communication gaps could affect productivity',
        'Workload concerns may lead to burnout'
      ]
    };
  }
}

module.exports = new AIService();
