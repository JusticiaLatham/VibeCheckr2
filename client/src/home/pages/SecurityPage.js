import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const controls = [
  {
    icon: Shield,
    title: 'Infrastructure Security',
    description: 'Data stays encrypted at rest and in transit on SOC 2 compliant cloud infrastructure.'
  },
  {
    icon: Lock,
    title: 'Access Controls',
    description: 'SSO, MFA, and least-privilege permissions keep accounts secure across your org.'
  },
  {
    icon: Eye,
    title: 'Monitoring & Response',
    description: 'Continuous logging, anomaly detection, and an on-call response team guard your data.'
  }
];

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <section className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Security at VibeCheckr</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Security is foundational to how we build. We combine modern infrastructure, strict operational controls, and third-party audits to protect customer data.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {controls.map((control) => {
            const Icon = control.icon;
            return (
              <div key={control.title} className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm space-y-3 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">{control.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{control.description}</p>
              </div>
            );
          })}
        </section>

        <section className="bg-white border border-secondary-200 rounded-2xl p-8 shadow-sm space-y-3">
          <h2 className="text-xl font-semibold text-secondary-900">Compliance & Certifications</h2>
          <p className="text-secondary-600 leading-relaxed">
            We maintain SOC 2 Type II controls and align with GDPR requirements. Our roadmap includes ISO 27001 certification and additional regional attestations.
          </p>
          <p className="text-secondary-600 leading-relaxed">
            Need our latest security documentation or to submit a questionnaire? Email security@vibecheckr.com and our trust team will assist within one business day.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SecurityPage;

