import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
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


function AppContent() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navbar at the top */}
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/agent" element={<AgentSignupPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:id" element={<AgentProfilePage />} />
          <Route path="/agent/cash-operations/new" element={<AgentCashOperationForm />} />
          <Route path="/agent/cash-operations" element={<AgentCashOperations />} />
          <Route path="/user/cash-operations" element={<UserCashOperations />} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;