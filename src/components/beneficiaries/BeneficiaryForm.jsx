import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function BeneficiaryForm({ mode = "create", initialData = {}, onSuccess }) {
  const { user } = useAuth();
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
    console.log("Input changed:", name, value);
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

      const url =
        mode === "edit"
          ? `http://127.0.0.1:8000/api/beneficiaries/update/${initialData.beneficiary_id}`
          : `http://127.0.0.1:8000/api/beneficiaries/create`;

      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

if (!response.ok || !data.success) {
    if (data.errors) {
        // Handle object/array errors
        const firstErrorRaw = Object.values(data.errors).flat()[0];
        const firstError = typeof firstErrorRaw === "string"
            ? firstErrorRaw
            : JSON.stringify(firstErrorRaw);
        setError(firstError);
    } else if (data.message) {
        // Handle simple message string
        setError(data.message);
    } else {
        setError("Something went wrong");
    }
    return;
}

      // Success case
      setSuccessMsg(
        mode === "edit" ? "Beneficiary updated successfully!" : "Beneficiary created successfully!"
      );
      onSuccess && onSuccess(data.beneficiary);

    } catch (err) {
      console.error("Error:", err);
      if (err.message === "Failed to fetch") {
        setError("Unable to connect to server. Please check if the server is running.");
      } else {
        setError(err.message || "Network error");
      }
    } finally {
      setLoading(false);
    }
  };
console.log("Rendering BeneficiaryForm", formData);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {mode === "edit" ? "Edit Beneficiary" : "Create Beneficiary"}
      </h2>

      {error && (
        <div className="text-red-500 text-sm">
            {typeof error === "string"
            ? error
            : Object.values(error)
                .flat()   // flatten in case it's an array
                .map(msg => (typeof msg === "string" ? msg : JSON.stringify(msg)))
                .join(", ")}  {/* join multiple messages if needed */}
        </div>
        )}


      {successMsg && <div className="text-green-500 text-sm">{successMsg}</div>}

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
        {loading
          ? "Submitting..."
          : mode === "edit"
          ? "Update Beneficiary"
          : "Create Beneficiary"}
      </button>
    </form>
  );
}