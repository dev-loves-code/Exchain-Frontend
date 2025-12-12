import React, { useState, useEffect } from 'react';
import { CreditCard, Loader, AlertCircle, Download, Eye } from 'lucide-react';
import api from '../../utils/api';

const StripeTransactionsTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/payments/stripe-transactions');
      setTransactions(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === 'amount-high') {
      return b.amount - a.amount;
    } else if (sortBy === 'amount-low') {
      return a.amount - b.amount;
    }
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          {/* <Loader className="w-8 h-8 text-blue-600 animate-spin" /> */}
          <p className="mt-2 text-gray-600 font-medium">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Stripe Transactions
        </h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">
              Error loading transactions
            </p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {sortedTransactions.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No transactions found
          </h4>
          <p className="text-gray-600">
            {filter !== 'all'
              ? `No ${filter} transactions. Try changing the filter.`
              : 'Start by recharging your wallet or making a transfer.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTransactions.map((tx) => (
            <div
              key={tx.stripe_payment_id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                setSelectedTx(
                  selectedTx?.stripe_payment_id === tx.stripe_payment_id
                    ? null
                    : tx
                )
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-teal-800" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {tx.payment_type?.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(tx.created_at)}
                    </p>
                  </div>
                </div>

                <div className="text-right ml-2">
                  <p className="font-bold text-gray-900 text-lg">
                    {tx.currency.toUpperCase()} {tx.amount.toFixed(2)}
                  </p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(
                      tx.status
                    )}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>

              {selectedTx?.stripe_payment_id === tx.stripe_payment_id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Charge ID</p>
                      <p className="font-mono text-xs text-gray-900 break-all">
                        {tx.stripe_charge_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-mono text-xs text-gray-900">
                        {tx.stripe_payment_method_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="text-gray-900 capitalize">
                        {tx.payment_type?.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="text-gray-900">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {tx.description && (
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">
                        Description
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {tx.description}
                      </p>
                    </div>
                  )}

                  {tx.stripe_metadata &&
                    Object.keys(tx.stripe_metadata).length > 0 && (
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-sm text-gray-600 font-medium">
                          Metadata
                        </p>
                        <div className="mt-2 space-y-1 text-sm">
                          {Object.entries(tx.stripe_metadata).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between text-gray-900"
                              >
                                <span>{key}:</span>
                                <span className="font-mono">
                                  {String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StripeTransactionsTab;
