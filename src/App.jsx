import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AgentSignupPage from './pages/AgentSignupPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import CreateRefundPage from './pages/refund-requests/CreateRefundPage';
import ViewRefundPage from './pages/refund-requests/ViewRefundPage';
import AdminRefundsPage from './pages/refund-requests/AdminRefundPage';

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

            {/*Bahij - Refund Request Routes */}
            <Route path="/refund/create" element={<CreateRefundPage />} />
            <Route path="/refund/view/:id" element={<ViewRefundPage />} />
            <Route path="/admin/refunds" element={<AdminRefundsPage />} />
          </Routes>
        </div>
       
      </Router>
    </AuthProvider>
  );
}

export default App;
