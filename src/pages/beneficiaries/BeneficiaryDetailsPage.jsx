import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Building2, User } from "lucide-react";
import Loading from "../../components/Loading.jsx";


export default function BeneficiaryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBeneficiary = async () => {
      try {
        setError("");
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in");

        const res = await fetch(`http://127.0.0.1:8000/api/beneficiaries/view/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || `HTTP error: ${res.status}`);
        }

        const data = await res.json();
        if (data.success) setBeneficiary(data.beneficiary);
        else throw new Error(data.message || "Failed to load beneficiary");
      } catch (err) {
        console.error(err);
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiary();
  }, [id]);

  const getPaymentInfo = () => {
    if (!beneficiary) return { icon: User, text: "No payment method", color: "text-gray-400" };

    if (beneficiary.wallet)
      return { icon: Wallet, text: beneficiary.wallet.name, color: "text-purple-600" };

    if (beneficiary.payment_method)
      return {
        icon: CreditCard,
        text: `${beneficiary.payment_method.type} ****${beneficiary.payment_method.last4 || ""}`,
        color: "text-blue-600",
      };

    if (beneficiary.bank_account)
      return { icon: Building2, text: beneficiary.bank_account.bank_name, color: "text-green-600" };

    return { icon: User, text: "No payment method", color: "text-gray-400" };
  };

  if (loading)  return <Loading fullScreen={true} text="Loading Data..." />;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
        <div>
          <button
            onClick={() => navigate("/beneficiaries")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  const { icon: Icon, text, color } = getPaymentInfo();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {beneficiary.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{beneficiary.name}</h2>
            <p className="text-gray-500">{beneficiary.email || "No email"}</p>
          </div>
        </div>

        <div className={`flex items-center gap-3 ${color}`}>
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="text-gray-700 font-medium">{text}</span>
        </div>

        {beneficiary.phone && (
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Phone</span>
            <span className="text-gray-800">{beneficiary.phone}</span>
          </div>
        )}

        <button
          onClick={() => navigate(`/beneficiaries/${id}/edit`)}
          className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md"
        >
          Edit Beneficiary
        </button>

        <button
          onClick={() => navigate("/beneficiaries")}
          className="mt-2 w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all"
        >
          Back to Beneficiaries
        </button>
      </div>
    </div>
  );
}
