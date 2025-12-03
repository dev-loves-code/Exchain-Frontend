import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function CommissionRateCard({ agentCommission }) {
  if (!agentCommission || agentCommission <= 0) return null;

  return (
    <div className="mb-6 p-6 bg-teal-50 border border-teal-200 rounded-xl">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">Your Commission Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{agentCommission}%</p>
        </div>
        <div className="p-3 bg-white rounded-lg">
          <CurrencyDollarIcon className="h-8 w-8 text-teal-600" />
        </div>
      </div>
    </div>
  );
}