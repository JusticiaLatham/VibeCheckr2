import React from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  MessageSquare, 
  Award, 
  Zap, 
  Shield, 
  Brain,
  Target,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into team performance with AI-powered analytics and customizable dashboards.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Team Surveys",
      description: "Create and distribute pulse surveys to understand team sentiment and engagement levels.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Calendar,
      title: "Performance Reviews",
      description: "Streamline your review process with automated scheduling and comprehensive feedback collection.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Slack Integration",
      description: "Seamlessly integrate with Slack for real-time notifications and easy survey distribution.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Boost engagement with points, badges, and leaderboards that make feedback fun and rewarding.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "Leverage artificial intelligence to identify patterns and provide actionable recommendations.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and track individual and team goals with progress monitoring and milestone celebrations.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: TrendingUp,
      title: "Career Progress",
      description: "Help employees visualize their career path with skill tracking and development recommendations.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Clock,
      title: "Real-time Notifications",
      description: "Stay updated with instant notifications for surveys, reviews, and important team updates.",
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Build
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              High-Performing Teams
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            VibeCheckr provides all the tools you need to understand, engage, and develop your team members effectively.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            All features included in every plan
          </div>
          <p className="text-gray-600 mb-8">
            No hidden fees, no feature restrictions. Get access to everything VibeCheckr has to offer.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
