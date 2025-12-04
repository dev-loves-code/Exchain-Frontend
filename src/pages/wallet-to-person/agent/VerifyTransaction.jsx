import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import ValidationErrors from '../../../components/ValidationErrors'; // <-- import path

export default function VerifyTransaction() {
  const navigate = useNavigate();

  const [ref, setRef] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const verifyTransaction = async (referenceCode) => {
    if (!referenceCode) return;

    setLoading(true);
    setErrors([]); // reset errors before each request

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setErrors(['You must be logged in to verify a transaction']);
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/transactions/agent/wallet-to-person/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reference_code: referenceCode }),
        }
      );

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok || !data.success) {
        const errorMsg = data.errors || data.message || 'Verification failed';
        throw new Error(
          Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg
        );
      }

      setResult(data.data || data);
    } catch (err) {
      console.error('Transaction verification error:', err);
      setErrors([err.message || 'Could not verify transaction']);
    } finally {
      setLoading(false);
    }
  };

  // Fullscreen loading
  if (loading) {
    return <Loading fullScreen text="Verifying transaction..." />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <ValidationErrors errors={errors} onClose={() => setErrors([])} />

      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Agent - Verify Transaction</h2>

        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Reference code"
          className="w-full px-4 py-3 border rounded-xl mb-4"
        />

        <button
          disabled={loading || !ref}
          onClick={() => verifyTransaction(ref)}
          className="px-4 py-3 bg-teal-800 text-white rounded-xl w-full mb-4"
        >
          Verify
        </button>

        {result && (
          <>
            <div className="mt-4 space-y-3 bg-gray-100 p-4 rounded">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-semibold">{result.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Reference Code:</span>
                <span className="font-semibold">{result.reference_code}</span>
              </div>
              <div className="flex justify-between">
                <span>Receiver Email:</span>
                <span className="font-semibold">{result.receiver_email}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount to Release:</span>
                <span className="font-semibold">
                  {result.amount_to_release} {result.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sender Name:</span>
                <span className="font-semibold">{result.sender_name}</span>
              </div>
              <div className="flex justify-between">
                <span>Transfer Date:</span>
                <span className="font-semibold">{result.transfer_date}</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() =>
                  navigate('/agent/complete', {
                    state: {
                      transaction_id: result.transaction_id,
                      summary: result,
                    },
                  })
                }
                className="px-4 py-3 bg-teal-800 text-white rounded-xl w-full"
              >
                Complete Transaction
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
