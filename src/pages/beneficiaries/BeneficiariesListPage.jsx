import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import BeneficiaryCard from "../../components/beneficiaries/BeneficiaryCard";
import Loading from "../../components/Loading.jsx";
import { useNavigate } from "react-router-dom";
import { Plus, Users } from "lucide-react";

export default function BeneficiariesListPage() {
  const { user, loading } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState(null); // start as null
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) fetchBeneficiaries();
  }, [loading, user]);

  const fetchBeneficiaries = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/beneficiaries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBeneficiaries(data.beneficiaries);
      else setError("Failed to fetch beneficiaries");
    } catch (err) {
      setError(err.message || "Network error");
    }
  };

  const handleCreateClick = () => {
    navigate("/beneficiaries/add");
  };

  if (loading || beneficiaries === null)
    return <Loading fullScreen={true} text="Loading beneficiaries..." />;

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-600 text-lg">Please login to view beneficiaries.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-blue-600 font-semibold">Manage Beneficiaries</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">
              Your Beneficiaries
            </h1>
          </div>
          <button
            onClick={handleCreateClick}
            className="bg-teal-800 hover:bg-teal-900 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create Beneficiary
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 text-red-700 rounded-xl border-2 border-red-200 font-medium">
            {error}
          </div>
        )}

        {/* Empty State */}
        {beneficiaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-2">No beneficiaries yet</p>
            <p className="text-gray-500 text-center">
              Click "Create Beneficiary" to add your first one.
            </p>
          </div>
        ) : (
          /* Beneficiaries Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficiaries.map((b) => (
              <BeneficiaryCard
                key={b.beneficiary_id}
                beneficiary={b}
                isSelected={selectedId === b.beneficiary_id}
                onSelect={() =>
                  setSelectedId(selectedId === b.beneficiary_id ? null : b.beneficiary_id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
