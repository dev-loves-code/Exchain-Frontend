import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Phone, 
  Mail, 
  Building2, 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ShieldX,
  RefreshCw
} from 'lucide-react';
import AgentsMap from '../components/AgentsMap';
import { useAuth } from "../context/AuthContext";

export default function AgentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const fetchAgent = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/agents/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch agent");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setAgent(data.data);
          setStatusMessage("");
        } else {
          setError(data.message || "Failed to load agent");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Network error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAgent();
  }, [id]);

  // Handle status update
  const handleUpdateStatus = async (newStatus) => {
    if (!isAdmin) return;
    
    setUpdatingStatus(true);
    setStatusMessage("");
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/agents/${id}/status`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setAgent(prev => ({ ...prev, status: newStatus }));
        setStatusMessage(`Agent ${newStatus} successfully!`);
        // Auto-clear success message after 3 seconds
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        setStatusMessage(`Failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setStatusMessage('Failed to update agent status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <RefreshCw className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error || "Agent not found"}</p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Agents
          </button>
          
          {/* Admin Badge */}
          {isAdmin && (
            <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Admin View
            </div>
          )}
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`mb-6 p-4 rounded-xl ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">{statusMessage}</span>
              <button onClick={() => setStatusMessage("")} className="text-sm opacity-70 hover:opacity-100">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {agent.business_name || agent.name}
                  </h1>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    <span className="capitalize">{agent.status || 'unknown'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-indigo-100">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{agent.city}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                  <span className="text-white font-bold text-2xl">
                    {agent.commission_rate ?? "N/A"}%
                  </span>
                  <p className="text-indigo-100 text-xs mt-1">Commission</p>
                </div>
                
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex flex-col items-end">
                    <p className="text-indigo-100 text-sm mb-2">Admin Actions:</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus('accepted')}
                        disabled={updatingStatus || agent.status === 'accepted'}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          agent.status === 'accepted'
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updatingStatus ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus('rejected')}
                        disabled={updatingStatus || agent.status === 'rejected'}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          agent.status === 'rejected'
                            ? 'bg-red-500 text-white cursor-not-allowed'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updatingStatus ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShieldX className="w-4 h-4" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Address */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="bg-indigo-100 p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                  <p className="text-gray-900 font-medium">{agent.address || "Not provided"}</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Working Hours</p>
                  <p className="text-gray-900 font-medium">
                    {agent.working_hours_start && agent.working_hours_end
                      ? `${agent.working_hours_start} - ${agent.working_hours_end}`
                      : "Not set"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50">
                <div className="bg-pink-100 p-3 rounded-xl">
                  <Phone className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{agent.phone_number || "Not provided"}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50">
                <div className="bg-rose-100 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900 font-medium break-all">{agent.email || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Admin Additional Info */}
            {isAdmin && (
              <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  Admin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Registration Date:</p>
                    <p className="font-medium">{new Date(agent.created_at).toLocaleDateString() || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Agent ID:</p>
                    <p className="font-mono font-medium text-gray-700">{agent.agent_id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Coordinates */}
            {agent.latitude && agent.longitude && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Coordinates:</strong> {agent.latitude}, {agent.longitude}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        {agent.latitude && agent.longitude && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MapPin className="w-7 h-7 text-indigo-600" />
              Location
            </h2>
            <AgentsMap agents={[agent]} />
          </div>
        )}
      </div>
    </div>
  );
}