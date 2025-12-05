import React from "react";
import EWalletCard from "./EWalletCard.jsx";

export default function EWalletList({ wallets, onWalletClick, onWalletDelete, onAddWallet }) {
  if (wallets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-900 text-lg font-semibold opacity-70">
          No wallets found
        </p>

        <button
          onClick={onAddWallet}
          className="mt-4 bg-teal-900 text-white px-6 py-2 rounded-xl 
                     hover:bg-teal-800 transition shadow-md hover:shadow-lg"
        >
          Add New Wallet
        </button>
      </div>
    );
  }

  return (
  <div className="w-full">
    <div className="flex flex-wrap gap-6">
        {wallets.map((wallet) => (
          <div
            key={wallet.wallet_id}
            className="min-w-[16rem] md:min-w-[20rem] relative 
                       transition-transform hover:scale-[1.03]"
          >
            <EWalletCard
              wallet={wallet}
              onClick={() => onWalletClick(wallet)}
              {...(onWalletDelete
                ? { onDelete: () => onWalletDelete(wallet.wallet_id) }
                : {})}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
