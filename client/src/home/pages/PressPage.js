import React from 'react';
import { Megaphone, Newspaper, Award } from 'lucide-react';

const mentions = [
  {
    outlet: 'Employee Experience Weekly',
    headline: 'VibeCheckr Raises Seed Round to Bring AI to Performance Rituals',
    link: '#',
    date: 'July 12, 2025'
  },
  {
    outlet: 'Future of Work Podcast',
    headline: 'How Ritual Design Solves Engagement Fatigue',
    link: '#',
    date: 'May 5, 2025'
  },
  {
    outlet: 'Denver Tech Journal',
    headline: 'Why VibeCheckr Chose Denver for its HQ Expansion',
    link: '#',
    date: 'February 20, 2025'
  }
];

const PressPage = () => {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Press & Media</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Download assets, explore media coverage, and connect with our communications team.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl border border-secondary-200 p-8 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900">Media Inquiries</h3>
            <p className="text-secondary-600">press@vibecheckr.com</p>
          </div>
          <div className="bg-white rounded-2xl border border-secondary-200 p-8 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900">Press Kit</h3>
            <p className="text-secondary-600">Brand guidelines, product screenshots, and leadership bios.</p>
            <button className="btn btn-outline w-full">Download Kit</button>
          </div>
          <div className="bg-white rounded-2xl border border-secondary-200 p-8 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900">Awards</h3>
            <p className="text-secondary-600">2025 Culture Tech Breakthrough, 2024 Denver Startup to Watch.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-secondary-900">Recent Coverage</h2>
          <div className="space-y-4">
            {mentions.map((mention) => (
              <div key={mention.headline} className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-primary-600 font-semibold text-sm uppercase tracking-wide">{mention.outlet}</div>
                  <h3 className="text-xl font-semibold text-secondary-900 mt-1">{mention.headline}</h3>
                  <div className="text-secondary-500 text-sm mt-1">{mention.date}</div>
                </div>
                <a href={mention.link} className="btn btn-outline w-full sm:w-auto text-center">
                  View Article
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PressPage;

