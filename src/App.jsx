import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AgentSignupPage from './pages/AgentSignupPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import SupportPage from './pages/SupportRequests/SupportPage';
import DashboardTest from './pages/SupportRequests/DashboardTest';
import SupportRequestListPage from './pages/SupportRequests/SupportRequestListPage';
import SupportRequestDetailPage from './pages/SupportRequests/SupportRequestDetailPage';
import SupportRequestDetailAdminPage from "./pages/SupportRequests/SupportRequestDetailAdminPage";



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/agent" element={<AgentSignupPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />


            {/* Bahij - Support Request */}
            <Route path="/dash" element={<DashboardTest />} /> {/*To see the card*/}
            <Route path="/support-request" element={<SupportPage />} /> {/*To to support form*/}
            <Route path="/support-request-list" element={<SupportRequestListPage />} /> 
            <Route path="/support/:id" element={<SupportRequestDetailPage />} />
            <Route path="/admin/support/:id" element={<SupportRequestDetailAdminPage />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
