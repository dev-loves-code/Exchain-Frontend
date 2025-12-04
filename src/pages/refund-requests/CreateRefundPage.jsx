import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import RefundForm from "../../components/refund-requests/RefundForm";
import ValidationErrors from "../../components/ValidationErrors";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const CreateRefundPage = () => {
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetTransactionId = searchParams.get("transaction_id");

  useEffect(() => {
    setSuccess(false);
  }, []);

  const handleSubmit = async ({ description }) => {
    const token = localStorage.getItem("token");
    setErrors([]); // Reset previous errors

    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transaction_id: presetTransactionId,
          description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        return { success: true };
      } else {
        const message = data.errors?.[0] || data.message || "Error submitting refund request";
        setErrors([message]); // Show error in popup
        return { success: false, message };
      }
    } catch (err) {
      const message = "Network error. Please try again.";
      setErrors([message]);
      return { success: false, message };
    }
  };

  const handleBack = () => {
    navigate("/transactions");
  };

  return (
    <>
      {!success ? (
        <RefundForm onSubmit={handleSubmit} presetTransactionId={presetTransactionId} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-6 bg-white rounded-3xl shadow-2xl border border-gray-200 p-12">
            <DotLottieReact
              src="https://lottie.host/6f9e3138-8baa-4b7f-b705-27e1be593b04/nJdW0uSvbu.lottie"
              loop
              autoplay
              style={{ width: 200, height: 200 }}
            />
            <p className="text-green-600 font-bold text-xl text-center">
              Refund request submitted successfully!
            </p>
            <button
              onClick={handleBack}
              className="mt-2 px-6 py-4 bg-teal-800 text-white rounded-xl font-semibold text-base hover:bg-teal-900 shadow-lg hover:shadow-xl transition-all"
            >
              Go Back To Transactions
            </button>
          </div>
        </div>
      )}

      {/* Validation Errors Popup */}
      <ValidationErrors errors={errors} onClose={() => setErrors([])} />
    </>
  );
};

export default CreateRefundPage;
