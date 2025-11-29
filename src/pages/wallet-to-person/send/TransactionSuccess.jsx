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
            {/* Reference */}
            <div className="flex justify-between">
              <span>Reference</span>
              <span className="font-semibold">
                {tx.reference_code || tx.transaction_id}
              </span>
            </div>

            {/* Sender */}
            <div className="flex justify-between">
              <span>Sender</span>
              <span className="font-semibold">
                {tx.sender?.full_name} ({tx.sender?.wallet_id})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sender Email</span>
              <span className="font-semibold">{tx.sender?.email}</span>
            </div>

            {/* Receiver */}
            <div className="flex justify-between">
              <span>Recipient</span>
              <span className="font-semibold">{tx.receiver?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Recipient Email</span>
              <span className="font-semibold">{tx.receiver?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Pickup Method</span>
              <span className="font-semibold">{tx.receiver?.pickup_method}</span>
            </div>

            {/* Transfer Details */}
            <div className="flex justify-between">
              <span>Transfer Amount</span>
              <span className="font-semibold">
                {tx.transfer_details?.amount} {tx.sender?.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Transfer Fee</span>
              <span className="font-semibold">
                {tx.transfer_details?.fee} {tx.sender?.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Received Amount</span>
              <span className="font-semibold">
                {tx.transfer_details?.received_amount} {tx.sender?.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Exchange Rate</span>
              <span className="font-semibold">{tx.transfer_details?.exchange_rate}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Type</span>
              <span className="font-semibold">{tx.transfer_details?.service_type}</span>
            </div>
            <div className="flex justify-between">
              <span>Transfer Speed</span>
              <span className="font-semibold">{tx.transfer_details?.transfer_speed}</span>
            </div>

            {/* Status */}
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-semibold">{tx.status}</span>
            </div>

            {/* Created Date */}
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
            onClick={() => navigate("/transactions")}
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
