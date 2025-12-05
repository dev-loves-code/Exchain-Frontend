import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Trash2, Edit, Eye, PlusCircle, Loader2, ArrowLeft, Sparkles, FilterX, ArrowUpDown, Filter } from 'lucide-react';
import { fetchReviews, deleteReview } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MessageBar = ({ message, type }) => {
    if (!message) return null;
    const baseClasses = "p-4 rounded-xl font-medium shadow-md transition-all duration-300 border";
    const colorClasses = type === 'error' 
        ? 'bg-red-100 text-red-700 border-red-200' 
        : 'bg-green-100 text-green-700 border-green-200';
    return <div className={`${baseClasses} ${colorClasses} mb-6`}>{message}</div>;
};

const ReviewListPage = () => {
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [filters, setFilters] = useState({ 
        rating: '', 
        sort: 'review_id' 
    });
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
            const apiFilters = {};
            if (filters.rating) apiFilters.rating = filters.rating;
            
            const response = await fetchReviews(
                token, 
                apiFilters, 
                page, 
                pagination.perPage, 
                filters.sort
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
    }, [token, filters, pagination.perPage]);

    useEffect(() => {
        if (token) {
            loadReviews(1);
        }
    }, [token, filters.rating, filters.sort, loadReviews]);

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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFilters({ 
            rating: '', 
            sort: 'review_id' 
        });
    };

    const StarRating = ({ rating, showNumber = false }) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={18}
                        className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                ))}
                {showNumber && <span className="ml-2 text-sm font-medium text-gray-900">({rating}/5)</span>}
            </div>
        );
    };

    const ReviewRow = ({ review }) => {
        const canEditDelete = !isAdmin && review.user_id === user?.user_id;
        const ratingColor = {
            1: 'bg-red-100 text-red-800 border border-red-200',
            2: 'bg-orange-100 text-orange-800 border border-orange-200',
            3: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            4: 'bg-green-100 text-green-800 border border-green-200',
            5: 'bg-teal-100 text-teal-800 border border-teal-200',
        };

        return (
            <tr key={review.review_id} className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900 border-r border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">#{review.review_id}</span>
                        </div>
                    </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap border-r border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 inline-flex text-sm leading-5 font-medium rounded-full ${ratingColor[review.rating] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                            {review.rating} Stars
                        </span>
                        <StarRating rating={review.rating} />
                    </div>
                </td>
                <td className="px-8 py-5 text-gray-700 border-r border-gray-100">
                    <div className="max-w-md">
                        <p className="text-sm line-clamp-2">{review.review_text || 'No review text provided'}</p>
                    </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700 border-r border-gray-100">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3">
                        <p className="font-semibold text-gray-900">{review.user?.full_name || 'Unknown User'}</p>
                        <p className="text-xs text-gray-500 mt-1">User #{review.user_id}</p>
                    </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-700">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3">
                        <p className="font-semibold text-gray-900">{new Date(review.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        })}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(review.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                        <Link 
                            to={`/reviews/${review.review_id}`} 
                            className="p-3 text-gray-500 hover:text-blue-600 transition duration-200 rounded-xl hover:bg-blue-50 border border-gray-200 hover:border-blue-300" 
                            title="View Details"
                        >
                            <Eye size={18} />
                        </Link>
                        
                        {canEditDelete && (
                            <>
                                <Link 
                                    to={`/reviews/edit/${review.review_id}`} 
                                    className="p-3 text-gray-500 hover:text-yellow-600 transition duration-200 rounded-xl hover:bg-yellow-50 border border-gray-200 hover:border-yellow-300" 
                                    title="Edit Review"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button 
                                    onClick={() => handleDelete(review.review_id)} 
                                    className="p-3 text-gray-500 hover:text-red-600 transition duration-200 rounded-xl hover:bg-red-50 border border-gray-200 hover:border-red-300" 
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
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-5 bg-gray-50 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3 sm:mb-0">
                    Showing <span className="font-semibold text-gray-900">{startItem}</span> to <span className="font-semibold text-gray-900">{endItem}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span> reviews
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

    const hasActiveFilters = filters.rating;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
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
                        <span className="text-blue-600 font-semibold text-lg">Review Management</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        Customer Reviews
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Read and manage customer feedback and ratings
                    </p>
                </div>

                {/* Status Message */}
                <MessageBar message={status.message} type={status.type} />

                {/* Main Content Card */}
                <div className="w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
                    {/* Card Header with Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">All Reviews</h2>
                            <p className="text-slate-500">Browse and manage customer feedback</p>
                        </div>
                        {isUser && (
                            <Link 
                                to="/reviews/add" 
                                className="flex items-center bg-teal-800 hover:bg-teal-900 text-white px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mt-4 md:mt-0"
                            >
                                <PlusCircle size={18} className="mr-2" /> Write a Review
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-900 font-medium mb-2">Rating Filter</label>
                                    <div className="relative">
                                        <select
                                            name="rating"
                                            value={filters.rating}
                                            onChange={handleFilterChange}
                                            className="w-full pl-4 pr-10 py-3 bg-white border-0 rounded-xl text-gray-900 placeholder-gray-400 transition-all focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none"
                                        >
                                            <option value="">All Ratings</option>
                                            <option value="5">⭐ 5 Stars</option>
                                            <option value="4">⭐ 4 Stars</option>
                                            <option value="3">⭐ 3 Stars</option>
                                            <option value="2">⭐ 2 Stars</option>
                                            <option value="1">⭐ 1 Star</option>
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
                                            <option value="review_id">ID (Ascending)</option>
                                            <option value="-review_id">ID (Descending)</option>
                                            <option value="rating">Rating (Low to High)</option>
                                            <option value="-rating">Rating (High to Low)</option>
                                            <option value="created_at">Date (Oldest First)</option>
                                            <option value="-created_at">Date (Newest First)</option>
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none">
                                            <ArrowUpDown size={18} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Table */}
                    {loading ? (
                        <div className="py-16 text-center">
                            <Loader2 className="animate-spin inline-block w-12 h-12 border-4 border-t-blue-600 border-gray-200 rounded-full mb-4" />
                            <p className="text-gray-600">Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="mb-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto">
                                    <Star className="w-12 h-12 text-gray-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                {hasActiveFilters 
                                    ? "No reviews match your current filters. Try adjusting your search criteria." 
                                    : "There are no reviews in the system yet."
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
                                {isUser && !hasActiveFilters && (
                                    <Link 
                                        to="/reviews/add" 
                                        className="px-6 py-3 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02]"
                                    >
                                        <PlusCircle size={18} className="inline mr-2" /> 
                                        Write the First Review
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
                                            <th className="px-8 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-200">Rating</th>
                                            <th className="px-8 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-200">Review</th>
                                            <th className="px-8 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-200">User</th>
                                            <th className="px-8 py-5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Date</th>
                                            <th className="px-8 py-5 text-right text-sm font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
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

                    {/* Footer Note */}
                    <p className="text-xs text-slate-500 text-center mt-8 pt-6 border-t border-gray-100">
                        {isUser ? 'You can only edit or delete your own reviews.' : 'Admins can view all reviews.'}
                    </p>
                </div>
            </div>
        </div>
    );
};   

export default ReviewListPage;