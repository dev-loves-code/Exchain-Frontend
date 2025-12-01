import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowPathIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CalendarIcon,
  FunnelIcon,
  ClockIcon,
  CurrencyDollarIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';
import { getStatusColor, getOperationTypeColor } from '../utils/statusColors';

const UserCashOperations = () => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    operation_type: '',
    start_date: '',
    end_date: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1
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
      
      console.log('Fetching operations with params:', params.toString());
      const response = await api.get(`/user/cash-operations?${params}`);
      
      if (response.data.success) {
        setOperations(response.data.data);
        setPagination(response.data.meta);
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

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this operation?')) {
      try {
        const response = await api.post(`/user/cash-operations/${id}/approve`);
        if (response.data.success) {
          fetchOperations();
        }
      } catch (error) {
        console.error('Error approving operation:', error);
        alert(error.response?.data?.error || 'Failed to approve operation');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this operation?')) {
      try {
        const response = await api.post(`/user/cash-operations/${id}/reject`);
        if (response.data.success) {
          fetchOperations();
        }
      } catch (error) {
        console.error('Error rejecting operation:', error);
        alert(error.response?.data?.error || 'Failed to reject operation');
      }
    }
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

  // Add a check to see what data you're getting
  useEffect(() => {
    if (operations.length > 0) {
      console.log('First operation keys:', Object.keys(operations[0]));
      console.log('First operation:', operations[0]);
    }
  }, [operations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Cash Operations
              </h1>
              <p className="text-gray-600 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Manage your deposit and withdrawal requests
              </p>
            </div>
            <button
              onClick={() => fetchOperations()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <FunnelIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 ml-3">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
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
                Operation Type
              </label>
              <select
                value={filters.operation_type}
                onChange={(e) => setFilters({...filters, operation_type: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              >
                <option value="">All Types</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
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
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
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
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setFilters({
                status: '',
                operation_type: '',
                start_date: '',
                end_date: ''
              })}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Operations List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Operations</h2>
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading operations...</p>
            </div>
          ) : operations.length === 0 ? (
            <div className="py-20 text-center">
              <CurrencyDollarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Wallet Amount</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {operations.map((op) => (
                      <tr key={op.cash_op_id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {op.operation_type === 'deposit' ? (
                              <ArrowDownTrayIcon className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <ArrowUpTrayIcon className="h-5 w-5 text-red-500 mr-2" />
                            )}
                            <OperationTypeBadge type={op.operation_type} />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(op.amount, op.currency_code)}
                          </div>
                          <div className="text-sm text-gray-500">{op.currency_code}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(op.wallet_amount, op.wallet?.currency_code)}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <WalletIcon className="h-4 w-4 mr-1" />
                            Wallet {op.wallet?.wallet_id}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={op.status} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{formatDate(op.created_at)}</div>
                        </td>
                        <td className="py-4 px-6">
                          {op.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleApprove(op.cash_op_id)}
                                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                title="Approve"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleReject(op.cash_op_id)}
                                className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                title="Reject"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Completed</span>
                          )}
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

export default UserCashOperations;