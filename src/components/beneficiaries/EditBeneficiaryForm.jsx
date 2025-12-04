import React, { useState } from "react";
import SuccessPopup from "./SuccessPopup"; // import the popup component

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
  const [showSuccess, setShowSuccess] = useState(false); // track popup visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in");

      const res = await fetch(
        `http://127.0.0.1:8000/api/beneficiaries/update/${initialData.beneficiary_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (data.errors) {
          const firstError = Object.values(data.errors).flat()[0];
          setError(firstError);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Failed to update beneficiary. Please check your input.");
        }
        return;
      }

      // Show success popup instead of inline message
      setShowSuccess(true);

      // Call parent's onSuccess callback
      onSuccess && onSuccess(data.beneficiary);

    } catch (err) {
      console.error(err);
      setError(err.message || "Network error. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900">
            Edit Beneficiary
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-100 rounded">{error}</div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-900 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email (optional)"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-900 font-medium mb-2">Wallet ID</label>
              <input
                type="number"
                name="wallet_id"
                value={formData.wallet_id}
                onChange={handleChange}
                placeholder="Wallet ID"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2">Payment Method ID</label>
              <input
                type="number"
                name="payment_method_id"
                value={formData.payment_method_id}
                onChange={handleChange}
                placeholder="Payment Method ID"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2">Bank Account ID</label>
              <input
                type="number"
                name="bank_account_id"
                value={formData.bank_account_id}
                onChange={handleChange}
                placeholder="Bank Account ID"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl`}
          >
            {loading ? "Updating..." : "Update Beneficiary"}
          </button>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <SuccessPopup
          message="Beneficiary updated successfully!"
          onComplete={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
