import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";

import Navbar from "./components/Navbar";
import NotificationBell from "./components/NotificationBell";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AgentSignupPage from "./pages/AgentSignupPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";

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

      {/* Optional: secondary header for notifications or page-specific info */}
      <header className="flex justify-end p-5 bg-gray-100">
        {user && <NotificationBell userId={user.user_id} />}
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/agent" element={<AgentSignupPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
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
