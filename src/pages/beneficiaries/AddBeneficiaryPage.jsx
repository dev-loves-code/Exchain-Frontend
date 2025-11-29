import React from "react";
import BeneficiaryForm from "../../components/beneficiaries/BeneficiaryForm";
import { useNavigate } from "react-router-dom";

export default function AddBeneficiaryPage() {
  const navigate = useNavigate();

  const handleSuccess = (createdBeneficiary) => {
    // Optionally, you could show a toast or log the created data
    console.log("Beneficiary created:", createdBeneficiary);
    navigate("/beneficiaries");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <BeneficiaryForm mode="create" onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
