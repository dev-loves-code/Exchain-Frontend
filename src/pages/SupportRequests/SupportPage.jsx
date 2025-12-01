import React from "react";
import SupportRequestForm from "../../components/SupportRequests/SupportRequestForm";

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Optional padding wrapper */}
      <div className="w-full px-4">
        <SupportRequestForm />
      </div>
    </div>
  );
};

export default SupportPage;
