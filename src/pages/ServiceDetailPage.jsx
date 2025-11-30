import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchService } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, Percent, DollarSign, Calendar, AlertTriangle, Edit } from 'lucide-react';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const loadService = async () => {
            setLoading(true);
            setError('');
            try {
                console.log('🔍 Loading service details for ID:', id);
                const response = await fetchService(token, id);
                console.log('📦 Service detail response:', response);
                
                // FIXED: Check for service_id directly since API returns the object directly
                if (response && response.service_id) {
                    setService(response);
                } else {
                    setError('Service not found or failed to load.');
                }
            } catch (e) {
                console.error('❌ Error loading service:', e);
                setError('Failed to fetch service details. Please check the ID.');
            } finally {
                setLoading(false);
            }
        };
        
        if (token && id) {
            loadService();
        }
    }, [id, token]);

    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading service details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center bg-red-50 rounded-xl m-4">
                <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
                <p className="text-red-700 text-lg font-medium mb-4">{error}</p>
                <button 
                    onClick={() => navigate('/services')} 
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-medium"
                >
                    Back to Service List
                </button>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="p-10 text-center">
                <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
                <p className="text-gray-700 text-lg">No service data available.</p>
            </div>
        );
    }

    // Helper function to format service type for display
    const formatServiceType = (type) => {
        const typeMap = {
            'transfer': 'Money Transfer',
            'payment': 'Bill Payment', 
            'cash_out': 'Cash Out / Withdrawal'
        };
        return typeMap[type] || type.replace(/_/g, ' ').toUpperCase();
    };

    // Helper function to format transfer speed for display
    const formatTransferSpeed = (speed) => {
        const speedMap = {
            'instant': 'Instant (Real-Time)',
            'same_day': 'Same Day',
            '1-3_days': '1-3 Business Days'
        };
        return speedMap[speed] || speed.replace(/_/g, ' ');
    };

    // Helper function to get speed icon and color
    const getSpeedDetails = (speed) => {
        switch (speed) {
            case 'instant':
                return { Icon: Zap, color: 'text-green-600', bgColor: 'bg-green-100' };
            case 'same_day':
                return { Icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
            case '1-3_days':
                return { Icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100' };
            default:
                return { Icon: Clock, color: 'text-gray-600', bgColor: 'bg-gray-100' };
        }
    };

    const { Icon: SpeedIcon, color: speedColor, bgColor: speedBgColor } = getSpeedDetails(service.transfer_speed);

    // Format dates
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            {/* Header with Back Button */}
            <div className="flex justify-between items-center mb-8">
                <button 
                    onClick={() => navigate('/services')} 
                    className="flex items-center text-gray-600 hover:text-gray-800 transition font-medium group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition" /> 
                    Back to Services
                </button>
                
                {isAdmin && (
                    <button
                        onClick={() => navigate(`/services/edit/${service.service_id}`)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium"
                    >
                        <Edit size={18} className="mr-2" />
                        Edit Service
                    </button>
                )}
            </div>

            {/* Service Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {formatServiceType(service.service_type)}
                            </h1>
                            <p className="text-blue-100 text-lg">Service ID: {service.service_id}</p>
                        </div>
                       <div className={`px-4 py-2 rounded-full ${speedBgColor} font-semibold text-sm text-black`}>
    {formatTransferSpeed(service.transfer_speed)}
</div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Service Type */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                    <Zap size={20} className="text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Service Type</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatServiceType(service.service_type)}
                            </p>
                        </div>

                        {/* Transfer Speed */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                    <SpeedIcon size={20} className={speedColor} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Transfer Speed</h3>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatTransferSpeed(service.transfer_speed)}
                            </p>
                        </div>

                        {/* Fee Percentage */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                    <Percent size={20} className="text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Fee Percentage</h3>
                            </div>
                            <p className="text-3xl font-bold text-purple-600">
                                {parseFloat(service.fee_percentage).toFixed(2)}%
                            </p>
                        </div>

                        {/* <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                    <DollarSign size={20} className="text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Base Fee</h3>
                            </div>
                            <p className="text-3xl font-bold text-green-600">
                                ${parseFloat(service.base_fee || 0).toFixed(2)}
                            </p>
                        </div> */}
                    </div>

                    {/* Additional Information */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-xl font-bold text-black mb-4">Service Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">Service ID:</span>
                                <span className="font-semibold text-black">{service.service_id}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">Created:</span>
                                <span className="font-semibold text-black">{formatDate(service.created_at)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">Last Updated:</span>
                                <span className="font-semibold text-black">{formatDate(service.updated_at)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">Status:</span>
                                <span className="font-semibold text-green-600">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="mt-8 bg-blue-50 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Service Description</h3>
                        <p className="text-gray-700 leading-relaxed">
                            This {formatServiceType(service.service_type).toLowerCase()} service provides 
                            <strong> {formatTransferSpeed(service.transfer_speed).toLowerCase()} </strong>
                            processing with a competitive fee structure. The service charges a 
                            <strong> {parseFloat(service.fee_percentage).toFixed(2)}% </strong>
                            fee on transaction amounts 
                            {/* {service.base_fee ? `plus a base fee of $${parseFloat(service.base_fee).toFixed(2)}` : ''}. */}
                            {service.transfer_speed === 'instant' && ' Transactions are processed in real-time for immediate availability.'}
                            {service.transfer_speed === 'same_day' && ' Transactions are processed and completed within the same business day.'}
                            {service.transfer_speed === '1-3_days' && ' Transactions typically complete within 1-3 business days.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;