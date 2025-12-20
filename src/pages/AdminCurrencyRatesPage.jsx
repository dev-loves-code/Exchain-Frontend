import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit,
  Search,
  TrendingUp,
  AlertCircle,
  Loader,
  Check,
  X,
  Filter,
  Eye,
} from 'lucide-react';
import {
  getCurrencyRates,
  addCurrencyRate,
  updateCurrencyRate,
  deleteCurrencyRate,
} from '../api/currencyRates';
import SuccessPopup from '../components/SuccessPopup';

const AdminCurrencyRatesPage = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showOnlyAdmin, setShowOnlyAdmin] = useState(false);
  const [sortByDate, setSortByDate] = useState(true);
  const [formData, setFormData] = useState({
    from_currency: '',
    to_currency: '',
    exchange_rate: '',
  });

  useEffect(() => {
    loadRates();
  }, [showOnlyAdmin]);

  const loadRates = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCurrencyRates(showOnlyAdmin);
      setRates(response.rates || []);
    } catch (err) {
      setError(err.message || 'Failed to load currency rates');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.from_currency.trim()) {
      setError('Please enter source currency');
      return false;
    }
    if (!formData.to_currency.trim()) {
      setError('Please enter target currency');
      return false;
    }
    if (!formData.exchange_rate || parseFloat(formData.exchange_rate) <= 0) {
      setError('Please enter a valid exchange rate');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        from_currency: formData.from_currency.trim().toUpperCase(),
        to_currency: formData.to_currency.trim().toUpperCase(),
        exchange_rate: parseFloat(formData.exchange_rate),
      };

      if (editingId) {
        await updateCurrencyRate(editingId, payload);
        setSuccessMessage(
          'Currency rate updated successfully! It now belongs to you.'
        );
      } else {
        await addCurrencyRate(payload);
        setSuccessMessage('Currency rate created successfully!');
      }

      setFormData({
        from_currency: '',
        to_currency: '',
        exchange_rate: '',
      });
      setEditingId(null);
      setShowForm(false);
      await loadRates();
    } catch (err) {
      setError(err.message || 'Failed to save currency rate');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rate) => {
    setFormData({
      from_currency: rate.from_currency,
      to_currency: rate.to_currency,
      exchange_rate: rate.exchange_rate,
    });
    setEditingId(rate.rate_id);
    setShowForm(true);
  };

  const handleDelete = async (id, rateInfo) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${rateInfo.from_currency}→${rateInfo.to_currency}?`
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      await deleteCurrencyRate(id);
      setSuccessMessage('Currency rate deleted successfully!');
      await loadRates();
    } catch (err) {
      setError(err.message || 'Failed to delete currency rate');
      console.error('Delete error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      from_currency: '',
      to_currency: '',
      exchange_rate: '',
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const filteredRates = rates.filter((rate) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      rate.from_currency.toLowerCase().includes(searchLower) ||
      rate.to_currency.toLowerCase().includes(searchLower)
    );
  });

  const sortedRates = sortByDate
    ? [...filteredRates].sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
    : filteredRates;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-8 h-8 text-teal-600" />
                Currency Exchange Rates
              </h1>
              <p className="text-gray-600 mt-2">
                Manage exchange rates - Create, edit, and organize rates
              </p>
            </div>
            <button
              onClick={() => (showForm ? handleCancel() : setShowForm(true))}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              {showForm && !editingId ? 'Cancel' : 'Add Rate'}
            </button>
          </div>
        </div>

        {successMessage && (
          <SuccessPopup
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-900 font-semibold">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {showForm && (
          <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Currency Rate' : 'Add New Currency Rate'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From Currency
                  </label>
                  <input
                    type="text"
                    name="from_currency"
                    value={formData.from_currency}
                    onChange={handleInputChange}
                    placeholder="e.g., USD"
                    maxLength="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase text-sm"
                    disabled={submitting || editingId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    To Currency
                  </label>
                  <input
                    type="text"
                    name="to_currency"
                    value={formData.to_currency}
                    onChange={handleInputChange}
                    placeholder="e.g., EUR"
                    maxLength="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase text-sm"
                    disabled={submitting || editingId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Exchange Rate
                  </label>
                  <input
                    type="number"
                    name="exchange_rate"
                    value={formData.exchange_rate}
                    onChange={handleInputChange}
                    placeholder="e.g., 1.15"
                    step="0.0001"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2 px-4 rounded-lg hover:from-teal-700 hover:to-teal-800 disabled:from-gray-400 disabled:to-gray-400 font-medium transition-all duration-200"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingId ? 'Update Rate' : 'Add Rate'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            {/* <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by currency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div> */}

            <button
              onClick={() => setSortByDate(!sortByDate)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border whitespace-nowrap ${
                sortByDate
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
              title="Sort by latest update date"
            >
              <TrendingUp className="w-4 h-4" />
              {sortByDate ? 'Date ↓' : 'Date'}
            </button>

            <button
              onClick={() => setShowOnlyAdmin(!showOnlyAdmin)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border whitespace-nowrap ${
                showOnlyAdmin
                  ? 'bg-teal-50 border-teal-300 text-teal-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              {showOnlyAdmin ? 'My Rates' : 'All Rates'}
            </button>
          </div>
        )}

        {!showForm && (
          <>
            {sortedRates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedRates.map((rate) => (
                  <div
                    key={rate.rate_id}
                    className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-teal-300 hover:shadow-lg transition-all duration-300"
                  >
                    {rate.by_admin && <div className="mb-3"></div> ? (
                      <span className="mb-3 inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold border border-teal-200">
                        <Check className="w-3 h-3" />
                        My Rate
                      </span>
                    ) : (
                      <span className="mb-3 inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold border border-teal-200">
                        <Check className="w-3 h-3" />
                        API Rate
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-teal-700 text-sm">
                            {rate.from_currency}
                          </span>
                        </div>
                        <div className="text-2xl text-gray-400">→</div>
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-teal-700 text-sm">
                            {rate.to_currency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Exchange Rate
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {parseFloat(rate.exchange_rate).toFixed(4)}
                      </p>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                      1 {rate.from_currency} ={' '}
                      {parseFloat(rate.exchange_rate).toFixed(4)}{' '}
                      {rate.to_currency}
                    </p>

                    <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                      <p className="text-xs text-gray-500">
                        {rate.by_admin
                          ? 'Created by you'
                          : 'From API • Can be adopted'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created:{' '}
                        {new Date(rate.created_at).toLocaleDateString()}{' '}
                        {new Date(rate.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        <br />
                        Updated:{' '}
                        {new Date(rate.updated_at).toLocaleDateString()}{' '}
                        {new Date(rate.updated_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(rate)}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50"
                      >
                        <Edit className="w-4 h-4" />
                        {rate.by_admin ? 'Edit' : 'Adopt'}
                      </button>
                      <button
                        onClick={() => handleDelete(rate.rate_id, rate)}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  {searchTerm
                    ? 'No currency rates found'
                    : showOnlyAdmin
                      ? 'No rates created yet'
                      : 'No currency rates available'}
                </p>
                <p className="text-gray-500 text-sm">
                  {searchTerm
                    ? 'Try adjusting your search'
                    : showOnlyAdmin
                      ? 'Click "Add Rate" to create your first currency exchange rate'
                      : 'Exchange rates will appear here once API fetches them'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCurrencyRatesPage;
