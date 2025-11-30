import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createReview, updateReview, fetchReview } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Save, Undo2, Star } from 'lucide-react';

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

    const title = isEditing ? 'Edit Review' : 'Write a Review';

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
        
        const newErrors = validateForm();
        setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }));
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
            <div className="p-10 text-center">
                <Loader2 className="animate-spin mx-auto" size={32} /> 
                Loading Review Data...
            </div>
        );
    }

    const StarRatingInput = () => {
        return (
            <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition transform hover:scale-110"
                    >
                        <Star
                            size={32}
                            className={
                                star <= (hoverRating || formData.rating) 
                                    ? "text-yellow-400 fill-current" 
                                    : "text-gray-300"
                            }
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">{title}</h1>

            {errors.general && (
                <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4 font-medium shadow-md">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                
                {/* Rating */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        Your Rating *
                    </label>
                    <StarRatingInput />
                    {getFieldError('rating') && (
                        <p className="text-red-600 text-sm mt-2 font-medium">
                            {errors.rating}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                        Selected: {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'No rating selected'}
                    </p>
                </div>

                {/* Review Text - Now Optional */}
                <div>
                    <label htmlFor="review_text" className="block text-lg font-semibold text-gray-700 mb-2">
                        Your Review <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                    </label>
                    <textarea
                        id="review_text"
                        name="review_text"
                        value={formData.review_text}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={6}
                        placeholder="Share your experience with our service (optional)..."
                        className={`w-full border rounded-xl p-4 focus:ring-blue-500 focus:border-blue-500 transition resize-none ${
                            getFieldError('review_text') 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300'
                        }`}
                    />
                    {getFieldError('review_text') && (
                        <p className="text-red-600 text-sm mt-2 font-medium">
                            {errors.review_text}
                        </p>
                    )}
                
                </div>
<p className="text-sm text-gray-500 mt-1">
    {formData.review_text.length} characters
</p>
                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/reviews')}
                        className="flex-1 flex items-center justify-center border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        <Undo2 size={20} className="mr-2" /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 transition"
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin mr-2" />
                        ) : (
                            <Save size={20} className="mr-2" />
                        )}
                        {isEditing ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Submitting...' : 'Submit Review')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewFormPage;