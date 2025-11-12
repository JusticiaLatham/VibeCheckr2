import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        <section className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Privacy Policy</h1>
          <p className="text-secondary-600">
            Last updated: November 12, 2025
          </p>
          <p className="text-secondary-600 leading-relaxed">
            At VibeCheckr, we respect the privacy of our customers and end users. This policy explains what data we collect, how we use it, and the choices you have.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-secondary-900">Information We Collect</h2>
          <ul className="list-disc pl-6 text-secondary-600 space-y-2">
            <li>Account information such as name, email address, company, and role.</li>
            <li>Survey and review data submitted by your team.</li>
            <li>Usage analytics that help us improve the product.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-secondary-900">How We Use Data</h2>
          <p className="text-secondary-600 leading-relaxed">
            We process personal data to deliver and enhance our services, provide customer support, detect fraud, and stay compliant with legal obligations. We never sell personal data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-secondary-900">Your Choices</h2>
          <p className="text-secondary-600 leading-relaxed">
            You can access, correct, or delete your personal information at any time. Contact privacy@vibecheckr.com to exercise your rights.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

