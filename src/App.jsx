import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Existing Imports
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AgentSignupPage from './pages/AgentSignupPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import GitHubCallbackPage from './pages/GitHubCallbackPage';
import { AdminAgentsPage } from './pages/AdminAgentsPage';
import ChatWidget from './components/Chat'; 
import SupportPage from './pages/SupportPage';

import {
  AdminDashboard,
  AgentDashboard,
  UserDashboard,
} from './components/DashboardsShared';
import TransactionTrackingPage from './components/TransactionTrackingPage';
import ServiceListPage from './pages/ServiceListPage';
import ServiceFormPage from './pages/ServiceFormPage'; 
import ServiceDetailPage from './pages/ServiceDetailPage'; 
import ReviewListPage from './pages/ReviewListPage';
import ReviewFormPage from './pages/ReviewFormPage';
import ReviewDetailPage from './pages/ReviewDetailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative">
          <Navbar />
          <ChatWidget />

      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/agent" element={<AgentSignupPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/services" element={<ServiceListPage />} />
          <Route path="/services/add" element={<ServiceFormPage />} />
          <Route path="/services/edit/:id" element={<ServiceFormPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/reviews" element={<ReviewListPage />} />
          <Route path="/reviews/add" element={<ReviewFormPage />} />
          <Route path="/reviews/:id" element={<ReviewDetailPage />} />
          <Route path="/reviews/edit/:id" element={<ReviewFormPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/agents" element={<AdminAgentsPage />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/transactions/tracking" element={<TransactionTrackingPage />} />
      </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;