import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const SupportRequestForm = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ subject: false, description: false });
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {
      subject: subject.trim() === "",
      description: description.trim() === "",
    };
    setErrors(newErrors);
    return !newErrors.subject && !newErrors.description;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/support/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "Failed to send request");
        setTimeout(() => setStatus(null), 3000);
        return;
      }

      setStatus("success");
      setMessage(data.message || "Request sent successfully!");
      setSubject("");
      setDescription("");
      setErrors({ subject: false, description: false });

      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus("error");
      setMessage("Network error — please try again.");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto overflow-hidden">
        


        {/* Form Section */}
<div className="px-6 py-8">
  <div className="space-y-6">

    {/* Form Title */}
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
      Contact Support
    </h2>
    <p className="text-gray-500 text-center mb-6">
      Our support team is ready to assist you.
    </p>

    {/* Subject Field */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Subject</label>
      <input
        type="text"
        value={subject}
        onChange={(e) => {
          setSubject(e.target.value);
          if (errors.subject && e.target.value.trim() !== "") {
            setErrors({ ...errors, subject: false });
          }
        }}
        placeholder="Enter subject"
        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none shadow-sm ${
          errors.subject
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
        }`}
      />
      {errors.subject && (
        <p className="text-red-500 text-sm mt-1">Subject is required</p>
      )}
    </div>

    {/* Description Field */}
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          if (errors.description && e.target.value.trim() !== "") {
            setErrors({ ...errors, description: false });
          }
        }}
        placeholder="Describe your issue"
        rows={5}
        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none shadow-sm resize-none ${
          errors.description
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
        }`}
      />
      {errors.description && (
        <p className="text-red-500 text-sm mt-1">Description is required</p>
      )}
    </div>

    {/* Submit Button */}
    <button
      onClick={handleSubmit}
      disabled={status === "loading"}
      className="w-full py-3 font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-shadow shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Submit Request
    </button>
  </div>
</div>

      </div>

      {/* Loading Overlay */}
      {status === "loading" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center justify-center">
            <div className="w-40 h-40">
              <DotLottieReact
                src="https://lottie.host/4cbbe026-9c3c-4373-a9f3-5d4a49449ca5/rbCwVQg5WV.lottie"
                loop
                autoplay
              />
            </div>
            <p className="text-white mt-4 text-lg font-medium">
              Sending your request...
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {status === "success" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md shadow-2xl text-center">
            <div className="w-40 h-40 mx-auto mb-4">
              <DotLottieReact
                src="https://lottie.host/4cbbe026-9c3c-4373-a9f3-5d4a49449ca5/rbCwVQg5WV.lottie"
                loop
                autoplay
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {status === "error" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md shadow-2xl text-center">
            <div className="w-40 h-40 mx-auto mb-4">
              <DotLottieReact
                src="https://lottie.host/3c4abfe5-b109-4395-9436-23bc908a89fb/Lvm3Z2xWC4.lottie"
                autoplay
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Error</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportRequestForm;