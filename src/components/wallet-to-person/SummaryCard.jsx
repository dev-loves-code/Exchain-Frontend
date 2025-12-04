import React from 'react';

export default function SummaryCard({ fees, totalToPay, currency = 'USD' }) {
  return (
    <div className="space-y-3 mb-6">
      <div className="flex justify-between py-3 border-b">
        <span className="text-gray-700 font-medium">Total Fees</span>
        <span className="text-gray-900 font-bold">
          {fees} {currency}
        </span>
      </div>

      <div className="flex justify-between py-3">
        <span className="text-gray-900 font-bold text-lg">Total To Pay</span>
        <span className="text-gray-900 font-bold text-xl">
          {totalToPay} {currency}
        </span>
      </div>
    </div>
  );
}
