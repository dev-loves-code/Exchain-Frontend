import React from "react";
import SupportCard from "../components/SupportRequests/SupportCard";

const DashboardTest = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <SupportCard
        subject="Need Help?"
        description="Need help with your account? Our experts are ready to assist you!"
      />

      {/* Other dashboard content can go here */}
    </div>
  );
};

export default DashboardTest;
