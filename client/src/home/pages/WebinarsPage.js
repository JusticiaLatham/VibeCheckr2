import React from 'react';
import { PlayCircle, CalendarClock, Mic2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sessions = [
  {
    title: 'Rolling Out Engagement Rituals in 30 Days',
    date: 'Live • November 20, 2025',
    description: 'A tactical session with our success team on sequencing surveys, recognition, and check-ins.',
    cta: 'Save Your Seat'
  },
  {
    title: 'Product Deep Dive: AI Insights & Nudges',
    date: 'On-Demand • 45 mins',
    description: 'See how managers use VibeCheckr to surface risks and celebrate wins automatically.',
    cta: 'Watch Now'
  },
  {
    title: 'People Ops AMA with VibeCheckr Customers',
    date: 'Live • December 5, 2025',
    description: 'Hear how high-growth companies build trust while scaling distributed teams.',
    cta: 'Register'
  }
];

const WebinarsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <section className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Webinars & Events</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Join live sessions or watch on-demand content to sharpen your people ops playbook.
          </p>
        </section>

        <section className="space-y-4">
          {sessions.map((session) => (
            <div key={session.title} className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-primary-600 text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
                    <CalendarClock className="w-4 h-4" />
                    {session.date}
                  </div>
                  <h2 className="text-2xl font-semibold text-secondary-900 mt-1">{session.title}</h2>
                  <p className="text-secondary-600 mt-2 leading-relaxed">{session.description}</p>
                </div>
              </div>
              <button className="btn btn-primary md:w-auto w-full flex items-center justify-center gap-2">
                <Mic2 className="w-4 h-4" />
                {session.cta}
              </button>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default WebinarsPage;

