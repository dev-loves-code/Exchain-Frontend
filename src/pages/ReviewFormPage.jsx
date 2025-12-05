import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createReview, updateReview, fetchReview } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Save, Undo2, Star, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';

const ReviewFormPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const isEditing = !!id;

    const [formData, setFormData] = useState({
        rating: 0,
        review_text: '',
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditing);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [focused, setFocused] = useState(null);

    // Fetch review data for editing
    useEffect(() => {
        if (isEditing && token) {
            const loadReview = async () => {
                try {
                    const response = await fetchReview(token, id);
                    
                    if (response.success && response.data) {
                        setFormData({
                            rating: response.data.rating,
                            review_text: response.data.review_text || '',
                        });
                        setErrors({});
                    } else {
                        setErrors({ general: 'Review not found or failed to load.' });
                    }
                } catch (error) {
                    setErrors({ general: 'Failed to fetch review details.' });
                } finally {
                    setFetchLoading(false);
                }
            };
            
            loadReview();
        } else {
            setFetchLoading(false);
        }
    }, [id, isEditing, token]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.rating || formData.rating < 1) {
            newErrors.rating = 'Please select a rating';
        }

        return newErrors;
    };

    const handleRatingChange = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
        setTouched(prev => ({ ...prev, rating: true }));
        if (errors.rating) {
            setErrors(prev => ({ ...prev, rating: '' }));
        }
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
            rating: true,
            review_text: true,
        });

        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }
        
        setLoading(true);

        try {
            if (isEditing) {
                await updateReview(token, id, formData);
                navigate('/reviews?message=Review+successfully+updated&type=success');
            } else {
                await createReview(token, formData);
                navigate('/reviews?message=Review+successfully+created&type=success');
            }
        } catch (e) {
            setErrors({ general: e.message || 'An error occurred during submission.' });
            setLoading(false);
        }
    };

    const getFieldError = (fieldName) => {
        return touched[fieldName] && errors[fieldName];
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="animate-spin w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full mx-auto mb-4" />
                    <p className="text-gray-600">Loading review data...</p>
                </div>
            </div>
        );
    }

    const StarRatingInput = () => {
        const ratingText = {
            1: "Poor",
            2: "Fair", 
            3: "Good",
            4: "Very Good",
            5: "Excellent"
        };

        return (
            <div>
                <div className="flex space-x-3 justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-2 transition-all duration-200 transform hover:scale-110 active:scale-95"
                        >
                            <Star
                                size={40}
                                className={
                                    star <= (hoverRating || formData.rating) 
                                        ? "text-yellow-400 fill-current drop-shadow-lg" 
                                        : "text-gray-300"
                                }
                            />
                        </button>
                    ))}
                </div>
                {formData.rating > 0 && (
                    <div className="text-center mb-4">
                        <span className={`px-4 py-2 inline-flex text-sm leading-5 font-medium rounded-full ${
                            formData.rating === 5 ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                            formData.rating === 4 ? 'bg-green-100 text-green-800 border border-green-200' :
                            formData.rating === 3 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            formData.rating === 2 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            {formData.rating} Stars - {ratingText[formData.rating] || 'Rating'}
                        </span>
                    </div>
                )}
            </div>
        );
    };

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
                            {isEditing ? 'Edit Review' : 'Share Your Feedback'}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        {isEditing ? 'Update Your Review' : 'Write a Review'}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {isEditing 
                            ? 'Update your rating and feedback.' 
                            : 'Help us improve by sharing your experience.'
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
                    {/* Rating Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                        <label className="block text-gray-900 font-medium mb-4 text-center text-lg">
                            Your Rating *
                        </label>
                        <StarRatingInput />
                        {getFieldError('rating') && (
                            <p className="text-red-600 text-sm mt-3 text-center font-medium">
                                {errors.rating}
                            </p>
                        )}
                    </div>

                    {/* Review Text Section */}
                    <div>
                        <label className="block text-gray-900 font-medium mb-2">
                            Your Review <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <textarea
                                name="review_text"
                                value={formData.review_text}
                                onChange={handleChange}
                                onFocus={() => handleFocus('review_text')}
                                onBlur={handleBlur}
                                rows={6}
                                placeholder="Share your detailed experience with our service (optional)..."
                                className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 transition-all 
                                    focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none ${
                                    focused === 'review_text' ? 'bg-white' : ''
                                } ${getFieldError('review_text') ? 'border border-red-300' : ''}`}
                            />
                            <div className="absolute left-4 top-4">
                                <MessageSquare size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            {getFieldError('review_text') && (
                                <p className="text-red-600 text-sm font-medium">
                                    {errors.review_text}
                                </p>
                            )}
                            <p className="text-sm text-gray-500 ml-auto">
                                {formData.review_text.length} characters
                            </p>
                        </div>
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
                                {isEditing ? 'Saving Changes...' : 'Submitting Review...'}
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <Save className="mr-2" size={20} />
                                {isEditing ? 'Save Changes' : 'Submit Review'}
                            </span>
                        )}
                    </button>

                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={() => navigate('/reviews')}
                        className="w-full py-4 border border-gray-300 bg-teal-800 text-white font-semibold rounded-xl hover:bg-teal-900 transition flex items-center justify-center"
                    >
                        <Undo2 className="mr-2" size={18} />
                        Cancel
                    </button>
                </form>

                {/* Footer Note */}
                <p className="text-xs text-slate-500 text-center mt-8 pt-6 border-t border-gray-100">
                    {isEditing 
                        ? 'Your updated review will replace the previous version.' 
                        : 'Your review helps other users make informed decisions.'
                    }
                </p>
            </div>
        </div>
    );
};

export default ReviewFormPage;