import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  
  const userDropdownRef = useRef(null);
  const agentDropdownRef = useRef(null);
  const adminDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (agentDropdownRef.current && !agentDropdownRef.current.contains(event.target)) {
        setShowAgentDropdown(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setShowAdminDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // User dropdown items
  const userLinks = [
    { to: "/agents", label: "Agents" },
    { to: "/user/cash-operations", label: "Cash Operations" },
    { to: "/send", label: "Wallet to Person" },
    { to: "/transactions", label: "W2P Transactions" },
    { to: "/beneficiaries", label: "Beneficiaries" },
    { to: "/support-request", label: "Support" },
    { to: "/support-request-list", label: "Support Requests" },
  ];

  // Agent dropdown items
  const agentLinks = [
    { to: "/agent/cash-operations", label: "My Operations" },
    { to: "/agent/verify", label: "Verify Transaction" },
  ];

  // Admin dropdown items
  const adminLinks = [
    { to: "/agents", label: "Agents" },
    { to: "/admin/refunds", label: "Manage Refunds" },
    { to: "/support-request-list", label: "Support Admin" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-gray-900 text-2xl font-black hover:text-teal-800 transition-colors"
          >
            Exchain
          </Link>

          <div className="flex items-center gap-4">
            {/* -------- AUTHENTICATED NAVIGATION -------- */}
            {user && (
              <>
                {/* Home link for all roles */}
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    isActive('/') 
                      ? 'bg-teal-800 text-white font-semibold shadow-md' 
                      : 'text-gray-700 hover:text-teal-800 hover:bg-teal-50'
                  }`}
                >
                  Home
                </Link>

                {/* Universal Profile Page for all users */}
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    isActive('/profile') 
                      ? 'bg-teal-800 text-white font-semibold shadow-md' 
                      : 'text-gray-700 hover:text-teal-800 hover:bg-teal-50'
                  }`}
                >
                  Profile
                </Link>

                {/* User Dropdown */}
                {user.role === "user" && (
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all ${
                        userLinks.some(link => isActive(link.to))
                          ? 'bg-teal-800 text-white font-semibold shadow-md' 
                          : 'text-gray-700 hover:text-teal-800 hover:bg-teal-50'
                      }`}
                    >
                      Services
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showUserDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
                        {userLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              isActive(link.to) ? 'bg-teal-50 text-teal-800 font-medium' : 'text-gray-700'
                            }`}
                            onClick={() => setShowUserDropdown(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Agent Dropdown */}
                {user.role === "agent" && (
                  <div className="relative" ref={agentDropdownRef}>
                    <button
                      onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all ${
                        agentLinks.some(link => isActive(link.to))
                          ? 'bg-teal-800 text-white font-semibold shadow-md' 
                          : 'text-gray-700 hover:text-teal-800 hover:bg-teal-50'
                      }`}
                    >
                      Agent Tools
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${showAgentDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showAgentDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
                        {agentLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              isActive(link.to) ? 'bg-teal-50 text-teal-800 font-medium' : 'text-gray-700'
                            }`}
                            onClick={() => setShowAgentDropdown(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Dropdown */}
                {user.role === "admin" && (
                  <div className="relative" ref={adminDropdownRef}>
                    <button
                      onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-all ${
                        adminLinks.some(link => isActive(link.to))
                          ? 'bg-teal-800 text-white font-semibold shadow-md' 
                          : 'text-gray-700 hover:text-teal-800 hover:bg-teal-50'
                      }`}
                    >
                      Admin Panel
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${showAdminDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showAdminDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
                        {adminLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              isActive(link.to) ? 'bg-teal-50 text-teal-800 font-medium' : 'text-gray-700'
                            }`}
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Notification Bell */}
            {user && <NotificationBell userId={user.user_id} />}

            {/* -------- AUTH BUTTONS -------- */}
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-teal-800 hover:bg-teal-900 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;