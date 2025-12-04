export default function Pagination({ pagination, onPageChange }) {
  const { current_page, last_page } = pagination;

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Page {current_page} of {last_page}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 text-sm"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(current_page + 1)}
            disabled={current_page === last_page}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
