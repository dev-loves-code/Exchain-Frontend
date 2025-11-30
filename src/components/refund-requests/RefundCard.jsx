import React from "react";
import { Hash, CreditCard, User, Mail, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";

const RefundCard = ({ refund, onCancel, onReject, onComplete, isAdmin }) => {
  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-300",
    completed: "bg-green-50 text-green-700 border-green-300",
    rejected: "bg-red-50 text-red-700 border-red-300",
    cancelled: "bg-gray-50 text-gray-700 border-gray-300"
  };

  const statusIcons = {
    pending: <Clock size={16} />,
    completed: <CheckCircle size={16} />,
    rejected: <XCircle size={16} />,
    cancelled: <XCircle size={16} />
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 mb-3 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusColors[refund.status] || statusColors.pending}`}>
          {statusIcons[refund.status] || statusIcons.pending}
          {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
        </span>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={14} />
          <p className="text-xs text-slate-500">
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
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Refund ID */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Hash size={16} className="text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-medium mb-0.5">Refund ID</p>
              <p className="text-sm text-slate-900 font-semibold truncate">{refund.refund_id}</p>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard size={16} className="text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-medium mb-0.5">Transaction ID</p>
              <p className="text-sm text-slate-900 font-semibold truncate">{refund.transaction_id}</p>
            </div>
          </div>

          {/* User Name */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <User size={16} className="text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-medium mb-0.5">User</p>
              <p className="text-sm text-slate-900 font-semibold truncate">{refund.user_name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Mail size={16} className="text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500 font-medium mb-0.5">Email</p>
              <p className="text-sm text-slate-900 font-semibold truncate">{refund.user_email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {((isAdmin && refund.status === "pending") || (!isAdmin && refund.status === "pending")) && (
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          {isAdmin ? (
            <>
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-95"
                onClick={() => onComplete(refund.refund_id)}
              >
                <CheckCircle size={18} />
                <span>Complete</span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-red-700 hover:shadow-md active:scale-95"
                onClick={() => onReject(refund.refund_id)}
              >
                <XCircle size={18} />
                <span>Reject</span>
              </button>
            </>
          ) : (
            <button
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:bg-red-700 hover:shadow-md active:scale-95"
              onClick={() => onCancel(refund.refund_id)}
            >
              <Trash2 size={18} />
              <span>Cancel Request</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RefundCard;