import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TransactionSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);

  const txId = state?.txId;

  useEffect(() => {
    if (!txId) {
      navigate("/send");
      return;
    }

    const fetchReceipt = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view the receipt");
        navigate("/send");
        return;
      }

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/transactions/receipt/${txId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch receipt");
        }

        setTx(data.data || {});
      } catch (err) {
        console.error("Failed to fetch transaction receipt:", err);
        alert(err.message || "Could not load transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [txId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading transaction...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-extrabold text-teal-800 mb-2">
          Transfer Initiated
        </h2>
        <p className="text-gray-600 mb-6">
          Your transfer was created successfully.
        </p>

        {tx ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Reference</span>
              <span className="font-semibold">
                {tx.reference_code || tx.transaction_id}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Amount</span>
              <span className="font-semibold">
                {tx.transfer_details?.amount} {tx.sender?.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-semibold">{tx.status || "pending"}</span>
            </div>
            {tx.created_at && (
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-semibold">
                  {new Date(tx.created_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No transaction details available.</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/transactions/history")}
            className="px-4 py-3 rounded-xl border"
          >
            View History
          </button>
          <button
            onClick={() => navigate("/send")}
            className="px-4 py-3 rounded-xl bg-teal-800 text-white"
          >
            Make Another
          </button>
        </div>
      </div>
    </div>
  );
}
