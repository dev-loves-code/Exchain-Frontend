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
import SendMoneyPageSuccess from './pages/beneficiaries/SendMoneyPage';


// Send Money Flow
import SendMoneyPage from './pages/wallet-to-person/send/SendMoneyPage';
import ConfirmTransaction from './pages/wallet-to-person/send/ConfirmTransaction';
import TransactionSuccess from './pages/wallet-to-person/send/TransactionSuccess';

// Transactions
import TransactionsHistory from './pages/wallet-to-person/transactions/TransactionHistory';
import ReceiptPage from './pages/wallet-to-person/transactions/ReceiptPage';

// Agent W2P
import VerifyTransaction from './pages/wallet-to-person/agent/VerifyTransaction';
import CompleteTransaction from './pages/wallet-to-person/agent/CompleteTransaction';


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
            {/* <Route path="/send/success" element={<SendMoneyPageSuccess />} /> */}

                          {/* Wallet to Person - User */}
              <Route path="/send" element={<SendMoneyPage />} />
              <Route path="/send/confirm" element={<ConfirmTransaction />} />
              <Route path="/send/success" element={<TransactionSuccess />} />

              {/* Wallet to Person - Transactions History */}
              <Route path="/transactions" element={<TransactionsHistory />} />
              <Route path="/transactions/receipt/:id" element={<ReceiptPage />} />

              {/* Agent - Wallet to Person */}
              <Route path="/agent/verify" element={<VerifyTransaction />} />
              <Route path="/agent/complete" element={<CompleteTransaction />} />




          </Routes>
        </div>
      </Router>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
