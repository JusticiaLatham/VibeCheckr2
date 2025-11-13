import React from 'react';
import { Building2, Users, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const stats = [
  { label: 'Teams Supported', value: '150+' },
  { label: 'Surveys Delivered', value: '12k+' },
  { label: 'Engagement Lift', value: '28%' }
];

const pillars = [
  {
    icon: Building2,
    title: 'People-First Design',
    description: 'We build VibeCheckr to help managers meet their people where they are, with experiences that feel modern and human.'
  },
  {
    icon: Users,
    title: 'Guided Success',
    description: 'Our success team partners with you from rollout to ongoing optimization so you see impact quickly.'
  },
  {
    icon: Target,
    title: 'Measurable Outcomes',
    description: 'Every workflow in VibeCheckr is instrumented for data so you can link engagement to business outcomes.'
  }
];

const CompanyOverview = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <section className="text-center space-y-6">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            Build Better Team Rituals
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">The VibeCheckr Story</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            We founded VibeCheckr to help hybrid teams stay aligned, celebrated, and resilient. We believe rituals plus data unlock teams that thrive—no matter where they sit.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white shadow-sm border border-secondary-200 p-8 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
              <div className="text-sm uppercase tracking-wide text-secondary-500">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-secondary-900 text-center">What Drives Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="bg-white rounded-2xl border border-secondary-200 p-8 shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900">{pillar.title}</h3>
                  <p className="text-secondary-600 leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-secondary-200 p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4 text-center">Where We’re Headed</h2>
          <p className="text-secondary-600 leading-relaxed max-w-4xl mx-auto text-center">
            VibeCheckr is expanding deeper into manager enablement with coaching nudges, growth conversations, and equitable skills tracking. We are investing in integrations that connect engagement data to your system of record and close the loop between signals and action.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyOverview;

