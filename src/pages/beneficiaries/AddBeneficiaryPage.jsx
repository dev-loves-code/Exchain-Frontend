import React from "react";
import BeneficiaryForm from "../../components/beneficiaries/BeneficiaryForm";
import { useNavigate } from "react-router-dom";

export default function AddBeneficiaryPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await fetch("http://localhost:8000/api/beneficiaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    navigate("/beneficiaries");
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Beneficiary</h2>
      <BeneficiaryForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
