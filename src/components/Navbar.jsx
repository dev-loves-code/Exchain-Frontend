import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Home */}
        <Link to="/" className="text-gray-900 text-2xl font-black hover:text-teal-800 transition-colors">
          PayOne
        </Link>

        <div className="flex items-center gap-4">

          {/* Show link only when logged in */}
          {user && (
            <Link
              to="/beneficiaries"
              className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
            >
              Beneficiaries
            </Link>
          )}

          {/* Auth Buttons */}
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