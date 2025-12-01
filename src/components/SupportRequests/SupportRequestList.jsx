import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Filter, Clock, CheckCircle, XCircle, Mail, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading"; // <- Import your Lottie Loading component

const SupportRequestList = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [orderBy, setOrderBy] = useState("latest");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.append("status", statusFilter);
      if (orderBy) queryParams.append("order_by", orderBy);

      const res = await fetch(
        `http://127.0.0.1:8000/api/support/request?${queryParams.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to fetch requests:", res.status, data);
        return;
      }
      setRequests(data);
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, orderBy]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Support Requests</h1>
          <p className="text-gray-600">Track and manage your support tickets</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 text-sm">
          Showing <span className="font-semibold text-gray-900">{requests.length}</span> request
          {requests.length !== 1 ? "s" : ""}
        </div>

        {/* Loading */}
        {loading && <Loading fullScreen text="Loading support requests..." />}

        {/* Requests List */}
        {!loading && requests.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No support requests found</h3>
            <p className="text-gray-600">Try adjusting your filters or create a new support request.</p>
          </div>
        ) : (
          !loading && (
            <div className="space-y-6">
              {requests.map((r) => (
                <div
                  key={r.support_id}
                  className="bg-white rounded-3xl shadow-2xl p-6 hover:shadow-3xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{r.subject}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                          r.status
                        )}`}
                      >
                        {getStatusIcon(r.status)}
                        {r.status?.charAt(0).toUpperCase() + r.status?.slice(1)}
                      </span>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {r.sent_at
                          ? new Date(r.sent_at).toLocaleDateString()
                          : new Date(r.received_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                    {r.user_full_name && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{r.user_full_name}</span>
                      </div>
                    )}
                    {r.user_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{r.user_email}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {r.description && <p className="text-gray-700 mb-4 line-clamp-2">{r.description}</p>}

                  {/* Footer */}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      {r.sent_at
                        ? `Sent: ${new Date(r.sent_at).toLocaleString()}`
                        : `Received: ${new Date(r.received_at).toLocaleString()}`}
                    </span>
                    <button
                      onClick={() => {
                        if (user?.role === "admin") {
                          navigate(`/admin/support/${r.support_id}`);
                        } else {
                          navigate(`/support/${r.support_id}`);
                        }
                      }}
                      className="px-5 py-2 bg-teal-800 text-white rounded-xl hover:bg-teal-900 transition-all shadow-md hover:shadow-lg"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SupportRequestList;
