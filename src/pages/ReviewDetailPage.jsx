import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchReview } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, User, AlertTriangle, Edit } from 'lucide-react';

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
            <div className="p-10 text-center text-gray-600">
                <div className="animate-pulse">Loading review details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center bg-red-50 text-red-700 rounded-xl m-4">
                <AlertTriangle size={24} className="mx-auto mb-2" />
                <p>{error}</p>
                <button onClick={() => navigate('/reviews')} className="mt-4 text-blue-600 hover:underline">
                    Go Back to Reviews
                </button>
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
                        size={24}
                        className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                ))}
                <span className="ml-3 text-xl font-bold text-gray-700">({rating}/5)</span>
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

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <button 
                    onClick={() => navigate('/reviews')} 
                    className="flex items-center text-gray-600 hover:text-gray-800 transition font-medium group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition" /> 
                    Back to Reviews
                </button>
                
                {canEdit && (
                    <button
                        onClick={() => navigate(`/reviews/edit/${review.review_id}`)}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition font-medium"
                    >
                        <Edit size={18} className="mr-2" />
                        Edit Review
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-400 p-8 text-white">
                        <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Customer Review
                            </h1>
                            <StarRating rating={review.rating} />
                        </div>
                        <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full font-semibold">
                            Review ID: {review.review_id}
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Review Content</h3>
                        <div className="bg-gray-50 rounded-xl p-6">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {review.review_text || 'No detailed review provided.'}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-xl font-bold text-black mb-4">Review Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">Review ID:</span>
                                <span className="font-semibold text-black">{review.review_id}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">User:</span>
                                <span className="font-semibold text-black">
                                    {review.user?.full_name || 'Unknown User'} (User #{review.user_id})
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">Created:</span>
                                <span className="font-semibold text-black">{formatDate(review.created_at)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">Last Updated:</span>
                                <span className="font-semibold text-black">{formatDate(review.updated_at)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">Rating:</span>
                                <span className="font-semibold text-black">{review.rating} out of 5 stars</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-black font-medium">Status:</span>
                                <span className="font-semibold text-green-600">Published</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetailPage;