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
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Home */}
        <Link to="/" className="text-white text-2xl font-bold">
          PayOne
        </Link>

        <div className="flex items-center gap-4">

          {/* Show link only when logged in */}
          {user && (
            <Link
              to="/beneficiaries"
              className="text-white px-4 py-2 rounded-lg hover:bg-white/20"
            >
              Beneficiaries
            </Link>
          )}

          {/* Auth Buttons */}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:shadow"
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
