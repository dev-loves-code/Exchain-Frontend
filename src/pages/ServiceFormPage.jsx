import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createService, updateService, fetchService } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Save, Undo2, ArrowLeft, Sparkles, FileText } from 'lucide-react';

const ServiceFormPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const isEditing = !!id;

    console.log('🔍 DEBUG - ID from URL:', id);
    console.log('🔍 DEBUG - isEditing:', isEditing);
    console.log('🔍 DEBUG - Token exists:', !!token);
    console.log('🔍 DEBUG - User role:', user?.role);

    const [formData, setFormData] = useState({
        service_type: '',
        transfer_speed: '',
        fee_percentage: '',
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditing);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [focused, setFocused] = useState(null);

    const title = isEditing ? 'Edit Service' : 'Add New Service';

    // Fetch service data for editing
    useEffect(() => {
        console.log('🔄 useEffect triggered - isEditing:', isEditing);
        
        if (isEditing && token) {
            const loadService = async () => {
                try {
                    console.log('🚀 Starting to fetch service with ID:', id);
                    console.log('🔑 Token being used:', token);
                    
                    const response = await fetchService(token, id);
                    console.log('📦 Raw API Response:', response);
                    console.log('🔍 Full response structure:', JSON.stringify(response, null, 2));
                    
                    if (response && response.service_id) {
                        console.log('🎯 Setting form data with:', response);
                        setFormData({
                            service_type: response.service_type || '',
                            transfer_speed: response.transfer_speed || '',
                            fee_percentage: response.fee_percentage 
                                ? String(response.fee_percentage) 
                                : '',
                        });
                        setErrors({});
                    } else {
                        console.error('❌ API returned failure or no data');
                        setErrors({ general: 'Service not found or failed to load.' });
                    }
                } catch (error) {
                    console.error('💥 Error in loadService:', error);
                    console.error('💥 Error message:', error.message);
                    setErrors({ general: `Failed to fetch service: ${error.message}` });
                } finally {
                    console.log('🏁 Fetch loading complete');
                    setFetchLoading(false);
                }
            };
            
            loadService();
        } else {
            console.log('⏩ Skipping fetch - isEditing:', isEditing, 'token:', !!token);
            setFetchLoading(false);
        }
    }, [id, isEditing, token]);

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.service_type) {
            newErrors.service_type = 'Service type is required';
        }

        if (!formData.transfer_speed) {
            newErrors.transfer_speed = 'Transfer speed is required';
        }

        if (!formData.fee_percentage) {
            newErrors.fee_percentage = 'Fee percentage is required';
        } else {
            const fee = parseFloat(formData.fee_percentage);
            if (isNaN(fee) || fee < 0) {
                newErrors.fee_percentage = 'Please enter a valid fee percentage (0 or higher)';
            }
            if (fee > 100) {
                newErrors.fee_percentage = 'Fee percentage cannot exceed 100%';
            }
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setFocused(null);
        
        const newErrors = validateForm();
        setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }));
    };

    const handleFocus = (fieldName) => {
        setFocused(fieldName);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setTouched({
            service_type: true,
            transfer_speed: true,
            fee_percentage: true,
        });

        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }
        
        setLoading(true);

        const dataToSend = {
            ...formData,
            fee_percentage: parseFloat(formData.fee_percentage)
        };
        
        try {
            if (isEditing) {
                await updateService(token, id, dataToSend);
                navigate('/services?message=Service+successfully+updated&type=success');
            } else {
                await createService(token, dataToSend);
                navigate('/services?message=Service+successfully+created&type=success');
            }
        } catch (e) {
            setErrors({ general: e.message || 'An error occurred during submission.' });
            setLoading(false);
        }
    };

    const getFieldError = (fieldName) => {
        return touched[fieldName] && errors[fieldName];
    };

    // Show loading only when fetching data for editing
    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="animate-spin w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Loading service data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-6 top-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-teal-800 text-white hover:bg-teal-900 transition"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
                <div className="text-center mb-10 mt-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                        <span className="text-blue-600 font-semibold text-lg">
                            {isEditing ? 'Service Management' : 'Add New Service'}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        {isEditing ? 'Edit Service Details' : 'Create New Service'}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {isEditing 
                            ? 'Update the service details below.' 
                            : 'Fill in the details to create a new service.'
                        }
                    </p>
                </div>

                {/* General Error */}
                {errors.general && (
                    <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 border border-red-200">
                        {errors.general}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Service Type */}
                    <div>
                        <label className="block text-gray-900 font-medium mb-2">
                            Service Type *
                        </label>
                        <div className="relative">
                            <select
                                name="service_type"
                                value={formData.service_type}
                                onChange={handleChange}
                                onFocus={() => handleFocus('service_type')}
                                onBlur={handleBlur}
                                required
                                className={`w-full pl-4 pr-10 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 transition-all 
                                    focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none ${
                                    focused === 'service_type' ? 'bg-white' : ''
                                } ${getFieldError('service_type') ? 'border border-red-300' : ''}`}
                            >
                                <option value="">Select a service type</option>
                                <option value="transfer">Money Transfer</option>
                                <option value="payment">Bill Payment</option>
                                <option value="cash_out">Cash Out / Withdrawal</option>
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none">
                                <FileText size={20} className="text-gray-400" />
                            </div>
                        </div>
                        {getFieldError('service_type') && (
                            <p className="text-red-600 text-sm mt-2 font-medium">
                                {errors.service_type}
                            </p>
                        )}
                    </div>

                    {/* Transfer Speed */}
                    <div>
                        <label className="block text-gray-900 font-medium mb-2">
                            Transfer Speed *
                        </label>
                        <div className="relative">
                            <select
                                name="transfer_speed"
                                value={formData.transfer_speed}
                                onChange={handleChange}
                                onFocus={() => handleFocus('transfer_speed')}
                                onBlur={handleBlur}
                                required
                                className={`w-full pl-4 pr-10 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 transition-all 
                                    focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none ${
                                    focused === 'transfer_speed' ? 'bg-white' : ''
                                } ${getFieldError('transfer_speed') ? 'border border-red-300' : ''}`}
                            >
                                <option value="">Select transfer speed</option>
                                <option value="instant">Instant (Real-Time)</option>
                                <option value="same_day">Same Day</option>
                                <option value="1-3_days">1-3 Business Days</option>
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none">
                                <FileText size={20} className="text-gray-400" />
                            </div>
                        </div>
                        {getFieldError('transfer_speed') && (
                            <p className="text-red-600 text-sm mt-2 font-medium">
                                {errors.transfer_speed}
                            </p>
                        )}
                    </div>

                    {/* Fee Percentage */}
                    <div>
                        <label className="block text-gray-900 font-medium mb-2">
                            Fee Percentage (%) *
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="fee_percentage"
                                value={formData.fee_percentage}
                                onChange={handleChange}
                                onFocus={() => handleFocus('fee_percentage')}
                                onBlur={handleBlur}
                                step="0.01"
                                min="0"
                                max="100"
                                required
                                placeholder="e.g., 1.50"
                                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 transition-all 
                                    focus:ring-2 focus:ring-blue-500 focus:bg-white ${
                                    focused === 'fee_percentage' ? 'bg-white' : ''
                                } ${getFieldError('fee_percentage') ? 'border border-red-300' : ''}`}
                            />
                            <div className="absolute left-4 top-4 pointer-events-none">
                                <span className="text-gray-400 font-medium">%</span>
                            </div>
                        </div>
                        {getFieldError('fee_percentage') && (
                            <p className="text-red-600 text-sm mt-2 font-medium">
                                {errors.fee_percentage}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="animate-spin mr-2" size={20} />
                                {isEditing ? 'Saving Changes...' : 'Creating Service...'}
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <Save className="mr-2" size={20} />
                                {isEditing ? 'Save Changes' : 'Create Service'}
                            </span>
                        )}
                    </button>

                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={() => navigate('/services')}
                        className="w-full py-4 border border-gray-300 bg-teal-800 text-white font-semibold rounded-xl hover:bg-teal-900 transition flex items-center justify-center"
                    >
                        <Undo2 className="mr-2" size={18} />
                        Cancel
                    </button>
                </form>

                {/* Footer Note */}
                <p className="text-xs text-slate-500 text-center mt-8 pt-6 border-t border-gray-100">
                    {isEditing 
                        ? 'Changes will be applied immediately after saving.' 
                        : 'New services will be available for transactions immediately.'
                    }
                </p>
            </div>
        </div>
    );
};

export default ServiceFormPage;