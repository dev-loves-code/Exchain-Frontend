import React from "react";
import { useNavigate } from "react-router-dom";
import { Headphones } from "lucide-react";

const SupportCard = ({ subject, description }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/support-request"); // navigate to support form page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <Headphones className="w-10 h-10 text-teal-700" />
        </div>

        {/* Subject */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {subject || "Need Help?"}
        </h2>

        {/* Description */}
        <p className="text-gray-700 mb-8">
          {description || "Need help with your account? Our experts are ready to assist you!"}
        </p>

        {/* Button */}
        <button
          onClick={handleChatClick}
          className="w-full py-4 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default SupportCard;
