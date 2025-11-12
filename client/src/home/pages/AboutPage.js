import React from 'react';
import { HeartHandshake, Rocket, Lightbulb } from 'lucide-react';

const values = [
  {
    icon: HeartHandshake,
    title: 'Empathy at Scale',
    description: 'We build experiences that help leaders listen intentionally and act on what their people need.'
  },
  {
    icon: Rocket,
    title: 'Momentum Matters',
    description: 'We ship quickly, learn from teams, and iterate with them to keep momentum high.'
  },
  {
    icon: Lightbulb,
    title: 'Clarity Over Chaos',
    description: 'We value clarity in data, in rituals, and in how we communicate internally and externally.'
  }
];

const AboutPage = () => {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">About VibeCheckr</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            VibeCheckr started with a simple idea: teams do their best work when they feel seen, supported, and have clear rituals to celebrate progress. We set out to create software that makes that easy.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="bg-white p-8 rounded-2xl border border-secondary-200 shadow-sm space-y-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">{value.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </section>

        <section className="bg-white rounded-2xl border border-secondary-200 p-10 shadow-sm space-y-4">
          <h2 className="text-2xl font-semibold text-secondary-900">Our Mission</h2>
          <p className="text-secondary-600 leading-relaxed">
            We believe feedback should drive belonging, not burnout. Our mission is to help every manager build predictable, inclusive rituals that boost engagement, retention, and growth. We combine thoughtful workflows with smart AI to remove busywork and surface the next-best action.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;

