import {
  CheckCircleIcon,
  ClockIcon as ClockIconSolid,
  XCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function StatsCards({ agents }) {
  const acceptedCount = agents.filter((a) => a.status === 'accepted').length;
  const pendingCount = agents.filter((a) => a.status === 'pending').length;
  const rejectedCount = agents.filter((a) => a.status === 'rejected').length;
  const totalCount = agents.length;

  const stats = [
    {
      label: 'Accepted',
      value: acceptedCount,
      icon: CheckCircleIcon,
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Pending',
      value: pendingCount,
      icon: ClockIconSolid,
      color: 'from-yellow-400 to-yellow-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Rejected',
      value: rejectedCount,
      icon: XCircleIcon,
      color: 'from-red-400 to-red-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: 'Total Agents',
      value: totalCount,
      icon: UserIcon,
      color: 'from-teal-400 to-teal-500',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bgColor} rounded-xl p-4 border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
            <stat.icon className={`h-7 w-7 ${stat.iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
