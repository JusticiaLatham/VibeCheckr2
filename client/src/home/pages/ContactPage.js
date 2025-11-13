import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Let’s Talk</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Whether you’re curious about pricing, want a tailored demo, or need support rolling out VibeCheckr, we’re here to help.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-secondary-200 rounded-2xl p-6 text-center shadow-sm">
            <Mail className="w-6 h-6 text-primary-600 mx-auto mb-3" />
            <div className="font-semibold text-secondary-900">Email</div>
            <a href="mailto:hello@vibecheckr.com" className="text-primary-600">hello@vibecheckr.com</a>
          </div>
          <div className="bg-white border border-secondary-200 rounded-2xl p-6 text-center shadow-sm">
            <Phone className="w-6 h-6 text-primary-600 mx-auto mb-3" />
            <div className="font-semibold text-secondary-900">Phone</div>
            <span className="text-secondary-600">(202) 499-0035</span>
          </div>
          <div className="bg-white border border-secondary-200 rounded-2xl p-6 text-center shadow-sm">
            <MapPin className="w-6 h-6 text-primary-600 mx-auto mb-3" />
            <div className="font-semibold text-secondary-900">HQ</div>
            <span className="text-secondary-600">Denver, CO</span>
          </div>
        </section>

        <section className="bg-white border border-secondary-200 rounded-2xl p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Send us a message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full border border-secondary-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Work Email</label>
                <input
                  type="email"
                  className="w-full border border-secondary-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="jane@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Company</label>
              <input
                type="text"
                className="w-full border border-secondary-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">How can we help?</label>
              <textarea
                rows="4"
                className="w-full border border-secondary-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Tell us a bit about what you’re looking for…"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary inline-flex items-center">
              <Send className="w-4 h-4 mr-2" />
              Submit
            </button>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;

