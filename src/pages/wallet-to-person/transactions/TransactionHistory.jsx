// TransactionsHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // adjust the path

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

useEffect(() => {
  if (authLoading) return;
  if (!user) return navigate("/login");

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/api/transactions/transactions-history-w2p",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      console.log("Fetched transactions:", data);

      setTransactions(
        (data?.data || data || []).map(tx => ({
          ...tx,
          id: tx.id || tx.transaction_id, // fallback if id missing
        }))
      );
    } catch (e) {
      console.error("Failed to load transactions:", e);
      alert("Could not load transactions");
    } finally {
      setLoading(false);
    }
  };

  loadTransactions();
}, [authLoading, user, navigate]);


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Transactions History (Wallet → Person)
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions found.</p>
        ) : (
          <div className="divide-y">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">
                    {tx.reference_code || `TX-${tx.id}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {tx.receiver_email} • {tx.created_at}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {tx.transfer_amount} {tx.currency_code}
                  </div>
                  <button
                    onClick={() => navigate(`/transactions/receipt/${tx.id}`)}
                    className="mt-2 px-3 py-1 rounded-md border text-sm"
                  >
                    Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
