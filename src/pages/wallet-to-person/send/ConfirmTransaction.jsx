import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ConfirmTransaction() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state?.formData) {
    navigate("/send");
    return null;
  }

  const { formData } = state;

  const onConfirm = async () => {
    setLoading(true);
    try {
      const payload = {
        sender_wallet_id: formData.senderWalletId,
        receiver_email: formData.recipientEmail,
        transfer_amount: parseFloat(formData.amount),
        currency_code: formData.recipientCurrency,
        include_fees: formData.includeFees,
        service_id: formData.serviceId,
      };
      console.log("Payload:", payload);


      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in to perform this action");

      const res = await fetch(
        "http://127.0.0.1:8000/api/transactions/initiate-wallet-to-person",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data?.message || "Could not create transaction");

      const txId = data.data.transaction_id || data.data.id;
      
      navigate("/send/success", { state: { txId, recipientCurrency: formData.recipientCurrency  } });
    } catch (err) {
      console.error("Transaction error:", err);
      alert(err.message || "Could not create transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Confirm Transfer</h2>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between"><span>Recipient</span><span className="font-semibold">{formData.recipient}</span></div>
          <div className="flex justify-between"><span>Email</span><span className="font-semibold">{formData.recipientEmail}</span></div>
          <div className="flex justify-between"><span>You Send</span><span className="font-semibold">{formData.amount} {formData.currency}</span></div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="flex-1 py-3 border rounded-xl">Back</button>
          <button disabled={loading} onClick={onConfirm} className="flex-1 py-3 bg-teal-800 text-white font-bold rounded-xl">
            {loading ? "Processing..." : "Confirm & Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
