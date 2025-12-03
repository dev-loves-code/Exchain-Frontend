export default function TransactionSummary({ 
  commissionOption, 
  agentCommission, 
  baseAmount, 
  currency, 
  amounts 
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h4 className="text-xl font-semibold mb-6 text-gray-800">Transaction Summary</h4>
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Commission Type:</span>
          <span className={`px-4 py-2 rounded-full font-medium ${commissionOption === 'excluding' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>
            {commissionOption} Commission
          </span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <div>
            <span className="text-gray-700 font-semibold">You Pay</span>
            <p className="text-sm text-gray-500 mt-1">Total amount you collect</p>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {amounts.youPay.toFixed(2)} {currency}
          </span>
        </div>

        <div className="space-y-3 pl-4 border-l-2 border-gray-200">
          {commissionOption === "excluding" && baseAmount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Base Amount:</span>
              <span className="text-gray-700 font-medium">{baseAmount.toFixed(2)} {currency}</span>
            </div>
          )}

          {agentCommission > 0 && amounts.commission > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Commission ({agentCommission}%):</span>
              <span className={`font-semibold ${commissionOption === "excluding" ? 'text-red-600' : 'text-yellow-600'}`}>
                {commissionOption === "excluding" ? '+' : '-'}{amounts.commission.toFixed(2)} {currency}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div>
            <span className="text-gray-800 font-bold text-lg">Wallet Receives</span>
            <p className="text-sm text-gray-500 mt-1">Amount credited to wallet</p>
          </div>
          <span className="text-2xl font-bold text-green-600">
            {amounts.walletReceives.toFixed(2)} {currency}
          </span>
        </div>
      </div>
    </div>
  );
}