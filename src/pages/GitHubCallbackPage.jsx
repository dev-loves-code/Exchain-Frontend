import { useEffect, useState } from 'react';

const GitHubCallbackPage = () => {
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userStr = params.get('user');
        const errorMsg = params.get('error');

        if (errorMsg) {
          setError(decodeURIComponent(errorMsg));
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
          return;
        }

        if (token && userStr) {
          localStorage.setItem('token', token);
          window.location.href = '/';
        } else if (token) {
          // If backend only sends token (common for JWT)
          localStorage.setItem('token', token);
          window.location.href = '/';
        } else {
          setError('Invalid authentication response');
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        }
      } catch (err) {
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
        {error ? (
          <>
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authenticating with GitHub</h2>
            <p className="text-gray-600">Please wait...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubCallbackPage;