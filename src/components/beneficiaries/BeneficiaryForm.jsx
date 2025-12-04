import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';
import SuccessPopup from '../SuccessPopup'; // your Lottie popup

export default function BeneficiaryForm({
  mode = 'create',
  initialData = {},
  onSuccess,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    wallet_id: initialData.wallet_id || '',
    payment_method_id: initialData.payment_method_id || '',
    bank_account_id: initialData.bank_account_id || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPopup, setShowPopup] = useState(false); // controls popup visibility
  const [createdBeneficiary, setCreatedBeneficiary] = useState(null); // store created data

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in');

      const url =
        mode === 'edit'
          ? `http://127.0.0.1:8000/api/beneficiaries/update/${initialData.beneficiary_id}`
          : `http://127.0.0.1:8000/api/beneficiaries/create`;

      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) {
          const firstErrorRaw = Object.values(data.errors).flat()[0];
          const firstError =
            typeof firstErrorRaw === 'string'
              ? firstErrorRaw
              : JSON.stringify(firstErrorRaw);
          setError(firstError);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Something went wrong');
        }
        return;
      }

      // Success → show popup
      setCreatedBeneficiary(data.beneficiary);
      setSuccessMsg(
        mode === 'edit'
          ? 'Beneficiary updated successfully!'
          : 'Beneficiary created successfully!'
      );
      setShowPopup(true); // show animation
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // While showing popup, hide the form completely
  if (showPopup) {
    return (
      <SuccessPopup
        message={successMsg}
        onComplete={() => {
          setShowPopup(false);
          onSuccess && onSuccess(createdBeneficiary); // navigate back
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold text-lg">
              {mode === 'edit' ? 'Edit Beneficiary' : 'Create Beneficiary'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            {mode === 'edit'
              ? 'Update Beneficiary Details'
              : 'Add a New Beneficiary'}
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name / Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (optional)"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Wallet / Payment */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                Wallet ID
              </label>
              <input
                type="number"
                name="wallet_id"
                value={formData.wallet_id}
                onChange={handleChange}
                placeholder="Wallet ID (optional)"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-900 font-medium mb-2">
                Payment Method ID
              </label>
              <input
                type="number"
                name="payment_method_id"
                value={formData.payment_method_id}
                onChange={handleChange}
                placeholder="Payment Method ID (optional)"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Bank Account */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">
              Bank Account ID
            </label>
            <input
              type="number"
              name="bank_account_id"
              value={formData.bank_account_id}
              onChange={handleChange}
              placeholder="Bank Account ID (optional)"
              className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            {loading
              ? 'Submitting...'
              : mode === 'edit'
                ? 'Update Beneficiary'
                : 'Create Beneficiary'}
          </button>
        </form>
      </div>
    </div>
  );
}
