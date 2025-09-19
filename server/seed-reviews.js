const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const ReviewTemplate = require('./models/ReviewTemplate');
const ReviewCycle = require('./models/ReviewCycle');
const Review = require('./models/Review');
const User = require('./models/User');
const Company = require('./models/Company');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vibecheckr', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📊 MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

const seedReviews = async () => {
  try {
    // Create a demo company
    const company = new Company({
      name: 'VibeCheckr Demo',
      domain: 'vibecheckr.com',
      industry: 'Technology',
      size: '50-200 employees',
      coreValues: [
        { value: 'Innovation', description: 'We embrace new ideas and creative solutions' },
        { value: 'Collaboration', description: 'We work together to achieve common goals' },
        { value: 'Customer Success', description: 'We prioritize our customers\' success' },
        { value: 'Transparency', description: 'We communicate openly and honestly' },
        { value: 'Continuous Learning', description: 'We constantly improve and grow' }
      ]
    });
    await company.save();

    // Create demo users
    const manager = new User({
      name: 'Sarah Johnson',
      email: 'sarah@vibecheckr.com',
      role: 'manager',
      company: company._id,
      department: 'Engineering'
    });
    await manager.save();

    const employee1 = new User({
      name: 'Alex Chen',
      email: 'alex@vibecheckr.com',
      role: 'employee',
      company: company._id,
      department: 'Engineering',
      manager: manager._id
    });
    await employee1.save();

    const employee2 = new User({
      name: 'Maria Rodriguez',
      email: 'maria@vibecheckr.com',
      role: 'employee',
      company: company._id,
      department: 'Engineering',
      manager: manager._id
    });
    await employee2.save();

    // Create review template
    const template = new ReviewTemplate({
      name: 'Weekly Peer Review',
      description: 'Quick feedback on collaboration, communication, execution, and ownership',
      type: 'peer_review',
      questions: [
        {
          questionId: 'collab-1',
          text: 'How well does this person collaborate with the team?',
          category: 'collaboration',
          responseType: 'rating',
          required: true,
          scale: { min: 1, max: 5, labels: { min: 'Poor', max: 'Excellent' } }
        },
        {
          questionId: 'comm-1',
          text: 'How clear and effective is their communication?',
          category: 'communication',
          responseType: 'rating',
          required: true,
          scale: { min: 1, max: 5, labels: { min: 'Poor', max: 'Excellent' } }
        },
        {
          questionId: 'exec-1',
          text: 'How well do they execute on their tasks and commitments?',
          category: 'execution',
          responseType: 'rating',
          required: true,
          scale: { min: 1, max: 5, labels: { min: 'Poor', max: 'Excellent' } }
        },
        {
          questionId: 'own-1',
          text: 'How well do they take ownership of their work and responsibilities?',
          category: 'ownership',
          responseType: 'rating',
          required: true,
          scale: { min: 1, max: 5, labels: { min: 'Poor', max: 'Excellent' } }
        },
        {
          questionId: 'feedback-1',
          text: 'What specific feedback would you give this person?',
          category: 'communication',
          responseType: 'text',
          required: true,
          placeholder: 'Share specific examples of what they do well and areas for improvement...'
        },
        {
          questionId: 'voice-1',
          text: 'Record a quick voice message with your thoughts (optional)',
          category: 'communication',
          responseType: 'voice',
          required: false,
          helpText: 'Sometimes it\'s easier to speak your thoughts than write them down'
        }
      ],
      valuesIntegration: [
        {
          value: 'Innovation',
          questions: ['collab-1', 'exec-1']
        },
        {
          value: 'Collaboration',
          questions: ['collab-1', 'comm-1']
        },
        {
          value: 'Customer Success',
          questions: ['exec-1', 'own-1']
        }
      ],
      gamification: {
        pointsPerQuestion: 10,
        bonusPoints: 50,
        timeLimit: 10,
        badges: [
          { name: 'Quick Reviewer', description: 'Complete a review in under 5 minutes', criteria: 'time < 5' },
          { name: 'Thoughtful Feedback', description: 'Provide detailed text feedback', criteria: 'text_length > 100' }
        ]
      },
      estimatedTime: 5,
      company: company._id
    });
    await template.save();

    // Create review cycle
    const cycle = new ReviewCycle({
      name: 'Q4 2024 Weekly Reviews',
      description: 'Weekly peer reviews for Q4 2024',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-12-31'),
      dueDate: new Date('2024-12-31'),
      frequency: 'weekly',
      assignmentSettings: {
        reviewsPerManager: 2,
        assignmentMethod: 'rotation',
        includeSelfReview: false,
        includePeerReview: true
      },
      templates: [{
        template: template._id,
        reviewerType: 'peer',
        weight: 1
      }],
      status: 'active',
      progress: {
        totalReviews: 2,
        completedReviews: 0,
        overdueReviews: 0,
        completionRate: 0
      },
      notifications: {
        enabled: true,
        reminderDays: [3, 1],
        slackChannel: '#reviews',
        emailReminders: true
      },
      company: company._id
    });
    await cycle.save();

    // Create sample reviews
    const review1 = new Review({
      reviewId: `review-${Date.now()}-1`,
      reviewer: manager._id,
      reviewee: employee1._id,
      reviewCycle: cycle._id,
      template: template._id,
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      company: company._id
    });
    await review1.save();

    const review2 = new Review({
      reviewId: `review-${Date.now()}-2`,
      reviewer: manager._id,
      reviewee: employee2._id,
      reviewCycle: cycle._id,
      template: template._id,
      status: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      company: company._id
    });
    await review2.save();

    // Create a completed review for demo
    const completedReview = new Review({
      reviewId: `review-${Date.now()}-3`,
      reviewer: manager._id,
      reviewee: employee1._id,
      reviewCycle: cycle._id,
      template: template._id,
      status: 'completed',
      responses: [
        {
          questionId: 'collab-1',
          questionText: 'How well does this person collaborate with the team?',
          category: 'collaboration',
          responseType: 'rating',
          rating: 5
        },
        {
          questionId: 'comm-1',
          questionText: 'How clear and effective is their communication?',
          category: 'communication',
          responseType: 'rating',
          rating: 4
        },
        {
          questionId: 'exec-1',
          questionText: 'How well do they execute on their tasks and commitments?',
          category: 'execution',
          responseType: 'rating',
          rating: 5
        },
        {
          questionId: 'own-1',
          questionText: 'How well do they take ownership of their work and responsibilities?',
          category: 'ownership',
          responseType: 'rating',
          rating: 4
        },
        {
          questionId: 'feedback-1',
          questionText: 'What specific feedback would you give this person?',
          category: 'communication',
          responseType: 'text',
          textResponse: 'Alex is an excellent team player who always goes above and beyond. Their code quality is outstanding and they\'re always willing to help others. The only area for improvement would be speaking up more in meetings - their ideas are valuable and should be shared more often.'
        }
      ],
      overallRating: 4.5,
      strengths: ['Excellent code quality', 'Great team player', 'Always willing to help'],
      areasForImprovement: ['Speak up more in meetings', 'Take on more leadership opportunities'],
      goals: ['Lead a technical presentation', 'Mentor a junior developer'],
      valuesAlignment: [
        { value: 'Innovation', rating: 5, comments: 'Always brings creative solutions' },
        { value: 'Collaboration', rating: 5, comments: 'Works well with everyone' },
        { value: 'Customer Success', rating: 4, comments: 'Delivers quality work consistently' }
      ],
      assignedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      pointsEarned: 100,
      badgesEarned: ['Quick Reviewer', 'Thoughtful Feedback'],
      completionTime: 4,
      company: company._id
    });
    await completedReview.save();

    // Update cycle progress
    cycle.progress.completedReviews = 1;
    cycle.progress.completionRate = 33;
    await cycle.save();

    console.log('✅ Review data seeded successfully!');
    console.log(`📊 Created company: ${company.name}`);
    console.log(`👥 Created users: ${manager.name}, ${employee1.name}, ${employee2.name}`);
    console.log(`📝 Created template: ${template.name}`);
    console.log(`🔄 Created cycle: ${cycle.name}`);
    console.log(`⭐ Created reviews: 3 (2 pending, 1 completed)`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
connectDB().then(() => {
  seedReviews();
});
