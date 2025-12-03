import { AlertCircle, CheckCircle } from 'lucide-react';

const Alert = ({ type, message }) => {
  const styles = {
    success: 'bg-green-50 border border-green-200 text-green-800',
    error: 'bg-red-50 border border-red-200 text-red-800',
  };
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  
  return (
    <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${styles[type]}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Alert;