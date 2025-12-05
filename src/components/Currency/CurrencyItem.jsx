import React from "react";

/**
 * CurrencyItem
 * Props:
 *  - currencyCode: string
 *  - isSelected: boolean
 *  - onSelect: (code) => void
 */
export default function CurrencyItem({ currencyCode, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(currencyCode)}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition text-left ${
        isSelected ? "bg-blue-50 border-2 border-teal-500" : "hover:bg-gray-50 border-2 border-transparent"
      }`}
      type="button"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
          isSelected ? "bg-teal-500" : "bg-blue-100"
        }`}
      >
        <span className={`font-bold text-sm ${isSelected ? "text-white" : "text-teal-600"}`}>
          {currencyCode.substring(0, 2)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900">{currencyCode}</div>
      </div>

      {isSelected && (
        <div className="text-teal-500">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
