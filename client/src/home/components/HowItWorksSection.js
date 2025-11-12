import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Set Up Your Team",
      description: "Invite your team members and configure your organization settings. Import data from existing systems or start fresh.",
      features: [
        "Quick team onboarding",
        "Role-based permissions",
        "Integration setup"
      ]
    },
    {
      number: "02",
      title: "Create Surveys & Reviews",
      description: "Design custom surveys and review templates tailored to your team's needs. Use our AI-powered suggestions or start from scratch.",
      features: [
        "Template library",
        "AI-powered suggestions",
        "Custom question types"
      ]
    },
    {
      number: "03",
      title: "Collect Feedback",
      description: "Distribute surveys through multiple channels including Slack, email, and direct links. Track response rates in real-time.",
      features: [
        "Multi-channel distribution",
        "Real-time tracking",
        "Automated reminders"
      ]
    },
    {
      number: "04",
      title: "Analyze & Act",
      description: "Get instant insights with our advanced analytics. Identify trends, spot issues early, and take action with AI recommendations.",
      features: [
        "Advanced analytics",
        "AI insights",
        "Action recommendations"
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How VibeCheckr Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in minutes and see results within days. Our simple 4-step process makes team management effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Number */}
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xl font-bold mx-auto mb-6 relative z-10">
                  {step.number}
                </div>

                {/* Step Content */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-8 h-8 transform -translate-x-4 -translate-y-4">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Team?
            </h3>
            <p className="text-gray-600 mb-6">
              Get started with VibeCheckr and begin building better teams today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
              <Link
                to="/app"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Try the App
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
