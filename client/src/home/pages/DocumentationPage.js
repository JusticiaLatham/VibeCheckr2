import React from 'react';
import { Code2, ServerCog, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sections = [
  {
    icon: Code2,
    title: 'REST API Reference',
    description: 'Endpoints, request payloads, and examples for syncing reviews, surveys, and users.'
  },
  {
    icon: ServerCog,
    title: 'Integration Guides',
    description: 'Detailed walkthroughs for connecting VibeCheckr with your HRIS, Slack, and calendar tools.'
  },
  {
    icon: ShieldCheck,
    title: 'Security & Compliance',
    description: 'Authentication, auditing, and data retention practices to keep your org compliant.'
  }
];

const DocumentationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <section className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Developer Documentation</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Build on top of VibeCheckr with secure APIs, webhooks, and embeddable components.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">{section.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{section.description}</p>
                <button className="text-primary-600 font-semibold hover:text-primary-700">Read docs →</button>
              </div>
            );
          })}
        </section>

        <section className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-secondary-900 mb-3">SDKs & Samples</h2>
          <p className="text-secondary-600 mb-4">
            Explore starter kits for Node.js, Python, and TypeScript along with sample apps and Postman collections.
          </p>
          <button className="btn btn-outline">View GitHub Repository</button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DocumentationPage;

