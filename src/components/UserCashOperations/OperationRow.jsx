import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  WalletIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import {
  getStatusColor,
  getOperationTypeColor,
} from '../../utils/statusColors';

export default function OperationRow({ operation, onApprove, onReject }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const OperationTypeBadge = ({ type }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getOperationTypeColor(type)}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="py-4 px-6">
        <div className="flex items-center">
          {operation.operation_type === 'deposit' ? (
            <ArrowDownTrayIcon className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <ArrowUpTrayIcon className="h-5 w-5 text-red-500 mr-2" />
          )}
          <OperationTypeBadge type={operation.operation_type} />
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="font-semibold text-gray-900">
          {formatCurrency(operation.amount, operation.currency_code)}
        </div>
        <div className="text-sm text-gray-500">{operation.currency_code}</div>
      </td>
      <td className="py-4 px-6">
        <div className="font-semibold text-gray-900">
          {formatCurrency(
            operation.wallet_amount,
            operation.wallet?.currency_code
          )}
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <WalletIcon className="h-4 w-4 mr-1" />
          Wallet {operation.wallet?.wallet_id}
        </div>
      </td>
      <td className="py-4 px-6">
        <StatusBadge status={operation.status} />
      </td>
      <td className="py-4 px-6">
        <div className="text-sm text-gray-900">
          {formatDate(operation.created_at)}
        </div>
      </td>
      <td className="py-4 px-6">
        {operation.status === 'pending' ? (
          <div className="flex space-x-2">
            <button
              onClick={() => onApprove(operation.cash_op_id)}
              className="inline-flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200"
              title="Approve"
            >
              <CheckCircleIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onReject(operation.cash_op_id)}
              className="inline-flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200"
              title="Reject"
            >
              <XCircleIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-500">Completed</span>
        )}
      </td>
    </tr>
  );
}
