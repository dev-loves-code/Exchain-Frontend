import React from "react";
import { useNavigate } from "react-router-dom";

export default function BeneficiaryCard({ beneficiary, onDelete }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/beneficiaries/${beneficiary.beneficiary_id}/edit`);
  };

const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this beneficiary?")) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://127.0.0.1:8000/api/beneficiaries/destroy/${beneficiary.beneficiary_id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (data.success) {
      alert("Beneficiary deleted successfully");
      // Refresh the page
      window.location.reload();
      // OR you can also call onDelete if you still want to update parent state
      // onDelete && onDelete(beneficiary.beneficiary_id);
    } else {
      alert(data.message || "Failed to delete");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
};


  return (
    <div
      className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-4 cursor-pointer border border-gray-200 flex flex-col justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{beneficiary.name}</h3>
        {beneficiary.email && <p className="text-sm text-gray-500 mt-1">Email: {beneficiary.email}</p>}
        {beneficiary.phone && <p className="text-sm text-gray-500 mt-1">Phone: {beneficiary.phone}</p>}
        {beneficiary.wallet && <p className="text-sm text-gray-500 mt-1">Wallet: {beneficiary.wallet.name || beneficiary.wallet.wallet_id}</p>}
        {beneficiary.payment_method && <p className="text-sm text-gray-500 mt-1">Payment Method: {beneficiary.payment_method.name || beneficiary.payment_method.payment_method_id}</p>}
        {beneficiary.bank_account && <p className="text-sm text-gray-500 mt-1">Bank Account: {beneficiary.bank_account.account_number || beneficiary.bank_account.bank_account_id}</p>}
      </div>

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); handleEdit(); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
