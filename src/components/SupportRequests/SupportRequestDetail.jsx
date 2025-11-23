import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Clock, CheckCircle, XCircle, Mail, User, Calendar, ArrowLeft } from "lucide-react";

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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) return <p className="text-center py-10 text-gray-600">Request not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to requests
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{request.subject}</h2>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
            request.status
          )}`}
        >
          {getStatusIcon(request.status)}
          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
        </span>

        {/* User Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
          {request.user_full_name && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span>{request.user_full_name}</span>
            </div>
          )}
          {request.user_email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{request.user_email}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {request.description && (
          <div className="mt-6 text-gray-700">
            <h3 className="font-semibold mb-2">Description</h3>
            <p>{request.description}</p>
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-6 text-xs text-gray-500 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {`Sent at: ${new Date(request.sent_at).toLocaleString()}`}
        </div>


      </div>
    </div>
  );
};

export default SupportRequestDetail;
