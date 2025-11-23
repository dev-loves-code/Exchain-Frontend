import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Hash, ArrowLeft } from "lucide-react";

const RefundForm = ({ onSubmit }) => {
  const [transactionId, setTransactionId] = useState("");
  const [description, setDescription] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ transaction_id: transactionId, description });
  };

  const handleBack = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <div className="w-full">
      {/* Back button on top */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Form header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Request Refund
        </h2>
        <p className="text-slate-500">
          Fill in the details below to process your refund request
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Transaction ID
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Hash size={20} />
            </div>
            <input
              type="text"
              placeholder="Enter transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              onFocus={() => setFocusedField("transaction")}
              onBlur={() => setFocusedField(null)}
              required
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 outline-none ${
                focusedField === "transaction"
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-slate-400">
              <FileText size={20} />
            </div>
            <textarea
              placeholder="Describe the reason for your refund request"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocusedField("description")}
              onBlur={() => setFocusedField(null)}
              required
              rows={4}
              className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl transition-all duration-200 outline-none resize-none ${
                focusedField === "description"
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          Submit Request
          <ArrowRight
            size={20}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          Your refund request will be reviewed within 2-3 business days
        </p>
      </div>
    </div>
  );
};

export default RefundForm;
