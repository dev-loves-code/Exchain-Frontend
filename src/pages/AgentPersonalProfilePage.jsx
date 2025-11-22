import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2, MapPin, Clock, Building2, FileText } from 'lucide-react';

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
    <div className={`border rounded-lg p-4 mb-4 flex items-start gap-3 ${styles[type]}`}>
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
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{profile.business_name || 'No Business Name'}</h2>
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
          profile.status === 'accepted' ? 'bg-green-100 text-green-800' :
          profile.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
        </span>
      </div>
      <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Edit Profile
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-500">Business License</p>
            <p className="text-gray-900">{profile.business_license || 'Not provided'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-gray-900">{profile.city || 'Not provided'}</p>
            <p className="text-sm text-gray-600">{profile.address || 'No address'}</p>
            {profile.latitude && profile.longitude && (
              <p className="text-xs text-gray-500 mt-1">
                Coordinates: {profile.latitude}, {profile.longitude}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-500">Working Hours</p>
            <p className="text-gray-900">
              {profile.working_hours_start && profile.working_hours_end
                ? `${profile.working_hours_start} - ${profile.working_hours_end}`
                : 'Not set'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-500">Commission Rate</p>
            <p className="text-gray-900">{profile.commission_rate}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Edit Profile Component
const EditProfile = ({ profile, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({
    business_name: profile.business_name || '',
    business_license: profile.business_license || '',
    latitude: profile.latitude || '',
    longitude: profile.longitude || '',
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
      {alert && <Alert type={alert.type} message={alert.message} />}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input type="text" name="business_name" value={formData.business_name} onChange={handleChange} maxLength={200} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.business_name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Your business name" />
            {validationErrors.business_name && <p className="mt-1 text-sm text-red-600">{validationErrors.business_name[0]}</p>}
          </div>

          {/* Business License */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business License</label>
            <input type="text" name="business_license" value={formData.business_license} onChange={handleChange} maxLength={100} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.business_license ? 'border-red-500' : 'border-gray-300'}`} placeholder="License number" />
            {validationErrors.business_license && <p className="mt-1 text-sm text-red-600">{validationErrors.business_license[0]}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} maxLength={100} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.city ? 'border-red-500' : 'border-gray-300'}`} placeholder="City" />
            {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city[0]}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.address ? 'border-red-500' : 'border-gray-300'}`} placeholder="Full address" />
            {validationErrors.address && <p className="mt-1 text-sm text-red-600">{validationErrors.address[0]}</p>}
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
            <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} step="any" min="-90" max="90" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.latitude ? 'border-red-500' : 'border-gray-300'}`} placeholder="-90 to 90" />
            {validationErrors.latitude && <p className="mt-1 text-sm text-red-600">{validationErrors.latitude[0]}</p>}
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
            <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} step="any" min="-180" max="180" className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.longitude ? 'border-red-500' : 'border-gray-300'}`} placeholder="-180 to 180" />
            {validationErrors.longitude && <p className="mt-1 text-sm text-red-600">{validationErrors.longitude[0]}</p>}
          </div>

          {/* Working Hours Start */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours Start</label>
            <input type="time" name="working_hours_start" value={formData.working_hours_start} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.working_hours_start ? 'border-red-500' : 'border-gray-300'}`} />
            {validationErrors.working_hours_start && <p className="mt-1 text-sm text-red-600">{validationErrors.working_hours_start[0]}</p>}
          </div>

          {/* Working Hours End */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours End</label>
            <input type="time" name="working_hours_end" value={formData.working_hours_end} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.working_hours_end ? 'border-red-500' : 'border-gray-300'}`} />
            {validationErrors.working_hours_end && <p className="mt-1 text-sm text-red-600">{validationErrors.working_hours_end[0]}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={handleSubmit} disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Updating...</> : 'Update Profile'}
          </button>
          <button type="button" onClick={onCancel} disabled={loading} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
        <Alert type="error" message={error} />
        <button onClick={fetchProfile} className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {isEditing
          ? <EditProfile profile={profile} onCancel={() => setIsEditing(false)} onUpdate={handleUpdate} />
          : <ViewProfile profile={profile} onEdit={() => setIsEditing(true)} />}
      </div>
    </div>
  );
}
