import React from "react";

export default function TransactionDetails({ tx }) {
  if (!tx) return null;
  return (
    <div className="space-y-2">
      <div className="flex justify-between"><span>Reference</span><span className="font-semibold">{tx.reference_code || tx.id}</span></div>
      <div className="flex justify-between"><span>Amount</span><span>{tx.transfer_amount} {tx.currency_code}</span></div>
      <div className="flex justify-between"><span>Status</span><span>{tx.status}</span></div>
      <div className="flex justify-between"><span>Created</span><span>{tx.created_at}</span></div>
    </div>
  );
}
