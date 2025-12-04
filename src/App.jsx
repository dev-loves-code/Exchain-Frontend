import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import "./index.css";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AgentSignupPage from "./pages/AgentSignupPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import AgentProfilePage from "./pages/AgentProfilePage";
import AgentsPage from "./pages/AgentsPage";
import AgentCashOperationForm from "./pages/AgentCashOperationForm";
import UserCashOperations from "./pages/UserCashOperations";
import UserProfile from "./pages/UserProfile";
import AgentCashOperations from "./pages/AgentCashOperations";
import UserProfilePage from "./pages/UserProfilePage";

// Support Requests
import SupportPage from "./pages/SupportRequests/SupportPage";
import DashboardTest from "./pages/SupportRequests/DashboardTest";
import SupportRequestListPage from "./pages/SupportRequests/SupportRequestListPage";
import SupportRequestDetailPage from "./pages/SupportRequests/SupportRequestDetailPage";
import SupportRequestDetailAdminPage from "./pages/SupportRequests/SupportRequestDetailAdminPage";

// Beneficiaries
import BeneficiariesListPage from "./pages/beneficiaries/BeneficiariesListPage";
import AddBeneficiaryPage from "./pages/beneficiaries/AddBeneficiaryPage";
import EditBeneficiaryPage from "./pages/beneficiaries/EditBeneficiaryPage";

// Send Money Flow
import SendMoneyPage from "./pages/wallet-to-person/send/SendMoneyPage";
import ConfirmTransaction from "./pages/wallet-to-person/send/ConfirmTransaction";
import TransactionSuccess from "./pages/wallet-to-person/send/TransactionSuccess";

// Transactions
import TransactionsHistory from "./pages/wallet-to-person/transactions/TransactionHistory";
import ReceiptPage from "./pages/wallet-to-person/transactions/ReceiptPage";

// Agent W2P
import VerifyTransaction from "./pages/wallet-to-person/agent/VerifyTransaction";
import CompleteTransaction from "./pages/wallet-to-person/agent/CompleteTransaction";

// Refund Requests
import CreateRefundPage from "./pages/refund-requests/CreateRefundPage";
import ViewRefundPage from "./pages/refund-requests/ViewRefundPage";
import AdminRefundsPage from "./pages/refund-requests/AdminRefundPage";
import RefundDetailPage from "./pages/refund-requests/RefundDetailPage";

function AppContent() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/agent" element={<AgentSignupPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          
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

          {/* Refund Requests */}
          <Route path="/refund/create" element={<CreateRefundPage />} />
          <Route path="/refund/view/:id" element={<ViewRefundPage />} />
          <Route path="/admin/refunds/:refundId" element={<RefundDetailPage />} />
          <Route path="/admin/refunds" element={<AdminRefundsPage />} />

          {/* Support Requests */}
          <Route path="/dash" element={<DashboardTest />} />
          <Route path="/support-request" element={<SupportPage />} />
          <Route path="/support-request-list" element={<SupportRequestListPage />} />
          <Route path="/support/:id" element={<SupportRequestDetailPage />} />
          <Route path="/admin/support/:id" element={<SupportRequestDetailAdminPage />} />
        </Routes>
      </main>
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