import React from "react";
import { Hash, CreditCard, User, Mail, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";

const RefundCard = ({ refund, onCancel, onReject, onComplete, isAdmin }) => {
  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    cancelled: "bg-gray-100 text-gray-700 border-gray-300"
  };

  const statusIcons = {
    pending: <Clock size={16} />,
    completed: <CheckCircle size={16} />,
    rejected: <XCircle size={16} />,
    cancelled: <XCircle size={16} />
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 mb-4 hover:shadow-xl transition-all duration-300">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-6">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${statusColors[refund.status] || statusColors.pending}`}>
          {statusIcons[refund.status] || statusIcons.pending}
          {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
        </span>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <p className="text-sm text-slate-500">
            {new Date(refund.sent_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Refund ID */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 transition-all hover:bg-white hover:shadow-md">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Hash size={18} className="text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">Refund ID</p>
              <p className="text-sm text-gray-900 font-semibold truncate">{refund.refund_id}</p>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 transition-all hover:bg-white hover:shadow-md">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CreditCard size={18} className="text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">Transaction ID</p>
              <p className="text-sm text-gray-900 font-semibold truncate">{refund.transaction_id}</p>
            </div>
          </div>

          {/* User Name */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 transition-all hover:bg-white hover:shadow-md">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <User size={18} className="text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">User</p>
              <p className="text-sm text-gray-900 font-semibold truncate">{refund.user_name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 transition-all hover:bg-white hover:shadow-md">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Mail size={18} className="text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
              <p className="text-sm text-gray-900 font-semibold truncate">{refund.user_email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {((isAdmin && refund.status === "pending") || (!isAdmin && refund.status === "pending")) && (
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          {isAdmin ? (
            <>
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:bg-green-700 shadow-lg hover:shadow-xl active:scale-95"
                onClick={() => onComplete(refund.refund_id)}
              >
                <CheckCircle size={20} />
                <span>Complete</span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-4 rounded-xl font-semibold text-base transition-all duration-200 hover:bg-red-700 shadow-lg hover:shadow-xl active:scale-95"
                onClick={() => onReject(refund.refund_id)}
              >
                <XCircle size={20} />
                <span>Reject</span>
              </button>
            </>
          ) : (
            <button
              className="w-full flex items-center justify-center gap-2 bg-teal-800 text-white px-5 py-5 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-teal-900 shadow-lg hover:shadow-xl active:scale-95"
              onClick={() => onCancel(refund.refund_id)}
            >
              <Trash2 size={20} />
              <span>Cancel Request</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RefundCard;