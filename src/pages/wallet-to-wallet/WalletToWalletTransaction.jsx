import React, { useState, useEffect } from 'react';
import useWallets from '../../hooks/getWallets';
import useCurrencies from '../../hooks/getCurrencies';
import WalletSelector from '../../components/Wallet/WalletSelector';
import BeneficiarySelector from '../../components/beneficiaries/BeneficiarySelector';
import CurrencyModal from '../../components/Currency/CurrencyModal.jsx';
import Swal from 'sweetalert2';

export default function WalletToWalletPage() {
  const token = localStorage.getItem('token');
  const { fetchWallets } = useWallets(token);
  const { currencies, loadingCurrencies, fetchCurrencies } = useCurrencies();

  const [senderWallet, setSenderWallet] = useState('');
  const [receiverWallet, setReceiverWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSenderSelector, setOpenSenderSelector] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showBeneficiarySelector, setShowBeneficiarySelector] = useState(false);

  useEffect(() => {
    if (token) fetchCurrencies();
  }, [token, fetchCurrencies]);

  const handleTransfer = async () => {
    if (!senderWallet || !receiverWallet || !amount || !currency) {
      Swal.fire('Error', 'Please fill all fields.', 'error');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Confirm Transfer',
      text: `Send ${amount} ${currency} from wallet #${senderWallet} to wallet #${receiverWallet}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, transfer',
      cancelButtonText: 'Cancel'
    });
    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/transactions/wallet-to-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sender_wallet_id: senderWallet,
          receiver_wallet_id: receiverWallet,
          amount,
          currency_code: currency
        })
      });
      
      const raw = await response.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = raw;
      }
      
      if (!response.ok) {
        if (data?.errors) {
          Swal.fire('Error', Object.values(data.errors).flat().join('\n'), 'error');
        } else if (data?.message) {
          Swal.fire('Error', data.message, 'error');
        } else {
          Swal.fire('Error', typeof data === 'string' ? data : 'Failed to transfer.', 'error');
        }
        return;
      }

      if (data?.success === false) {
        if (data.errors) {
          Swal.fire('Error', Object.values(data.errors).flat().join('\n'), 'error');
        } else if (data.message) {
          Swal.fire('Error', data.message, 'error');
        } else {
          Swal.fire('Error', 'Transfer failed (server returned success: false).', 'error');
        }
        return;
      }

      Swal.fire('Success', data?.message || 'Transfer completed successfully.', 'success');
      fetchWallets();
      setSenderWallet('');
      setReceiverWallet('');
      setAmount('');
      setCurrency('');
    } catch (error) {
      console.error('Transfer error:', error);
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

return (
<div className="max-w-xl mx-auto mt-8 mb-20 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
    <h1 className="text-3xl font-bold mb-8 text-gray-900">Wallet-to-Wallet Transfer</h1>

    {/* Sender Wallet */}
    <label className="text-gray-800 block mb-2 font-semibold">Sender Wallet</label>
    <button
      onClick={() => setOpenSenderSelector(true)}
      className="text-gray-900 w-full mb-6 border border-gray-300 rounded-lg p-3 text-left bg-gray-50 hover:bg-gray-100 transition-all duration-200 focus:ring-2 focus:ring-teal-950"
    >
      {senderWallet ? `Wallet #${senderWallet}` : 'Select Sender Wallet'}
    </button>

    {openSenderSelector && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="w-[500px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
          <WalletSelector
            onSelect={(wallet) => {
              setSenderWallet(wallet.wallet_id);
              setOpenSenderSelector(false);
            }}
          />
        </div>
      </div>
    )}

    {/* Receiver Wallet */}
    <label className="text-gray-800 block mb-2 font-semibold">Receiver Wallet</label>
    <div className="flex gap-3 mb-6">
      <input
        type="text"
        placeholder="Enter receiver wallet ID"
        value={receiverWallet}
        onChange={(e) => setReceiverWallet(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
      />
      <button
        type="button"
        onClick={() => setShowBeneficiarySelector(true)}
        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 transition-all duration-200"
      >
        Select
      </button>
    </div>

    {showBeneficiarySelector && (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setShowBeneficiarySelector(false)}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowBeneficiarySelector(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <BeneficiarySelector
            onSelect={(beneficiary) => {
              if (beneficiary.wallet) {
                setReceiverWallet(beneficiary.wallet.wallet_id);
              } else {
                Swal.fire("Error", "Selected beneficiary has no wallet", "error");
              }
              setShowBeneficiarySelector(false);
            }}
          />
        </div>
      </div>
    )}

<div className="flex gap-4 mb-6">
  {/* Amount */}
  <div className="flex-1">
    <label className="text-gray-800 block mb-2 font-semibold">Amount</label>
    <input
      type="number"
      min="0.01"
      step="0.01"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500"
    />
  </div>

  {/* Currency */}
  <div className="flex-1">
    <label className="text-gray-800 block mb-2 font-semibold">Currency</label>
    <button
      type="button"
      onClick={() => setShowCurrencyModal(true)}
      className="w-full border border-gray-300 rounded-lg p-3 text-left bg-gray-50 hover:bg-gray-100 transition-all duration-200"
    >
      {currency || 'Select Currency'}
    </button>
  </div>
</div>

    

    {showCurrencyModal && (
      <CurrencyModal
        show={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        currencies={currencies || []}
        mode="select"
        onSelect={(selectedCurrency) => {
          setCurrency(selectedCurrency);
          setShowCurrencyModal(false);
        }}
        loadingCurrencies={loadingCurrencies}
      />
    )}

    {/* Transfer Button */}
    <button
      onClick={handleTransfer}
      disabled={loading}
      className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
        loading
          ? 'bg-gray-400 cursor-not-allowed'
          : ' bg-teal-900 hover:bg-teal-800 text-white shadow-md'
      }`}
    >
      {loading ? 'Transferring...' : 'Transfer'}
    </button>
  </div>
);
}