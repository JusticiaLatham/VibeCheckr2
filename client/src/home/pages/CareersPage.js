import React from 'react';
import { Briefcase, Laptop, Heart } from 'lucide-react';

const perks = [
  {
    icon: Laptop,
    title: 'Remote-Friendly',
    description: 'Work from Denver HQ or anywhere in North America with quarterly in-person onsites.'
  },
  {
    icon: Heart,
    title: 'Care Package',
    description: 'Comprehensive health coverage, generous parental leave, and $1,500 annual wellness stipend.'
  },
  {
    icon: Briefcase,
    title: 'Career Growth',
    description: 'Annual learning budget, dedicated coach support, and transparent leveling frameworks.'
  }
];

const openings = [
  {
    title: 'Solution Architect',
    team: 'Product Strategy',
    location: 'Remote (North America)',
    type: 'Full-time'
  },
  {
    title: 'Backend Software Engineer',
    team: 'Platform Engineering',
    location: 'Denver, CO or Remote',
    type: 'Full-time'
  },
  {
    title: 'Customer Success Manager',
    team: 'Customer Experience',
    location: 'Denver, CO or Remote',
    type: 'Full-time'
  },
  {
    title: 'Product Manager',
    team: 'Product',
    location: 'Remote (US)',
    type: 'Full-time'
  }
];

const CareersPage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <section className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Join the VibeCheckr Team</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            We’re builders, facilitators, and operators on a mission to make work more human. Help us design the rituals that keep teams connected.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.title} className="bg-white rounded-2xl border border-secondary-200 p-8 shadow-sm space-y-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">{perk.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{perk.description}</p>
              </div>
            );
          })}
        </section>

        <section className="bg-white rounded-2xl border border-secondary-200 p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-secondary-900">Open Roles</h2>
              <p className="text-secondary-600">We review applications on a rolling basis.</p>
            </div>
            <a
              href="mailto:careers@vibecheckr.com"
              className="btn btn-primary w-full sm:w-auto text-center"
            >
              Send Your Resume
            </a>
          </div>

          <div className="space-y-4">
            {openings.map((role) => (
              <div
                key={role.title}
                className="border border-secondary-200 bg-white rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-900">{role.title}</h3>
                    <p className="text-secondary-600">{role.team}</p>
                  </div>
                  <div className="flex flex-col sm:items-end text-sm text-secondary-500">
                    <span>{role.location}</span>
                    <span>{role.type}</span>
                  </div>
                  <a
                    href="mailto:careers@vibecheckr.com"
                    className="btn btn-outline sm:min-w-[140px] text-center"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CareersPage;

