import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchReview } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, User, AlertTriangle, Edit, Sparkles, MessageSquare, Tag } from 'lucide-react';

const ReviewDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = localStorage.getItem('token');

    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isAdmin = user?.role === 'admin';
    const canEdit = !isAdmin && review?.user_id === user?.user_id;

    useEffect(() => {
        const loadReview = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetchReview(token, id);
                
                if (response.success && response.data) {
                    setReview(response.data);
                } else {
                    setError('Review not found or failed to load.');
                }
            } catch (e) {
                setError('Failed to fetch review details. Please check the ID.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            loadReview();
        }
    }, [id, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading review details...</p>
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
                        onClick={() => navigate('/reviews')} 
                        className="py-3 px-6 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-xl"
                    >
                        Back to Reviews
                    </button>
                </div>
            </div>
        );
    }

    if (!review) return null;

    const StarRating = ({ rating }) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={28}
                        className={star <= rating ? "text-yellow-400 fill-current drop-shadow-sm" : "text-gray-300"}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to get rating badge styling
    const getRatingBadge = (rating) => {
        const badgeStyles = {
            5: 'bg-gradient-to-r from-teal-100 to-teal-50 text-teal-800 border border-teal-200',
            4: 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200',
            3: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200',
            2: 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 border border-orange-200',
            1: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200',
        };
        return badgeStyles[rating] || 'bg-gray-100 text-gray-800 border border-gray-200';
    };

    const ratingText = {
        1: "Poor",
        2: "Fair", 
        3: "Good",
        4: "Very Good",
        5: "Excellent"
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
                        <span className="text-blue-600 font-semibold text-lg">Review Details</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        Customer Feedback
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Detailed review information and rating
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 overflow-hidden">
                    {/* Card Header with Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Review Details</h2>
                            <p className="text-slate-500">Review ID: #{review.review_id}</p>
                        </div>
                        {canEdit && (
                            <button
                                onClick={() => navigate(`/reviews/edit/${review.review_id}`)}
                                className="flex items-center bg-teal-800 hover:bg-teal-900 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mt-4 md:mt-0"
                            >
                                <Edit size={18} className="mr-2" />
                                Edit Review
                            </button>
                        )}
                    </div>

                    {/* Rating Badge */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <span className={`px-4 py-2 inline-flex items-center text-sm leading-5 font-medium rounded-full ${getRatingBadge(review.rating)}`}>
                            <Star size={16} className="mr-2" />
                            {review.rating} Stars - {ratingText[review.rating] || 'Rating'}
                        </span>
                        <StarRating rating={review.rating} />
                    </div>

                    {/* Review Content Section */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Review Content</h3>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {review.review_text || 'No detailed review provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* User Information Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mr-4">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Reviewer</h3>
                                    <p className="text-sm text-gray-500">User information</p>
                                </div>
                            </div>
                            <div className="ml-16">
                                <p className="text-xl font-bold text-gray-900">{review.user?.full_name || 'Unknown User'}</p>
                                <p className="text-sm text-gray-500 mt-1">User #{review.user_id}</p>
                            </div>
                        </div>

                        {/* Date Information Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center mr-4">
                                    <Calendar size={24} className="text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
                                    <p className="text-sm text-gray-500">Review dates</p>
                                </div>
                            </div>
                            <div className="ml-16 space-y-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Created</p>
                                    <p className="font-semibold text-gray-900">{formatDate(review.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Last Updated</p>
                                    <p className="font-semibold text-gray-900">{formatDate(review.updated_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Rating Details Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl flex items-center justify-center mr-4">
                                    <Star size={24} className="text-yellow-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Rating Details</h3>
                                    <p className="text-sm text-gray-500">Performance score</p>
                                </div>
                            </div>
                            <div className="ml-16">
                                <div className="flex items-center mb-2">
                                    <StarRating rating={review.rating} />
                                    <span className="ml-3 text-xl font-bold text-gray-900">({review.rating}/5)</span>
                                </div>
                                <p className="text-sm text-gray-500">Overall satisfaction rating</p>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mr-4">
                                    <Tag size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                                    <p className="text-sm text-gray-500">Review visibility</p>
                                </div>
                            </div>
                            <div className="ml-16">
                                <span className="px-4 py-2 inline-flex text-sm leading-5 font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                                    Published & Visible
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Review Information Table */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Information</h3>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">Review ID:</span>
                                    <span className="font-semibold text-gray-900">#{review.review_id}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">User ID:</span>
                                    <span className="font-semibold text-gray-900">#{review.user_id}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">Created Date:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(review.created_at)}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">Last Updated:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(review.updated_at)}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">Rating Score:</span>
                                    <span className="font-semibold text-gray-900">{review.rating} out of 5 stars</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                    <span className="text-gray-700 font-medium">Review Length:</span>
                                    <span className="font-semibold text-gray-900">{review.review_text?.length || 0} characters</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-start">
                            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Review Information</h4>
                                <p className="text-sm text-gray-700">
                                    This review is publicly visible. {canEdit ? 'You can edit or delete your own review.' : 'Only the reviewer can edit or delete this review.'} 
                                    All reviews help improve our service quality and customer experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-xs text-slate-500 text-center">
                    Review details are updated in real-time. Last fetched: {new Date().toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
};

export default ReviewDetailPage;