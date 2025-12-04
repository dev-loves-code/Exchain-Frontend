export default function CommissionSelector({
  commissionOption,
  onOptionChange,
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <label className="block text-lg font-semibold mb-4 text-gray-800">
        Commission Type
      </label>
      <div className="space-y-4">
        <label className="flex items-start space-x-4 p-4 border border-gray-300 rounded-xl hover:border-teal-400 transition-colors duration-200 cursor-pointer">
          <input
            type="radio"
            checked={commissionOption === 'excluding'}
            onChange={() => onOptionChange('excluding')}
            className="text-teal-600 focus:ring-teal-500 mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">
                Excluding Commission
              </span>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                Recommended
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              You pay: <span className="font-medium">Amount + Commission</span>{' '}
              | Wallet receives:{' '}
              <span className="font-medium">Full Amount</span>
            </p>
          </div>
        </label>
        <label className="flex items-start space-x-4 p-4 border border-gray-300 rounded-xl hover:border-gray-400 transition-colors duration-200 cursor-pointer">
          <input
            type="radio"
            checked={commissionOption === 'including'}
            onChange={() => onOptionChange('including')}
            className="text-gray-600 focus:ring-gray-500 mt-1"
          />
          <div>
            <span className="font-medium text-gray-800">
              Including Commission
            </span>
            <p className="text-sm text-gray-600 mt-2">
              You pay: <span className="font-medium">Full Amount</span> | Wallet
              receives: <span className="font-medium">Amount - Commission</span>
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
