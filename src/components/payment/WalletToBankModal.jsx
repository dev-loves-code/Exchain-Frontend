import React, { useState, useEffect } from 'react';
import { ArrowRight, X, AlertCircle, Loader, Plus } from 'lucide-react';
import { transferToBank, getBankAccounts } from '../../api/wallet';

const WalletToBankModal = ({ wallets, onClose, onSuccess }) => {
  const [selectedWallet, setSelectedWallet] = useState(wallets[0] || null);
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState('saved');
  const [savedAccountId, setSavedAccountId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  const [newAccount, setNewAccount] = useState({
    account_number: '',
    holder_name: '',
    bank_name: '',
  });

  const [savedAccounts, setSavedAccounts] = useState([]);

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      setLoadingAccounts(true);
      try {
        const response = await getBankAccounts();
        console.log('Bank accounts response:', response);

        const beneficiaryList = response.beneficiaries || response.data || [];

        const beneficiariesWithBank = beneficiaryList.filter(
          (beneficiary) => beneficiary.bank_account_id
        );

        console.log(
          'Filtered beneficiaries with bank accounts:',
          beneficiariesWithBank
        );
        setSavedAccounts(beneficiariesWithBank);
      } catch (err) {
        console.error('Failed to fetch bank accounts:', err);
        setSavedAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    if (selectedWallet.balance < parseFloat(amount)) {
      setError('Insufficient balance');
      return;
    }

    if (accountType === 'saved' && !savedAccountId) {
      setError('Please select a bank account');
      return;
    }

    if (accountType === 'new') {
      if (!newAccount.account_number.trim()) {
        setError('Please enter account number');
        return;
      }
      if (!newAccount.holder_name.trim()) {
        setError('Please enter account holder name');
        return;
      }
      if (!newAccount.bank_name.trim()) {
        setError('Please enter bank name');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        wallet_id: selectedWallet.wallet_id,
        amount: parseFloat(amount),
        currency: selectedWallet.currency_code,
      };

      if (accountType === 'saved') {
        payload.beneficiary_id = parseInt(savedAccountId, 10);
        console.log('Sending beneficiary_id:', payload.beneficiary_id);
      } else {
        payload.external_account_number = newAccount.account_number;
        payload.external_holder_name = newAccount.holder_name;
        payload.external_bank_name = newAccount.bank_name;
      }

      console.log('Transfer payload:', payload);
      const result = await transferToBank(payload);

      if (result.success) {
        onSuccess(
          `✅ Transferred ${selectedWallet.currency_code} ${amount} to bank`
        );
      } else {
        setError(result.message || 'Transfer failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to transfer to bank');
      console.error('Transfer error:', err);
    } finally {
      setLoading(false);
    }
  };

  const predefinedAmounts = [50, 100, 250, 500, 1000];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ArrowRight className="w-6 h-6 text-teal-800" />
            Transfer to Bank
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
                      className="w-4 h-4 text-green-600"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-900">
                        {wallet.currency_code}
                      </p>
                      <p className="text-sm text-gray-600">
                        {/* Available: {wallet.balance.toFixed(2)} */}
                        Available: {Number(wallet.balance ?? 0).toFixed(2)}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
            />

            <div className="mt-3 grid grid-cols-3 gap-2">
              {predefinedAmounts.map((preAmount) => (
                <button
                  key={preAmount}
                  type="button"
                  onClick={() => setAmount(preAmount.toString())}
                  disabled={
                    selectedWallet && selectedWallet.balance < preAmount
                  }
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedWallet?.currency_code} {preAmount}
                </button>
              ))}
            </div>

            {selectedWallet && (
              <p className="text-xs text-gray-500 mt-2">
                Available: {selectedWallet.currency_code}{' '}
                {/* {selectedWallet.balance.toFixed(2)} */}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Bank Account
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="accountType"
                  value="saved"
                  checked={accountType === 'saved'}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="ml-3 font-medium text-gray-700">
                  Use Saved Account
                </span>
              </label>

              {accountType === 'saved' && (
                <div className="ml-7 space-y-2">
                  {loadingAccounts ? (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Loading accounts...
                    </p>
                  ) : savedAccounts.length === 0 ? (
                    <p className="text-sm text-gray-600">
                      No saved accounts. Use a new account instead.
                    </p>
                  ) : (
                    savedAccounts.map((beneficiary) => (
                      <label
                        key={beneficiary.beneficiary_id}
                        className="flex items-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="savedAccount"
                          value={String(beneficiary.beneficiary_id)}
                          checked={
                            savedAccountId ===
                            String(beneficiary.beneficiary_id)
                          }
                          onChange={(e) => {
                            setSavedAccountId(e.target.value);
                            console.log(
                              'Selected beneficiary:',
                              e.target.value
                            );
                          }}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {beneficiary.name} - {beneficiary.bank_account_id}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              )}

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="accountType"
                  value="new"
                  checked={accountType === 'new'}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="ml-3 font-medium text-gray-700">
                  Use New Account
                </span>
              </label>
            </div>
          </div>

          {accountType === 'new' && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="holder_name"
                  value={newAccount.holder_name}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={newAccount.account_number}
                  onChange={handleInputChange}
                  placeholder="e.g., 1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={newAccount.bank_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Chase Bank"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          )}

          {amount && selectedWallet && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-3">Transaction Summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">
                    {selectedWallet.currency_code}{' '}
                    {parseFloat(amount).toFixed(2)}
                  </span>
                </div>
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
                loading ||
                !selectedWallet ||
                !amount ||
                (accountType === 'saved' &&
                  !savedAccountId &&
                  savedAccounts.length > 0) ||
                (accountType === 'new' &&
                  (!newAccount.account_number ||
                    !newAccount.holder_name ||
                    !newAccount.bank_name))
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
                  <ArrowRight className="w-5 h-5" />
                  Transfer Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalletToBankModal;
