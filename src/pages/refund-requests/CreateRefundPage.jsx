import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import RefundForm from "../../components/refund-requests/RefundForm";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const CreateRefundPage = () => {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Reset state when component mounts
  useEffect(() => {
    setMessage("");
    setSuccess(false);
  }, []);

  const handleSubmit = async ({ transaction_id, description }) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/refund/request-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transaction_id, description }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setMessage(data.errors?.[0] || data.message || "Error");
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  const handleBack = () => { // Navigate back to transactions page ---------------------------------------------------------------------------------------------
    setSuccess(false); // show form again
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {!success ? (
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <RefundForm onSubmit={handleSubmit} />
            {message && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{message}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <DotLottieReact
            src="https://lottie.host/6f9e3138-8baa-4b7f-b705-27e1be593b04/nJdW0uSvbu.lottie"
            loop={true}
            autoplay
            style={{ width: 200, height: 200 }}
          />
          <p className="text-green-600 font-bold text-lg">
            Refund request submitted successfully!
          </p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go Back To Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateRefundPage;
