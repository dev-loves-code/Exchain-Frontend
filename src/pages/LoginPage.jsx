import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      window.location.href = '/';
    } else {
      setError(result.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
          Welcome back to Exchain
        </h2>
        <p className="text-gray-600 text-center mb-8">Sign in to continue</p>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 mb-6 hover:bg-gray-50 transition"
        >
          <span className="font-semibold text-gray-700">
            Continue With Google
          </span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-gray-500 text-sm">
              Or sign in with
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-800 hover:bg-teal-900 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="text-bg-teal-900 font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
