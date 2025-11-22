import React from "react";
import SupportRequestForm from "../components/SupportRequests/SupportRequestForm";

const SupportPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Send a Support Request</h1>
      <SupportRequestForm onRequestSent={() => alert("Request sent!")} />
    </div>
  );
};

export default SupportPage;
