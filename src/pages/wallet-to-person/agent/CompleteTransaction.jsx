import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";

export default function CompleteTransaction() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [txId] = useState(state?.transaction_id || ""); // read-only
  const [summary] = useState(state?.summary || null);   // verified transaction summary
  const [result, setResult] = useState(null);          // completed transaction result
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onComplete = async () => {
    if (!txId) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to complete a transaction");
        return;
      }

      const res = await fetch(
        "http://127.0.0.1:8000/api/transactions/agent/wallet-to-person/complete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ transaction_id: txId }),
        }
      );

      const text = await res.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }

      if (!res.ok || data.success === false) {
        // Use the verified summary if completion fails
        if (summary) {
          setResult({ ...summary, alreadyProcessed: true });
        } else {
          setError(data.message || "Complete failed");
        }
        return;
      }

      // Merge backend result with summary to ensure no empty fields
      setResult({ ...summary, ...data.data });
    } catch (e) {
      console.error("Complete transaction error:", e);
      if (summary) {
        setResult({ ...summary, alreadyProcessed: true });
      } else {
        setError(e.message || "Complete failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Completing transaction..." />;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Agent - Complete Transaction</h2>

        <input
          value={txId}
          readOnly
          className="w-full px-4 py-3 border rounded-xl mb-4 bg-gray-100 cursor-not-allowed"
        />

        {!result && (
          <button
            disabled={loading || !txId}
            onClick={onComplete}
            className="px-4 py-3 bg-teal-800 text-white rounded-xl w-full mb-4"
          >
            Complete Transaction
          </button>
        )}

        {error && (
          <div className="mt-2 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {result && (
          <div className="mt-4 space-y-3 bg-gray-100 p-4 rounded">
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-semibold">{result.transaction_id}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Received:</span>
              <span className="font-semibold">
                {result.amount_received || result.amount_to_release || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Receiver Email:</span>
              <span className="font-semibold">
                {result.receiver_email || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Completed At:</span>
              <span className="font-semibold">
                {result.completed_at || new Date().toISOString()}
              </span>
            </div>

            {result.alreadyProcessed && (
              <div className="mt-2 text-sm text-gray-600">
                This transaction was already completed.
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() =>
                  navigate("/agent/verify", {
                    state: {
                      reference_code: txId,
                      summary: result,
                    },
                  })
                }
                className="px-4 py-3 bg-gray-800 text-white rounded-xl w-full"
              >
                Back to Verify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
