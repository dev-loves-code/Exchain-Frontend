import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon,
  CogIcon
} from '@heroicons/react/24/outline';

// Import components
import AgentsMap from "../components/AgentsMap";
import FilterCard from "../components/AgentsPage/FilterCard";
import AgentCard from "../components/AgentsPage/AgentCard";
import StatsCards from "../components/AgentsPage/StatsCards";
import UpdateCommissionModal from "../components/AgentsPage/UpdateCommissionModal";

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
  
  const isAdmin = user?.role === 'admin';
  
  const [filters, setFilters] = useState({
    city: '',
    name: '',
    status: ''
  });

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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Find Agents
              </h1>
              <p className="text-gray-600">
                Discover agents near you • {agents.length} agent{agents.length !== 1 ? 's' : ''} found
                {isAdmin && (
                  <span className="ml-3 px-3 py-1 bg-gray-800 text-white rounded-full text-sm font-medium">
                    Admin View
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowCommissionModal(true)}
                  className="inline-flex items-center px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow"
                >
                  <CogIcon className="h-5 w-5 mr-2" />
                  Update Commissions
                </button>
              )}
              <button
                onClick={() => fetchAgents()}
                className="inline-flex items-center px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {isAdmin && agents.length > 0 && (
            <StatsCards agents={agents} />
          )}
        </div>

        {/* Update Commissions Modal */}
        <UpdateCommissionModal 
          show={showCommissionModal}
          onClose={() => setShowCommissionModal(false)}
          newCommissionRate={newCommissionRate}
          onRateChange={(e) => setNewCommissionRate(e.target.value)}
          onUpdate={handleUpdateAllCommissions}
          updatingCommission={updatingCommission}
          commissionMessage={commissionMessage}
          agentCount={agents.length}
        />

        {/* Filters Card */}
        <FilterCard 
          filters={filters}
          isAdmin={isAdmin}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* Agent Listing */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Agents List</h2>
                  <p className="text-gray-600 mt-1">
                    Showing {agents.length} agent{agents.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm">
                    <option>Recently Added</option>
                    <option>Name (A-Z)</option>
                    <option>Commission Rate</option>
                    <option>Status</option>
                  </select>
                </div>
              </div>

              {/* Agent Cards Grid */}
              <div className="space-y-4">
                {loading ? (
                  <div className="py-16 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading agents...</p>
                  </div>
                ) : agents.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No agents found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <AgentCard
                      key={agent.agent_id}
                      agent={agent}
                      isAdmin={isAdmin}
                      updatingStatus={updatingStatus}
                      onViewAgent={handleViewAgent}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Map View</h2>
              
              {/* Map Container */}
              <div className="bg-gray-50 rounded-xl border border-gray-300 overflow-hidden h-[500px] mb-6">
                <AgentsMap agents={agents} />
              </div>
              
              {/* Quick Stats */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {agents.length}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Total Agents</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      {[...new Set(agents.map(a => a.city))].length}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Cities Covered</div>
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