import React, { useState, useEffect } from "react";
import { Search, Wallet, Check } from "lucide-react";
import useWallets from "../../hooks/getWallets";

export default function WalletSelector({ onSelect, showAllOption = false }) {
  const token = localStorage.getItem("token");

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const { wallets, fetchWallets } = useWallets(token);

  useEffect(() => {
    fetchWallets();
  }, []);

  const filtered = wallets.filter((w) =>
    `${w.wallet_id} ${w.currency_code} ${w.balance}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
return (
  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
    <h2 className="text-2xl font-black text-gray-900 mb-5">Select Wallet</h2>

    {/* Search bar */}
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search wallets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-gray-900 border border-gray-300 
                   focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
      />
    </div>

    {/* Optional All Wallets button */}
    {showAllOption && (
      <div
        onClick={() => {
          setSelected(null);
          onSelect(null);
        }}
        className={`p-4 mb-4 rounded-xl border-2 cursor-pointer transition shadow-sm ${
          selected === null
            ? "border-teal-600 bg-teal-50 shadow-md"
            : "border-gray-200 hover:border-teal-400 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gray-300 rounded-full flex items-center justify-center text-white font-extrabold">
            ALL
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-gray-900">All Wallets</h3>
            <p className="text-sm text-gray-500">View transactions for all wallets</p>
          </div>

          {selected === null && (
            <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    )}

    {/* Wallet list */}
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No wallets found</p>
        </div>
      ) : (
        filtered.map((w) => {
          const isSelected = selected?.wallet_id === w.wallet_id;

          return (
            <div
              key={w.wallet_id}
              onClick={() => {
                setSelected(w);
                onSelect(w);
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition shadow-sm ${
                isSelected
                  ? "border-teal-600 bg-teal-50 shadow-md"
                  : "border-gray-200 hover:border-teal-800 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-teal-800 
                                flex items-center justify-center text-white font-extrabold text-lg shadow-inner">
                  {w.currency_code[0].toUpperCase()}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Wallet #{w.wallet_id}</h3>
                  <p className="text-sm text-gray-600">
                    {w.balance} {w.currency_code}
                  </p>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg">
                <Wallet className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-semibold">
                  {w.currency_code} Wallet — {w.balance}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);
};