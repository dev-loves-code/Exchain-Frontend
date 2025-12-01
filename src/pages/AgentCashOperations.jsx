import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowPathIcon, 
  XMarkIcon,
  UserIcon,
  CurrencyDollarIcon,
  WalletIcon,
  CalendarIcon,
  FunnelIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import { getStatusColor, getOperationTypeColor } from '../utils/statusColors';

const AgentCashOperations = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    operation_type: '',
    user_id: '',
    start_date: '',
    end_date: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1
  });
  const [stats, setStats] = useState({
    total_commission: 0,
    total_deposits: 0,
    total_withdrawals: 0
  });

  const navigate = useNavigate();

  const fetchOperations = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page,
        per_page: pagination.per_page
      });
      
      console.log('Fetching agent operations with params:', params.toString());
      const response = await api.get(`/agent/cash-operations?${params}`);
      
      if (response.data.success) {
        setOperations(response.data.data);
        setPagination(response.data.meta);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching operations:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, [filters]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this operation? This action cannot be undone.')) {
      try {
        const response = await api.post(`/agent/cash-operations/${id}/cancel`);
        if (response.data.success) {
          fetchOperations();
        }
      } catch (error) {
        console.error('Error cancelling operation:', error);
        alert(error.response?.data?.error || 'Failed to cancel operation');
      }
    }
  };

  const handleCreateNew = () => {
    navigate('/agent/cash-operations/new');
  };

  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const OperationTypeBadge = ({ type }) => (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getOperationTypeColor(type)}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );

  // Add debug logging to see the data structure
  useEffect(() => {
    if (operations.length > 0) {
      console.log('First agent operation keys:', Object.keys(operations[0]));
      console.log('First agent operation:', operations[0]);
    }
  }, [operations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Agent Operations
              </h1>
              <p className="text-gray-600">
                Manage customer cash operations and commissions
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => fetchOperations()}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                New Operation
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Commission</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(stats.total_commission_usd, 'USD')}
                </p>
              </div>
              <CurrencyDollarIcon className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Deposits</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(stats.total_deposits_usd, 'USD')}
                </p>
              </div>
              <ArrowDownTrayIcon className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Withdrawals</p>
                <p className="text-3xl font-bold mt-2">
                  {formatCurrency(stats.total_withdrawals_usd, 'USD')}
                </p>
              </div>
              <ArrowUpTrayIcon className="h-12 w-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <FunnelIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 ml-3">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.operation_type}
                onChange={(e) => setFilters({...filters, operation_type: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">All Types</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={filters.user_id}
                onChange={(e) => setFilters({...filters, user_id: e.target.value})}
                placeholder="Enter user ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => setFilters({...filters, start_date: e.target.value})}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) => setFilters({...filters, end_date: e.target.value})}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={() => setFilters({
                status: '',
                operation_type: '',
                user_id: '',
                start_date: '',
                end_date: ''
              })}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Clear Filters
            </button>
            <button
              onClick={() => fetchOperations()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Operations List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Customer Operations</h2>
                <p className="text-gray-600 mt-1">
                  Showing {operations.length} of {pagination.total} operations
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Items per page:</span>
                <select
                  value={pagination.per_page}
                  onChange={(e) => {
                    setPagination({...pagination, per_page: parseInt(e.target.value)});
                    fetchOperations(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading operations...</p>
            </div>
          ) : operations.length === 0 ? (
            <div className="py-20 text-center">
              <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No operations found</h3>
              <p className="text-gray-500">Try adjusting your filters or create a new operation</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Commission</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {operations.map((op) => (
                      <tr key={op.cash_op_id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-6">
                          <OperationTypeBadge type={op.operation_type} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium text-gray-900 hover:text-purple-600 cursor-pointer"
                                   onClick={() => handleViewUser(op.user_id)}>
                                {op.user?.full_name || `User ${op.user_id}`}
                              </div>
                              <div className="text-sm text-gray-500">ID: {op.user_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-gray-900">
                            {formatCurrency(op.amount, op.currency_code)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Wallet: {formatCurrency(op.wallet_amount, op.wallet?.currency_code)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-green-600">
                            {formatCurrency(op.agent_commission, op.currency_code)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={op.status} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{formatDate(op.created_at)}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewUser(op.user_id)}
                              className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                              title="View Customer"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {op.status === 'pending' && (
                              <button
                                onClick={() => handleCancel(op.cash_op_id)}
                                className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                title="Cancel Operation"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {pagination.current_page} of {pagination.last_page}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => fetchOperations(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => fetchOperations(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCashOperations;