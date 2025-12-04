import {
  XMarkIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function UpdateCommissionModal({
  show,
  onClose,
  newCommissionRate,
  onRateChange,
  onUpdate,
  updatingCommission,
  commissionMessage,
  agentCount,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Update All Commissions
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {commissionMessage ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-7 w-7 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Success!
            </h4>
            <p className="text-gray-600">{commissionMessage}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Commission Rate (%)
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="0.1"
                  value={newCommissionRate}
                  onChange={onRateChange}
                  placeholder="Enter commission rate (1-100%)"
                  className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This will update commission for all {agentCount} agents
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                disabled={updatingCommission}
              >
                Cancel
              </button>
              <button
                onClick={onUpdate}
                disabled={updatingCommission || !newCommissionRate}
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {updatingCommission ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Update All
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
