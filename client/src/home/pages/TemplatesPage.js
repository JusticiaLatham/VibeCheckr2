import React from 'react';
import { ClipboardList, SmilePlus, Trophy } from 'lucide-react';

const templates = [
  {
    icon: ClipboardList,
    title: 'Quarterly Performance Review',
    description: 'Structured review with competency ratings, open feedback, and development goals.',
    type: 'Performance'
  },
  {
    icon: SmilePlus,
    title: 'Employee Pulse Survey',
    description: '10-question survey focused on sentiment, belonging, and enablement.',
    type: 'Engagement'
  },
  {
    icon: Trophy,
    title: 'Recognition Nominations',
    description: 'Celebrate team wins with peer nominations and story prompts.',
    type: 'Recognition'
  }
];

const TemplatesPage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <section className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Template Library</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Kickstart your next survey or review with curated templates built from thousands of successful team launches.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <div key={template.title} className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{template.type}</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">{template.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{template.description}</p>
                <button className="btn btn-outline w-full">Preview Template</button>
              </div>
            );
          })}
        </section>

        <section className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm text-center space-y-3">
          <h2 className="text-xl font-semibold text-secondary-900">Need something custom?</h2>
          <p className="text-secondary-600">Work with our success team to tailor questions, scoring, and workflows.</p>
          <button className="btn btn-primary">Book a Template Workshop</button>
        </section>
      </div>
    </div>
  );
};

export default TemplatesPage;

