import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Wallet, CreditCard, Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BeneficiaryCard({ beneficiary, isSelected, onSelect }) {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this beneficiary?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:8000/api/beneficiaries/destroy/${beneficiary.beneficiary_id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) window.location.reload();
      else alert(data.message || "Failed to delete");
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const fetchDetails = async () => {
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://127.0.0.1:8000/api/beneficiaries/view/${beneficiary.beneficiary_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success && data.beneficiary) setDetails(data.beneficiary);
      else setDetails({});
    } catch (err) {
      console.error(err);
      setDetails({});
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (isSelected) fetchDetails();
  }, [isSelected]);

  const getPaymentInfo = () => {
  // Use details if available, otherwise fallback to beneficiary from props
  const info = details || beneficiary;

  if (info.wallet) {
    return { icon: Wallet, text: `Wallet: ${info.wallet.wallet_id ?? "N/A"}`, bgColor: "bg-purple-50", textColor: "text-purple-600" };
  }
  if (info.payment_method) {
    return {
      icon: CreditCard,
      text: `${info.payment_method.type || "Card"} ****${info.payment_method.last4 || ""}`,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    };
  }
  if (info.bank_account) {
    return {
      icon: Building2,
      text: info.bank_account.bank_name || "Unnamed Bank",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
    };
  }
  return { icon: User, text: "No payment method", bgColor: "bg-gray-50", textColor: "text-gray-500" };
};

  const { icon: Icon, text, bgColor, textColor } = getPaymentInfo();

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border-0 transition-all duration-300 p-6 cursor-pointer
      ${isSelected ? "ring-2 ring-teal-600 bg-teal-50 shadow-xl" : "hover:shadow-2xl hover:-translate-y-1"}`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {beneficiary.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900">{beneficiary.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{beneficiary.email || "No email"}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/beneficiaries/${beneficiary.beneficiary_id}/edit`);
            }}
            className="p-2.5 bg-teal-50 hover:bg-teal-100 rounded-xl transition-all hover:scale-110 shadow-sm"
          >
            <Edit2 className="w-5 h-5 text-teal-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl transition-all hover:scale-110 shadow-sm"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>

      {/* Payment Info */}
      <div className={`flex items-center gap-3 px-5 py-3.5 ${bgColor} rounded-xl ${textColor} mt-4 border border-gray-100`}>
        <Icon className="w-5 h-5" />
        <span className="font-semibold text-sm">{text}</span>
      </div>


      {/* Expanded Details */}
      {isSelected && (
        <div className="mt-5 border-t border-gray-200 pt-4 text-gray-700 space-y-2">
          {loadingDetails ? (
            <p>Loading details...</p>
          ) : details ? (
            <>
              <p><strong>Wallet ID:</strong> {details.wallet?.wallet_id ?? "N/A"}</p>
              <p><strong>Payment Method:</strong> {details.payment_method?.type ?? "N/A"}</p>
              <p><strong>Bank Account:</strong> {details.bank_account?.bank_name ?? "N/A"}</p>
              <p><strong>Bank Account ID:</strong> {details.bank_account?.id ?? "N/A"}</p>
            </>
          ) : (
            <p>No details available</p>
          )}
        </div>
      )}
    </div>
  );
}
