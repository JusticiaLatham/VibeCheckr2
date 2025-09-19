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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Development routes - no auth required */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
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
