import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="text-white text-2xl font-bold">PayOne</a>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-white font-medium">{user.full_name}</span>
                <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full">
                  {user.role}
                </span>
                <button
                  onClick={logout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="text-white hover:bg-white/20 px-4 py-2 rounded-lg">
                  Login
                </a>
                <a href="/signup" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium">
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;