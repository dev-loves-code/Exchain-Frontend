import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowPathIcon, 
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

// Import components
import StatsCards from '../components/AgentCashOperations/StatsCards';
import FilterCard from '../components/AgentCashOperations/FilterCard';
import OperationsTable from '../components/AgentCashOperations/OperationsTable';

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
    total_commission_usd: 0,
    total_deposits_usd: 0,
    total_withdrawals_usd: 0
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
      
      const response = await api.get(`/agent/cash-operations?${params}`);
      
      if (response.data.success) {
        setOperations(response.data.data);
        setPagination(response.data.meta);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching operations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      operation_type: '',
      user_id: '',
      start_date: '',
      end_date: ''
    });
  };

  const handleApplyFilters = () => {
    fetchOperations(1);
  };

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

  const handlePageChange = (page) => {
    fetchOperations(page);
  };

  const handlePerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, per_page: newPerPage }));
    fetchOperations(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Agent Operations
              </h1>
              <p className="text-gray-600">
                Manage customer cash operations and commissions
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => fetchOperations()}
                className="inline-flex items-center px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow"
              >
                <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                New Operation
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <FilterCard 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        {/* Operations List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Customer Operations</h2>
                <p className="text-gray-600 mt-1">
                  Showing {operations.length} of {pagination.total} operations
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Items per page:</span>
                <select
                  value={pagination.per_page}
                  onChange={handlePerPageChange}
                  className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          <OperationsTable
            operations={operations}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onViewUser={handleViewUser}
            onCancel={handleCancel}
            onPerPageChange={handlePerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentCashOperations;