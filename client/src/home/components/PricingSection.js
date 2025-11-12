import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CalendarCheck } from 'lucide-react';

const plans = [
  {
    name: 'Monthly Plan',
    id: 'monthly',
    price: '$650',
    billing: 'per month',
    description: 'Flexible month-to-month billing for growing teams.',
    features: [
      'Unlimited surveys & feedback touchpoints',
      'Advanced analytics & reporting',
      'Slack and calendar integrations',
      'Stripe-powered secure billing'
    ],
    icon: CreditCard
  },
  {
    name: 'Annual Plan',
    id: 'annual',
    price: '$6,000',
    billing: 'per year',
    description: 'Best value for teams ready to make a long-term commitment.',
    features: [
      'All monthly plan features',
      'Dedicated success partner',
      'Priority roadmap requests',
      '2 months free compared to monthly'
    ],
    icon: CalendarCheck,
    highlight: true
  }
];

const PricingSection = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planId) => {
    navigate('/register', { state: { selectedPlan: planId } });
  };

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Choose the plan that fits your team’s rhythm. Both are powered by secure Stripe billing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`h-full flex flex-col rounded-2xl border shadow-sm p-8 transition-transform hover:-translate-y-1 ${
                  plan.highlight
                    ? 'border-primary-400 bg-white shadow-md'
                    : 'border-secondary-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-secondary-900">{plan.name}</h3>
                    <p className="text-secondary-600">{plan.description}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-secondary-900">{plan.price}</span>
                  <span className="text-secondary-500 ml-2">{plan.billing}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-secondary-700">
                      <span className="mt-1 mr-3 inline-flex h-2.5 w-2.5 rounded-full bg-primary-500"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full btn ${plan.highlight ? 'btn-primary' : 'btn-outline'} mt-auto`}
                >
                  Select {plan.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

