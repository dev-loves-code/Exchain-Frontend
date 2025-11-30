import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Trash2, Edit, Eye, PlusCircle, Loader2, FilterX } from 'lucide-react';
import { fetchServices, deleteService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MessageBar = ({ message, type }) => {
    if (!message) return null;
    const baseClasses = "p-4 rounded-xl font-medium shadow-md transition-all duration-300";
    const colorClasses = type === 'error' 
        ? 'bg-red-100 text-red-700 border-red-200' 
        : 'bg-green-100 text-green-700 border-green-200';
    return <div className={`${baseClasses} ${colorClasses} mb-6 border`}>{message}</div>;
};

const ServiceListPage = () => {
    const { user } = useAuth(); 
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [filters, setFilters] = useState({ 
        service_type: '', 
        transfer_speed: '', 
        sort: 'service_id' 
    });
    const [pagination, setPagination] = useState({ 
        currentPage: 1, 
        lastPage: 1, 
        total: 0, 
        perPage: 10 
    });

    const isAdmin = user?.role === 'admin';
    console.log('🔍 User object:', user);
    console.log('🔍 User role_id:', user?.role_id);
    console.log('🔍 Is admin:', isAdmin);
    
    const loadServices = useCallback(async (page = 1) => {
        if (!token) {
            setStatus({ message: 'Authentication required. Please log in.', type: 'error' });
            setLoading(false);
            return;
        }

        setLoading(true);
        setStatus({ message: '', type: '' });

        try {
            const apiFilters = {};
            if (filters.service_type) apiFilters.service_type = filters.service_type;
            if (filters.transfer_speed) apiFilters.transfer_speed = filters.transfer_speed;
            
            console.log('🔍 Sending to API:', {
                filters: apiFilters,
                page,
                perPage: pagination.perPage,
                sort: filters.sort,
                fullURL: `http://127.0.0.1:8000/api/services?${new URLSearchParams({ 
                    ...apiFilters, 
                    page, 
                    perPage: pagination.perPage, 
                    sort: filters.sort 
                }).toString()}`
            });
            
            const servicesData = await fetchServices(
                token, 
                apiFilters, 
                page, 
                pagination.perPage, 
                filters.sort
            );
            
            console.log('📦 Received from API:', {
                dataCount: servicesData.data?.length,
                total: servicesData.total,
                currentPage: servicesData.current_page,
                filtersApplied: servicesData.data?.map(s => ({ 
                    id: s.service_id, 
                    type: s.service_type, 
                    speed: s.transfer_speed 
                }))
            });
            
            setServices(servicesData.data || []);
            setPagination({
                currentPage: servicesData.current_page || 1,
                lastPage: servicesData.last_page || 1,
                total: servicesData.total || 0,
                perPage: servicesData.per_page || 10,
            });
            
        } catch (error) {
            console.error('❌ Fetch error:', error);
            setStatus({ 
                message: error.message || 'Failed to fetch services from server.', 
                type: 'error' 
            });
            setServices([]);
        } finally {
            setLoading(false);
        }
    }, [token, filters, pagination.perPage]);

    useEffect(() => {
        console.log('🔄 Filters changed, reloading services:', filters);
        if (token) {
            loadServices(1);
        }
    }, [token, filters.service_type, filters.transfer_speed, filters.sort, loadServices]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log(`🎛️ Filter changed: ${name} = "${value}"`);
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (serviceId) => {
        if (!isAdmin) {
            setStatus({ message: "You do not have permission to delete services.", type: 'error' });
            return;
        }
        
        if (!window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
            return;
        }

        try {
            const result = await deleteService(token, serviceId);
            
            if (result.success) {
                setStatus({ 
                    message: result.message || 'Service successfully deleted.', 
                    type: 'success' 
                });
                loadServices(pagination.currentPage);
            } else {
                setStatus({ 
                    message: result.message || 'Deletion failed.', 
                    type: 'error' 
                });
            }
            
        } catch (error) {
            console.error('Delete error:', error);
            
            if (error.message.includes('foreign key constraint') || 
                error.message.includes('associated transactions') ||
                error.message?.includes('422')) {
                setStatus({ 
                    message: 'Cannot delete this service because it has associated transactions. Please remove the transactions first.', 
                    type: 'error' 
                });
            } else if (error.message.includes('404')) {
                setStatus({ 
                    message: 'Service not found. It may have already been deleted.', 
                    type: 'error' 
                });
                loadServices(pagination.currentPage);
            } else {
                setStatus({ 
                    message: error.message || 'Deletion failed. Please try again.', 
                    type: 'error' 
                });
            }
        }
    };

    const handleClearFilters = () => {
        console.log('🧹 Clearing all filters');
        setFilters({ 
            service_type: '', 
            transfer_speed: '', 
            sort: 'service_id' 
        });
    };

    const handlePageChange = (newPage) => {
        console.log('📄 Changing to page:', newPage);
        loadServices(newPage);
    };

    const ServiceRow = ({ service }) => {
        const typeColor = {
            transfer: 'bg-blue-100 text-blue-800',
            payment: 'bg-purple-100 text-purple-800',
            cash_out: 'bg-teal-100 text-teal-800',
        };

        const speedColor = {
            instant: 'text-green-600 font-semibold',
            same_day: 'text-yellow-600',
            '1-3_days': 'text-red-600',
        };

        const feePercentage = typeof service.fee_percentage === 'number' 
            ? service.fee_percentage 
            : parseFloat(service.fee_percentage) || 0;

        return (
            <tr key={service.service_id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900 border-r border-gray-100">
                    #{service.service_id}
                </td>
                <td className="px-8 py-5 whitespace-nowrap border-r border-gray-100">
                    <span className={`px-4 py-2 inline-flex text-sm leading-5 font-medium rounded-full ${typeColor[service.service_type] || 'bg-gray-100 text-gray-800'}`}>
                        {service.service_type?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
                    </span>
                </td>
                <td className={`px-8 py-5 whitespace-nowrap text-base font-medium ${speedColor[service.transfer_speed] || 'text-gray-500'} border-r border-gray-100`}>
                    {service.transfer_speed?.replace(/_/g, ' ') || 'N/A'}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900">
                    {feePercentage.toFixed(2)}%
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                        <Link 
                            to={`/services/${service.service_id}`} 
                            className="p-3 text-gray-500 hover:text-blue-600 transition duration-150 rounded-full hover:bg-blue-50" 
                            title="View Details"
                        >
                            <Eye size={20} />
                        </Link>
                        
                        {isAdmin && (
                            <>
                                <Link 
                                    to={`/services/edit/${service.service_id}`} 
                                    className="p-3 text-gray-500 hover:text-yellow-600 transition duration-150 rounded-full hover:bg-yellow-50" 
                                    title="Edit Service"
                                >
                                    <Edit size={20} />
                                </Link>
                                <button 
                                    onClick={() => handleDelete(service.service_id)} 
                                    className="p-3 text-gray-500 hover:text-red-600 transition duration-150 rounded-full hover:bg-red-50" 
                                    title="Delete Service"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const Pagination = () => {
        const startItem = (pagination.currentPage - 1) * pagination.perPage + 1;
        const endItem = Math.min(pagination.currentPage * pagination.perPage, pagination.total);

        return (
            <div className="flex justify-between items-center px-4 py-3 sm:px-6">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{pagination.total}</span> results
                </p>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {pagination.currentPage} of {pagination.lastPage}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage || pagination.total === 0}
                        className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </nav>
            </div>
        );
    };

    const hasActiveFilters = filters.service_type || filters.transfer_speed;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    Service Catalog
                </h1>
                {isAdmin && (
                    <Link 
                        to="/services/add" 
                        className="flex items-center bg-gradient-to-r from-green-500 to-teal-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]"
                    >
                        <PlusCircle size={20} className="mr-2" /> Add New Service
                    </Link>
                )}
            </div>

            <MessageBar message={status.message} type={status.type} />

            <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Filters & Sorting</h2>
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition duration-150"
                        >
                            <FilterX size={16} className="mr-1" />
                            Clear Filters
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                        <select
                            name="service_type"
                            value={filters.service_type}
                            onChange={handleFilterChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Types</option>
                            <option value="transfer">Transfer</option>
                            <option value="payment">Payment</option>
                            <option value="cash_out">Cash Out</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Speed</label>
                        <select
                            name="transfer_speed"
                            value={filters.transfer_speed}
                            onChange={handleFilterChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Speeds</option>
                            <option value="instant">Instant</option>
                            <option value="same_day">Same Day</option>
                            <option value="1-3_days">1-3 Days</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                        <select
                            name="sort"
                            value={filters.sort}
                            onChange={handleFilterChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="service_id">ID (Ascending)</option>
                            <option value="-service_id">ID (Descending)</option>
                            <option value="fee_percentage">Fee % (Low to High)</option>
                            <option value="-fee_percentage">Fee % (High to Low)</option>
                            <option value="transfer_speed">Transfer Speed</option>
                            <option value="-created_at">Date (Newest First)</option>
                            <option value="created_at">Date (Oldest First)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        <Loader2 className="animate-spin inline-block w-8 h-8 border-4 border-t-blue-600 border-gray-200 rounded-full mb-3" />
                        <p>Loading service data...</p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">No services found</p>
                        <p className="text-gray-600 mb-6">
                            {hasActiveFilters 
                                ? "No services match your current filters." 
                                : "There are no services in the system yet."
                            }
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]"
                            >
                                <FilterX size={18} className="mr-2" />
                                Clear filters to see all services
                            </button>
                        )}
                        {isAdmin && !hasActiveFilters && (
                            <Link 
                                to="/services/add" 
                                className="inline-flex items-center bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] mt-4"
                            >
                                <PlusCircle size={18} className="mr-2" /> 
                                Add Your First Service
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">ID</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Service Type</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Transfer Speed</th>
                                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Fee Percentage</th>
                                        <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {services.map(service => (
                                        <ServiceRow key={service.service_id} service={service} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {pagination.lastPage > 1 && <Pagination />}
                    </>
                )}
            </div>
        </div>
    );
};   

export default ServiceListPage;