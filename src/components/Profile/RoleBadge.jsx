import { Shield, User as UserIcon, Briefcase } from 'lucide-react';

const RoleBadge = ({ role }) => {
  const config = {
    admin: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      icon: Shield,
      label: 'Admin'
    },
    agent: {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      icon: Briefcase,
      label: 'Agent'
    },
    user: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: UserIcon,
      label: 'User'
    }
  };

  const roleConfig = config[role] || config.user;
  const Icon = roleConfig.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${roleConfig.bg} ${roleConfig.text}`}>
      <Icon className="w-4 h-4" />
      <span>{roleConfig.label}</span>
    </div>
  );
};

export default RoleBadge;