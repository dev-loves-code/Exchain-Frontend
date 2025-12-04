import {
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function FilterCard({
  filters,
  isAdmin,
  onFilterChange,
  onClearFilters,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-teal-50 rounded-lg">
          <FunnelIcon className="h-6 w-6 text-teal-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 ml-3">Filters</h2>
        {(filters.city || filters.name || filters.status) && (
          <button
            onClick={onClearFilters}
            className="ml-auto text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      <div
        className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}
      >
        {/* Name Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
            Search by Name
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter agent name..."
              value={filters.name}
              onChange={(e) => onFilterChange('name', e.target.value)}
              className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
            Search by City
          </label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Enter city..."
              value={filters.city}
              onChange={(e) => onFilterChange('city', e.target.value)}
              className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Status Filter (Admin Only) */}
        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200"
            >
              <option value="">All Statuses</option>
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
