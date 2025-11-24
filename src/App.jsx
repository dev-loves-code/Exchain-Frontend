import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
import BeneficiariesBox from "./components/beneficiaries/BeneficiaryBox";


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

            
            {/*Bahij - Beneficiaries */}
            <Route path="/beneficiaries/add" element={<AddBeneficiaryPage />} />
            <Route path="/beneficiaries/:id/edit" element={<EditBeneficiaryPage />} />
            <Route path="/beneficiaries/:id" element={<BeneficiaryDetailsPage />} />
            <Route path="/beneficiaries" element={<BeneficiariesListPage />} />
            <Route
  path="/beneficiary-box"
  element={
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Beneficiaries</h1>
      <BeneficiariesBox onRowClick={(b) => console.log("Clicked:", b)} />
    </div>
  }
/>


          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
