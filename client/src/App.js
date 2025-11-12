import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/Layout';
// import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './home/pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Surveys from './pages/Surveys';
import CreateSurvey from './pages/CreateSurvey';
import SurveyDetails from './pages/SurveyDetails';
import Reviews from './pages/Reviews';
import ReviewCreate from './pages/ReviewCreate';
import Slack from './pages/Slack';
import Analytics from './pages/Analytics';
import Company from './pages/Company';
import Calendar from './pages/Calendar';
import Notifications from './pages/Notifications';
import GamificationDashboard from './pages/GamificationDashboard';
import Rewards from './pages/Rewards';
import CareerProgress from './pages/CareerProgress';
import ReviewSettings from './pages/ReviewSettings';
import CompanyOverview from './home/pages/CompanyOverview';
import AboutPage from './home/pages/AboutPage';
import CareersPage from './home/pages/CareersPage';
import BlogPage from './home/pages/BlogPage';
import PressPage from './home/pages/PressPage';
import ContactPage from './home/pages/ContactPage';
import ResourcesPage from './home/pages/ResourcesPage';
import HelpCenterPage from './home/pages/HelpCenterPage';
import DocumentationPage from './home/pages/DocumentationPage';
import CommunityPage from './home/pages/CommunityPage';
import TemplatesPage from './home/pages/TemplatesPage';
import WebinarsPage from './home/pages/WebinarsPage';
import LegalOverviewPage from './home/pages/LegalOverviewPage';
import PrivacyPolicyPage from './home/pages/PrivacyPolicyPage';
import TermsPage from './home/pages/TermsPage';
import CookiePolicyPage from './home/pages/CookiePolicyPage';
import GDPRPage from './home/pages/GDPRPage';
import SecurityPage from './home/pages/SecurityPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/company" element={<CompanyOverview />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/press" element={<PressPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/help-center" element={<HelpCenterPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/webinars" element={<WebinarsPage />} />
              <Route path="/legal" element={<LegalOverviewPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/gdpr" element={<GDPRPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Development routes - no auth required */}
              <Route path="/app" element={<Layout />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="surveys" element={<Surveys />} />
                <Route path="surveys/create" element={<CreateSurvey />} />
                <Route path="surveys/:id" element={<SurveyDetails />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="reviews/create" element={<ReviewCreate />} />
                <Route path="slack" element={<Slack />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="company" element={<Company />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="gamification" element={<GamificationDashboard />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="career-progress" element={<CareerProgress />} />
                <Route path="review-settings" element={<ReviewSettings />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
