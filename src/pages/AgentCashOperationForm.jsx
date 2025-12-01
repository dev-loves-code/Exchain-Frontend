import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Add this import
import { useNavigate } from 'react-router-dom'; // Add this import

const AgentCashOperationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Add this
  const [formData, setFormData] = useState({
    user_id: "",
    wallet_id: "",
    operation_type: "deposit",
    amount: "",
    currency_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [commissionOption, setCommissionOption] = useState("excluding");
  const [agentCommission, setAgentCommission] = useState(0);
  const dropdownRef = useRef(null);

  const handleBack = () => {
    navigate('/agent/cash-operations'); // Navigate back to agent operations page
  };

  // Rest of your existing code remains the same...
  // Fetch agent commission rate from profile
  useEffect(() => {
    const fetchAgentCommission = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/agent/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setAgentCommission(data.data.commission_rate || 0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch agent commission:", error);
      }
    };

    fetchAgentCommission();
  }, []);


   // Calculate amounts based on commission option
  const calculateAmounts = () => {
    const amount = parseFloat(formData.amount) || 0;
    
    if (amount <= 0 || agentCommission <= 0) {
      return {
        youPay: amount,
        walletReceives: amount,
        commission: 0
      };
    }

    if (commissionOption === "excluding") {
      // Commission excluded: user pays amount + commission, wallet gets full amount
      const commission = amount * (agentCommission / 100);
      const youPay = amount + commission;
      return {
        youPay,
        walletReceives: amount,
        commission
      };
    } else {
      // Commission included: user pays amount, wallet gets amount minus commission
      const commission = amount * (agentCommission / 100);
      const walletReceives = amount - commission;
      return {
        youPay: amount,
        walletReceives,
        commission
      };
    }
  };

  const amounts = calculateAmounts();

  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/currency/list");
      const data = await response.json();
      if (data?.success && data.currencies) {
        setCurrencies(data.currencies);
        setFilteredCurrencies(data.currencies);
      }
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
    }
  };

  const handleCurrencySearch = (term) => {
    const upperCaseTerm = term.toUpperCase();
    setSearchTerm(term);
    setFilteredCurrencies(currencies.filter(currency => currency.includes(upperCaseTerm)));
    setFormData(prev => ({ ...prev, currency_code: upperCaseTerm }));
  };

  const selectCurrency = (currency) => {
    setFormData(prev => ({ ...prev, currency_code: currency }));
    setSearchTerm(currency);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currencies.includes(formData.currency_code)) {
      setMessage("Please select a valid currency");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/agent/cash-operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: amounts.walletReceives // Always send what the wallet receives
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Cash operation created successfully!");
        setFormData({
          user_id: "", wallet_id: "", operation_type: "deposit", amount: "", currency_code: ""
        });
        setSearchTerm("");
      } else {
        setMessage(data.message || "Failed to create cash operation");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // ... rest of your existing code ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button & Header - NEW SECTION */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 group"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Operations
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Create Cash Operation
              </h1>
              <p className="text-gray-600">
                Process deposits and withdrawals for customers
              </p>
            </div>
            <button
              onClick={handleBack}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              View Operations
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Form */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Operation Details</h2>

              {message && (
                <div className={`p-4 rounded-xl mb-6 ${
                  message.includes("success") ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rest of your form remains exactly the same */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">User ID</label>
                    <input
                      type="text"
                      name="user_id"
                      value={formData.user_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter user ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Wallet ID</label>
                    <input
                      type="text"
                      name="wallet_id"
                      value={formData.wallet_id}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter wallet ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Operation Type</label>
                    <select
                      name="operation_type"
                      value={formData.operation_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    >
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                    </select>
                  </div>
                </div>

                {/* Commission Option */}
                <div className="p-6 border border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100">
                  <label className="block text-lg font-semibold mb-4 text-gray-800">Commission Type</label>
                  <div className="space-y-4">
                    <label className="flex items-start space-x-4 p-4 border border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-200 cursor-pointer">
                      <input
                        type="radio"
                        checked={commissionOption === "excluding"}
                        onChange={() => setCommissionOption("excluding")}
                        className="text-blue-600 focus:ring-blue-500 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">Excluding Commission</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            Recommended
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          You pay: <span className="font-semibold">Amount + Commission</span> | 
                          Wallet receives: <span className="font-semibold">Full Amount</span>
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start space-x-4 p-4 border border-gray-300 rounded-xl hover:border-purple-400 transition-colors duration-200 cursor-pointer">
                      <input
                        type="radio"
                        checked={commissionOption === "including"}
                        onChange={() => setCommissionOption("including")}
                        className="text-purple-600 focus:ring-purple-500 mt-1"
                      />
                      <div>
                        <span className="font-medium text-gray-800">Including Commission</span>
                        <p className="text-sm text-gray-600 mt-2">
                          You pay: <span className="font-semibold">Full Amount</span> | 
                          Wallet receives: <span className="font-semibold">Amount - Commission</span>
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Side - Amount, Currency & Summary */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-50 to-purple-50 p-8 border-l border-gray-200">
              <div className="h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Transaction Details</h3>
                
                {/* Commission Rate Display */}
                {agentCommission > 0 && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-blue-100">Your Commission Rate</p>
                        <p className="text-3xl font-bold mt-2">{agentCommission}%</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amount and Currency Inputs */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      {commissionOption === "including" ? "Total Amount" : "Base Amount"}
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      min="0.01"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Currency</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleCurrencySearch(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white uppercase"
                        placeholder="USD"
                        maxLength="3"
                      />
                      <div 
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:text-gray-700"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Dropdown */}
                    {showDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-xl max-h-60 overflow-auto">
                        {filteredCurrencies.map((currency) => (
                          <div
                            key={currency}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                            onClick={() => selectCurrency(currency)}
                          >
                            <span className="font-medium text-gray-700">{currency}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Calculation Display */}
                <div className="flex-1 space-y-6">
                  {formData.amount ? (
                    <>
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                        <h4 className="text-xl font-bold mb-6 text-gray-800">Transaction Summary</h4>
                        <div className="space-y-6">
                          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">Commission Type:</span>
                            <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-semibold capitalize">
                              {commissionOption} Commission
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                            <div>
                              <span className="text-gray-700 font-semibold">You Pay</span>
                              <p className="text-sm text-gray-500 mt-1">Total amount you collect</p>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">
                              {amounts.youPay.toFixed(2)} {formData.currency_code}
                            </span>
                          </div>

                          <div className="space-y-3 pl-4 border-l-2 border-gray-300">
                            {commissionOption === "excluding" && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500">Base Amount:</span>
                                <span className="text-gray-700 font-medium">{parseFloat(formData.amount).toFixed(2)} {formData.currency_code}</span>
                              </div>
                            )}

                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Commission ({agentCommission}%):</span>
                              <span className={`font-semibold ${commissionOption === "excluding" ? 'text-red-600' : 'text-amber-600'}`}>
                                {commissionOption === "excluding" ? '+' : '-'}{amounts.commission.toFixed(2)} {formData.currency_code}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                            <div>
                              <span className="text-gray-800 font-bold text-lg">Wallet Receives</span>
                              <p className="text-sm text-gray-500 mt-1">Amount credited to wallet</p>
                            </div>
                            <span className="text-3xl font-bold text-green-600">
                              {amounts.walletReceives.toFixed(2)} {formData.currency_code}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || !currencies.includes(formData.currency_code)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "Create Cash Operation"
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">Enter amount to see calculation</p>
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