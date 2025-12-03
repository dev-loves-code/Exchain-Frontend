import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function CurrencyDropdown({ 
  currencies, 
  selectedCurrency, 
  onSelectCurrency, 
  searchTerm, 
  onSearchChange 
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [filteredCurrencies, setFilteredCurrencies] = useState(currencies);

  useEffect(() => {
    const upperCaseTerm = searchTerm.toUpperCase();
    setFilteredCurrencies(currencies.filter(currency => currency.includes(upperCaseTerm)));
  }, [searchTerm, currencies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (currency) => {
    onSelectCurrency(currency);
    onSearchChange(currency);
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-2 text-gray-700">Currency</label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 uppercase"
          placeholder="USD"
          maxLength="3"
        />
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:text-gray-700"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && filteredCurrencies.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
          {filteredCurrencies.map((currency) => (
            <div
              key={currency}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
              onClick={() => handleSelect(currency)}
            >
              <span className="font-medium text-gray-700">{currency}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}