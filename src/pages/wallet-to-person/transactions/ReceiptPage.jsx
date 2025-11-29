import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ReceiptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate(-1);
      return;
    }

    const fetchReceipt = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view the receipt");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/transactions/receipt/${id}`,
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
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading transaction...</p>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No transaction details available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-extrabold text-teal-800 mb-4">
          Transaction Receipt
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Reference</span>
            <span className="font-semibold">{tx.reference_code || tx.transaction_id}</span>
          </div>
          <div className="flex justify-between">
            <span>Sender Wallet</span>
            <span>{tx.sender?.wallet_id || tx.sender_wallet_id || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Recipient</span>
            <span>{tx.receiver?.name || tx.receiver_email || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Email</span>
            <span>{tx.receiver?.email || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount</span>
            <span>
              {tx.transfer_details?.amount || tx.transfer_amount || 0}{" "}
              {tx.sender?.currency || tx.currency_code || ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Fees</span>
            <span>
              {tx.transfer_details?.fee || tx.transfer_fee || 0}{" "}
              {tx.sender?.currency || tx.currency_code || ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Received</span>
            <span>
              {tx.transfer_details?.received_amount || 0}{" "}
              {tx.receiver?.currency || tx.sender?.currency || ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Exchange Rate</span>
            <span>{tx.transfer_details?.exchange_rate || 1}</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span>{tx.status || "pending"}</span>
          </div>
          {tx.created_at && (
            <div className="flex justify-between">
              <span>Date</span>
              <span>{new Date(tx.created_at).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-3 rounded-xl bg-teal-800 text-white"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
