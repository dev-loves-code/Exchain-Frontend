import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AgentTransactionReceipt({ tx }) {
  const navigate = useNavigate();

  if (!tx) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-500">No transaction data available.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Map status to styles
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
    cancelled: {
      icon: <XCircle size={20} />,
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "CANCELLED",
    },
  };

  const statusKey = tx?.status?.trim().toLowerCase() || "pending";
  const currentStatus = statusConfig[statusKey] || statusConfig.pending;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-white transition-all shadow-sm hover:shadow-md print:hidden"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Receipt */}
        <div id="receipt" className="bg-white shadow-2xl p-6">
          {/* Header */}
          <div className="border-b-2 border-gray-300 p-4 text-center">
            <div className="bg-teal-800 text-white px-6 py-2 font-black text-xl mb-2">
              Exchain
            </div>
            <div className="text-xs text-gray-600">+961 76-410-921</div>
          </div>

          {/* Transaction Info */}
          <div className="p-4 space-y-4">
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-semibold">{tx.transaction_id}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-semibold">{tx.amount_received || tx.amount_to_release || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Currency:</span>
              <span className="font-semibold">{tx.currency || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Receiver Email:</span>
              <span className="font-semibold">{tx.receiver_email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold bg-green-50 text-green-700 border border-green-200 rounded">
                <CheckCircle size={20} /> COMPLETED
                </div>

            </div>
            {tx.completed_at && (
              <div className="flex justify-between">
                <span>Completed At:</span>
                <span className="font-semibold">{tx.completed_at}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 bg-gray-50 p-4 text-center mt-4">
            <p className="text-xs text-gray-600 mb-2">Thank you for your transaction</p>
            <p className="text-xs text-gray-500">Generated: {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
          >
            <Printer size={20} />
            Print Receipt
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-teal-800 text-white rounded-xl font-semibold hover:bg-teal-900 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
