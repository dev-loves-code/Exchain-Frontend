import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
            Welcome to PayOne Dashboard
          </h1>

          {user ? (
            <div className="space-y-8">
              {/* User Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-inner">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'User ID', value: user.user_id },
                    { label: 'Full Name', value: user.full_name },
                    { label: 'Email', value: user.email },
                    { label: 'Phone', value: user.phone_number || 'N/A' },
                    { label: 'Role', value: user.role, badge: true },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition"
                    >
                      <p className="text-sm text-gray-500">{item.label}</p>
                      {item.badge ? (
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {item.value}
                        </span>
                      ) : (
                        <p className="font-semibold text-gray-800">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* API Info */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-yellow-700 text-center">
                  ✅ API Connection Working! Data fetched from <code>/auth/me</code>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-6">
                Please log in to view your information
              </p>
              <a
                href="/login"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow hover:shadow-lg transition"
              >
                Go to Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;