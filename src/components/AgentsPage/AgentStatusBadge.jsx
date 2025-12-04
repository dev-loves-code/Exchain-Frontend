import {
  CheckCircleIcon,
  ClockIcon as ClockIconSolid,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function AgentStatusBadge({ status, showFullText = false }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-3 w-3 text-green-500" />;
      case 'pending':
        return <ClockIconSolid className="h-3 w-3 text-yellow-500" />;
      case 'rejected':
        return <XCircleIcon className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div
      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(status)}`}
    >
      {getStatusIcon(status)}
      <span
        className={`ml-1 capitalize ${showFullText ? '' : 'hidden sm:inline'}`}
      >
        {status}
      </span>
    </div>
  );
}
