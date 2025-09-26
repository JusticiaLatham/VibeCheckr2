import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "HR Director",
      company: "TechCorp",
      avatar: "SC",
      content: "VibeCheckr has completely transformed how we approach employee feedback. The AI insights have helped us identify and address issues before they become problems.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Engineering Manager",
      company: "StartupXYZ",
      avatar: "MR",
      content: "The Slack integration is a game-changer. Our team actually looks forward to surveys now, and the gamification elements keep everyone engaged.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "CEO",
      company: "GrowthCo",
      avatar: "EJ",
      content: "We've seen a 40% improvement in team satisfaction since implementing VibeCheckr. The analytics help us make data-driven decisions about our culture.",
      rating: 5
    },
    {
      name: "David Kim",
      role: "People Operations",
      company: "ScaleUp Inc",
      avatar: "DK",
      content: "The review process used to be a nightmare. Now it's automated, efficient, and actually enjoyable for both managers and employees.",
      rating: 5
    },
    {
      name: "Lisa Wang",
      role: "Team Lead",
      company: "InnovateLab",
      avatar: "LW",
      content: "The career progress tracking feature has been incredible for our team's development. Employees can see their growth path clearly.",
      rating: 5
    },
    {
      name: "James Thompson",
      role: "VP of Engineering",
      company: "DataFlow",
      avatar: "JT",
      content: "VibeCheckr's analytics have given us insights we never had before. We can now predict and prevent team issues proactively.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by Teams Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers are saying about VibeCheckr and how it's transforming their team culture.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-8 h-8 text-blue-600" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-blue-600 font-medium">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Highlights */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">AI-Powered</div>
              <div className="text-gray-600">Smart Analytics</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
              <div className="text-gray-600">Feedback Collection</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">Secure</div>
              <div className="text-gray-600">Enterprise Grade</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">Easy</div>
              <div className="text-gray-600">Setup & Use</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
