import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Clock, CheckCircle, XCircle, Mail, User, Calendar, ArrowLeft } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const SupportRequestDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/support/requestAdmin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return console.error("Failed to fetch request:", data);
      setRequest(data.support_request);
      setStatus(data.support_request.status);
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (updateStatusLoading) return;
    setUpdateStatusLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/support/request/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) return console.error("Failed to update:", data);

      setUpdateSuccess(true);
      fetchRequest(); // Refresh after update
      setTimeout(() => setUpdateSuccess(false), 2500); // hide animation after 2.5s
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateStatusLoading(false);
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
    <div className="max-w-3xl mx-auto px-4 py-8 relative">
      {/* Back Button */}
      <button
        className="flex items-center gap-2 text-white-600 hover:text-blue-700 mb-6"
        onClick={() => navigate(-1)}
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

        {/* Status Update */}
        <div className="mt-6 flex gap-4 items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          >
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={updateStatus}
            disabled={updateStatusLoading}
            className="w-full sm:w-auto py-2 px-4 font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Update Status
          </button>
        </div>

        {/* Timestamp */}
        <div className="mt-6 text-xs text-gray-500 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {`Received at: ${new Date(request.received_at).toLocaleString()}`}
        </div>
      </div>

      {/* Success Animation */}
      {updateSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md shadow-2xl text-center">
            <div className="w-40 h-40 mx-auto mb-4">
              <DotLottieReact
                src="https://lottie.host/4cbbe026-9c3c-4373-a9f3-5d4a49449ca5/rbCwVQg5WV.lottie"
                loop
                autoplay
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Status Updated!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportRequestDetailAdmin;
