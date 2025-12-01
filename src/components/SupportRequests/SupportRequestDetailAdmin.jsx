import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Clock, CheckCircle, XCircle, Mail, User, Calendar, ArrowLeft, Sparkles } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Loading from "../../components/Loading";

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
      const res = await fetch(`http://127.0.0.1:8000/api/support/request-admin/${id}`, {
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
      setTimeout(() => setUpdateSuccess(false), 3000); // hide animation after 3s
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
    // <- Use your custom Lottie loading here
    return <Loading fullScreen text="Loading request details..." />;
  }

  if (!request)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-600 text-lg">Request not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-teal-600" />
          <h1 className="text-2xl font-bold text-gray-900">Support Request Detail</h1>
        </div>

        {/* Back Button */}
        <button
          className="flex items-center gap-2 px-5 py-3 bg-teal-800 text-white rounded-xl hover:bg-teal-900 transition-all shadow-lg"
          onClick={() => navigate(-1)}
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

          {/* Status Update */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
            >
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={updateStatus}
              disabled={updateStatusLoading}
              className="w-full sm:w-auto py-2 px-4 font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Update Status
            </button>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-5 h-5" />
            <span>{`Received at: ${new Date(request.received_at).toLocaleString()}`}</span>
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
    </div>
  );
};

export default SupportRequestDetailAdmin;
