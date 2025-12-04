import React, { useEffect, useState, useCallback } from "react";
import { Search, Filter, Eye, ArrowRight, Clock, CheckCircle, XCircle, User, Hash, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import SuccessPopup from "../../components/SuccessPopup"; // Add this import

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Modern Minimal RefundCard Component
const RefundCard = ({ refund, onReject, onComplete, onViewDetails, isAdmin }) => {
  const statusStyles = {
    pending: { 
      bg: "bg-amber-500/10", 
      text: "text-amber-700", 
      border: "border-amber-200",
      dot: "bg-amber-500"
    },
    completed: { 
      bg: "bg-emerald-500/10", 
      text: "text-emerald-700", 
      border: "border-emerald-200",
      dot: "bg-emerald-500"
    },
    rejected: { 
      bg: "bg-rose-500/10", 
      text: "text-rose-700", 
      border: "border-rose-200",
      dot: "bg-rose-500"
    },
    cancelled: { 
      bg: "bg-slate-500/10", 
      text: "text-slate-700", 
      border: "border-slate-200",
      dot: "bg-slate-500"
    }
  };

  const status = statusStyles[refund.status] || statusStyles.pending;

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-teal-300 hover:shadow-xl transition-all duration-300">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.text} border ${status.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`}></span>
              <span className="text-xs font-semibold uppercase tracking-wide">
                {refund.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock size={14} />
              <span className="text-xs">
                {new Date(refund.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Hash size={14} />
            <span className="text-sm font-mono">{refund.refund_id}</span>
          </div>
        </div>
        
        <button
          onClick={onViewDetails}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-xl font-medium text-sm hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105"
        >
          <Eye size={16} />
          <span>Details</span>
        </button>
      </div>

      {/* User Info Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            {refund.user_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{refund.user_name}</p>
            <p className="text-xs text-gray-500 truncate">{refund.user_email}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
            <CreditCard size={14} className="text-gray-400" />
            <span className="text-xs font-mono text-gray-600">{refund.transaction_id}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isAdmin && refund.status === "pending" && (
        <div className="flex gap-3">
          <button
            onClick={() => onComplete(refund.refund_id)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={16} />
            <span>Approve</span>
          </button>
          <button
            onClick={() => onReject(refund.refund_id)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle size={16} />
            <span>Decline</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Main AdminRefundsPage Component
const AdminRefundsPage = () => {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orderBy, setOrderBy] = useState("latest");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [processingId, setProcessingId] = useState(null); // Track which refund is being processed

  // Memoize fetchRefunds to prevent unnecessary re-renders
  const fetchRefunds = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (orderBy) params.append("order_by", orderBy);

      const res = await fetch(
        `${API_BASE_URL}/refund/requests-view-all?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setRefunds(data);
        setFilteredRefunds(data);
      } else {
        setMessage(data.message || "Error fetching refunds");
      }
    } catch (err) {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, orderBy]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  useEffect(() => {
    const filtered = refunds.filter((refund) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        refund.user_name?.toLowerCase().includes(searchLower) ||
        refund.user_email?.toLowerCase().includes(searchLower) ||
        refund.refund_id?.toString().includes(searchLower) ||
        refund.transaction_id?.toString().includes(searchLower)
      );
    });
    setFilteredRefunds(filtered);
  }, [searchTerm, refunds]);

  const handleViewDetails = (refundId) => {
    navigate(`/admin/refunds/${refundId}`);
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");
    setProcessingId(id); // Set processing state
    
    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-reject/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejected_reason: "Rejected by admin" }),
      });
      const data = await res.json();
      if (res.ok) {
        // Optimistic update for immediate UI feedback
        setRefunds(
          refunds.map((r) =>
            r.refund_id === id ? { ...r, status: "rejected" } : r
          )
        );
        setSuccessMessage("Refund request declined successfully!");
        setShowSuccessPopup(true);
      } else {
        setMessage(data.message || "Error rejecting refund");
        // Revert optimistic update on error
        fetchRefunds();
      }
    } catch (err) {
      setMessage("Network error");
      fetchRefunds(); // Revert on error
    } finally {
      setProcessingId(null); // Clear processing state
    }
  };

  const handleComplete = async (id) => {
    const token = localStorage.getItem("token");
    setProcessingId(id); // Set processing state
    
    try {
      const res = await fetch(
        `${API_BASE_URL}/refund/request-complete/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        // Optimistic update for immediate UI feedback
        setRefunds(
          refunds.map((r) =>
            r.refund_id === id ? { ...r, status: "completed" } : r
          )
        );
        setSuccessMessage("Refund request approved successfully!");
        setShowSuccessPopup(true);
      } else {
        setMessage(data.message || "Error completing refund");
        // Revert optimistic update on error
        fetchRefunds();
      }
    } catch (err) {
      setMessage("Network error");
      fetchRefunds(); // Revert on error
    } finally {
      setProcessingId(null); // Clear processing state
    }
  };

  const handleSuccessPopupComplete = () => {
    setShowSuccessPopup(false);
    setSuccessMessage("");
  };

  if (loading) return <Loading fullScreen text="Loading refund requests..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* Success Popup */}
      {showSuccessPopup && (
        <SuccessPopup 
          message={successMessage} 
          onComplete={handleSuccessPopupComplete} 
        />
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Refund Requests
          </h1>
          <p className="text-gray-500">Manage and review all refund requests</p>
        </div>

        {/* Controls Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          {/* Search Bar */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, refund ID, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-700 bg-white text-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Sort By
              </label>
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-700 bg-white text-sm"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl px-4 py-3 w-full border border-teal-200">
                <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide mb-1">Results</p>
                <p className="text-2xl font-bold text-teal-700">
                  {filteredRefunds.length}
                  <span className="text-sm font-normal text-teal-600 ml-1">/ {refunds.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Cards */}
        {filteredRefunds.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {searchTerm
                ? "No refund requests match your search"
                : "No refund requests found"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm && "Try adjusting your search criteria"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRefunds.map((r) => (
              <RefundCard
                key={r.refund_id}
                refund={r}
                onReject={handleReject}
                onComplete={handleComplete}
                onViewDetails={() => handleViewDetails(r.refund_id)}
                isAdmin={true}
                // Disable buttons while processing this specific refund
                isProcessing={processingId === r.refund_id}
              />
            ))}
          </div>
        )}

        {/* Error Message */}
        {message && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRefundsPage;