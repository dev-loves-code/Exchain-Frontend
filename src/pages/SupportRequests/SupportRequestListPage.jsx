import React from "react";
import SupportRequestList from "../../components/SupportRequests/SupportRequestList";

const SupportRequestListPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Support Request List</h1>
      <SupportRequestList />
    </div>
  );
};

export default SupportRequestListPage;
