import React from 'react';
import SupportRequestList from '../../components/SupportRequests/SupportRequestList';

const SupportRequestListPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Optional Page Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Support Requests
      </h1>

      {/* Component */}
      <SupportRequestList />
    </div>
  );
};

export default SupportRequestListPage;
