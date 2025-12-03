import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowPathIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

// Import components
import FilterCard from '../components/UserCashOperations/FilterCard';
import OperationsTable from '../components/UserCashOperations/OperationsTable';

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
      
      const response = await api.get(`/user/cash-operations?${params}`);
      
      if (response.data.success) {
        setOperations(response.data.data);
        setPagination(response.data.meta);
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
      start_date: '',
      end_date: ''
    });
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Cash Operations
              </h1>
              <p className="text-gray-600 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Manage your deposit and withdrawal requests
              </p>
            </div>
            <button
              onClick={() => fetchOperations()}
              className="inline-flex items-center px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <FilterCard 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Operations List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Operations</h2>
                <p className="text-gray-600 mt-1">
                  Showing {operations.length} of {pagination.total} operations
                </p>
              </div>
            </div>
          </div>

          <OperationsTable
            operations={operations}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onApprove={handleApprove}
            onReject={handleReject}
            onPerPageChange={handlePerPageChange}
            onRefresh={() => fetchOperations()}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCashOperations;