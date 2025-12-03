import { 
  UserIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getStatusColor, getOperationTypeColor } from '../../utils/statusColors';

export default function OperationRow({ 
  operation, 
  onViewUser, 
  onCancel 
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const OperationTypeBadge = ({ type }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOperationTypeColor(type)}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="py-4 px-6">
        <OperationTypeBadge type={operation.operation_type} />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center">
          <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <div 
              className="font-medium text-gray-900 hover:text-teal-700 cursor-pointer"
              onClick={() => onViewUser(operation.user_id)}
            >
              {operation.user?.full_name || `User ${operation.user_id}`}
            </div>
            <div className="text-sm text-gray-500">ID: {operation.user_id}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="font-semibold text-gray-900">
          {formatCurrency(operation.amount, operation.currency_code)}
        </div>
        <div className="text-sm text-gray-500">
          Wallet: {formatCurrency(operation.wallet_amount, operation.wallet?.currency_code)}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="font-semibold text-green-600">
          {formatCurrency(operation.agent_commission, operation.currency_code)}
        </div>
      </td>
      <td className="py-4 px-6">
        <StatusBadge status={operation.status} />
      </td>
      <td className="py-4 px-6">
        <div className="text-sm text-gray-900">{formatDate(operation.created_at)}</div>
      </td>
      <td className="py-4 px-6">
        <div className="flex space-x-2">
          <button
            onClick={() => onViewUser(operation.user_id)}
            className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            title="View Customer"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          {operation.status === 'pending' && (
            <button
              onClick={() => onCancel(operation.cash_op_id)}
              className="inline-flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200"
              title="Cancel Operation"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}