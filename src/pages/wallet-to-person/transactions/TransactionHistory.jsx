// TransactionsHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Receipt, RefreshCw, Mail, Calendar } from "lucide-react";
import Loading from "../../../components/Loading"; // adjust the path

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
        setTransactions(
          (data?.data || data || []).map((tx) => ({
            ...tx,
            id: tx.id || tx.transaction_id,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Transaction History
          </h2>
          <p className="text-slate-500">
            Wallet to Person Transfers
          </p>
        </div>

        {loading ? (
          <Loading fullScreen={false} text="Loading transactions..." />
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <p className="text-gray-500">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  
                  {/* LEFT SIDE - Transaction Info */}
                  <div className="flex-1 space-y-3">
                    
                    {/* Reference Code & Status Badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900">
                        {tx.reference_code || `TX-${tx.id}`}
                      </h3>
                      <span
                        className={`
                          inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border
                          ${
                            tx.status === "done"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : tx.status === "pending"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : tx.status === "refunded"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        `}
                      >
                        {tx.status || "unknown"}
                      </span>
                    </div>

                    {/* Receiver & Date Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>{tx.receiver_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{tx.created_at}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE - Amount & Actions */}
                  <div className="flex flex-col items-end gap-4">
                    
                    {/* Amount */}
                    <div className="text-right">
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {tx.transfer_amount} <span className="text-xl text-gray-600">{tx.currency_code}</span>
                      </p>
                    </div>

                    {/* Action Buttons */}
                  <div className="flex gap-3">
                    {/* Receipt Button */}
                    <button
                      onClick={() => navigate(`/transactions/receipt/${tx.id}`)}
                      className="flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 hover:shadow-md transition-all"
                    >
                      <Receipt size={18} />
                      <span>Receipt</span>
                    </button>

                    {/* Refund / View Refund Button */}
                    {tx.refund_request_id ? (
                      <button
                        onClick={() => navigate(`/refund/view/${tx.refund_request_id}`)}
                        className="flex items-center gap-2 px-5 py-3 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 shadow-lg hover:shadow-xl transition-all"
                      >
                        <RefreshCw size={18} />
                        <span>View Refund Request</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/refund/create?transaction_id=${tx.id}`)}
                        className="flex items-center gap-2 px-5 py-3 bg-teal-800 text-white rounded-xl font-semibold hover:bg-teal-900 shadow-lg hover:shadow-xl transition-all"
                      >
                        <RefreshCw size={18} />
                        <span>Refund</span>
                      </button>
                    )}
                  </div>

                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}