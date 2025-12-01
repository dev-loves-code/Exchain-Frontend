import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Sparkles } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function SupportRequestForm({ onSuccess }) {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({ subject: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | "success" | "error" | "loading"
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.subject.trim() || !formData.description.trim()) {
      setMessage("Please fill in all required fields");
      setStatus("error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/support/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "Failed to send request");
        setLoading(false);
        return;
      }

      setStatus("success");
      setMessage(data.message || "Request sent successfully!");
      setFormData({ subject: "", description: "" });
      setLoading(false);

      // Call onSuccess callback
      onSuccess && onSuccess(data);
    } catch (err) {
      setStatus("error");
      setMessage("Network error — please try again.");
      setLoading(false);
    }
  };

  // Auto-close overlay after 3 seconds for success/error
  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus(null), 3000); 
      return () => clearTimeout(timer);
    }
  }, [status]);

  const StatusOverlay = ({ title, message, lottie, loop = false }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-3xl p-10 max-w-md shadow-2xl text-center">
        <div className="w-40 h-40 mx-auto mb-4">
          <DotLottieReact src={lottie} loop={loop} autoplay />
        </div>
        {title && <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>}
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold text-lg">Contact Support</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Our support team is ready to assist you
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-900 font-medium mb-2">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue"
                rows={5}
                className="w-full px-5 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>

      {/* Overlays */}
      {status === "loading" && (
        <StatusOverlay
          title="Submitting..."
          message="Please wait while we send your request"
          lottie="https://lottie.host/4cbbe026-9c3c-4373-a9f3-5d4a49449ca5/rbCwVQg5WV.lottie"
          loop={true}
        />
      )}
      {status === "success" && (
        <StatusOverlay
          title="Success!"
          message={message}
          lottie="https://lottie.host/4cbbe026-9c3c-4373-a9f3-5d4a49449ca5/rbCwVQg5WV.lottie"
          loop={true}
        />
      )}
      {status === "error" && (
        <StatusOverlay
          title="Error"
          message={message}
          lottie="https://lottie.host/3c4abfe5-b109-4395-9436-23bc908a89fb/Lvm3Z2xWC4.lottie"
          loop={false}
        />
      )}
    </div>
  );
}
