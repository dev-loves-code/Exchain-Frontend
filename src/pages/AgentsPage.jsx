import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import AgentsMap from "../components/AgentsMap";
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  UserIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ArrowPathIcon,
  XMarkIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon as ClockIconSolid,
  XCircleIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
  NoSymbolIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function AgentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [updatingCommission, setUpdatingCommission] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [newCommissionRate, setNewCommissionRate] = useState("");
  const [commissionMessage, setCommissionMessage] = useState("");
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Filter states
  const [filters, setFilters] = useState({
    city: '',
    name: '',
    status: ''
  });

  // Fetch agents with filters
  const fetchAgents = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.name) params.append('name', filters.name);
    if (filters.status && isAdmin) params.append('status', filters.status);

    fetch(`http://127.0.0.1:8000/api/agents?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch agents');
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setAgents(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAgents();
  }, [filters, isAdmin]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ city: '', name: '', status: '' });
  };

  const handleViewAgent = (agentId, agentName) => {
    navigate(`/agents/${agentId}`, { state: { agentName } });
  };

  // Admin: Update agent status (accept/reject)
  const handleUpdateStatus = async (agentId, status) => {
    if (!isAdmin) return;
    
    setUpdatingStatus(agentId);
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/agents/${agentId}/status`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state
        setAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.agent_id === agentId 
              ? { ...agent, status: status }
              : agent
          )
        );
        alert(`Agent ${status} successfully!`);
      } else {
        alert(`Failed to update status: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update agent status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Admin: Update all commissions
  const handleUpdateAllCommissions = async () => {
    if (!isAdmin) return;
    
    if (!newCommissionRate || isNaN(newCommissionRate) || newCommissionRate < 1 || newCommissionRate > 100) {
      alert("Please enter a valid commission rate between 1% and 100%");
      return;
    }

    setUpdatingCommission(true);
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/agents/commission/update-all', {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commission_rate: parseFloat(newCommissionRate) }),
      });

      const data = await response.json();

      if (data.success) {
        setCommissionMessage(data.message);
        // Refresh agents list to show updated commissions
        fetchAgents();
        setTimeout(() => {
          setShowCommissionModal(false);
          setCommissionMessage("");
          setNewCommissionRate("");
        }, 2000);
      } else {
        alert(`Failed to update commissions: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating commissions:', error);
      alert('Failed to update commissions');
    } finally {
      setUpdatingCommission(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircleIcon className="h-3 w-3 text-green-500" />;
      case 'pending': return <ClockIconSolid className="h-3 w-3 text-yellow-500" />;
      case 'rejected': return <XCircleIcon className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Find Agents
              </h1>
              <p className="text-gray-600">
                Discover agents near you • {agents.length} agent{agents.length !== 1 ? 's' : ''} found
                {isAdmin && (
                  <span className="ml-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-semibold">
                    👑 Admin View
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <>
                  <button
                    onClick={() => setShowCommissionModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <CogIcon className="h-5 w-5 mr-2" />
                    Update All Commissions
                  </button>
                </>
              )}
              <button
                onClick={() => fetchAgents()}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Summary Bar - MOVED TO TOP */}
          {isAdmin && agents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-xs font-medium">Accepted</p>
                    <p className="text-2xl font-bold mt-1">
                      {agents.filter(a => a.status === 'accepted').length}
                    </p>
                  </div>
                  <CheckCircleIcon className="h-8 w-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-xs font-medium">Pending</p>
                    <p className="text-2xl font-bold mt-1">
                      {agents.filter(a => a.status === 'pending').length}
                    </p>
                  </div>
                  <ClockIconSolid className="h-8 w-8 text-yellow-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-xs font-medium">Rejected</p>
                    <p className="text-2xl font-bold mt-1">
                      {agents.filter(a => a.status === 'rejected').length}
                    </p>
                  </div>
                  <XCircleIcon className="h-8 w-8 text-red-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs font-medium">Total Agents</p>
                    <p className="text-2xl font-bold mt-1">{agents.length}</p>
                  </div>
                  <UserIcon className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Update All Commissions Modal */}
        {showCommissionModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Update All Commissions</h3>
                <button
                  onClick={() => setShowCommissionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              {commissionMessage ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Success!</h4>
                  <p className="text-gray-600">{commissionMessage}</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Commission Rate (%)
                    </label>
                    <div className="relative">
                      <CurrencyDollarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        max="100"
                        step="0.1"
                        value={newCommissionRate}
                        onChange={(e) => setNewCommissionRate(e.target.value)}
                        placeholder="Enter commission rate (1-100%)"
                        className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      This will update commission for all {agents.length} agents
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowCommissionModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={updatingCommission}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateAllCommissions}
                      disabled={updatingCommission || !newCommissionRate}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {updatingCommission ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Update All Commissions
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <FunnelIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 ml-3">Filters</h2>
            {(filters.city || filters.name || filters.status) && (
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
          
          <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
            {/* Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                Search by Name
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter agent name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                Search by City
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter city..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            {/* Status Filter (Admin Only) */}
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Filter
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="accepted">Accepted</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Left Listing, Right Map - WIDER LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* Left Column: Agent Listing - 3 out of 5 columns */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Agents List</h2>
                  <p className="text-gray-600 mt-1">
                    Showing {agents.length} agent{agents.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm">
                    <option>Recently Added</option>
                    <option>Name (A-Z)</option>
                    <option>Commission Rate</option>
                    <option>Status</option>
                  </select>
                </div>
              </div>

              {/* Compact Agent Cards Grid */}
              <div className="space-y-4">
                {loading ? (
                  <div className="py-20 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading agents...</p>
                  </div>
                ) : agents.length === 0 ? (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MagnifyingGlassIcon className="h-8 w-8 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No agents found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                    >
                      <XMarkIcon className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <div
                      key={agent.agent_id}
                      className="group bg-white rounded-xl border border-gray-200 hover:border-purple-300 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => handleViewAgent(agent.agent_id, agent.name)}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          {/* Agent Info - Compact */}
                          <div className="flex items-center flex-1 min-w-0">
                            {/* Small Avatar */}
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                {agent.full_name?.charAt(0) || 'A'}
                              </div>
                            </div>
                            
                            {/* Compact Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center min-w-0">
                                  <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 truncate mr-2">
                                    {agent.full_name}
                                  </h3>
                                  {isAdmin && agent.status && (
                                    <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center flex-shrink-0 ${getStatusColor(agent.status)}`}>
                                      {getStatusIcon(agent.status)}
                                      <span className="ml-1 capitalize hidden sm:inline">{agent.status}</span>
                                    </div>
                                  )}
                                </div>
                                <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-purple-500 flex-shrink-0 ml-2" />
                              </div>
                              
                              {/* Compact Details */}
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPinIcon className="h-3 w-3 mr-1" />
                                  <span className="truncate max-w-[120px]">{agent.city}</span>
                                </div>
                                <div className="flex items-center">
                                  <ClockIcon className="h-3 w-3 mr-1" />
                                  <span>{agent.working_hours_start} - {agent.working_hours_end}</span>
                                </div>
                                <div className="flex items-center">
                                  <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                                  <span className="font-semibold text-green-600">{agent.commission_rate ?? "N/A"}%</span>
                                </div>
                                {agent.phone && (
                                  <div className="flex items-center">
                                    <PhoneIcon className="h-3 w-3 mr-1" />
                                    <span>{agent.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Admin Actions */}
                          {isAdmin && (
                            <div className="flex items-center space-x-2 ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                              {agent.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(agent.agent_id, 'accepted')}
                                    disabled={updatingStatus === agent.agent_id}
                                    className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    title="Accept Agent"
                                  >
                                    {updatingStatus === agent.agent_id ? (
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckBadgeIcon className="h-4 w-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(agent.agent_id, 'rejected')}
                                    disabled={updatingStatus === agent.agent_id}
                                    className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    title="Reject Agent"
                                  >
                                    {updatingStatus === agent.agent_id ? (
                                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <NoSymbolIcon className="h-4 w-4" />
                                    )}
                                  </button>
                                </>
                              ) : (
                                <div className="flex flex-col items-end space-y-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.status)}`}>
                                    {getStatusIcon(agent.status)}
                                    <span className="ml-1 capitalize">{agent.status}</span>
                                  </span>
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => handleUpdateStatus(agent.agent_id, 'accepted')}
                                      disabled={updatingStatus === agent.agent_id || agent.status === 'accepted'}
                                      className={`px-2 py-1 text-xs rounded ${agent.status === 'accepted' ? 'bg-green-100 text-green-600' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStatus(agent.agent_id, 'rejected')}
                                      disabled={updatingStatus === agent.agent_id || agent.status === 'rejected'}
                                      className={`px-2 py-1 text-xs rounded ${agent.status === 'rejected' ? 'bg-red-100 text-red-600' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Map - 2 out of 5 columns (40% width - WIDER!) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 sticky top-8 h-full">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <MapPinIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3 flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">Map View</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {agents.length} agent{agents.length !== 1 ? 's' : ''} displayed
                  </p>
                </div>
              </div>
              
              {/* Larger Map Container */}
              <div className="bg-gray-50 rounded-xl border border-gray-300 overflow-hidden h-[600px] mb-6">
                <AgentsMap agents={agents} />
              </div>
              
              {/* Map Legend - Enhanced for wider space */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 text-sm">Map Legend</h3>
                  <span className="text-xs text-gray-500">Click markers for details</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <span className="text-xs font-medium text-gray-700">Accepted</span>
                      <span className="text-xs text-gray-500 block">Active agents</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <div>
                      <span className="text-xs font-medium text-gray-700">Pending</span>
                      <span className="text-xs text-gray-500 block">Awaiting approval</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <span className="text-xs font-medium text-gray-700">Rejected</span>
                      <span className="text-xs text-gray-500 block">Not approved</span>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <span className="text-xs font-medium text-gray-700">You</span>
                      <span className="text-xs text-gray-500 block">Your location</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats - Expanded for wider layout */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {agents.length}
                      </div>
                      <div className="text-xs text-blue-800 font-medium">Total Agents</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {[...new Set(agents.map(a => a.city))].length}
                      </div>
                      <div className="text-xs text-green-800 font-medium">Cities Covered</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-xl">
                      <div className="text-2xl font-bold text-amber-600 mb-1">
                        {agents.filter(a => a.status === 'accepted').length}
                      </div>
                      <div className="text-xs text-amber-800 font-medium">Approved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}