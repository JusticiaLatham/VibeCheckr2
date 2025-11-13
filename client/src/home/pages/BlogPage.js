import React from 'react';
import { PenSquare, BarChart3, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const posts = [
  {
    title: 'The Manager Rituals Playbook',
    description: 'How high-performing teams run weekly feedback, recognition, and planning cadences.',
    date: 'October 22, 2025',
    category: 'Leadership',
    icon: PenSquare
  },
  {
    title: 'Connecting Engagement to Business KPIs',
    description: 'A framework for linking employee sentiment to revenue, retention, and NPS.',
    date: 'September 30, 2025',
    category: 'Analytics',
    icon: BarChart3
  },
  {
    title: 'Building Psychological Safety in Hybrid Teams',
    description: 'Practices we’ve seen work across fast-scaling hybrid orgs.',
    date: 'August 18, 2025',
    category: 'Culture',
    icon: MessageCircle
  }
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">Insights from the VibeCheckr Team</h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Explore strategies, rituals, and stories that help people teams build cultures of trust and performance.
          </p>
        </section>

        <section className="space-y-6">
          {posts.map((post) => {
            const Icon = post.icon;
            return (
              <article key={post.title} className="bg-white rounded-2xl border border-secondary-200 p-8 shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-primary-600 font-medium">
                  <div className="inline-flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {post.category}
                  </div>
                  <span className="text-secondary-500">{post.date}</span>
                </div>
                <h2 className="text-2xl font-semibold text-secondary-900 mt-4 mb-3">{post.title}</h2>
                <p className="text-secondary-600 leading-relaxed">{post.description}</p>
                <button className="mt-6 text-primary-600 font-semibold hover:text-primary-700">
                  Read Story →
                </button>
              </article>
            );
          })}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;

