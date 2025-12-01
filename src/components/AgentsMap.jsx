import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// Function to create custom icons based on agent status - USING YOUR LEGEND COLORS
const createStatusIcon = (status) => {
  let color, borderColor;
  
  switch (status) {
    case 'rejected':
      color = '#ef4444'; // Red
      borderColor = '#dc2626';
      break;
    case 'accepted':
      color = '#10b981'; // Green (from your legend - bg-green-500)
      borderColor = '#059669';
      break;
    case 'pending':
      color = '#f59e0b'; // Yellow (from your legend - bg-yellow-500)
      borderColor = '#d97706';
      break;
    default:
      color = '#6b7280'; // Grey for unknown
      borderColor = '#4b5563';
      break;
  }

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
        <path fill="${color}" stroke="${borderColor}" stroke-width="2" d="M12 0C7.03 0 3 4.03 3 9c0 7.5 9 18 9 18s9-10.5 9-18c0-4.97-4.03-9-9-9z"/>
        <circle cx="12" cy="9" r="4" fill="#fff"/>
        ${status === 'accepted' ? '<path fill="#fff" d="M9 16.17L7.23 14.41 6 15.64 9 18.67 18 9.64 16.77 8.41z"/>' : ''}
        ${status === 'rejected' ? '<path fill="#fff" d="M7 7l10 10M17 7L7 17" stroke="#fff" stroke-width="2"/>' : ''}
        ${status === 'pending' ? '<circle cx="12" cy="12" r="2" fill="#fff"/>' : ''}
      </svg>
    `),
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
};

// Custom BLUE icon for user location (as per your legend)
const userIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path fill="#3b82f6" stroke="#fff" stroke-width="2" d="M12 0C7.03 0 3 4.03 3 9c0 7.5 9 18 9 18s9-10.5 9-18c0-4.97-4.03-9-9-9z"/>
      <circle cx="12" cy="9" r="4" fill="#fff"/>
    </svg>
  `),
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

// Component to clear route when clicking on map
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

// Routing component with collapsible directions
function RoutingControl({ start, end, showDirections }) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: { styles: [{ color: "#6366f1", opacity: 0.8, weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: showDirections,
      createMarker: () => null,
    }).addTo(map);

    return () => map.removeControl(control);
  }, [map, start, end, showDirections]);

  return null;
}

export default function AgentsMap({ agents }) {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.error(err)
    );
  }, []);

  const handleRoute = (agent) => {
    setSelectedAgent([agent.latitude, agent.longitude]);
    setShowDirections(false);
  };

  const clearRoute = () => {
    setSelectedAgent(null);
    setShowDirections(false);
  };

  const toggleDirections = () => {
    setShowDirections(!showDirections);
  };

  const handleViewProfile = (agentId) => {
    window.location.href = `/agents/${agentId}`;
  };

  // Helper function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={[33.9, 35.5]}
        zoom={8}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <MapClickHandler onMapClick={clearRoute} />

        {currentPosition && (
          <Marker position={currentPosition} icon={userIcon}>
            <Popup>
              <div style={{ textAlign: 'center', fontWeight: '600', color: '#3b82f6' }}>
                📍 You are here
              </div>
            </Popup>
          </Marker>
        )}

        {agents.map((agent) => {
          // Use agent.status from your data (assuming it exists)
          // If agent.status doesn't exist, default to 'pending'
          const status = agent.status || 'pending';
          const agentIcon = createStatusIcon(status);
          
          return (
            <Marker key={agent.agent_id} position={[agent.latitude, agent.longitude]} icon={agentIcon}>
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    marginBottom: '8px',
                    color: '#1f2937'
                  }}>
                    {agent.business_name || agent.name || agent.full_name}
                  </div>
                  
                  {/* Status Badge */}
                  <div style={{ 
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    ...(status === 'accepted' ? { backgroundColor: '#d1fae5', color: '#065f46' } :
                        status === 'pending' ? { backgroundColor: '#fef3c7', color: '#92400e' } :
                        status === 'rejected' ? { backgroundColor: '#fee2e2', color: '#991b1b' } :
                        { backgroundColor: '#f3f4f6', color: '#374151' })
                  }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                    📍 {agent.city}<br />
                    {agent.working_hours_start && agent.working_hours_end && (
                      <>🕐 {agent.working_hours_start} - {agent.working_hours_end}<br /></>
                    )}
                    {agent.commission_rate && (
                      <>💰 Commission: {agent.commission_rate}%<br /></>
                    )}
                    {agent.phone && (
                      <>📱 {agent.phone}</>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <button
                      onClick={() => handleViewProfile(agent.agent_id)}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'transform 0.2s',
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      👤 View Profile
                    </button>
                    <button
                      onClick={() => handleRoute(agent)}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'transform 0.2s',
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      🗺️ Get Directions
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {currentPosition && selectedAgent && (
          <RoutingControl 
            start={currentPosition} 
            end={selectedAgent} 
            showDirections={showDirections}
          />
        )}
      </MapContainer>

      {/* Control buttons - positioned at bottom left to not interfere */}
      {selectedAgent && (
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '20px', 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button
            onClick={toggleDirections}
            style={{
              padding: '12px 20px',
              background: showDirections 
                ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                : 'white',
              color: showDirections ? 'white' : '#6366f1',
              border: showDirections ? 'none' : '2px solid #6366f1',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            {showDirections ? '👁️ Hide' : '📋 Show'} Directions
          </button>
          <button
            onClick={clearRoute}
            style={{
              padding: '12px 20px',
              background: 'white',
              color: '#ef4444',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
              e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
              e.target.style.color = 'white';
              e.target.style.border = 'none';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              e.target.style.background = 'white';
              e.target.style.color = '#ef4444';
              e.target.style.border = '2px solid #ef4444';
            }}
          >
            ✕ Clear Route
          </button>
        </div>
      )}
    </div>
  );
}