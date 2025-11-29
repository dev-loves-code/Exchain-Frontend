import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Clock, DollarSign, Phone, Mail, Building2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import AgentsMap from '../components/AgentsMap';

export default function AgentProfilePage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        if (data.success) setAgent(data.data);
        else setError(data.message || "Failed to load agent");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Network error");
      })
      .finally(() => setLoading(false));
  }, [id]);

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
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Agents
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {agent.business_name || agent.name}
                </h1>
                <div className="flex items-center gap-2 text-indigo-100">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{agent.city}</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                <span className="text-white font-bold text-2xl">
                  {agent.commission_rate ?? "N/A"}%
                </span>
                <p className="text-indigo-100 text-xs mt-1">Commission</p>
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