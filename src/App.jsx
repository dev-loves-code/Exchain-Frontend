import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import './index.css';

// Existing Imports
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AgentSignupPage from './pages/AgentSignupPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import GitHubCallbackPage from './pages/GitHubCallbackPage';
import ChatWidget from './components/Chat';
import Footer from './components/Footer';

// Dashboard Components
import {
  AdminDashboard,
  AgentDashboard,
  UserDashboard,
} from './components/DashboardsShared';

// Profile & Agent Pages
import AgentProfilePage from './pages/AgentProfilePage';
import AgentsPage from './pages/AgentsPage';
import UserProfile from './pages/UserProfile';
import UserProfilePage from './pages/UserProfilePage';

// Cash Operations
import AgentCashOperationForm from './pages/AgentCashOperationForm';
import UserCashOperations from './pages/UserCashOperations';
import AgentCashOperations from './pages/AgentCashOperations';

// Support Requests
import SupportPage from './pages/SupportRequests/SupportPage';
import DashboardTest from './pages/SupportRequests/DashboardTest';
import SupportRequestListPage from './pages/SupportRequests/SupportRequestListPage';
import SupportRequestDetailPage from './pages/SupportRequests/SupportRequestDetailPage';
import SupportRequestDetailAdminPage from './pages/SupportRequests/SupportRequestDetailAdminPage';

// Beneficiaries
import BeneficiariesListPage from './pages/beneficiaries/BeneficiariesListPage';
import AddBeneficiaryPage from './pages/beneficiaries/AddBeneficiaryPage';
import EditBeneficiaryPage from './pages/beneficiaries/EditBeneficiaryPage';

import UserWalletsPage from './pages/UserWalletsPage';

// Send Money Flow
import SendMoneyPage from './pages/wallet-to-person/send/SendMoneyPage';
import ConfirmTransaction from './pages/wallet-to-person/send/ConfirmTransaction';
import TransactionSuccess from './pages/wallet-to-person/send/TransactionSuccess';
import WalletToWalletPage from './pages/wallet-to-wallet/WalletToWalletTransaction';

// Transactions
import TransactionsHistory from './pages/wallet-to-person/transactions/TransactionHistory';
import ReceiptPage from './pages/wallet-to-person/transactions/ReceiptPage';
import TransactionTrackingPage from './components/TransactionTrackingPage';
import W2WHistory from './pages/wallet-to-wallet/History';
import W2WDetails from './pages/wallet-to-wallet/TransactionDetails';

// Agent W2P
import VerifyTransaction from './pages/wallet-to-person/agent/VerifyTransaction';
import CompleteTransaction from './pages/wallet-to-person/agent/CompleteTransaction';

// Refund Requests
import CreateRefundPage from './pages/refund-requests/CreateRefundPage';
import ViewRefundPage from './pages/refund-requests/ViewRefundPage';
import AdminRefundsPage from './pages/refund-requests/AdminRefundPage';
import RefundDetailPage from './pages/refund-requests/RefundDetailPage';


// Services & Reviews
import ServiceListPage from './pages/ServiceListPage';
import ServiceFormPage from './pages/ServiceFormPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ReviewListPage from './pages/ReviewListPage';
import ReviewFormPage from './pages/ReviewFormPage';
import ReviewDetailPage from './pages/ReviewDetailPage';

// Payment Management
import PaymentManagementPage from './pages/PaymentManagementPage';

// Admin Currency Rates
import AdminCurrencyRatesPage from './pages/AdminCurrencyRatesPage';


function AppContent() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <Navbar />
      <ChatWidget />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/agent" element={<AgentSignupPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />

          {/* Dashboard Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />

          {/* Cash Operations & Profiles */}
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:id" element={<AgentProfilePage />} />
          <Route path="/agent/cash-operations/new" element={<AgentCashOperationForm />} />
          <Route path="/agent/cash-operations" element={<AgentCashOperations />} />
          <Route path="/user/cash-operations" element={<UserCashOperations />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/profile" element={<UserProfilePage />} />

          {/* Beneficiaries */}
          <Route path="/beneficiaries/add" element={<AddBeneficiaryPage />} />
          <Route path="/beneficiaries/:id/edit" element={<EditBeneficiaryPage />} />
          <Route path="/beneficiaries" element={<BeneficiariesListPage />} />

          {/* Wallets*/}
          <Route path="/wallets" element={<UserWalletsPage />} />
          <Route path="/wallet-to-wallet/history" element={<W2WHistory />} />
          <Route path="/wallet-to-wallet/details/:id" element={<W2WDetails />} />

          {/* Wallet to Person - User */}
          <Route path="/send" element={<SendMoneyPage />} />
          <Route path="/send/confirm" element={<ConfirmTransaction />} />
          <Route path="/send/success" element={<TransactionSuccess />} />

          {/* Wallet to Person - Transactions History */}
          <Route path="/transactions" element={<TransactionsHistory />} />
          <Route path="/transactions/receipt/:id" element={<ReceiptPage />} />
          <Route path="/transactions/tracking" element={<TransactionTrackingPage />} />

          {/* Agent - Wallet to Person */}
          <Route path="/agent/verify" element={<VerifyTransaction />} />
          <Route path="/agent/complete" element={<CompleteTransaction />} />

          {/* Wallet to Wallet - User */}
          <Route path="/wallet-to-wallet" element={<WalletToWalletPage />} />

          {/* Refund Requests */}
          <Route path="/refund/create" element={<CreateRefundPage />} />
          <Route path="/refund/view/:id" element={<ViewRefundPage />} />
          <Route path="/admin/refunds/:refundId" element={<RefundDetailPage />} />
          <Route path="/admin/refunds" element={<AdminRefundsPage />} />

          {/* Payment Management */}
          <Route path="/payments" element={<PaymentManagementPage />} />

          {/* Admin - Currency Rates */}
          <Route
            path="/admin/currency-rates"
            element={<AdminCurrencyRatesPage />}
          />

          {/* Support Requests */}
          <Route path="/dash" element={<DashboardTest />} />
          <Route path="/support-request" element={<SupportPage />} />
          <Route path="/support-request-list" element={<SupportRequestListPage />} />
          <Route path="/support/:id" element={<SupportRequestDetailPage />} />
          <Route path="/admin/support/:id" element={<SupportRequestDetailAdminPage />} />

          {/* Services & Reviews */}
          <Route path="/services" element={<ServiceListPage />} />
          <Route path="/services/add" element={<ServiceFormPage />} />
          <Route path="/services/edit/:id" element={<ServiceFormPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/reviews" element={<ReviewListPage />} />
          <Route path="/reviews/add" element={<ReviewFormPage />} />
          <Route path="/reviews/:id" element={<ReviewDetailPage />} />
          <Route path="/reviews/edit/:id" element={<ReviewFormPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Router>
          <AppContent />
        </Router>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;