import React, { useEffect, useState } from 'react';
import {
  Plus,
  Wallet,
  ArrowRight,
  DollarSign,
  CreditCard,
  RefreshCw,
  AlertCircle,
  Loader,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getWalletBalance,
  rechargeWallet,
  transferToBank,
  getPaymentMethods,
} from '../api/wallet';
import SuccessPopup from '../components/SuccessPopup';
import RechargeWalletModal from '../components/payment/RechargeWalletModal';
import WalletToBankModal from '../components/payment/WalletToBankModal';
import StripeTransactionsTab from '../components/payment/StripeTransactionsTab';
import PaymentMethodsTab from '../components/payment/PaymentMethodsTab';

const PaymentManagementPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('wallets');
  const [wallets, setWallets] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [walletsRes, methodsRes] = await Promise.all([
        getWalletBalance(),
        getPaymentMethods(),
      ]);

      setWallets(walletsRes.data || []);
      setPaymentMethods(methodsRes.data || []);

      if (walletsRes.data && walletsRes.data.length > 0) {
        setSelectedWallet(walletsRes.data[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load payment data');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const walletsRes = await getWalletBalance();
      setWallets(walletsRes.data || []);
    } catch (err) {
      setError('Failed to refresh wallet balance');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRechargeSuccess = (message) => {
    setSuccessMessage(message);
    setShowRechargeModal(false);
    loadData();
  };

  const handleTransferSuccess = (message) => {
    setSuccessMessage(message);
    setShowTransferModal(false);
    loadData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-teal-800 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading payment data...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-teal-800" />
            Payment Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage wallets, recharge, transfer, and view transactions
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8 overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { id: 'wallets', label: 'Wallets', icon: Wallet },
              //   { id: 'recharge', label: 'Recharge', icon: Plus },
              //   { id: 'transfer', label: 'Transfer to Bank', icon: ArrowRight },
              { id: 'transactions', label: 'Transactions', icon: CreditCard },
              { id: 'methods', label: 'Payment Methods', icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === id
                    ? 'text-teal-800 border-b-2 border-teal-800'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'wallets' && (
              <WalletsTab
                wallets={wallets}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onSelectWallet={setSelectedWallet}
                selectedWallet={selectedWallet}
                onRecharge={() => setShowRechargeModal(true)}
                onTransfer={() => setShowTransferModal(true)}
              />
            )}

            {activeTab === 'recharge' && (
              <div className="text-center py-8">
                <Plus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recharge Your Wallet
                </h3>
                <p className="text-gray-600 mb-6">
                  Use the modal to add funds to your wallet via Stripe
                </p>
                <button
                  onClick={() => setShowRechargeModal(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Open Recharge Modal
                </button>
              </div>
            )}

            {activeTab === 'transfer' && (
              <div className="text-center py-8">
                <ArrowRight className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Transfer to Bank Account
                </h3>
                <p className="text-gray-600 mb-6">
                  Transfer funds from your wallet to a bank account
                </p>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Open Transfer Modal
                </button>
              </div>
            )}

            {activeTab === 'transactions' && <StripeTransactionsTab />}

            {activeTab === 'methods' && (
              <PaymentMethodsTab
                methods={paymentMethods}
                onRefresh={loadData}
              />
            )}
          </div>
        </div>
      </div>

      {showRechargeModal && (
        <RechargeWalletModal
          wallets={wallets}
          onClose={() => setShowRechargeModal(false)}
          onSuccess={handleRechargeSuccess}
        />
      )}

      {showTransferModal && (
        <WalletToBankModal
          wallets={wallets}
          onClose={() => setShowTransferModal(false)}
          onSuccess={handleTransferSuccess}
        />
      )}

      {successMessage && (
        <SuccessPopup
          message={successMessage}
          onComplete={() => setSuccessMessage('')}
        />
      )}
    </div>
  );
};

const WalletsTab = ({
  wallets,
  refreshing,
  onRefresh,
  onSelectWallet,
  selectedWallet,
  onRecharge,
  onTransfer,
}) => {
  const [showBalances, setShowBalances] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Your Wallets</h3>
      </div>

      {wallets.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No wallets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets.map((wallet) => (
            <div
              key={wallet.wallet_id}
              onClick={() => onSelectWallet(wallet)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all border-gray-200 bg-white `}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wallet</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {wallet.currency_code}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {/* {showBalances ? wallet.balance.toFixed(2) : '••••'} */}
                    {showBalances
                      ? Number(wallet.balance ?? 0).toFixed(2)
                      : '••••'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectWallet(wallet);
                    onRecharge();
                  }}
                  className="flex-1 py-2 px-3 bg-[#115e59] text-white text-sm font-medium rounded  transition-colors"
                >
                  Recharge
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectWallet(wallet);
                    onTransfer();
                  }}
                  className="flex-1 py-2 px-3 bg-[#1ea39b] text-white text-sm font-medium rounded  transition-colors"
                >
                  Transfer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentManagementPage;
