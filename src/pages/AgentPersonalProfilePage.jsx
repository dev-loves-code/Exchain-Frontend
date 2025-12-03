import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Edit, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AgentsMap from '../components/AgentsMap';
import Alert from '../components/AgentProfile/Alert';
import StatusBadge from '../components/AgentProfile/StatusBadge';
import InfoCard from '../components/AgentProfile/InfoCard';
import { Building2, Clock, FileText, Phone, Mail } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

// API utility functions
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const api = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/agent/profile`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return response.json();
  },
  
  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/agent/profile`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return errorData;
    }
    
    return response.json();
  },
};

// Normalize function to convert HH:MM:SS → HH:MM
const normalizeProfile = (profile) => {
  const normalize = (t) => t ? t.substring(0, 5) : '';
  return {
    ...profile,
    working_hours_start: normalize(profile.working_hours_start),
    working_hours_end: normalize(profile.working_hours_end),
  };
};

// View Profile Component
const ViewProfile = ({ profile, onEdit }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <button 
          onClick={onEdit} 
          className="inline-flex items-center px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow"
        >
          <Edit className="w-5 h-5 mr-2" />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {profile.business_name || 'No Business Name'}
              </h1>
              <StatusBadge status={profile.status} />
            </div>
            <p className="text-gray-600">
              Agent ID: {profile.agent_id}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              icon={Building2}
              title="Business License"
              value={profile.business_license}
            />
            
            <InfoCard
              icon={MapPin}
              title="Location"
              value={profile.city}
              subtext={profile.address}
            />
            
            <InfoCard
              icon={Clock}
              title="Working Hours"
              value={
                profile.working_hours_start && profile.working_hours_end
                  ? `${profile.working_hours_start} - ${profile.working_hours_end}`
                  : null
              }
            />
            
            <InfoCard
              icon={FileText}
              title="Commission Rate"
              value={profile.commission_rate ? `${profile.commission_rate}%` : null}
            />
            
            {profile.phone_number && (
              <InfoCard
                icon={Phone}
                title="Phone"
                value={profile.phone_number}
              />
            )}
            
            {profile.email && (
              <InfoCard
                icon={Mail}
                title="Email"
                value={profile.email}
              />
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      {profile.latitude && profile.longitude && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            Your Location
          </h2>
          <div className="bg-gray-50 rounded-xl border border-gray-300 overflow-hidden h-[400px]">
            <AgentsMap agents={[profile]} />
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Profile Component
const EditProfile = ({ profile, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({
    business_name: profile.business_name || '',
    business_license: profile.business_license || '',
    address: profile.address || '',
    city: profile.city || '',
    working_hours_start: profile.working_hours_start || '',
    working_hours_end: profile.working_hours_end || '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAlert(null);
    setValidationErrors({});

    const dataToSend = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null) {
        acc[key] = value;
      } else if ((key === 'working_hours_start' || key === 'working_hours_end') && value === '') {
        acc[key] = null;
      }
      return acc;
    }, {});

    try {
      const result = await api.updateProfile(dataToSend);
      
      if (result.success) {
        setAlert({ type: 'success', message: result.message });
        setTimeout(() => {
          onUpdate(normalizeProfile(result.data));
        }, 1500);
      } else {
        if (result.errors) {
          setValidationErrors(result.errors);
          setAlert({ type: 'error', message: 'Please fix the validation errors below' });
        } else {
          setAlert({ type: 'error', message: result.message || 'Failed to update profile' });
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Edit Profile
        </h2>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
      
      {alert && <Alert type={alert.type} message={alert.message} />}
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input 
              type="text" 
              name="business_name" 
              value={formData.business_name} 
              onChange={handleChange} 
              maxLength={200} 
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 ${validationErrors.business_name ? 'border-red-300' : ''}`} 
              placeholder="Your business name" 
            />
            {validationErrors.business_name && (
              <p className="mt-2 text-sm text-red-600">{validationErrors.business_name[0]}</p>
            )}
          </div>

          {/* Business License */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business License</label>
            <input 
              type="text" 
              name="business_license" 
              value={formData.business_license} 
              onChange={handleChange} 
              maxLength={100} 
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 ${validationErrors.business_license ? 'border-red-300' : ''}`} 
              placeholder="License number" 
            />
            {validationErrors.business_license && (
              <p className="mt-2 text-sm text-red-600">{validationErrors.business_license[0]}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              maxLength={100} 
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 ${validationErrors.city ? 'border-red-300' : ''}`} 
              placeholder="City" 
            />
            {validationErrors.city && (
              <p className="mt-2 text-sm text-red-600">{validationErrors.city[0]}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 ${validationErrors.address ? 'border-red-300' : ''}`} 
              placeholder="Full address" 
            />
            {validationErrors.address && (
              <p className="mt-2 text-sm text-red-600">{validationErrors.address[0]}</p>
            )}
          </div>

          {/* Working Hours Start */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours Start</label>
            <input 
              type="time" 
              name="working_hours_start" 
              value={formData.working_hours_start} 
              onChange={handleChange} 
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 ${validationErrors.working_hours_start ? 'border-red-300' : ''}`} 
            />
            {validationErrors.working_hours_start && (
              <p className="mt-2 text-sm text-red-600">{validationErrors.working_hours_start[0]}</p>
            )}
          </div>

          {/* Working Hours End */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours End</label>
            <input 
              type="time" 
              name="working_hours_end" 
              value={formData.working_hours_end} 
              onChange={handleChange} 
              className={`w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 ${validationErrors.working_hours_end ? 'border-red-300' : ''}`} 
            />
            {validationErrors.working_hours_end && (
              <p className="mt-2 text-sm text-red-600">{validationErrors.working_hours_end[0]}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="w-full px-6 py-4 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Profile'
          )}
        </button>
      </div>
    </div>
  );
};

// Main App Component
export default function AgentPersonalProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getProfile();
      if (result.success) {
        setProfile(normalizeProfile(result.data));
      } else {
        setError(result.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full">
        <Alert type="error" message={error} />
        <button 
          onClick={fetchProfile} 
          className="w-full mt-6 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition-all duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {isEditing
          ? <EditProfile profile={profile} onCancel={() => setIsEditing(false)} onUpdate={handleUpdate} />
          : <ViewProfile profile={profile} onEdit={() => setIsEditing(true)} />}
      </div>
    </div>
  );
}