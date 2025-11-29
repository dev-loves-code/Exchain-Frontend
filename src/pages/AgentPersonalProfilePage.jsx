import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2, MapPin, Clock, Building2, FileText, Phone, Mail } from 'lucide-react';
import AgentsMap from '../components/AgentsMap';

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

// Alert Component
const Alert = ({ type, message }) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  return (
    <div className={`border rounded-xl p-4 mb-4 flex items-start gap-3 ${styles[type]}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
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
const ViewProfile = ({ profile, onEdit }) => (
  <div className="space-y-6">
    {/* Header Card */}
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {profile.business_name || 'No Business Name'}
            </h2>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              profile.status === 'accepted' ? 'bg-green-100 text-green-800' :
              profile.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
            </span>
          </div>
          <button 
            onClick={onEdit} 
            className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition font-semibold shadow-lg"
          >
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business License */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Business License</p>
              <p className="text-gray-900 font-medium">{profile.business_license || 'Not provided'}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Location</p>
              <p className="text-gray-900 font-medium">{profile.city || 'Not provided'}</p>
              <p className="text-sm text-gray-600 mt-1">{profile.address || 'No address'}</p>
              {profile.latitude && profile.longitude && (
                <p className="text-xs text-gray-500 mt-2">
                  📍 {profile.latitude}, {profile.longitude}
                </p>
              )}
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Working Hours</p>
              <p className="text-gray-900 font-medium">
                {profile.working_hours_start && profile.working_hours_end
                  ? `${profile.working_hours_start} - ${profile.working_hours_end}`
                  : 'Not set'}
              </p>
            </div>
          </div>

          {/* Commission Rate */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100">
            <div className="bg-pink-100 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Commission Rate</p>
              <p className="text-gray-900 font-medium text-2xl">{profile.commission_rate}%</p>
            </div>
          </div>

          {/* Phone */}
          {profile.phone_number && (
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Phone className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Phone</p>
                <p className="text-gray-900 font-medium">{profile.phone_number}</p>
              </div>
            </div>
          )}

          {/* Email */}
          {profile.email && (
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100">
              <div className="bg-teal-100 p-3 rounded-xl">
                <Mail className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                <p className="text-gray-900 font-medium break-all">{profile.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Map Section */}
    {profile.latitude && profile.longitude && (
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <MapPin className="w-7 h-7 text-indigo-600" />
          Your Location
        </h2>
        <AgentsMap agents={[profile]} />
      </div>
    )}
  </div>
);

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
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Edit Profile
      </h2>
      {alert && <Alert type={alert.type} message={alert.message} />}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
            <input 
              type="text" 
              name="business_name" 
              value={formData.business_name} 
              onChange={handleChange} 
              maxLength={200} 
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${validationErrors.business_name ? 'border-red-500' : 'border-gray-200'}`} 
              placeholder="Your business name" 
            />
            {validationErrors.business_name && <p className="mt-2 text-sm text-red-600">{validationErrors.business_name[0]}</p>}
          </div>

          {/* Business License */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Business License</label>
            <input 
              type="text" 
              name="business_license" 
              value={formData.business_license} 
              onChange={handleChange} 
              maxLength={100} 
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${validationErrors.business_license ? 'border-red-500' : 'border-gray-200'}`} 
              placeholder="License number" 
            />
            {validationErrors.business_license && <p className="mt-2 text-sm text-red-600">{validationErrors.business_license[0]}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              maxLength={100} 
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${validationErrors.city ? 'border-red-500' : 'border-gray-200'}`} 
              placeholder="City" 
            />
            {validationErrors.city && <p className="mt-2 text-sm text-red-600">{validationErrors.city[0]}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${validationErrors.address ? 'border-red-500' : 'border-gray-200'}`} 
              placeholder="Full address" 
            />
            {validationErrors.address && <p className="mt-2 text-sm text-red-600">{validationErrors.address[0]}</p>}
          </div>

          {/* Working Hours Start */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Working Hours Start</label>
            <input 
              type="time" 
              name="working_hours_start" 
              value={formData.working_hours_start} 
              onChange={handleChange} 
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${validationErrors.working_hours_start ? 'border-red-500' : 'border-gray-200'}`} 
            />
            {validationErrors.working_hours_start && <p className="mt-2 text-sm text-red-600">{validationErrors.working_hours_start[0]}</p>}
          </div>

          {/* Working Hours End */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Working Hours End</label>
            <input 
              type="time" 
              name="working_hours_end" 
              value={formData.working_hours_end} 
              onChange={handleChange} 
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${validationErrors.working_hours_end ? 'border-red-500' : 'border-gray-200'}`} 
            />
            {validationErrors.working_hours_end && <p className="mt-2 text-sm text-red-600">{validationErrors.working_hours_end[0]}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={loading} 
            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-lg flex items-center justify-center gap-3 shadow-lg"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Updating...</> : '💾 Update Profile'}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={loading} 
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function AgentProfileApp() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-semibold text-lg">Loading your profile...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <Alert type="error" message={error} />
        <button 
          onClick={fetchProfile} 
          className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          🔄 Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {isEditing
          ? <EditProfile profile={profile} onCancel={() => setIsEditing(false)} onUpdate={handleUpdate} />
          : <ViewProfile profile={profile} onEdit={() => setIsEditing(true)} />}
      </div>
    </div>
  );
}