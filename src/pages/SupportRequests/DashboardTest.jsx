import React from 'react';
import SupportCard from '../../components/SupportRequests/SupportCard';

const DashboardTest = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SupportCard
          subject="Need Help?"
          description="Need help with your account? Our experts are ready to assist you!"
        />

        <SupportCard
          subject="Another Feature"
          description="You can add any other card here, and it will sit side-by-side."
        />
      </div>

      {/* Other dashboard content can go here */}
    </div>
  );
};

export default DashboardTest;
