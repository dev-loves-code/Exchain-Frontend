import React, { useState } from 'react';
import EWalletList from '../components/Wallet/EWalletList.jsx';
import { Search, X } from 'lucide-react';
import useWallets from "../hooks/getWallets.js";
import useCurrencies from "../hooks/getCurrencies.js";
import Swal from 'sweetalert2';

export default function WalletsPage() {

  const token = localStorage.getItem("token");
  const { wallets, loading: walletsLoading, fetchWallets } = useWallets(token);
  const { currencies, loadingCurrencies, fetchCurrencies } = useCurrencies();
  
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleDeleteWallet = async (walletId) => {
      const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This wallet will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return; 

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/wallets/${walletId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire(
          'Deleted!',
          'Wallet has been deleted successfully.',
          'success'
        );
        fetchWallets();
      } else {
        Swal.fire(
          'Error!',
          data.message || 'Failed to delete wallet.',
          'error'
        );
      }

    } catch (error) {
      console.error('Error deleting wallet:', error);
      Swal.fire(
        'Error!',
        'Failed to delete wallet. Please try again.',
        'error'
      );
    }
  };

  const handleAddWalletClick = () => {
    setShowModal(true);
    setSelectedCurrency(null);
    if (currencies.length === 0) {
      fetchCurrencies();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSearchTerm('');
    setSelectedCurrency(null);
  };

  const handleCurrencySelect = (currencyCode) => {
    setSelectedCurrency(currencyCode);
  };

  const handleCreateWallet = async () => {
    if (!selectedCurrency) return;

    setCreating(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/wallets', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currency_code: selectedCurrency })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.success) {
        // Refresh wallets list
        fetchWallets();
        handleCloseModal();
      } else {
        alert(result.message || 'Failed to create wallet');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      alert('Failed to create wallet. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  // Filter currencies based on search term
  const filteredCurrencies = (currencies || []).filter(currencyCode => {
    if (!currencyCode) return false;
    
    const search = (searchTerm || '').toLowerCase();
    const matchesSearch = currencyCode.toLowerCase().includes(search);
    
    return matchesSearch;
  });

  if (walletsLoading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading wallets...</p>
      </div>
    </div>
  );
}
return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900">My Wallets</h1>

      {wallets.length > 0 && (
        <button 
          onClick={handleAddWalletClick}
          className="bg-teal-800 text-white px-8 py-3 rounded-lg 
                     hover:bg-teal-700 transition shadow-md font-medium"
        >
          + Add New Wallet
        </button>
      )}
    </div>

    {/* Wallets */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EWalletList 
        wallets={wallets} 
        onWalletClick={() => {}}
        onWalletDelete={handleDeleteWallet}
        onAddWallet={handleAddWalletClick} 
      />
    </div>

    {/* Currency Selection Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">

          {/* Modal Header */}
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Select Currency</h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search currency code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-teal-700"
                autoFocus
              />
            </div>
          </div>

          {/* Currency List */}
          <div className="flex-1 overflow-y-auto">
            {loadingCurrencies ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-800"></div>
              </div>
            ) : filteredCurrencies.length > 0 ? (
              <div className="p-2">
                {filteredCurrencies.map((currencyCode, index) => (
                  <button
                    key={`${currencyCode}-${index}`}
                    onClick={() => handleCurrencySelect(currencyCode)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition text-left border-2 ${
                      selectedCurrency === currencyCode
                        ? 'bg-teal-50 border-teal-700 shadow-sm'
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selectedCurrency === currencyCode
                          ? 'bg-teal-800'
                          : 'bg-teal-100'
                      }`}
                    >
                      <span
                        className={`font-bold text-sm ${
                          selectedCurrency === currencyCode
                            ? 'text-white'
                            : 'text-teal-800'
                        }`}
                      >
                        {currencyCode.substring(0, 2)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">
                        {currencyCode}
                      </div>
                    </div>

                    {selectedCurrency === currencyCode && (
                      <div className="text-teal-700">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {searchTerm
                  ? 'No currencies found matching your search'
                  : 'No available currencies'}
              </div>
            )}
          </div>

          {/* Create Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleCreateWallet}
              disabled={!selectedCurrency || creating}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                selectedCurrency && !creating
                  ? 'bg-teal-800 text-white hover:bg-teal-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {creating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </span>
              ) : (
                'Create Wallet'
              )}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}