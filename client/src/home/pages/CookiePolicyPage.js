import React from 'react';

const CookiePolicyPage = () => {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <section className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Cookie Policy</h1>
          <p className="text-secondary-600">Last updated: November 12, 2025</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-secondary-900">What Are Cookies?</h2>
          <p className="text-secondary-600 leading-relaxed">
            Cookies are small text files that help us recognize your browser, remember preferences, and improve performance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-secondary-900">How We Use Cookies</h2>
          <ul className="list-disc pl-6 text-secondary-600 space-y-2">
            <li>Authentication cookies keep you signed in.</li>
            <li>Analytics cookies measure usage and improve the product.</li>
            <li>Preference cookies remember your settings.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-secondary-900">Managing Cookies</h2>
          <p className="text-secondary-600 leading-relaxed">
            You can control cookies through your browser settings. Disabling cookies may impact your experience with the service.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicyPage;

