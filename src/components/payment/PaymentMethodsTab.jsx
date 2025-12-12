import React, { useState } from 'react';
import { CreditCard, Loader, AlertCircle, Trash2, Check } from 'lucide-react';

const PaymentMethodsTab = ({ methods, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (methodId) => {
    if (
      !window.confirm('Are you sure you want to delete this payment method?')
    ) {
      return;
    }

    setDeletingId(methodId);
    setError('');

    try {
      setError('Delete functionality to be implemented with Stripe API');
    } catch (err) {
      setError(err.message || 'Failed to delete payment method');
    } finally {
      setDeletingId(null);
    }
  };

  const getCardBrand = (brand) => {
    const brandMap = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      discover: 'Discover',
    };
    return brandMap[brand?.toLowerCase()] || brand;
  };

  const getCardIcon = (brand) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
    };
    return icons[brand?.toLowerCase()] || '💳';
  };

  const isExpired = (expMonth, expYear) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="mt-2 text-gray-600 font-medium">
            Loading payment methods...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Saved Payment Methods
        </h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {methods.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No payment methods
          </h4>
          <p className="text-gray-600">
            Add a payment method by completing your first wallet recharge
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {methods.map((method) => {
            const expired = isExpired(method.exp_month, method.exp_year);
            return (
              <div
                key={method.payment_method_id}
                className={`p-6 rounded-lg border-2 transition-all `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {getCardIcon(method.card_brand)}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {getCardBrand(method.card_brand)}
                      </p>
                      <p className="text-xl font-bold text-gray-900 font-mono">
                        •••• {method.card_last_four}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {expired && (
                      <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold ml-2">
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Expiration</p>
                    <p
                      className={`font-semibold mt-1 ${
                        expired ? 'text-red-600' : 'text-gray-900'
                      }`}
                    >
                      {String(method.exp_month).padStart(2, '0')}/
                      {String(method.exp_year).slice(-2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Card Type</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {getCardBrand(method.card_brand)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Last Four</p>
                    <p className="font-mono font-semibold text-gray-900 mt-1">
                      {method.card_last_four}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {expired ? 'Expired' : 'Active'}
                    </p>
                  </div>
                </div>

                {expired && (
                  <div className="bg-red-100 border border-red-300 rounded p-3 mb-4 text-sm text-red-700">
                    This card has expired and cannot be used for new
                    transactions.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsTab;
