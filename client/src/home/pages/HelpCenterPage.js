import React from 'react';
import { Search, MessageSquare, BookOpenCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const topics = [
  {
    title: 'Getting Started',
    description: 'Invite your team, configure permissions, and launch your first survey in under an hour.'
  },
  {
    title: 'Engagement Programs',
    description: 'Best practices for building recurring cadence of check-ins, reviews, and recognitions.'
  },
  {
    title: 'Integrations',
    description: 'Step-by-step instructions for connecting Slack, Google Workspace, calendar, and more.'
  }
];

const HelpCenterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Help Center</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Search articles, follow guided tours, or reach out to our support team to get unstuck fast.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search help articles…"
                className="w-full border border-secondary-200 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div key={topic.title} className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm space-y-3">
              <BookOpenCheck className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-secondary-900">{topic.title}</h3>
              <p className="text-secondary-600 leading-relaxed">{topic.description}</p>
              <button className="text-primary-600 font-semibold hover:text-primary-700">View articles →</button>
            </div>
          ))}
        </section>

        <section className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
          <MessageSquare className="w-6 h-6 text-primary-600 mx-auto" />
          <h2 className="text-xl font-semibold text-secondary-900">Need more help?</h2>
          <p className="text-secondary-600">Email us at support@vibecheckr.com or chat with our team inside the app.</p>
          <button className="btn btn-primary">Contact Support</button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HelpCenterPage;

