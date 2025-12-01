import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Clock, CheckCircle, XCircle, Mail, User, Calendar, ArrowLeft, Sparkles } from "lucide-react";

const SupportRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/support/request/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to fetch request:", res.status, data);
        return;
      }
      setRequest(data.support_request);
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-600 text-lg">Request not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-teal-600" />
          <h1 className="text-2xl font-bold text-gray-900">Support Request Details</h1>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-3 bg-teal-800 text-white rounded-xl hover:bg-teal-900 transition-all shadow-lg mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to requests
        </button>

        {/* Request Card */}
        <div className="bg-gray-50 rounded-3xl shadow-inner p-8 border border-gray-200 space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{request.subject}</h2>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                request.status
              )}`}
            >
              {getStatusIcon(request.status)}
              {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
            </span>
          </div>

          {/* User Info */}
          <div className="flex flex-wrap gap-6 text-gray-700 text-sm">
            {request.user_full_name && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span>{request.user_full_name}</span>
              </div>
            )}
            {request.user_email && (
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{request.user_email}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {request.description && (
            <div className="text-gray-700">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p>{request.description}</p>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-5 h-5" />
            <span>{`Sent at: ${new Date(request.sent_at).toLocaleString()}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportRequestDetail;
