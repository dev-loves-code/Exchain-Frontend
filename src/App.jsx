import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import './index.css';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AgentSignupPage from './pages/AgentSignupPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import BeneficiariesListPage from "./pages/beneficiaries/BeneficiariesListPage";
import AddBeneficiaryPage from "./pages/beneficiaries/AddBeneficiaryPage";
import BeneficiaryDetailsPage from "./pages/beneficiaries/BeneficiaryDetailsPage";
import EditBeneficiaryPage from "./pages/beneficiaries/EditBeneficiaryPage";
import SendMoneyPageSuccess from './pages/beneficiaries/SendMonyPage';

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/agent" element={<AgentSignupPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

            
            {/*Bahij - Beneficiaries */}
            <Route path="/beneficiaries/add" element={<AddBeneficiaryPage />} />
            <Route path="/beneficiaries/:id/edit" element={<EditBeneficiaryPage />} />
            {/* <Route path="/beneficiaries/:id" element={<BeneficiaryDetailsPage />} /> // Can be remover */}
            <Route path="/beneficiaries" element={<BeneficiariesListPage />} /> 
            <Route path="/send/success" element={<SendMoneyPageSuccess />} />




          </Routes>
        </div>
      </Router>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
