import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import api from '../utils/api';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/auth/users/${id}`);

      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err.response?.data?.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      agent: 'bg-teal-100 text-teal-700 border-teal-200',
      user: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircleIcon className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center">
          <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The user you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
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
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                User Profile
              </h1>
              <p className="text-gray-600">View user details and information</p>
            </div>
            <button
              onClick={fetchUser}
              className="inline-flex items-center px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <UserCircleIcon className="h-12 w-12 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {user.full_name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ID: {user.user_id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Contact Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-start p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Phone Number
                  </p>
                  <p className="font-medium text-gray-900">
                    {user.phone_number || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Account Role
                  </p>
                  <p className="font-medium text-gray-900 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Account Created
                  </p>
                  <p className="font-medium text-gray-900">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Last Updated
                  </p>
                  <p className="font-medium text-gray-900">
                    {formatDate(user.updated_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-gray-100 border border-gray-200">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <UserCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    User ID
                  </p>
                  <p className="text-sm font-mono text-gray-900 break-all">
                    {user.user_id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
