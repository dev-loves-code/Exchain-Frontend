import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import RefundCard from "../../components/refund-requests/RefundCard";
import Loading from "../../components/Loading";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const ViewRefundPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch refund details
  const fetchRefund = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-view/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRefund({ ...data, refund_id: id });
      else setMessage(data.message || "Error fetching refund");
    } catch (err) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefund();
  }, [id]);

  // Cancel refund
  const handleCancel = async (refundId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-cancel/${refundId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Refund canceled successfully");
        setRefund({ ...refund, status: "cancelled" });
      } else {
        setMessage(data.message || "Error canceling refund");
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  const handleBack = () => navigate(-1);

  if (loading) {
    return <Loading fullScreen={true} text="Loading refund details..." />;
  }

  if (!refund) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <p className="text-red-600 font-semibold text-lg">
            {message || "Refund not found"}
          </p>
          <button
            onClick={handleBack}
            className="mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold text-lg">
              Refund Details
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Refund Request Details
          </h1>
          <p className="text-slate-500 mt-2">
            View and manage your refund request
          </p>
        </div>

        {/* Refund Card */}
        <RefundCard refund={refund} onCancel={handleCancel} isAdmin={false} />
        
        {/* Success/Error Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-xl ${
            message.includes("successfully") 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            <p className="font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRefundPage;