import { FunnelIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function FilterCard({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-teal-50 rounded-lg">
          <FunnelIcon className="h-6 w-6 text-teal-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 ml-3">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operation Type
          </label>
          <select
            value={filters.operation_type}
            onChange={(e) => onFilterChange('operation_type', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
          >
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => onFilterChange('start_date', e.target.value)}
              className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => onFilterChange('end_date', e.target.value)}
              className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClearFilters}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
