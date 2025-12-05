import { Trash2 } from "lucide-react";

export default function EWalletCard({ wallet, onDelete, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl p-6 w-80 cursor-pointer overflow-hidden 
      bg-gradient-to-br from-teal-900/95 via-teal-800/95 to-teal-900/95 
      text-white border border-teal-700/40 
      hover:border-teal-600/50 transition-all duration-300`}
    >

      {/* Minimal background effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-64 h-64 bg-teal-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-8">
          <p className="text-4xl font-medium mt-1 tracking-tight text-white/95">
            {wallet.currency_code} {wallet.balance}
          </p>
        </div>

        <div className="mt-8">
          <p className="text-sm font-normal mb-1.5 text-teal-100/60">
            E-Wallet Number
          </p>
          <p className="text-lg font-medium tracking-wide text-white/90">
            {wallet.wallet_id}
          </p>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute bottom-6 right-6 
                       p-2 rounded-full transition-all duration-200
                       hover:bg-teal-800/30 text-teal-200/60 hover:text-teal-100"
            aria-label="Delete wallet"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}