import { Trash2 } from "lucide-react";

export default function EWalletCard({ wallet, onDelete, onClick }) {
  const cardGradient = "from-teal-300 to-emerald-400";

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl p-6 w-80 shadow-xl cursor-pointer overflow-hidden 
      bg-gradient-to-br ${cardGradient} text-gray-900`}
    >

      {/* Soft background circles */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">

        {/* Balance */}
        <div className="mb-6">
          <p className="text-4xl font-bold mt-1">
            {wallet.currency_code} {wallet.balance}
          </p>
        </div>

        {/* Wallet Number */}
        <div>
          <p className="text-sm font-medium mb-1 text-gray-700 underline">
            E-Wallet Number
          </p>
          <p className="text-xl font-semibold tracking-wide">
            {wallet.wallet_id}
          </p>
        </div>

        {/* Delete Icon */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute bottom-2 right-2 bg-teal-600 hover:bg-teal-700 
                       p-2 rounded-full shadow-lg transition"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
