import React, { useState } from 'react';
import { Plus, X, AlertCircle, Loader } from 'lucide-react';
import { rechargeWallet } from '../../api/wallet';

const RechargeWalletModal = ({ wallets, onClose, onSuccess }) => {
  const [selectedWallet, setSelectedWallet] = useState(wallets[0] || null);
  const [amount, setAmount] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedWallet) {
      setError('Please select a wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!paymentMethodId) {
      setError('Please select a payment method');
      return;
    }

    setLoading(true);

    try {
      const result = await rechargeWallet({
        amount: parseFloat(amount),
        payment_method_id: paymentMethodId,
        wallet_id: selectedWallet.wallet_id,
        currency: selectedWallet.currency_code,
      });

      if (result.success) {
        onSuccess(
          `✅ Wallet recharged with ${selectedWallet.currency_code} ${amount}`
        );
      } else {
        setError(result.message || 'Recharge failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to recharge wallet');
      console.error('Recharge error:', err);
    } finally {
      setLoading(false);
    }
  };

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plus className="w-6 h-6 text-teal-800" />
            Recharge Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Wallet
            </label>
            {wallets.length === 0 ? (
              <p className="text-gray-600 text-sm">No wallets available</p>
            ) : (
              <div className="space-y-2">
                {wallets.map((wallet) => (
                  <label
                    key={wallet.wallet_id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="wallet"
                      value={wallet.wallet_id}
                      checked={selectedWallet?.wallet_id === wallet.wallet_id}
                      onChange={() => setSelectedWallet(wallet)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900">
                        {wallet.currency_code}
                      </p>
                      <p className="text-sm text-gray-600">
                        Balance: {wallet.balance}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Amount {selectedWallet?.currency_code}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            />

            <div className="mt-3 grid grid-cols-3 gap-2">
              {predefinedAmounts.map((preAmount) => (
                <button
                  key={preAmount}
                  type="button"
                  onClick={() => setAmount(preAmount.toString())}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors"
                >
                  {selectedWallet?.currency_code} {preAmount}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Payment Method
            </label>
            <input
              type="text"
              value={paymentMethodId}
              onChange={(e) => setPaymentMethodId(e.target.value)}
              placeholder="Stripe Payment Method ID (pm_...)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-2">
              Note: In production, this would be handled through Stripe Elements
            </p>
          </div>

          {amount && selectedWallet && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Transaction Summary</p>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Amount:</span>
                <span className="text-lg font-bold text-blue-600">
                  {selectedWallet.currency_code} {parseFloat(amount).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading || !selectedWallet || !amount || !paymentMethodId
              }
              className="flex-1 py-3 px-4 bg-teal-800 text-white font-semibold rounded-lg  transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Recharge Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RechargeWalletModal;
