import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        <section className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Terms of Service</h1>
          <p className="text-secondary-600">Last updated: November 12, 2025</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-secondary-900">1. Acceptance</h2>
          <p className="text-secondary-600 leading-relaxed">
            By accessing or using VibeCheckr, you agree to these Terms. If you are accepting on behalf of an organization, you represent that you have authority to bind that organization.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-secondary-900">2. Usage</h2>
          <p className="text-secondary-600 leading-relaxed">
            You agree to use the services in compliance with applicable laws, keep your credentials secure, and not misuse or attempt to reverse engineer the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-secondary-900">3. Termination</h2>
          <p className="text-secondary-600 leading-relaxed">
            We may suspend or terminate access if you violate these terms. You may terminate your account at any time by contacting support@vibecheckr.com.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;

