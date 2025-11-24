import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function BeneficiariesBox({ onRowClick }) {
  const { user, loading: authLoading } = useAuth(); // get auth state
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch beneficiaries once user is ready
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchBeneficiaries();
      } else {
        setError("Please login to view beneficiaries.");
        setLoading(false);
      }
    }
  }, [authLoading, user]);

  const fetchBeneficiaries = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login.");

      const res = await fetch("http://127.0.0.1:8000/api/beneficiaries", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // Try to parse error message
        let msg = "Failed to fetch beneficiaries";
        try {
          const errData = await res.json();
          msg = errData.message || msg;
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.beneficiaries)) {
        setBeneficiaries(data.beneficiaries);
      } else {
        setError("No beneficiaries found or invalid response.");
      }
    } catch (err) {
      console.error("Beneficiaries fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading)
    return (
      <div className="text-center mt-4 text-sm">Loading beneficiaries...</div>
    );

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 font-semibold text-gray-800 text-lg">
        Beneficiaries List
      </div>

      {error && (
        <div className="text-red-500 p-3 text-sm text-center">{error}</div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {beneficiaries.length > 0 ? (
          beneficiaries.map((b) => (
            <div
              key={b.beneficiary_id}
              onClick={() => onRowClick && onRowClick(b)}
              className="flex flex-col p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <p className="font-semibold text-gray-800 text-sm">{b.name}</p>
              {b.email && (
                <p className="text-gray-600 text-xs truncate">Email: {b.email}</p>
              )}
              {b.wallet && (
                <p className="text-gray-600 text-xs truncate">
                  Wallet: {b.wallet.name || b.wallet.wallet_id}
                </p>
              )}
              {b.payment_method && (
                <p className="text-gray-600 text-xs truncate">
                  Payment Method: {b.payment_method.name || b.payment_method.payment_method_id}
                </p>
              )}
              {b.bank_account && (
                <p className="text-gray-600 text-xs truncate">
                  Bank Account: {b.bank_account.account_number || b.bank_account.bank_account_id}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500 text-center text-sm">
            No beneficiaries found.
          </p>
        )}
      </div>
    </div>
  );
}
