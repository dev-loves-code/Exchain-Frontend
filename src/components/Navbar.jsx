import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

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
                My Profile
              </Link>

              {/* Normal User (not agent & not admin) */}
              {user.role === "user" && (
                <>
                  <Link
                    to="/agents"
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      isActive('/agents') 
                        ? 'bg-teal-800 text-white font-semibold shadow-md' 
                        : 'text-gray-700 hover:text-teal-800 hover:bg-teal-50'
                    }`}
                  >
                    Agents
                  </Link>

                  <Link
                    to="/user/cash-operations"
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      isActive('/user/cash-operations') 
                        ? 'bg-teal-800 text-white font-semibold shadow-md' 
                        : 'text-gray-700 hover:text-teal-800 hover:bg-teal-50'
                    }`}
                  >
                    My Transactions
                  </Link>
                </>
              )}

              {/* Agent */}
              {user.role === "agent" && (
                <Link
                  to="/agent/cash-operations"
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    isActive('/agent/cash-operations') 
                      ? 'bg-teal-800 text-white font-semibold shadow-md' 
                      : 'text-gray-700 hover:text-teal-800 hover:bg-teal-50'
                  }`}
                >
                  My Operations
                </Link>
              )}

              {/* Admin */}
              {user.role === "admin" && (
                <Link
                  to="/agents"
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    isActive('/agents') 
                      ? 'bg-teal-800 text-white font-semibold shadow-md' 
                      : 'text-gray-700 hover:text-teal-800 hover:bg-teal-50'
                  }`}
                >
                  Agents
                </Link>
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
    </nav>
  );
};

export default Navbar;