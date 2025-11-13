import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LifeBuoy, Users, LayoutGrid, Video } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const resourceCards = [
  {
    icon: LifeBuoy,
    title: 'Help Center',
    description: 'Guides, FAQs, and step-by-step walkthroughs to get your team onboarded quickly.',
    href: '/help-center'
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Deep dive into APIs, integrations, and advanced configuration.',
    href: '/documentation'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join managers and people leaders swapping rituals, playbooks, and best practices.',
    href: '/community'
  },
  {
    icon: LayoutGrid,
    title: 'Templates',
    description: 'Plug-and-play survey and review templates curated by our success team.',
    href: '/templates'
  },
  {
    icon: Video,
    title: 'Webinars',
    description: 'Live and on-demand sessions covering product releases and people ops trends.',
    href: '/webinars'
  }
];

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">VibeCheckr Resources</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Everything you need to launch, scale, and celebrate the rituals that power high-performing teams.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resourceCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900">{card.title}</h3>
                  <p className="text-secondary-600 mt-2 leading-relaxed">{card.description}</p>
                </div>
                <span className="text-primary-600 font-semibold mt-auto">
                  Explore &rarr;
                </span>
              </Link>
            );
          })}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ResourcesPage;

