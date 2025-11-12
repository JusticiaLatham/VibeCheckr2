import React from 'react';
import { MessageCircle, Award, CalendarCheck2 } from 'lucide-react';

const highlights = [
  {
    icon: MessageCircle,
    title: 'Discussion Boards',
    description: 'Swap rituals, ask for feedback, and share templates with other managers.'
  },
  {
    icon: CalendarCheck2,
    title: 'Monthly Roundtables',
    description: 'Live, facilitated sessions diving into retention, recognition, and enablement.'
  },
  {
    icon: Award,
    title: 'Member Spotlights',
    description: 'Celebrate wins and learn from teams shipping people-first programs.'
  }
];

const CommunityPage = () => {
  return (
    <div className="bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <section className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">VibeCheckr Community</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Learn alongside people leaders building cultures of psychological safety and high performance.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm space-y-3 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">{item.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </section>

        <section className="bg-white border border-secondary-200 rounded-2xl p-10 shadow-sm text-center space-y-4">
          <h2 className="text-2xl font-semibold text-secondary-900">Ready to join?</h2>
          <p className="text-secondary-600">Request an invite to our private Slack community.</p>
          <button className="btn btn-primary">Request Invite</button>
        </section>
      </div>
    </div>
  );
};

export default CommunityPage;

