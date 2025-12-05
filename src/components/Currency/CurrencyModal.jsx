import React, { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";
import CurrencySearch from "./CurrencySearch";
import CurrencyItem from "./CurrencyItem";


export default function CurrencyModal({
  show,
  onClose,
  currencies = [],
  onCreate,
  loadingCurrencies = false,
  creating = false,
  initialSelected = null,
  controlledSelected,
  onSelect,      // <-- new: optional callback for select mode
  mode = "create", // <-- "create" or "select"
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalSelected, setInternalSelected] = useState(initialSelected);

  useEffect(() => setInternalSelected(initialSelected), [initialSelected]);

  const selectedCurrency = controlledSelected ?? internalSelected;

  const handleSelect = (code) => {
    if (onSelect) {
      onSelect(code); 
    } else {
      setInternalSelected(code);
    }
  };

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencies;
    const q = searchTerm.trim().toLowerCase();
    return currencies.filter((c) => c.toLowerCase().includes(q));
  }, [currencies, searchTerm]);

  if (!show) return null;

  const buttonLabel = mode === "select" ? "Select Currency" : "Create Wallet";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Select Currency</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition" aria-label="Close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <CurrencySearch value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loadingCurrencies ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
            </div>
          ) : filteredCurrencies.length > 0 ? (
            <div className="p-2">
              {filteredCurrencies.map((currencyCode, idx) => (
                <CurrencyItem
                  key={`${currencyCode}-${idx}`}
                  currencyCode={currencyCode}
                  isSelected={selectedCurrency === currencyCode}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? "No currencies found matching your search" : "No available currencies"}
            </div>
          )}
        </div>

        {/* Confirm/Create Button */}
        <div className="p-4 border-t">
          <button
            onClick={() => (mode === "select" ? onSelect(selectedCurrency) : onCreate(selectedCurrency))}
            disabled={!selectedCurrency || (mode === "create" && creating)}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              selectedCurrency && !(mode === "create" && creating)
                ? "bg-blue-500 text-white hover:bg-teal-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            type="button"
          >
            {mode === "create" && creating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Creating...
              </span>
            ) : (
              buttonLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
