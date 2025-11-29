import { useState } from "react";

const AgentCashOperationForm = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    wallet_id: "",
    operation_type: "deposit",
    amount: "",
    currency_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage(""); // Clear message when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/agent/cash-operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Cash operation created successfully!");
        // Reset form
        setFormData({
          user_id: "",
          wallet_id: "",
          operation_type: "deposit",
          amount: "",
          currency_code: "",
        });
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
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Cash Operation</h2>

      {message && (
        <div className={`p-3 rounded mb-4 ${
          message.includes("success") 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User ID */}
        <div>
          <label className="block text-sm font-medium mb-1">User ID</label>
          <input
            type="text"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter user ID"
          />
        </div>

        {/* Wallet ID */}
        <div>
          <label className="block text-sm font-medium mb-1">Wallet ID</label>
          <input
            type="text"
            name="wallet_id"
            value={formData.wallet_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter wallet ID"
          />
        </div>

        {/* Operation Type - ONLY DROPDOWN */}
        <div>
          <label className="block text-sm font-medium mb-1">Operation Type</label>
          <select
            name="operation_type"
            value={formData.operation_type}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter amount"
          />
        </div>

        {/* Currency Code */}
        <div>
          <label className="block text-sm font-medium mb-1">Currency Code</label>
          <input
            type="text"
            name="currency_code"
            value={formData.currency_code}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., USD, EUR, GBP"
            maxLength="3"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Cash Operation"}
        </button>
      </form>
    </div>
  );
};

export default AgentCashOperationForm;