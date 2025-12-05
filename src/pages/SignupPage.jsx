import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { register, loginWithGoogle,loginWithGitHub } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async () => {
    setErrors({});
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      window.location.href = '/';
    } else {
      setErrors(result.errors || { general: result.message });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-center">
          Create Account
        </h2>
        <p className="text-gray-600 text-center mb-6">Join PayOne today</p>

        {/* Agent Registration Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 text-center mb-2">
            Want to become a PayOne Agent?
          </p>
          <a
            href="/signup/agent"
            className="block w-full text-center bg-teal-800 hover:bg-teal-900 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition text-sm"
          >
            Register as Agent →
          </a>
        </div>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 mb-6 hover:bg-gray-50 transition"
        >
          <span className="font-semibold text-gray-700">
            Continue With Google
          </span>
        </button>
        <button
  onClick={loginWithGitHub}
  className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 mb-6 hover:bg-gray-50 transition"
>
  <span className="font-semibold text-gray-700">Continue With GitHub</span>
</button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-gray-500 text-sm">
              Or sign up with
            </span>
          </div>
        </div>

        {errors.general && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          {[
            { name: 'full_name', placeholder: 'Full Name', type: 'text' },
            { name: 'email', placeholder: 'Email', type: 'email' },
            { name: 'phone_number', placeholder: 'Phone Number', type: 'tel' },
            { name: 'password', placeholder: 'Password', type: 'password' },
            {
              name: 'password_confirmation',
              placeholder: 'Confirm Password',
              type: 'password',
            },
          ].map((field) => (
            <div key={field.name}>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors[field.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name][0]}
                </p>
              )}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-teal-800 hover:bg-teal-900 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-bg-teal-900 font-semibold hover:underline"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
