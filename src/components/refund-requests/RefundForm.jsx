import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Sparkles } from 'lucide-react';
import SuccessPopup from '../SuccessPopup';

export default function RefundForm({ onSubmit, presetTransactionId }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: '',
  });

  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => navigate(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await onSubmit(formData);

      if (result?.success) {
        setSuccessMsg('Refund request successfully submitted!');
        setShowPopup(true);
      } else {
        setError(result?.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  if (showPopup) {
    return (
      <SuccessPopup
        message={successMsg}
        onComplete={() => {
          setShowPopup(false);
          navigate(-1);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute left-6 top-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-10 mt-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold text-lg">
              Refund Request
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Request a Transaction Refund
          </h1>
          <p className="text-slate-500 mt-2">
            Provide the details below and we will review your request.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-gray-900 font-medium mb-2">
              Description *
            </label>
            <div className="relative">
              <FileText
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocused('description')}
                onBlur={() => setFocused(null)}
                placeholder="Explain the reason for the refund"
                required
                rows={4}
                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl resize-none text-gray-900 placeholder-gray-400 transition-all 
                  focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                    focused === 'description' ? 'bg-white' : ''
                  }`}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            {loading ? 'Submitting...' : 'Submit Refund Request'}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-xs text-slate-500 text-center mt-6 pt-6 border-t">
          Refund requests are reviewed within 2–3 business days.
        </p>
      </div>
    </div>
  );
}
