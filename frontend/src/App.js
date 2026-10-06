import React from "react";
import "./App.css";
import "./LandingPage.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import posthog from "posthog-js";
import { AuthProvider } from "./contexts/AuthContext";
import { AINinjaProvider } from "./contexts/AINinjaContext";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

import ErrorBoundary from "./components/ErrorBoundary";
import QueryProvider from "./components/QueryProvider";

import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Pricing from "./components/Pricing";
import Admin from "./components/Admin";
import AdminDashboard from "./components/AdminDashboard";
import AdminPortal from "./components/AdminPortal";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentCanceled from "./components/PaymentCanceled";

// Core Pillars
import AINinja from "./components/AINinja";
import OneProfile from "./components/OneProfile";
import Profile from "./components/Profile";

import DashboardLayout from "./components/DashboardLayout";
import Checkout from "./components/Checkout";
import AdminAnalytics from "./components/AdminAnalytics";
import RefundPolicy from "./components/RefundPolicy";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import VerifyEmail from "./components/VerifyEmail";
import ScrollToTop from "./components/ScrollToTop";
import ContactPage from "./components/ContactPage";
import RecruiterDashboard from "./components/RecruiterDashboard";

// Voice Call / Interview Prep Features
import InterviewPrep from "./components/InterviewPrep";
import InterviewRoom from "./components/InterviewRoom";
import InterviewReport from "./components/InterviewReport";

// Initialize PostHog
if (process.env.REACT_APP_POSTHOG_KEY) {
  posthog.init(process.env.REACT_APP_POSTHOG_KEY, {
    api_host: process.env.REACT_APP_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
  });
}

function App() {
  // Global Event Tracking
  React.useEffect(() => {
    const handleButtonClick = (e) => {
      const target = e.target.closest('button, a.btn, .clickable-element');
      if (target) {
        posthog.capture('button_clicked', {
          text: target.innerText || target.getAttribute('aria-label'),
          id: target.id,
          class: target.className
        });
      }
    };

    const handleFormSubmit = (e) => {
      posthog.capture('form_submitted', {
        form_id: e.target.id,
        action: e.target.action
      });
    };

    const handleFormChange = (e) => {
       // Optional: capture input changes if needed
    };

    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      if (scrollPercent > 90) posthog.capture('scroll_depth', { depth: '90%' });
      else if (scrollPercent > 50) posthog.capture('scroll_depth', { depth: '50%' });
    };

    document.addEventListener('click', handleButtonClick);
    document.addEventListener('submit', handleFormSubmit);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleButtonClick);
      document.removeEventListener('submit', handleFormSubmit);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <ErrorBoundary>
        <QueryProvider>
        <AuthProvider>
          <AINinjaProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Standalone Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/canceled" element={<PaymentCanceled />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Internal App Routes (Wrapped in DashboardLayout) */}
                <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} requireVerification={false}><DashboardLayout /></ProtectedRoute>}>
                  {/* The 'Summary/Leaderboard' view */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pricing" element={<Pricing />} />
                  
                  {/* AI Ninja Ecosystem - Unified Handling */}
                  <Route path="/ai-ninja" element={<AINinja />} />
                  <Route path="/ai-ninja/onboard" element={<AINinja />} />
                  <Route path="/ai-ninja/dashboard" element={<AINinja />} />
                  <Route path="/ai-ninja/leaderboard" element={<AINinja />} />
                  <Route path="/ai-ninja/reports" element={<AINinja />} />
                  
                  {/* Core Content Pillars */}
                  <Route path="/one-profile" element={<OneProfile />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                </Route>

                <Route path="/recruiters" element={<RecruiterDashboard />} />

                {/* Admin/Employee Portal (Standalone) */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute> } />
                <Route path="/job-ninjas-admin-portal" element={<AdminPortal />} />

                {/* Voice Call / Mock Interview Routes */}
                <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
                <Route path="/interview-prep/:sessionId" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
                <Route path="/interview-prep/:sessionId/report" element={<ProtectedRoute><InterviewReport /></ProtectedRoute>} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AINinjaProvider>
        </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
