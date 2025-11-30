import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createService, updateService, fetchService } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Save, Undo2 } from 'lucide-react';

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
                    
                    // FIXED: Check for response.service_id instead of response.success
                    if (response && response.service_id) {
                        console.log('🎯 Setting form data with:', response);
                        setFormData({
                            service_type: response.service_type || '',
                            transfer_speed: response.transfer_speed || '',
                            fee_percentage: response.fee_percentage 
                                ? String(response.fee_percentage) 
                                : '',
                        });
                        // Clear any previous errors
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

    // Log formData changes
    useEffect(() => {
        console.log('📝 FormData updated:', formData);
    }, [formData]);

    // Log error changes
    useEffect(() => {
        console.log('🚨 Errors updated:', errors);
    }, [errors]);

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
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Validate individual field on blur
        const newErrors = validateForm();
        setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        setTouched({
            service_type: true,
            transfer_speed: true,
            fee_percentage: true,
        });

        // Validate all fields
        const newErrors = validateForm();
        setErrors(newErrors);

        // If there are errors, don't submit
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
                // Redirect with success message
                navigate('/services?message=Service+successfully+updated&type=success');
            } else {
                await createService(token, dataToSend);
                // Redirect with success message
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
        console.log('⏳ Rendering loading state...');
        return (
            <div className="p-10 text-center">
                <Loader2 className="animate-spin mx-auto" size={32} /> 
                Loading Service Data...
            </div>
        );
    }

    console.log('🎨 Rendering form with data:', formData);
    console.log('🎨 Current errors:', errors);
console.log('🎨 Rendering form with data:', formData);
console.log('🎨 Current errors:', errors);

// Add this debug section
console.log('🔍 FORM DEBUG:');
console.log('  - service_type value:', formData.service_type);
console.log('  - transfer_speed value:', formData.transfer_speed);
console.log('  - fee_percentage value:', formData.fee_percentage);
console.log('  - isEditing:', isEditing);
console.log('  - fetchLoading:', fetchLoading);

    // ... your existing JSX
    return (
        <div className="p-4 md:p-8 max-w-xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                {isEditing ? 'Edit Service' : 'Add New Service'}
            </h1>

            {errors.general && (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4 font-medium shadow-md">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                
                {/* Service Type - Now shows old value when editing */}
                <div>
                    <label htmlFor="service_type" className="block text-lg font-semibold text-gray-700 mb-2">
                        Service Type *
                    </label>
                    <select
                        id="service_type"
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full border rounded-xl p-4 focus:ring-blue-500 focus:border-blue-500 appearance-none transition ${
                            getFieldError('service_type') 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 bg-black'
                        }`}
                    >
                        <option value="">Select a service type</option>
                        <option value="transfer">Money Transfer</option>
                        <option value="payment">Bill Payment</option>
                        <option value="cash_out">Cash Out / Withdrawal</option>
                    </select>
                    {getFieldError('service_type') && (
                        <p className="text-red-600 text-sm mt-2 font-medium">
                            {errors.service_type}
                        </p>
                    )}
                </div>

                {/* Transfer Speed - Now shows old value when editing */}
                <div>
                    <label htmlFor="transfer_speed" className="block text-lg font-semibold text-gray-700 mb-2">
                        Transfer Speed *
                    </label>
                    <select
                        id="transfer_speed"
                        name="transfer_speed"
                        value={formData.transfer_speed}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full border rounded-xl p-4 focus:ring-blue-500 focus:border-blue-500 appearance-none transition ${
                            getFieldError('transfer_speed') 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 bg-black'
                        }`}
                    >
                        <option value="">Select transfer speed</option>
                        <option value="instant">Instant (Real-Time)</option>
                        <option value="same_day">Same Day</option>
                        <option value="1-3_days">1-3 Business Days</option>
                    </select>
                    {getFieldError('transfer_speed') && (
                        <p className="text-red-600 text-sm mt-2 font-medium">
                            {errors.transfer_speed}
                        </p>
                    )}
                </div>

                {/* Fee Percentage - Now shows old value when editing */}
                <div>
                    <label htmlFor="fee_percentage" className="block text-lg font-semibold text-gray-700 mb-2">
                        Fee Percentage (%) *
                    </label>
                    <input
                        type="number"
                        id="fee_percentage"
                        name="fee_percentage"
                        value={formData.fee_percentage}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        step="0.01"
                        min="0"
                        max="100"
                        required
                        placeholder="e.g., 1.50"
                        className={`w-full border rounded-xl p-4 focus:ring-blue-500 focus:border-blue-500 text-xl font-mono transition ${
                            getFieldError('fee_percentage') 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 bg-black'
                        }`}
                    />
                    {getFieldError('fee_percentage') && (
                        <p className="text-red-600 text-sm mt-2 font-medium">
                            {errors.fee_percentage}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/services')}
                        className="flex-1 flex items-center justify-center border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        <Undo2 size={20} className="mr-2" /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || fetchLoading}
                        className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition"
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin mr-2" />
                        ) : (
                            <Save size={20} className="mr-2" />
                        )}
                        {isEditing ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Creating...' : 'Create Service')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceFormPage;