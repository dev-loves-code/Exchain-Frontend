import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // <-- add useLocation
import { ArrowLeft, CheckCircle, Clock, XCircle, Printer } from "lucide-react";
import Loading from "../../components/Loading"; // adjust path if needed

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  
 const location = useLocation();
const stateTransactionType = location.state?.transactionType;
const stateRefund = location.state?.refund;

// Use fallback from the fetched transaction
const transactionTypeValue = stateTransactionType || tx?.type;
const refundValue = stateRefund || tx?.refund_request_id;

console.log("Transaction type:", transactionTypeValue);
console.log("Refund request ID:", refundValue);
  useEffect(() => {
    if (!id) {
      navigate(-1);
      return;
    }

    const fetchReceipt = async () => {
      setLoading(true);
      if (!token) {
        alert("You must be logged in to view the receipt");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/transactions/details/${id}`,
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

  const handleApprove = async (transactionId) => {
    console.log("Approving transaction:", transactionId, "Token:", localStorage.getItem("token"));

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://127.0.0.1:8000/api/transactions/approve/${transactionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to approve transaction");

    alert("Transaction approved successfully");
    // Optionally, refresh the list or update state
  } catch (err) {
    console.error(err);
    alert("Error approving transaction");
  }
};

const handleDeny = async (transactionId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://127.0.0.1:8000/api/transactions/reject/${transactionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to reject transaction");

    alert("Transaction denied successfully");
  } catch (err) {
    console.error(err);
    alert("Error denying transaction");
  }
};

  if (loading) {
    return <Loading fullScreen={true} text="Loading transaction..." />;
  }

  if (!tx) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <p className="text-gray-500">No transaction details available.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    done: {
      icon: <CheckCircle size={20} />,
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "COMPLETED",
    },
    pending: {
      icon: <Clock size={20} />,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      label: "PENDING",
    },
    refunded: {
      icon: <XCircle size={20} />,
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "REFUNDED",
    },
    rejected: {
      icon: <XCircle size={20} />,
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "REJECTED",
    },
  };

  const statusKey = tx?.status?.trim().toLowerCase() || "pending";
  const currentStatus = statusConfig[statusKey] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Receipt Document */}
        <div id="receipt" className="bg-white shadow-2xl rounded-2xl">

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Sender Section */}
            <div className="border-2  border-gray-300">
              <div className="bg-gray-200 px-3 py-1 border-b border-gray-300">
                <h3 className="text-xs font-bold uppercase">Sender Information</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Sender Wallet ID</label>
                    <div className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      {tx.sender_wallet?.wallet_id || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Currency</label>
                    <div className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      {tx.sender_wallet?.currency || tx.currency_code || "-"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Receiver Wallet ID</label>
                    <div className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      {tx.receiver_wallet?.wallet_id || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Currency</label>
                    <div className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      {tx.receiver_wallet?.currency || tx.currency_code || "-"}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Transaction Details */}
            <div className="border-2 border-teal-800">
              <div className="bg-teal-800 text-white px-3 py-2">
                <h3 className="text-sm font-bold uppercase">Transaction Details</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Transfer Amount</label>
                    <div className="text-lg font-bold text-gray-900 border-b-2 border-gray-400 pb-1">
                      {tx.transfer?.amount || tx.transfer_amount || 0}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Currency</label>
                    <div className="text-lg font-bold text-gray-900 border-b-2 border-gray-400 pb-1">
                      {tx.transfer?.currency || tx.transfer.currency || ""}
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Fees</label>
                      <div className="text-sm font-semibold text-gray-900">
                        ${tx.transfer?.fee || tx.transfer_fee || 0}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Exchange Rate</label>
                      <div className="text-sm font-semibold text-gray-900">
                        {tx.transfer?.exchange_rate || 1}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Status</label>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${currentStatus.bg} ${currentStatus.text} border ${currentStatus.border} rounded`}>
                        {currentStatus.icon}
                        {currentStatus.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Received */}
            <div className="border-2 border-gray-900">
              <div className="bg-yellow-400 text-gray-900 px-3 py-2 border-b-2 border-gray-900">
                <h3 className="text-sm font-bold uppercase">Amount Received</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Received Amount</label>
                    <div className="text-2xl font-black text-teal-800 border-b-2 border-gray-400 pb-1">
                      {tx.amount_received?.amount || 0}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Currency</label>
                    <div className="text-2xl font-black text-teal-800 border-b-2 border-gray-400 pb-1">
                      {tx.amount_received?.currency || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>            
          </div>          
        </div>

{/* Action Buttons */}
<div className="flex flex-wrap gap-4 mt-6 print:hidden">
  {/* Approve / Deny for received & pending */}
  {transactionTypeValue === "received" && tx?.status === "pending" && (
    <>
      <button
        onClick={() => handleApprove(tx.transaction_id)}
        className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
      >
        <CheckCircle size={18} />
        <span>Approve</span>
      </button>
      <button
        onClick={() => handleDeny(tx.transaction_id)}
        className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
      >
        <XCircle size={18} />
        <span>Deny</span>
      </button>
    </>
  )}

  {/* Refund button for sent */}
  {transactionTypeValue === "sent" && (
    refundValue ? (
      <button
        onClick={() => navigate(`/refund/view/${refundValue}`)}
        className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-teal-800 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-md hover:shadow-lg"
      >
        <span>View Refund</span>
      </button>
    ) : (
      <button
        onClick={() => navigate(`/refund/create?transaction_id=${tx.id}`)}
        className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-gray-800 rounded-xl font-semibold hover:bg-yellow-600 transition-all shadow-md hover:shadow-lg"
      >
        <span>Request Refund</span>
      </button>
    )
  )}

  {/* Optional message for self-transfer */}
  {transactionTypeValue === "self-transfer" && (
    <p className="flex-1 min-w-[150px] text-center text-gray-500 py-3 border border-gray-300 rounded-xl">
      No actions available for self-transfer
    </p>
  )}

  {/* Always show back button */}
  <button
    onClick={() => navigate(-1)}
    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition-all shadow-md hover:shadow-lg"
  >
    <ArrowLeft size={18} />
    <span>Back</span>
  </button>
</div>




      </div>
    </div>
  );
}