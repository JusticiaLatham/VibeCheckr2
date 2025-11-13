import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GDPRPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <section className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">GDPR Commitment</h1>
          <p className="text-secondary-600">Last updated: November 12, 2025</p>
          <p className="text-secondary-600 leading-relaxed">
            VibeCheckr adheres to GDPR requirements when processing personal data of EU residents. We act as a processor on behalf of our customers and have appropriate contractual, technical, and organizational measures in place.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-secondary-900">Data Processing</h2>
          <p className="text-secondary-600 leading-relaxed">
            We only process personal data according to customer instructions and retain it for as long as needed to deliver the service. Subprocessors must meet our security and privacy standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-secondary-900">Data Subject Rights</h2>
          <p className="text-secondary-600 leading-relaxed">
            Individuals can request access, correction, or deletion of their data. We assist customers in fulfilling these requests promptly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-secondary-900">Contact</h2>
          <p className="text-secondary-600 leading-relaxed">
            For data processing agreements or GDPR questions, contact privacy@vibecheckr.com.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default GDPRPage;

