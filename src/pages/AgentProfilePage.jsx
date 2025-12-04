import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Building2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Shield,
} from 'lucide-react';
import AgentsMap from '../components/AgentsMap';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/AgentProfile/StatusBadge';
import InfoCard from '../components/AgentProfile/InfoCard';

export default function AgentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const fetchAgent = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/agents/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch agent');
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setAgent(data.data);
          setStatusMessage('');
        } else {
          setError(data.message || 'Failed to load agent');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Network error');
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
    setStatusMessage('');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/agents/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAgent((prev) => ({ ...prev, status: newStatus }));
        setStatusMessage(`Agent ${newStatus} successfully!`);
        setTimeout(() => setStatusMessage(''), 3000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error || 'Agent not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Agents
        </button>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl ${statusMessage.includes('successfully') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{statusMessage}</span>
              <button
                onClick={() => setStatusMessage('')}
                className="text-sm opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {agent.business_name || agent.name}
                  </h1>
                  <StatusBadge status={agent.status} />
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{agent.city}</span>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {agent.commission_rate ?? 'N/A'}%
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Commission Rate</p>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Admin View
                  </div>
                )}
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Admin Actions:
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus('accepted')}
                    disabled={updatingStatus || agent.status === 'accepted'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      agent.status === 'accepted'
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                    } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {updatingStatus ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={updatingStatus || agent.status === 'rejected'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      agent.status === 'rejected'
                        ? 'bg-red-100 text-red-700 cursor-not-allowed'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {updatingStatus ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Reject
                  </button>
                </div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <InfoCard
                icon={Building2}
                title="Address"
                value={agent.address}
              />

              <InfoCard
                icon={Clock}
                title="Working Hours"
                value={
                  agent.working_hours_start && agent.working_hours_end
                    ? `${agent.working_hours_start} - ${agent.working_hours_end}`
                    : null
                }
              />

              <InfoCard icon={Phone} title="Phone" value={agent.phone_number} />

              <InfoCard icon={Mail} title="Email" value={agent.email} />
            </div>

            {/* Admin Additional Info */}
            {isAdmin && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Admin Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Registration Date
                    </p>
                    <p className="font-medium text-gray-900">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Agent ID</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {agent.agent_id}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Coordinates */}
            {agent.latitude && agent.longitude && (
              <div className="text-sm text-gray-600">
                <strong>Coordinates:</strong> {agent.latitude},{' '}
                {agent.longitude}
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        {agent.latitude && agent.longitude && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              Location
            </h2>
            <div className="bg-gray-50 rounded-xl border border-gray-300 overflow-hidden h-[400px]">
              <AgentsMap agents={[agent]} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
