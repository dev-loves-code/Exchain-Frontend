import { CurrencyDollarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import OperationRow from './OperationRow';
import Pagination from '../shared/Pagination';

export default function OperationsTable({
  operations,
  loading,
  pagination,
  onPageChange,
  onApprove,
  onReject,
  onPerPageChange,
  onRefresh,
}) {
  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading operations...</p>
      </div>
    );
  }

  if (operations.length === 0) {
    return (
      <div className="py-16 text-center">
        <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No operations found
        </h3>
        <p className="text-gray-500">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Wallet Amount
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {operations.map((op) => (
              <OperationRow
                key={op.cash_op_id}
                operation={op}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </>
  );
}
