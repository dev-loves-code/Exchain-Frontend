import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Trash2, Edit, Eye, PlusCircle, Loader2 } from 'lucide-react';
import { fetchReviews, deleteReview } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MessageBar = ({ message, type }) => {
    if (!message) return null;
    const baseClasses = "p-4 rounded-xl font-medium shadow-md transition-all duration-300";
    const colorClasses = type === 'error' 
        ? 'bg-red-100 text-red-700 border-red-200' 
        : 'bg-green-100 text-green-700 border-green-200';
    return <div className={`${baseClasses} ${colorClasses} mb-6 border`}>{message}</div>;
};

const ReviewListPage = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [pagination, setPagination] = useState({ 
        currentPage: 1, 
        lastPage: 1, 
        total: 0, 
        perPage: 10 
    });

    const isAdmin = user?.role === 'admin';
    const isUser = user?.role === 'user';

    const loadReviews = useCallback(async (page = 1) => {
        if (!token) {
            setStatus({ message: 'Authentication required. Please log in.', type: 'error' });
            setLoading(false);
            return;
        }

        setLoading(true);
        setStatus({ message: '', type: '' });

        try {
            
            const response = await fetchReviews(
                token, 
                {}, // No filters
                page, 
                pagination.perPage, 
            );
            
            
            let reviewsArray = [];
            let paginationData = {
                currentPage: page,
                lastPage: 1,
                total: 0,
                perPage: pagination.perPage,
            };

            if (response && response.success && response.data && Array.isArray(response.data.data)) {
                reviewsArray = response.data.data;
                paginationData = {
                    currentPage: response.data.current_page || page,
                    lastPage: response.data.last_page || 1,
                    total: response.data.total || 0,
                    perPage: response.data.per_page || pagination.perPage,
                };
            } else {
                reviewsArray = [];
            }
            
            
            setReviews(reviewsArray);
            setPagination(paginationData);
            
        } catch (error) {
            setStatus({ 
                message: error.message || 'Failed to fetch reviews from server.', 
                type: 'error' 
            });
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [token, pagination.perPage]);

    useEffect(() => {
        if (token) {
            loadReviews(1);
        }
    }, [token, loadReviews]);

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
            return;
        }

        try {
            const result = await deleteReview(token, reviewId);
            
            if (result.success) {
                setStatus({ 
                    message: 'Review successfully deleted.', 
                    type: 'success' 
                });
                loadReviews(pagination.currentPage);
            } else {
                setStatus({ 
                    message: 'Deletion failed.', 
                    type: 'error' 
                });
            }
            
        } catch (error) {
            setStatus({ 
                message: error.message || 'Deletion failed. Please try again.', 
                type: 'error' 
            });
        }
    };

    const handlePageChange = (newPage) => {
        loadReviews(newPage);
    };

    const StarRating = ({ rating }) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={18}
                        className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                ))}
                <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
            </div>
        );
    };

    const ReviewRow = ({ review }) => {
        const canEditDelete = !isAdmin && review.user_id === user?.user_id;

        return (
            <tr key={review.review_id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {review.review_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <StarRating rating={review.rating} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                    {review.review_text || 'No review text provided'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {review.user?.full_name ||'Unkown User' } (User #{review.user_id})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(review.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                        <Link 
                            to={`/reviews/${review.review_id}`} 
                            className="p-2 text-gray-500 hover:text-blue-600 transition duration-150 rounded-full hover:bg-blue-50" 
                            title="View Details"
                        >
                            <Eye size={18} />
                        </Link>
                        
                        {canEditDelete && (
                            <>
                                <Link 
                                    to={`/reviews/edit/${review.review_id}`} 
                                    className="p-2 text-gray-500 hover:text-yellow-600 transition duration-150 rounded-full hover:bg-yellow-50" 
                                    title="Edit Review"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button 
                                    onClick={() => handleDelete(review.review_id)} 
                                    className="p-2 text-gray-500 hover:text-red-600 transition duration-150 rounded-full hover:bg-red-50" 
                                    title="Delete Review"
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

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900">
                    Customer Reviews
                </h1>
                {isUser && (
                    <Link 
                        to="/reviews/add" 
                        className="flex items-center bg-gradient-to-r from-green-500 to-teal-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]"
                    >
                        <PlusCircle size={20} className="mr-2" /> Write a Review
                    </Link>
                )}
            </div>

            <MessageBar message={status.message} type={status.type} />

            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        <Loader2 className="animate-spin inline-block w-8 h-8 border-4 border-t-blue-600 border-gray-200 rounded-full mb-3" />
                        <p>Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        <div className="mb-4">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">No reviews found</p>
                        <p className="text-gray-600 mb-6">
                            There are no reviews in the system yet.
                        </p>
                        {isUser && (
                            <Link 
                                to="/reviews/add" 
                                className="inline-flex items-center bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] mt-4"
                            >
                                <PlusCircle size={18} className="mr-2" /> 
                                Write the First Review
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Review</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reviews.map(review => (
                                        <ReviewRow key={review.review_id} review={review} />
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

export default ReviewListPage;