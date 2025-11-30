import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const AgentCashOperationForm = () => {
  const { user } = useAuth();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Form */}
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Cash Operation</h2>

            {message && (
              <div className={`p-3 rounded mb-6 ${
                message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">User ID</label>
                  <input
                    type="text"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                </div>
              </div>

              {/* Commission Option */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <label className="block text-sm font-medium mb-3 text-gray-700">Commission Type</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={commissionOption === "excluding"}
                      onChange={() => setCommissionOption("excluding")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Excluding Commission</span>
                      <p className="text-xs text-gray-500">You pay: Amount + Commission | Wallet receives: Full Amount</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={commissionOption === "including"}
                      onChange={() => setCommissionOption("including")}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Including Commission</span>
                      <p className="text-xs text-gray-500">You pay: Full Amount | Wallet receives: Amount - Commission</p>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side - Amount, Currency & Summary */}
          <div className="md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 p-8 border-l border-gray-200">
            <div className="h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Transaction Details</h3>
              
              {/* Commission Rate Display */}
              {agentCommission > 0 && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700">Agent Commission Rate</span>
                    <span className="text-lg font-bold text-blue-600">{agentCommission}%</span>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition uppercase"
                      placeholder="USD"
                      maxLength="3"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredCurrencies.map((currency) => (
                        <div
                          key={currency}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
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
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                      <h4 className="text-lg font-semibold mb-4 text-gray-800">Transaction Summary</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                          <span className="text-gray-600">Commission Type:</span>
                          <span className="font-semibold text-gray-800 capitalize">{commissionOption} Commission</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">You Pay:</span>
                          <span className="text-xl font-bold text-blue-600">
                            {amounts.youPay.toFixed(2)} {formData.currency_code}
                          </span>
                        </div>

                        {commissionOption === "excluding" && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Base Amount:</span>
                            <span className="text-gray-700">{parseFloat(formData.amount).toFixed(2)} {formData.currency_code}</span>
                          </div>
                        )}

                        {commissionOption === "excluding" && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Commission ({agentCommission}%):</span>
                            <span className="text-red-600">+{amounts.commission.toFixed(2)} {formData.currency_code}</span>
                          </div>
                        )}

                        {commissionOption === "including" && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Commission ({agentCommission}%):</span>
                            <span className="text-red-600">-{amounts.commission.toFixed(2)} {formData.currency_code}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <span className="text-gray-700 font-semibold">Wallet Receives:</span>
                          <span className="text-2xl font-bold text-green-600">
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
                      className="w-full bg-green-600 text-white p-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg"
                    >
                      {loading ? "Processing..." : "Create Cash Operation"}
                    </button>
                  </>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
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
  );
};

export default AgentCashOperationForm;