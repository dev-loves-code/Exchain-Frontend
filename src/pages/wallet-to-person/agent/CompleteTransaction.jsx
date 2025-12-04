import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../../../components/Loading';
import AgentTransactionReceipt from '../../../components/wallet-to-person/AgentTransactionReceipt';
import SuccessPopup from '../../../components/SuccessPopup'; // <-- import path

export default function CompleteTransaction() {
  const { state } = useLocation();

  const [txId] = useState(state?.transaction_id || '');
  const [summary] = useState(state?.summary || null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const onComplete = async () => {
    if (!txId) return;

    setLoading(true);
    setError('');
    setShowSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to complete a transaction');
        return;
      }

      const res = await fetch(
        'http://127.0.0.1:8000/api/transactions/agent/wallet-to-person/complete',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ transaction_id: txId }),
        }
      );

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok || data.success === false) {
        if (summary) {
          setResult({ ...summary, alreadyProcessed: true });
        } else {
          setError(data.message || 'Complete failed');
        }
        return;
      }

      // Merge backend result with summary
      const mergedResult = { ...summary, ...data.data };
      setResult(mergedResult);

      // Show success popup
      setShowSuccess(true);
    } catch (e) {
      console.error('Complete transaction error:', e);
      if (summary) {
        setResult({ ...summary, alreadyProcessed: true });
      } else {
        setError(e.message || 'Complete failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // stay on the same page
  };

  if (loading) {
    return <Loading fullScreen text="Completing transaction..." />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 relative">
      {/* Show Success Popup on top of receipt */}
      {showSuccess && (
        <SuccessPopup
          message="Transaction completed successfully!"
          onComplete={handleSuccessComplete}
        />
      )}

      {result ? (
        // Always show the receipt if result exists
        <AgentTransactionReceipt tx={result} />
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            Agent - Complete Transaction
          </h2>

          <input
            value={txId}
            readOnly
            className="w-full px-4 py-3 border rounded-xl mb-4 bg-gray-100 cursor-not-allowed"
          />

          <button
            disabled={loading || !txId}
            onClick={onComplete}
            className="px-4 py-3 bg-teal-800 text-white rounded-xl w-full mb-4"
          >
            Complete Transaction
          </button>

          {error && (
            <div className="mt-2 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
