import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

// Import components
import CommissionSelector from '../components/AgentCashOperationForm/CommissionSelector';
import CurrencyDropdown from '../components/AgentCashOperationForm/CurrencyDropdown';
import TransactionSummary from '../components/AgentCashOperationForm/TransactionSummary';
import CommissionRateCard from '../components/AgentCashOperationForm/CommissionRateCard';

const AgentCashOperationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: '',
    wallet_id: '',
    operation_type: 'deposit',
    amount: '',
    currency_code: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [commissionOption, setCommissionOption] = useState('excluding');
  const [agentCommission, setAgentCommission] = useState(0);

  // Handle back navigation
  const handleBack = () => {
    navigate('/agent/cash-operations');
  };

  // Fetch agent commission rate
  useEffect(() => {
    const fetchAgentCommission = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/agent/profile`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setAgentCommission(data.data.commission_rate || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch agent commission:', error);
      }
    };

    fetchAgentCommission();
  }, []);

  // Fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/currency/list');
        const data = await response.json();
        if (data?.success && data.currencies) {
          setCurrencies(data.currencies);
        }
      } catch (error) {
        console.error('Failed to fetch currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  // Calculate amounts
  const calculateAmounts = () => {
    const amount = parseFloat(formData.amount) || 0;

    if (amount <= 0 || agentCommission <= 0) {
      return {
        youPay: amount,
        walletReceives: amount,
        commission: 0,
      };
    }

    if (commissionOption === 'excluding') {
      const commission = amount * (agentCommission / 100);
      const youPay = amount + commission;
      return {
        youPay,
        walletReceives: amount,
        commission,
      };
    } else {
      const commission = amount * (agentCommission / 100);
      const walletReceives = amount - commission;
      return {
        youPay: amount,
        walletReceives,
        commission,
      };
    }
  };

  const amounts = calculateAmounts();

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currencies.includes(formData.currency_code)) {
      setMessage('Please select a valid currency');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/agent/cash-operations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            ...formData,
            amount: amounts.walletReceives,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessage('Cash operation created successfully!');
        setFormData({
          user_id: '',
          wallet_id: '',
          operation_type: 'deposit',
          amount: '',
          currency_code: '',
        });
        setSearchTerm('');
      } else {
        setMessage(data.message || 'Failed to create cash operation');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Operations
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Cash Operation
              </h1>
              <p className="text-gray-600">
                Process deposits and withdrawals for customers
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="md:flex">
            {/* Left Side - Form */}
            <div className="md:w-1/2 p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Operation Details
              </h2>

              {message && (
                <div
                  className={`p-4 rounded-xl mb-6 ${
                    message.includes('success')
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      User ID
                    </label>
                    <input
                      type="text"
                      name="user_id"
                      value={formData.user_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
                      placeholder="Enter user ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Wallet ID
                    </label>
                    <input
                      type="text"
                      name="wallet_id"
                      value={formData.wallet_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
                      placeholder="Enter wallet ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Operation Type
                    </label>
                    <select
                      name="operation_type"
                      value={formData.operation_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
                    >
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                    </select>
                  </div>
                </div>

                {/* Commission Selection */}
                <CommissionSelector
                  commissionOption={commissionOption}
                  onOptionChange={setCommissionOption}
                />
              </form>
            </div>

            {/* Right Side - Amount, Currency & Summary */}
            <div className="md:w-1/2 bg-gray-50 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-200">
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  Transaction Details
                </h3>

                {/* Commission Rate */}
                <CommissionRateCard agentCommission={agentCommission} />

                {/* Amount and Currency Inputs */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      {commissionOption === 'including'
                        ? 'Total Amount'
                        : 'Base Amount'}
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      min="0.01"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>

                  <CurrencyDropdown
                    currencies={currencies}
                    selectedCurrency={formData.currency_code}
                    onSelectCurrency={(currency) =>
                      setFormData((prev) => ({
                        ...prev,
                        currency_code: currency,
                      }))
                    }
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                  />
                </div>

                {/* Transaction Summary */}
                <div className="flex-1 space-y-6">
                  {formData.amount && formData.currency_code ? (
                    <>
                      <TransactionSummary
                        commissionOption={commissionOption}
                        agentCommission={agentCommission}
                        baseAmount={parseFloat(formData.amount) || 0}
                        currency={formData.currency_code}
                        amounts={amounts}
                      />

                      {/* Submit Button */}
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={
                          loading ||
                          !currencies.includes(formData.currency_code)
                        }
                        className="w-full bg-teal-800 hover:bg-teal-900 text-white py-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Processing...
                          </span>
                        ) : (
                          'Create Cash Operation'
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500">
                        Enter amount and select currency to see calculation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCashOperationForm;
