import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed
import AgentsMap from "../components/AgentsMap"; // Your map component

export default function AgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Filter states
  const [filters, setFilters] = useState({
    city: '',
    name: '',
    status: ''
  });

  // Fetch agents with filters
  useEffect(() => {
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
  }, [filters, isAdmin]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ city: '', name: '', status: '' });
  };

  const statusColors = {
    accepted: { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
    pending: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    rejected: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fef3ff 0%, #f3e8ff 50%, #ede9fe 100%)',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        marginBottom: '24px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700',
          color: '#581c87',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          🗺️ Find Agents
          {isAdmin && (
            <span style={{
              fontSize: '14px',
              padding: '4px 12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              👑 Admin
            </span>
          )}
        </h1>
        <p style={{ 
          color: '#7c3aed', 
          fontSize: '15px',
          margin: 0
        }}>
          Discover agents near you • {agents.length} agent{agents.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Filters Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#7c3aed',
              fontWeight: '600',
              fontSize: '15px'
            }}>
              🔍 Filters
            </div>
            {(filters.city || filters.name || filters.status) && (
              <button
                onClick={clearFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9333ea',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '4px 8px'
                }}
              >
                Clear all
              </button>
            )}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isAdmin ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {/* Name Filter */}
            <div>
              <input
                type="text"
                placeholder="🏷️ Search by name..."
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e9d5ff',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: '#faf5ff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#a855f7';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9d5ff';
                  e.target.style.background = '#faf5ff';
                }}
              />
            </div>

            {/* City Filter */}
            <div>
              <input
                type="text"
                placeholder="📍 Search by city..."
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e9d5ff',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: '#faf5ff'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#a855f7';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9d5ff';
                  e.target.style.background = '#faf5ff';
                }}
              />
            </div>

            {/* Status Filter (Admin Only) */}
            {isAdmin && (
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e9d5ff',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    background: '#faf5ff',
                    color: filters.status ? '#581c87' : '#9333ea',
                    fontWeight: filters.status ? '500' : '400'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#a855f7';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9d5ff';
                    e.target.style.background = '#faf5ff';
                  }}
                >
                  <option value="">✨ All statuses</option>
                  <option value="accepted">✅ Accepted</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {loading ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px',
              color: '#7c3aed',
              fontSize: '15px',
              fontWeight: '500'
            }}>
              <div style={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                border: '3px solid #e9d5ff',
                borderTop: '3px solid #7c3aed',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '12px'
              }} />
              <div>Loading agents...</div>
              <style>
                {`@keyframes spin { to { transform: rotate(360deg); } }`}
              </style>
            </div>
          ) : agents.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '40px',
              background: 'white',
              borderRadius: '16px',
              border: '2px dashed #e9d5ff'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
              <div style={{ color: '#581c87', fontWeight: '600', marginBottom: '4px' }}>
                No agents found
              </div>
              <div style={{ color: '#9333ea', fontSize: '14px' }}>
                Try adjusting your filters
              </div>
            </div>
          ) : (
            agents.map((agent) => (
              <div
                key={agent.agent_id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 2px 12px rgba(139, 92, 246, 0.06)',
                  border: '1px solid rgba(139, 92, 246, 0.08)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(139, 92, 246, 0.06)';
                }}
                onClick={() => window.location.href = `/agents/${agent.agent_id}`}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {agent.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#9333ea',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      📍 {agent.city}
                    </div>
                  </div>
                  {isAdmin && agent.status && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: statusColors[agent.status]?.bg || '#f3f4f6',
                      color: statusColors[agent.status]?.text || '#374151',
                      whiteSpace: 'nowrap'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: statusColors[agent.status]?.dot || '#9ca3af'
                      }} />
                      {agent.status}
                    </div>
                  )}
                </div>

                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  marginBottom: '12px'
                }}>
                  <div>🕐 {agent.working_hours_start} - {agent.working_hours_end}</div>
                  <div>💰 Commission: {agent.commission_rate ?? "N/A"}%</div>
                </div>

                <div style={{
                  paddingTop: '12px',
                  borderTop: '1px solid #f3f4f6',
                  fontSize: '13px',
                  color: '#7c3aed',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  View details →
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.1)'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#581c87',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🗺️ Map View
          </div>
          <AgentsMap agents={agents} />
        </div>
      </div>
    </div>
  );
}