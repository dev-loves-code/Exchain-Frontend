import React from "react";
import { useNavigate } from "react-router-dom";
import { Headphones } from "lucide-react";

const SupportCard = ({ subject, description }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/support-request"); // navigate to form page
  };

  return (
    <div className="bg-neutral-100 w-full rounded-3xl p-6 shadow-md">
      <div className="text-center mb-6">
        <span className="text-gray-400 mb-2 block">
          <Headphones size={40} className="mx-auto" />
        </span>
        <div>
          <h4 className="text-gray-700 font-normal mb-2">{subject || "Need Help?"}</h4>
          <p className="text-gray-500 text-lg font-normal">
            {description || "Need help with your account? Our experts are ready to assist you!"}
          </p>
        </div>
      </div>

      <span className="border-b border-gray-200 w-full my-6 block"></span>

      <div className="px-3 pb-3 flex items-center">
        <button
          onClick={handleChatClick}
          className="py-3 w-full text-center font-semibold text-white bg-blue-600 rounded-3xl hover:bg-blue-700 transition"
        >
          Chat With Us
        </button>
      </div>
    </div>
  );
};

export default SupportCard;
