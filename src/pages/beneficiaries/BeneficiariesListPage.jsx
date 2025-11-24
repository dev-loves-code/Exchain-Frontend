import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import BeneficiaryCard from "../../components/beneficiaries/BeneficiaryCard";
import { useNavigate } from "react-router-dom";

export default function BeneficiariesListPage() {
  const { user, loading } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) fetchBeneficiaries();
  }, [loading, user]);

  const fetchBeneficiaries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/beneficiaries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBeneficiaries(data.beneficiaries);
      else setError("Failed to fetch beneficiaries");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateClick = () => {
    navigate("/beneficiaries/add");
  };

  if (loading) return <div className="text-center mt-20 text-lg">Loading...</div>;
  if (!user) return <div className="text-center mt-20 text-lg">Please login to view beneficiaries.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Beneficiaries</h1>
        <button
          onClick={handleCreateClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow-md transition-colors"
        >
          + Create Beneficiary
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {beneficiaries.length === 0 ? (
        <div className="text-gray-500 mt-10 text-center">
          No beneficiaries yet. Click "Create Beneficiary" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {beneficiaries.map((b) => (
            <BeneficiaryCard key={b.beneficiary_id} beneficiary={b} />
          ))}
        </div>
      )}
    </div>
  );
}
