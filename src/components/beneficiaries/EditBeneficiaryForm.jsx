import React, { useState } from "react";

export default function EditBeneficiaryForm({ initialData = {}, onSuccess }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    wallet_id: initialData.wallet_id || "",
    payment_method_id: initialData.payment_method_id || "",
    bank_account_id: initialData.bank_account_id || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in");

      const res = await fetch(`http://127.0.0.1:8000/api/beneficiaries/update/${initialData.beneficiary_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      // Handle server validation errors
      if (!res.ok || !data.success) {
        if (data.errors) {
          const firstError = Object.values(data.errors).flat()[0];
          setError(firstError);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Failed to update beneficiary. Please check your input.");
        }
        return; // stop execution here
      }

      // Success case
      setSuccessMsg("Beneficiary updated successfully!");
      onSuccess && onSuccess(data.beneficiary);

    } catch (err) {
      console.error(err);
      setError(err.message || "Network error. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Edit Beneficiary</h2>

      {error && <div className="text-red-500 text-sm p-2 bg-red-100 rounded">{error}</div>}
      {successMsg && <div className="text-green-500 text-sm p-2 bg-green-100 rounded">{successMsg}</div>}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="email"
        name="email"
        placeholder="Email (optional)"
        value={formData.email}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="number"
        name="wallet_id"
        placeholder="Wallet ID (optional)"
        value={formData.wallet_id}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="number"
        name="payment_method_id"
        placeholder="Payment Method ID (optional)"
        value={formData.payment_method_id}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="number"
        name="bank_account_id"
        placeholder="Bank Account ID (optional)"
        value={formData.bank_account_id}
        onChange={handleChange}
        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        type="submit"
        disabled={loading}
        className={`mt-2 px-4 py-2 rounded text-white font-semibold transition-colors ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Updating..." : "Update Beneficiary"}
      </button>
    </form>
  );
}
