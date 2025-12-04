import React, { useState, useEffect } from 'react';
import {
  Loader2,
  Edit,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/AgentProfile/Alert';
import StatusBadge from '../components/AgentProfile/StatusBadge';
import InfoCard from '../components/AgentProfile/InfoCard';
import { Building2, Clock, FileText, Phone, Mail, MapPin } from 'lucide-react';
import UserInfoCard from '../components/Profile/UserInfoCard';
import RoleBadge from '../components/Profile/RoleBadge';
import UserForm from '../components/Profile/UserForm';
import AgentsMap from '../components/AgentsMap';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const api = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/user/profile`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return response.json();
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/user/profile`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }

    return response.json();
  },
};

// Normalize function for agent profile
const normalizeProfile = (profile) => {
  if (!profile) return profile;

  const normalize = (t) => (t ? t.substring(0, 5) : '');

  if (profile.agent_profile) {
    return {
      ...profile,
      agent_profile: {
        ...profile.agent_profile,
        working_hours_start: normalize(
          profile.agent_profile.working_hours_start
        ),
        working_hours_end: normalize(profile.agent_profile.working_hours_end),
      },
    };
  }

  return profile;
};

// User Profile View Component
const UserProfileView = ({ profile, onEdit }) => {
  const navigate = useNavigate();
  const isAgent = profile.role === 'agent';

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

      {/* User Info */}
      <div className="space-y-6">
        {/* User Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {profile.full_name}
              </h1>
              <RoleBadge role={profile.role} />
            </div>
            <div className="text-sm text-gray-500">
              User ID: {profile.user_id}
            </div>
          </div>

          <UserInfoCard user={profile} />
        </div>

        {/* Agent Profile Section */}
        {isAgent && profile.agent_profile && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Agent Profile
                </h2>
                <StatusBadge status={profile.agent_profile.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard
                  icon={Building2}
                  title="Business Name"
                  value={profile.agent_profile.business_name}
                />

                <InfoCard
                  icon={FileText}
                  title="Business License"
                  value={profile.agent_profile.business_license}
                />

                <InfoCard
                  icon={MapPin}
                  title="Location"
                  value={profile.agent_profile.city}
                  subtext={profile.agent_profile.address}
                />

                <InfoCard
                  icon={Clock}
                  title="Working Hours"
                  value={
                    profile.agent_profile.working_hours_start &&
                    profile.agent_profile.working_hours_end
                      ? `${profile.agent_profile.working_hours_start} - ${profile.agent_profile.working_hours_end}`
                      : null
                  }
                />

                <InfoCard
                  icon={FileText}
                  title="Commission Rate"
                  value={
                    profile.agent_profile.commission_rate
                      ? `${profile.agent_profile.commission_rate}%`
                      : null
                  }
                />
              </div>
            </div>

            {/* Map Section */}
            {profile.agent_profile.latitude &&
              profile.agent_profile.longitude && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    Business Location
                  </h2>
                  <div className="bg-gray-50 rounded-xl border border-gray-300 overflow-hidden h-[400px]">
                    <AgentsMap
                      agents={[
                        {
                          ...profile.agent_profile,
                          agent_id: profile.user_id,
                          name: profile.agent_profile.business_name,
                        },
                      ]}
                    />
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

// Edit Profile Component
const EditProfileView = ({ profile, onCancel, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [activeSection, setActiveSection] = useState('user'); // 'user' or 'agent'

  const isAgent = profile.role === 'agent';

  const handleUserSubmit = async (userData) => {
    setLoading(true);
    setAlert(null);

    try {
      const result = await api.updateProfile(userData);

      if (result.success) {
        setAlert({ type: 'success', message: 'Profile updated successfully!' });
        setTimeout(() => {
          onUpdate(result.data);
        }, 1500);
      } else {
        if (result.errors) {
          setAlert({
            type: 'error',
            message: 'Please fix the validation errors',
          });
        } else {
          setAlert({
            type: 'error',
            message: result.message || 'Failed to update profile',
          });
        }
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAgentSubmit = async (agentData) => {
    setLoading(true);
    setAlert(null);

    try {
      const result = await api.updateProfile(agentData);

      if (result.success) {
        setAlert({
          type: 'success',
          message: 'Agent profile updated successfully!',
        });
        setTimeout(() => {
          onUpdate(result.data);
        }, 1500);
      } else {
        if (result.errors) {
          setAlert({
            type: 'error',
            message: 'Please fix the validation errors',
          });
        } else {
          setAlert({
            type: 'error',
            message: result.message || 'Failed to update profile',
          });
        }
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Tab Navigation */}
      {isAgent && (
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveSection('user')}
            className={`px-4 py-3 font-medium text-sm ${activeSection === 'user' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            User Information
          </button>
          <button
            onClick={() => setActiveSection('agent')}
            className={`px-4 py-3 font-medium text-sm ${activeSection === 'agent' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Agent Information
          </button>
        </div>
      )}

      {/* User Form */}
      {activeSection === 'user' && (
        <UserForm
          user={profile}
          onSubmit={handleUserSubmit}
          onCancel={onCancel}
          loading={loading}
        />
      )}

      {/* Agent Form (only for agents) */}
      {isAgent && activeSection === 'agent' && (
        <AgentProfileEditForm
          profile={profile.agent_profile}
          onSubmit={handleAgentSubmit}
          onCancel={onCancel}
          loading={loading}
        />
      )}
    </div>
  );
};

// Agent Profile Edit Form Component
const AgentProfileEditForm = ({ profile, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    business_name: profile.business_name || '',
    business_license: profile.business_license || '',
    address: profile.address || '',
    city: profile.city || '',
    working_hours_start: profile.working_hours_start || '',
    working_hours_end: profile.working_hours_end || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            maxLength={200}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
            placeholder="Your business name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business License
          </label>
          <input
            type="text"
            name="business_license"
            value={formData.business_license}
            onChange={handleChange}
            maxLength={100}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
            placeholder="License number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            maxLength={100}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
            placeholder="Full address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Working Hours Start
          </label>
          <input
            type="time"
            name="working_hours_start"
            value={formData.working_hours_start}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Working Hours End
          </label>
          <input
            type="time"
            name="working_hours_end"
            value={formData.working_hours_end}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Main Profile Page Component
export default function UserProfilePage() {
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
    setProfile(normalizeProfile(updatedProfile));
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {isEditing ? (
          <EditProfileView
            profile={profile}
            onCancel={() => setIsEditing(false)}
            onUpdate={handleUpdate}
          />
        ) : (
          <UserProfileView
            profile={profile}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
}
