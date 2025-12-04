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

        {/* Logo */}
        <Link
          to="/"
          className="text-gray-900 text-2xl font-black hover:text-teal-800 transition-colors"
        >
          PayOne
        </Link>

        <div className="flex items-center gap-4">

          {/* -------- AUTHENTICATED NAVIGATION -------- */}
          {user && (
            <>
              {/* Normal User (not agent & not admin) */}
              {user.role === "user" && (
                <>
                  <Link
                    to="/send"
                    className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
                  >
                    Send Money
                  </Link>

                  <Link
                    to="/transactions"
                    className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
                  >
                    Transactions
                  </Link>

                  <Link
                    to="/beneficiaries"
                    className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
                  >
                    Beneficiaries
                  </Link>


                  {/* Support Requests */}
                  <Link
                    to="/support-request"
                    className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
                  >
                    Support
                  </Link>

                  <Link
                    to="/support-request-list"
                    className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
                  >
                    My Support Requests
                  </Link>
                </>
              )}

              {/* Agent */}
              {user.role === "agent" && (
                <>
                  <Link
                    to="/agent/verify"
                    className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
                  >
                    Verify Transaction
                  </Link>

                  {/* Admin/Agent can view support details */}
                  <Link
                    to="/support/:id"
                    className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
                  >
                    Support Detail
                  </Link>
                </>
              )}

              {/* Admin Only */}
              {user.role === "admin" && (
                <>
                  <Link
                    to="/admin/refunds"
                    className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
                  >
                    Manage Refunds
                  </Link>

                  <Link
                    to="/support-request-list"
                    className="text-gray-700 hover:text-teal-800 px-4 py-2 rounded-xl hover:bg-teal-50 font-medium transition-all"
                  >
                    Support Admin
                  </Link>
                </>
              )}
            </>
          )}

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
