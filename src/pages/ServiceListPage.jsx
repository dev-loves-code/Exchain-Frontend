import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Trash2, Edit, Eye, PlusCircle, Loader2, FilterX, ArrowLeft, Sparkles, Search, Filter, ArrowUpDown } from 'lucide-react';
import { fetchServices, deleteService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MessageBar = ({ message, type }) => {
    if (!message) return null;
    const baseClasses = "p-4 rounded-xl font-medium shadow-md transition-all duration-300 border";
    const colorClasses = type === 'error' 
        ? 'bg-red-100 text-red-700 border-red-200' 
        : 'bg-green-100 text-green-700 border-green-200';
    return <div className={`${baseClasses} ${colorClasses} mb-6`}>{message}</div>;
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
            
            const servicesData = await fetchServices(
                token, 
                apiFilters, 
                page, 
                pagination.perPage, 
                filters.sort
            );
            
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
        if (token) {
            loadServices(1);
        }
    }, [token, filters.service_type, filters.transfer_speed, filters.sort, loadServices]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
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
        setFilters({ 
            service_type: '', 
            transfer_speed: '', 
            sort: 'service_id' 
        });
    };

    const handlePageChange = (newPage) => {
        loadServices(newPage);
    };

    const ServiceRow = ({ service }) => {
        const typeColor = {
            transfer: 'bg-blue-100 text-blue-800 border border-blue-200',
            payment: 'bg-purple-100 text-purple-800 border border-purple-200',
            cash_out: 'bg-teal-100 text-teal-800 border border-teal-200',
        };

        const speedColor = {
            instant: 'bg-green-100 text-green-800 border border-green-200',
            same_day: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            '1-3_days': 'bg-red-100 text-red-800 border border-red-200',
        };

        const feePercentage = typeof service.fee_percentage === 'number' 
            ? service.fee_percentage 
            : parseFloat(service.fee_percentage) || 0;

        return (
            <tr key={service.service_id} className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900 border-r border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">#{service.service_id}</span>
                        </div>
                    </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap border-r border-gray-100">
                    <span className={`px-4 py-2 inline-flex text-sm leading-5 font-medium rounded-full ${typeColor[service.service_type] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                        {service.service_type?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
                    </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap border-r border-gray-100">
                    <span className={`px-4 py-2 inline-flex text-sm leading-5 font-medium rounded-full ${speedColor[service.transfer_speed] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                        {service.transfer_speed?.replace(/_/g, ' ') || 'N/A'}
                    </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 inline-block">
                        <span className="text-2xl font-black text-gray-900">
                            {feePercentage.toFixed(2)}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">fee</span>
                    </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                        <Link 
                            to={`/services/${service.service_id}`} 
                            className="p-3 text-gray-500 hover:text-blue-600 transition duration-200 rounded-xl hover:bg-blue-50 border border-gray-200 hover:border-blue-300" 
                            title="View Details"
                        >
                            <Eye size={18} />
                        </Link>
                        
                        {isAdmin && (
                            <>
                                <Link 
                                    to={`/services/edit/${service.service_id}`} 
                                    className="p-3 text-gray-500 hover:text-yellow-600 transition duration-200 rounded-xl hover:bg-yellow-50 border border-gray-200 hover:border-yellow-300" 
                                    title="Edit Service"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button 
                                    onClick={() => handleDelete(service.service_id)} 
                                    className="p-3 text-gray-500 hover:text-red-600 transition duration-200 rounded-xl hover:bg-red-50 border border-gray-200 hover:border-red-300" 
                                    title="Delete Service"
                                >
                                    <Trash2 size={18} />
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
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-5 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3 sm:mb-0">
                    Showing <span className="font-semibold text-gray-900">{startItem}</span> to <span className="font-semibold text-gray-900">{endItem}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span> services
                </p>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-4 py-2 rounded-xl border border-gray-300 bg-teal-800 text-white text-sm font-medium hover:bg-teal-900 hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Prev
                    </button>
                    <span className="px-4 py-2 bg-teal-800 text-white border border-gray-300 rounded-xl text-sm font-medium">
                        Page {pagination.currentPage} of {pagination.lastPage}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.lastPage || pagination.total === 0}
                        className="px-4 py-2 rounded-xl border border-gray-300 bg-teal-800 text-white text-sm font-medium hover:bg-teal-900 hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        Next <ArrowLeft size={16} className="ml-1 rotate-180" />
                    </button>
                </div>
            </div>
        );
    };

    const hasActiveFilters = filters.service_type || filters.transfer_speed;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button - Only show if you have navigation history */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-teal-800 text-white hover:bg-teal-900 transition"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        <span className="text-blue-600 font-semibold text-lg">Service Management</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        Service Catalog
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Manage and browse all available services in the system
                    </p>
                </div>

                {/* Status Message */}
                <MessageBar message={status.message} type={status.type} />

                {/* Main Content Card */}
                <div className="w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
                    {/* Card Header with Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">All Services</h2>
                            <p className="text-slate-500">Filter and manage service offerings</p>
                        </div>
                        {isAdmin && (
                            <Link 
                                to="/services/add" 
                                className="flex items-center bg-teal-800 hover:bg-teal-900 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mt-4 md:mt-0"
                            >
                                <PlusCircle size={18} className="mr-2" /> Add New Service
                            </Link>
                        )}
                    </div>

                    {/* Filters Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-500" />
                                <h3 className="text-lg font-medium text-gray-900">Filters & Sorting</h3>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex items-center text-sm text-teal-800 hover:text-teal-900 transition px-3 py-1 rounded-lg hover:bg-teal-50"
                                >
                                    <FilterX size={16} className="mr-1" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-gray-900 font-medium mb-2">Service Type</label>
                                    <div className="relative">
                                        <select
                                            name="service_type"
                                            value={filters.service_type}
                                            onChange={handleFilterChange}
                                            className="w-full pl-4 pr-10 py-3 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none"
                                        >
                                            <option value="">All Types</option>
                                            <option value="transfer">Transfer</option>
                                            <option value="payment">Payment</option>
                                            <option value="cash_out">Cash Out</option>
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none">
                                            <ArrowUpDown size={18} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-900 font-medium mb-2">Transfer Speed</label>
                                    <div className="relative">
                                        <select
                                            name="transfer_speed"
                                            value={filters.transfer_speed}
                                            onChange={handleFilterChange}
                                            className="w-full pl-4 pr-10 py-3 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none"
                                        >
                                            <option value="">All Speeds</option>
                                            <option value="instant">Instant</option>
                                            <option value="same_day">Same Day</option>
                                            <option value="1-3_days">1-3 Days</option>
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none">
                                            <ArrowUpDown size={18} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-900 font-medium mb-2">Sort By</label>
                                    <div className="relative">
                                        <select
                                            name="sort"
                                            value={filters.sort}
                                            onChange={handleFilterChange}
                                            className="w-full pl-4 pr-10 py-3 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none"
                                        >
                                            <option value="service_id">ID (Ascending)</option>
                                            <option value="-service_id">ID (Descending)</option>
                                            <option value="fee_percentage">Fee % (Low to High)</option>
                                            <option value="-fee_percentage">Fee % (High to Low)</option>
                                            <option value="transfer_speed">Transfer Speed</option>
                                            <option value="-created_at">Date (Newest First)</option>
                                            <option value="created_at">Date (Oldest First)</option>
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none">
                                            <ArrowUpDown size={18} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Table */}
                    {loading ? (
                        <div className="py-16 text-center">
                            <Loader2 className="animate-spin inline-block w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full mb-4" />
                            <p className="text-gray-600">Loading service data...</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="mb-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="w-12 h-12 text-gray-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {hasActiveFilters 
                                    ? "No services match your current filters. Try adjusting your search criteria." 
                                    : "There are no services in the system yet."
                                }
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]"
                                    >
                                        <FilterX size={18} className="inline mr-2" />
                                        Clear all filters
                                    </button>
                                )}
                                {isAdmin && !hasActiveFilters && (
                                    <Link 
                                        to="/services/add" 
                                        className="px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]"
                                    >
                                        <PlusCircle size={18} className="inline mr-2" /> 
                                        Add Your First Service
                                    </Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-2xl border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-8 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-200">ID</th>
                                            <th className="px-8 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-200">Service Type</th>
                                            <th className="px-8 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-200">Transfer Speed</th>
                                            <th className="px-8 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Fee Percentage</th>
                                            <th className="px-8 py-5 text-right text-sm font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
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

                    {/* Footer Note */}
                    <p className="text-xs text-slate-500 text-center mt-8 pt-6 border-t border-gray-100">
                        Services are managed by administrators. Contact support for service-related inquiries.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ServiceListPage;