const InfoCard = ({ icon: Icon, title, value, subtext = null }) => {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-200">
      <div className="bg-gray-100 p-3 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-gray-900 font-medium">{value || 'Not provided'}</p>
        {subtext && <p className="text-sm text-gray-600 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};

export default InfoCard;
