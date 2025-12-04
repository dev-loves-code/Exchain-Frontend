import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Hash,
  CreditCard,
  User,
  Mail,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Loading from "../../components/Loading";


const API_BASE_URL = "http://127.0.0.1:8000/api";

const RefundDetailPage = () => {
  const { refundId } = useParams();
  const navigate = useNavigate();

  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRefundDetails = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-view/${refundId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setRefund(data);
      } else {
        setMessage(data.message || "Failed to load refund details.");
      }
    } catch (err) {
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundDetails();
  }, [refundId]);

  const handleBack = () => navigate(-1);

  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    cancelled: "bg-gray-200 text-gray-700 border-gray-300",
  };

  const statusIcons = {
    pending: <Clock size={20} />,
    completed: <CheckCircle size={20} />,
    rejected: <XCircle size={20} />,
    cancelled: <XCircle size={20} />,
  };

  // Avoid “toUpperCase” crash before refund loads
  const safeStatus = refund?.status ? refund.status : "pending";

if (loading) return <Loading fullScreen text="Loading refund request..." />;


  if (!refund) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-600 text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Back */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} /> Back to Admin Refunds
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Refund Request Details</h1>

          <span
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusColors[safeStatus]}`}
          >
            {statusIcons[safeStatus]}
            {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
          </span>
        </div>

        {/* Submitted Date */}
        <p className="text-gray-500 mt-3 flex items-center gap-1">
          <Clock size={16} /> Submitted:
          {new Date(refund.sent_at).toLocaleString()}
        </p>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 space-y-4">

        <p><strong>Refund ID:</strong> {refund.refund_id}</p>
        <p><strong>Transaction ID:</strong> {refund.transaction_id}</p>
        <p><strong>User:</strong> {refund.user_name}</p>
        <p><strong>Email:</strong> {refund.user_email}</p>
        <p><strong>Amount:</strong> {refund.amount} {refund.currency}</p>

        {refund.description && (
          <p>
            <strong>Description:</strong> {refund.description}
          </p>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("successfully")
              ? "bg-green-50 text-green-700 border border-green-300"
              : "bg-red-50 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default RefundDetailPage;
