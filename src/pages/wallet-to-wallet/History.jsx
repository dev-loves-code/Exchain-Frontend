import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Receipt, Mail, Calendar } from "lucide-react";
import Loading from "../../components/Loading";
import WalletSelector from '../../components/Wallet/WalletSelector';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openSenderSelector, setOpenSenderSelector] = useState(false);
  const [transactionType, setTransactionType] = useState(""); // "" = all, "sent", "received"
  const [selectedWalletId, setSelectedWalletId] = useState(null);
  const [selectedWalletLabel, setSelectedWalletLabel] = useState("All Wallets");

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) return navigate("/login");

    const loadTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let url = "http://127.0.0.1:8000/api/transactions/wallet-to-wallet-history";
        const params = new URLSearchParams();
        if (transactionType) params.append("type", transactionType);
        if (selectedWalletId) params.append("wallet_id", selectedWalletId);
        if ([...params].length) url += `?${params.toString()}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const txs = data?.data?.transactions;

// Ensure we have an array
const transactionsArray = Array.isArray(txs)
  ? txs
  : txs
  ? Object.values(txs) // in case API returned an object
  : [];

setTransactions(
  transactionsArray.map((tx) => ({
    ...tx,
    id: tx.id || tx.transaction_id,
  }))
);


        setSummary({
          total_received_amount: data?.data?.total_received_amount || 0,
          total_transfer_amount: data?.data?.total_transfer_amount || 0,
          total_transfer_fee: data?.data?.total_transfer_fee || 0,
          total_sent_amount: data?.data?.total_sent_amount || 0,
        });
      } catch (e) {
        console.error("Failed to load transactions:", e);
        alert("Could not load transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [authLoading, user, navigate, transactionType, selectedWalletId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
            Transaction History
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Wallet to Wallet Transfers
          </p>
        </div>

        {/* Summary */}
        {selectedWalletId && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-5 bg-green-50 rounded-2xl text-center shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500">Total Received</p>
              <p className="text-2xl font-bold text-green-600">{summary.total_received_amount}</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl text-center shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500">Total Transfer</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total_transfer_amount}</p>
            </div>
            <div className="p-5 bg-red-50 rounded-2xl text-center shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500">Total Fee</p>
              <p className="text-2xl font-bold text-red-600">{summary.total_transfer_fee}</p>
            </div>
            <div className="p-5 bg-red-100 rounded-2xl text-center shadow-sm hover:shadow-md transition">
              <p className="text-sm text-gray-500">Total Sent</p>
              <p className="text-2xl font-bold text-red-700">{summary.total_sent_amount}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="">All Transactions</option>
            <option value="sent">Sent</option>
            <option value="received">Received</option>
          </select>

          <button
            className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
            onClick={() => setOpenSenderSelector(true)}
          >
            {selectedWalletLabel}
          </button>
        </div>

        {/* Wallet Selector Modal */}
        {openSenderSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="w-full max-w-md">
              <WalletSelector
                showAllOption={true}
                onSelect={(wallet) => {
                  setSelectedWalletId(wallet?.wallet_id || null);
                  setSelectedWalletLabel(wallet ? `Wallet #${wallet.wallet_id}` : "All Wallets");
                  setOpenSenderSelector(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Transactions */}
        {loading ? (
          <Loading fullScreen={false} text="Loading transactions..." />
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <p className="text-gray-400 text-lg">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white rounded-3xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  
                  {/* LEFT SIDE */}
                  <div className="flex-1 space-y-3">
                    {/* Reference & Status */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900">{tx.reference_code || `TX-${tx.id}`}</h3>
                      
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-semibold border
                          ${
                            tx.type === "sent"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : tx.type === "received"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                      >
                        {tx.type === "sent" ? "Sent" : tx.type === "received" ? "Received" : "Self-transfer"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border
                          ${
                            tx.status === "done"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : tx.status === "pending"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : tx.status === "refunded"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                      >
                        {tx.status || "unknown"}
                      </span>
                    </div>

                    {/* Receiver & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>{tx.receiver_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{new Date(tx.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {tx.transfer_amount} <span className="text-lg text-gray-500">{tx.currency_code}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate(`/wallet-to-wallet/details/${tx.id}`, {
                          state: { transactionType: tx.type, refund: tx.refund_request_id },
                        });
                      }}
                      className="flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 hover:shadow-md transition"
                    >
                      <Receipt size={18} />
                      <span>Details</span>
                    </button>
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
