import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchService } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, Percent, DollarSign, Calendar, AlertTriangle, Edit, Sparkles, FileText, Tag } from 'lucide-react';

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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading service details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 text-center">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
                    <p className="text-red-700 text-lg font-medium mb-6">{error}</p>
                    <button 
                        onClick={() => navigate('/services')} 
                        className="py-3 px-6 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
                    >
                        Back to Service List
                    </button>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 text-center">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
                    <p className="text-gray-700 text-lg mb-6">No service data available.</p>
                    <button 
                        onClick={() => navigate('/services')} 
                        className="py-3 px-6 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
                    >
                        Back to Service List
                    </button>
                </div>
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

    // Helper function to get service type badge styling
    const getServiceTypeBadge = (type) => {
        const badgeStyles = {
            'transfer': 'bg-blue-100 text-blue-800 border border-blue-200',
            'payment': 'bg-purple-100 text-purple-800 border border-purple-200',
            'cash_out': 'bg-teal-100 text-teal-800 border border-teal-200',
        };
        return badgeStyles[type] || 'bg-gray-100 text-gray-800 border border-gray-200';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition bg-white"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        <span className="text-blue-600 font-semibold text-lg">Service Details</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        Service Information
                    </h1>
                    <p className="text-slate-500 mt-2">
                        View detailed information about this service
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 overflow-hidden">
                    {/* Card Header with Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                {formatServiceType(service.service_type)}
                            </h2>
                            <p className="text-slate-500">Service ID: #{service.service_id}</p>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={() => navigate(`/services/edit/${service.service_id}`)}
                                className="flex items-center bg-teal-800 hover:bg-teal-900 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mt-4 md:mt-0"
                            >
                                <Edit size={18} className="mr-2" />
                                Edit Service
                            </button>
                        )}
                    </div>

                    {/* Service Type & Speed Badges */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <span className={`px-4 py-2 inline-flex text-sm leading-5 font-medium rounded-full ${getServiceTypeBadge(service.service_type)}`}>
                            <Tag size={16} className="mr-2" />
                            {formatServiceType(service.service_type)}
                        </span>
                        <span className={`px-4 py-2 inline-flex text-sm leading-5 font-medium rounded-full ${speedBgColor} ${speedColor}`}>
                            <SpeedIcon size={16} className="mr-2" />
                            {formatTransferSpeed(service.transfer_speed)}
                        </span>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Service Type Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mr-4">
                                    <FileText size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Service Type</h3>
                                    <p className="text-sm text-gray-500">Primary service category</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 ml-16">
                                {formatServiceType(service.service_type)}
                            </p>
                        </div>

                        {/* Transfer Speed Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mr-4">
                                    <SpeedIcon size={24} className={speedColor} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Transfer Speed</h3>
                                    <p className="text-sm text-gray-500">Processing time</p>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 ml-16">
                                {formatTransferSpeed(service.transfer_speed)}
                            </p>
                        </div>

                        {/* Fee Percentage Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                                    <Percent size={24} className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Fee Percentage</h3>
                                    <p className="text-sm text-gray-500">Transaction fee rate</p>
                                </div>
                            </div>
                            <div className="ml-16">
                                <p className="text-3xl font-black text-purple-600">
                                    {parseFloat(service.fee_percentage).toFixed(2)}%
                                </p>
                                <p className="text-sm text-gray-500 mt-1">per transaction</p>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mr-4">
                                    <Zap size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                                    <p className="text-sm text-gray-500">Service availability</p>
                                </div>
                            </div>
                            <div className="ml-16">
                                <span className="px-4 py-2 inline-flex text-sm leading-5 font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                                    Active & Available
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Service Information Table */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                            Service Information
                        </h3>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">Service ID:</span>
                                    <span className="font-semibold text-gray-900">#{service.service_id}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">Created Date:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(service.created_at)}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">Last Updated:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(service.updated_at)}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">Transaction Fee:</span>
                                    <span className="font-semibold text-gray-900">{parseFloat(service.fee_percentage).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Description */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Description</h3>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                            <p className="text-gray-700 leading-relaxed">
                                This <span className="font-semibold text-gray-900">{formatServiceType(service.service_type).toLowerCase()}</span> service provides 
                                <span className="font-semibold text-gray-900"> {formatTransferSpeed(service.transfer_speed).toLowerCase()} </span>
                                processing with a competitive fee structure. The service charges a 
                                <span className="font-semibold text-gray-900"> {parseFloat(service.fee_percentage).toFixed(2)}% </span>
                                fee on transaction amounts.
                                {service.transfer_speed === 'instant' && ' Transactions are processed in real-time for immediate availability.'}
                                {service.transfer_speed === 'same_day' && ' Transactions are processed and completed within the same business day.'}
                                {service.transfer_speed === '1-3_days' && ' Transactions typically complete within 1-3 business days.'}
                            </p>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Important Information</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Fees are calculated based on the transaction amount</li>
                                    <li>• Processing times may vary during peak hours</li>
                                    <li>• Contact support for transaction-specific inquiries</li>
                                    <li>• Terms and conditions apply to all transactions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-xs text-slate-500 text-center">
                    Service details are updated in real-time. Last fetched: {new Date().toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
};

export default ServiceDetailPage;