import { 
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

export default function StatsCards({ stats }) {
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const cards = [
    {
      label: "Total Commission",
      value: stats.total_commission_usd,
      icon: CurrencyDollarIcon,
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
      textColor: "text-gray-900"
    },
    {
      label: "Total Deposits",
      value: stats.total_deposits_usd,
      icon: ArrowDownTrayIcon,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-gray-900"
    },
    {
      label: "Total Withdrawals",
      value: stats.total_withdrawals_usd,
      icon: ArrowUpTrayIcon,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      textColor: "text-gray-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bgColor} rounded-xl p-6 border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{card.label}</p>
              <p className={`text-2xl font-bold ${card.textColor} mt-2`}>
                {formatCurrency(card.value, 'USD')}
              </p>
            </div>
            <card.icon className={`h-10 w-10 ${card.iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  );
}