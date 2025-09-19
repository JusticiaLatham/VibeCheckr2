# VibeCheckr Pulse - AI-Powered Employee Engagement Platform

VibeCheckr Pulse is a revolutionary employee engagement platform that uses AI to create intelligent, context-aware pulse surveys for scaling businesses. The platform automatically detects high-interest business milestones, generates survey questions based on company values and culture, and provides executive-level insights to help leaders understand their team dynamics.

## 🚀 Key Features

### AI-Powered Survey Generation
- **Smart Question Suggestions**: AI generates survey questions based on company handbook, core values, and industry context
- **Context-Aware Surveys**: Different question sets for different survey types (onboarding, monthly pulse, milestone surveys)
- **Growth-Based Suggestions**: Survey topics that evolve with your company's growth trajectory

### Calendar Integration & Milestone Detection
- **Google Calendar Integration**: Automatically syncs with company calendars
- **High-Interest Event Detection**: AI identifies important meetings, product launches, all-hands meetings
- **Automatic Survey Triggers**: Launches surveys based on detected milestones
- **Slide Deck Analysis**: Upload all-hands slide decks for AI to generate follow-up questions

### Standard Survey Templates
- **Onboarding Surveys**: 1-week, 60-day, 90-day, 6-month, and 1-year check-ins
- **Monthly Pulse Surveys**: Regular engagement tracking
- **Milestone Surveys**: Event-specific feedback collection
- **All-Hands Follow-ups**: Post-meeting comprehension and sentiment analysis

### Executive Dashboard & Insights
- **Blind Spot Identification**: AI identifies areas executives should pay attention to
- **Risk Assessment**: Early warning system for potential issues
- **Growth Insights**: Understanding how team dynamics change during scaling
- **Actionable Recommendations**: AI-generated suggestions for leadership

### Mobile-First Experience
- **Push Notifications**: Real-time alerts for leaders about important insights
- **Mobile-Optimized**: Responsive design for on-the-go management
- **Quick Actions**: Easy survey creation and response management

## 🏗️ Architecture

### Backend (Node.js + Express)
- **RESTful API**: Clean, well-documented API endpoints
- **MongoDB**: Document-based database for flexible data storage
- **JWT Authentication**: Secure user authentication and authorization
- **AI Integration**: OpenAI GPT-4 for intelligent survey generation and analysis
- **Calendar APIs**: Google Calendar integration for milestone detection
- **File Processing**: PDF/DOC processing for handbook and slide deck analysis

### Frontend (React + Tailwind CSS)
- **Modern React**: Hooks, Context API, and React Query for state management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live dashboard updates and notifications
- **Interactive Charts**: Data visualization with Recharts
- **Form Management**: React Hook Form for complex survey creation

### AI Services
- **Survey Generation**: Context-aware question creation
- **Sentiment Analysis**: Employee response analysis
- **Milestone Detection**: Calendar event analysis
- **Executive Insights**: High-level recommendations and blind spot identification

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key
- Google Calendar API credentials

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VibeCheckr2
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vibecheckr
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/calendar/callback
   ```

4. **Start the backend server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies** (if not done globally)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 Mobile App (Future Enhancement)

The platform is designed with mobile-first principles and includes:
- **Progressive Web App (PWA)**: Installable on mobile devices
- **Push Notifications**: Real-time alerts for important insights
- **Offline Support**: Basic functionality without internet connection
- **Native App**: Future React Native implementation planned

## 🔧 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user and company
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Surveys
- `GET /api/surveys` - Get all surveys
- `POST /api/surveys` - Create new survey
- `POST /api/surveys/ai-generate` - Generate AI-powered survey
- `GET /api/surveys/:id` - Get survey details
- `POST /api/surveys/:id/respond` - Submit survey response
- `GET /api/surveys/:id/responses` - Get survey responses

### AI Services
- `POST /api/ai/generate-survey-questions` - Generate survey questions
- `POST /api/ai/generate-slide-questions` - Generate questions from slide deck
- `POST /api/ai/analyze-responses` - Analyze survey responses
- `GET /api/ai/growth-suggestions` - Get growth-based suggestions
- `GET /api/ai/company-insights` - Get company AI insights

### Calendar Integration
- `GET /api/calendar/auth-url` - Get Google Calendar auth URL
- `POST /api/calendar/sync` - Sync calendar events
- `GET /api/calendar/high-interest-events` - Get high-interest events
- `POST /api/calendar/upload-slidedeck` - Upload slide deck

### Analytics
- `GET /api/analytics/survey/:id` - Get survey analytics
- `GET /api/analytics/company` - Get company analytics
- `GET /api/analytics/executive` - Get executive dashboard data

## 🎯 Use Cases

### For HR Teams
- **Automated Onboarding**: AI-generated surveys for new hire check-ins
- **Culture Monitoring**: Regular pulse surveys to track team sentiment
- **Event Follow-ups**: Automatic surveys after all-hands meetings
- **Risk Management**: Early detection of potential issues

### For Executives
- **Blind Spot Identification**: AI highlights areas needing attention
- **Growth Insights**: Understanding team dynamics during scaling
- **Strategic Decisions**: Data-driven insights for leadership decisions
- **Employee Retention**: Proactive identification of retention risks

### For Scaling Businesses
- **Milestone Tracking**: Automatic surveys around important events
- **Team Alignment**: Ensuring everyone understands company direction
- **Communication Effectiveness**: Measuring how well information is received
- **Cultural Evolution**: Tracking how company culture changes with growth

## 🔮 Future Enhancements

### Phase 2 Features
- **Advanced AI Models**: Integration with more sophisticated AI models
- **Predictive Analytics**: Forecasting team trends and issues
- **Integration Hub**: Connect with Slack, Microsoft Teams, and other tools
- **Advanced Reporting**: Custom report generation and scheduling

### Phase 3 Features
- **Machine Learning**: Custom models trained on company data
- **Voice Surveys**: Voice-to-text survey responses
- **Video Analysis**: Meeting sentiment analysis from video calls
- **Global Expansion**: Multi-language support and timezone management

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and standards
- Pull request process
- Issue reporting
- Development setup

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact our support team

## 🎉 Getting Started

1. **Sign up** for a new account
2. **Upload your company handbook** and define core values
3. **Connect your calendar** for automatic milestone detection
4. **Create your first AI-powered survey**
5. **Start gathering insights** about your team's pulse

---

**VibeCheckr Pulse** - Making employee engagement intelligent, automated, and actionable for scaling businesses.
