import {
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
  NoSymbolIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import AgentStatusBadge from './AgentStatusBadge';

export default function AgentCard({
  agent,
  isAdmin,
  updatingStatus,
  onViewAgent,
  onUpdateStatus,
}) {
  const handleCardClick = (e) => {
    // Don't trigger view if clicking on admin buttons
    if (e.target.closest('.admin-actions')) return;
    onViewAgent(agent.agent_id, agent.name);
  };

  return (
    <div
      className="group bg-white rounded-xl border border-gray-200 hover:border-teal-300 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* Agent Info */}
          <div className="flex items-center flex-1 min-w-0">
            {/* Avatar */}
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {agent.full_name?.charAt(0) || 'A'}
              </div>
            </div>

            {/* Compact Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors duration-200 truncate mr-2">
                    {agent.full_name}
                  </h3>
                  {isAdmin && agent.status && (
                    <AgentStatusBadge status={agent.status} />
                  )}
                </div>
                <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-teal-500 flex-shrink-0 ml-2" />
              </div>

              {/* Details */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPinIcon className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[120px]">{agent.city}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>
                    {agent.working_hours_start} - {agent.working_hours_end}
                  </span>
                </div>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                  <span className="font-semibold text-green-600">
                    {agent.commission_rate ?? 'N/A'}%
                  </span>
                </div>
                {agent.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-3 w-3 mr-1" />
                    <span>{agent.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="admin-actions flex items-center space-x-2 ml-4 flex-shrink-0">
              {agent.status === 'pending' ? (
                <>
                  <button
                    onClick={() => onUpdateStatus(agent.agent_id, 'accepted')}
                    disabled={updatingStatus === agent.agent_id}
                    className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    title="Accept Agent"
                  >
                    {updatingStatus === agent.agent_id ? (
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckBadgeIcon className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onUpdateStatus(agent.agent_id, 'rejected')}
                    disabled={updatingStatus === agent.agent_id}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    title="Reject Agent"
                  >
                    {updatingStatus === agent.agent_id ? (
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <NoSymbolIcon className="h-4 w-4" />
                    )}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-end space-y-1">
                  <AgentStatusBadge status={agent.status} showFullText />
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onUpdateStatus(agent.agent_id, 'accepted')}
                      disabled={
                        updatingStatus === agent.agent_id ||
                        agent.status === 'accepted'
                      }
                      className={`px-2 py-1 text-xs rounded ${agent.status === 'accepted' ? 'bg-green-50 text-green-600' : 'hover:bg-green-50 text-gray-500 hover:text-green-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onUpdateStatus(agent.agent_id, 'rejected')}
                      disabled={
                        updatingStatus === agent.agent_id ||
                        agent.status === 'rejected'
                      }
                      className={`px-2 py-1 text-xs rounded ${agent.status === 'rejected' ? 'bg-red-50 text-red-600' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
