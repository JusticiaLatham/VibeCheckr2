import React from 'react';
import { ShieldCheck, Scale, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const legalLinks = [
  { title: 'Privacy Policy', description: 'Understand how we collect, use, and protect personal data.', href: '/privacy' },
  { title: 'Terms of Service', description: 'The rules of the road for using VibeCheckr’s products.', href: '/terms' },
  { title: 'Cookie Policy', description: 'Learn how and why we use cookies and similar technologies.', href: '/cookies' },
  { title: 'GDPR', description: 'Our commitment to GDPR compliance and data subject rights.', href: '/gdpr' },
  { title: 'Security', description: 'Infrastructure, monitoring, and processes that keep your data safe.', href: '/security' }
];

const LegalOverviewPage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <section className="space-y-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Trust & Compliance
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Legal Center</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Transparency is core to our mission. Explore the policies and safeguards that keep your organization compliant and your data protected.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {legalLinks.map((link) => (
            <Link
              key={link.title}
              to={link.href}
              className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-600 uppercase tracking-wide">
                <FileText className="w-4 h-4" />
                Policy
              </div>
              <h3 className="text-xl font-semibold text-secondary-900">{link.title}</h3>
              <p className="text-secondary-600 leading-relaxed">{link.description}</p>
              <span className="text-primary-600 font-semibold mt-auto">View document →</span>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
};

export default LegalOverviewPage;

