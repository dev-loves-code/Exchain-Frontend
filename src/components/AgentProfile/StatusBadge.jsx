const StatusBadge = ({ status }) => {
  const config = {
    accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Accepted' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' }
  };
  
  const statusConfig = config[status] || config.pending;
  
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
      {statusConfig.label}
    </span>
  );
};

export default StatusBadge;