import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const location = useLocation();

  // Demo account configuration
  const DEMO_EMAIL = 'demo@vibecheckr.com';
  const DEMO_PASSWORD = 'demo123';
  const MAX_DEMO_USES = 10;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    companySize: '',
    domain: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    billingPostalCode: '',
    plan: 'trial'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, login } = useAuth();
  const navigate = useNavigate();

  // Check if this is a demo account
  const isDemoAccount = formData.email.toLowerCase() === DEMO_EMAIL.toLowerCase() && 
                        formData.password === DEMO_PASSWORD;

  // Get demo usage count from localStorage
  const getDemoUsageCount = () => {
    const count = localStorage.getItem('demo_account_uses');
    return count ? parseInt(count, 10) : 0;
  };

  // Increment demo usage count
  const incrementDemoUsage = () => {
    const currentCount = getDemoUsageCount();
    localStorage.setItem('demo_account_uses', (currentCount + 1).toString());
  };

  useEffect(() => {
    if (location.state?.selectedPlan) {
      setFormData((prev) => ({
        ...prev,
        plan: location.state.selectedPlan
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Check demo account limit
    if (isDemoAccount) {
      const usageCount = getDemoUsageCount();
      if (usageCount >= MAX_DEMO_USES) {
        alert(`Demo account limit reached (${MAX_DEMO_USES} uses). Please use a different email to create a real account.`);
        return;
      }
    }
    
    setLoading(true);
    
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      companyName: formData.companyName,
      industry: formData.industry,
      companySize: formData.companySize,
      domain: formData.domain,
      plan: formData.plan,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      company: formData.companyName
    };

    // Only include payment method if not a demo account
    if (!isDemoAccount) {
      registrationData.paymentMethod = {
        cardNumber: formData.cardNumber,
        cardExpiry: formData.cardExpiry,
        cardCvc: formData.cardCvc,
        billingPostalCode: formData.billingPostalCode
      };
    }
    
    const result = await register(registrationData);
    
    if (result.success) {
      // Increment demo usage if this was a demo account
      if (isDemoAccount) {
        incrementDemoUsage();
        const remaining = MAX_DEMO_USES - getDemoUsageCount();
        alert(`Demo account created! (${remaining} demo uses remaining)`);
      }
      navigate('/app/dashboard');
    } else {
      // If demo account already exists, try to log in instead
      if (isDemoAccount && result.error && result.error.includes('already exists')) {
        const loginResult = await login(formData.email, formData.password);
        if (loginResult.success) {
          alert('Demo account already exists. Logged you in!');
          navigate('/app/dashboard');
          return;
        }
      }
      // Show the actual error message
      if (result.error) {
        console.error('Registration error:', result.error);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <span className="text-2xl font-bold text-primary-600">V</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Create your VibeCheckr account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Start building a more engaged and connected team
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700">
                  First Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="input pl-10"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700">
                  Last Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="input pl-10"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input pl-10"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Company Information */}
            <div className="border-t border-secondary-200 pt-4">
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Company Information</h3>
              
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-secondary-700">
                  Company Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className="input pl-10"
                    placeholder="Acme Inc."
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-secondary-700">
                    Industry
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    required
                    className="input"
                    value={formData.industry}
                    onChange={handleChange}
                  >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-secondary-700">
                    Company Size
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    required
                    className="input"
                    value={formData.companySize}
                    onChange={handleChange}
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="domain" className="block text-sm font-medium text-secondary-700">
                  Company Domain (Optional)
                </label>
                <input
                  id="domain"
                  name="domain"
                  type="text"
                  className="input mt-1"
                  placeholder="company.com"
                  value={formData.domain}
                  onChange={handleChange}
                />
                <p className="mt-1 text-xs text-secondary-500">
                  We'll auto-detect this from your email if not provided
                </p>
              </div>
            </div>

            {/* Billing Information */}
            <div className="border-t border-secondary-200 pt-4">
              <h3 className="text-lg font-medium text-secondary-900 mb-4 flex items-center justify-between">
                Billing Details
                {!isDemoAccount && (
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                    Powered by Stripe
                  </span>
                )}
                {isDemoAccount && (
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wide bg-green-50 px-2 py-1 rounded">
                    Demo Mode
                  </span>
                )}
              </h3>
              {isDemoAccount ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800 font-medium mb-1">
                    🎉 Demo Account Detected
                  </p>
                  <p className="text-xs text-green-700">
                    Credit card not required for demo accounts. ({MAX_DEMO_USES - getDemoUsageCount()} demo uses remaining)
                  </p>
                </div>
              ) : (
                <p className="text-sm text-secondary-600 mb-4">
                  Select your plan and enter card details to activate your subscription. You can switch plans or cancel at any time.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="plan" className="block text-sm font-medium text-secondary-700">
                    Plan
                  </label>
                  <select
                    id="plan"
                    name="plan"
                    className="input mt-1"
                    value={formData.plan}
                    onChange={handleChange}
                    required
                  >
                    <option value="trial">14-Day Free Trial</option>
                    <option value="monthly">Monthly Plan – $650 / month</option>
                    <option value="annual">Annual Plan – $6,000 / year</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <div className="w-full text-sm text-secondary-500 bg-primary-50 border border-primary-100 rounded-lg px-4 py-3">
                    {formData.plan === 'trial' && 'Trial converts to monthly billing after 14 days unless cancelled.'}
                    {formData.plan === 'monthly' && 'Billed monthly at $650. Cancel any time in settings.'}
                    {formData.plan === 'annual' && 'Billed annually at $6,000 with 2 months free vs monthly.'}
                  </div>
                </div>
              </div>

              {!isDemoAccount && (
                <>
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-secondary-700">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      inputMode="numeric"
                      required
                      className="input mt-1"
                      placeholder="4242 4242 4242 4242"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <label htmlFor="cardExpiry" className="block text-sm font-medium text-secondary-700">
                        Expiration
                      </label>
                      <input
                        id="cardExpiry"
                        name="cardExpiry"
                        type="text"
                        inputMode="numeric"
                        required
                        className="input mt-1"
                        placeholder="MM / YY"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="cardCvc" className="block text-sm font-medium text-secondary-700">
                        CVC
                      </label>
                      <input
                        id="cardCvc"
                        name="cardCvc"
                        type="text"
                        inputMode="numeric"
                        required
                        className="input mt-1"
                        placeholder="123"
                        value={formData.cardCvc}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="billingPostalCode" className="block text-sm font-medium text-secondary-700">
                        Billing ZIP / Postal
                      </label>
                      <input
                        id="billingPostalCode"
                        name="billingPostalCode"
                        type="text"
                        required
                        className="input mt-1"
                        placeholder="94103"
                        value={formData.billingPostalCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-secondary-500">
                    Transactions are processed securely via Stripe. We never store your full card details on our servers.
                  </p>
                </>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-secondary-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
