import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  Wallet,
  CreditCard,
  Building2,
  Check,
} from 'lucide-react';

export default function BeneficiarySelector({ onSelect }) {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:8000/api/beneficiaries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBeneficiaries(data.beneficiaries);
    } catch (err) {
      console.error('Error fetching beneficiaries:', err);
    }
  };

  const getPaymentInfo = (b) => {
    if (b.wallet)
      return {
        icon: Wallet,
        text: b.wallet.wallet_id,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
      };
    if (b.payment_method)
      return {
        icon: CreditCard,
        text: b.payment_method.method_type,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      };
    if (b.bank_account)
      return {
        icon: Building2,
        text: b.bank_account.receiver_bank_account,
        color: 'text-teal-700',
        bg: 'bg-teal-50',
      };
    return {
      icon: User,
      text: 'No payment method',
      color: 'text-gray-500',
      bg: 'bg-gray-50',
    };
  };

  const filtered = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-black text-gray-900 mb-4">
        Select Beneficiary
      </h2>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search beneficiaries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-gray-900 focus:ring-2 focus:ring-teal-600 transition"
        />
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No beneficiaries found</p>
          </div>
        ) : (
          filtered.map((b) => {
            const payment = getPaymentInfo(b);
            const Icon = payment.icon;
            const isSelected = selected?.beneficiary_id === b.beneficiary_id;

            return (
              <div
                key={b.beneficiary_id}
                onClick={() => {
                  setSelected(b);
                  onSelect(b);
                }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50 shadow-md'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {b.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{b.name}</h3>
                    <p className="text-sm text-gray-500">
                      {b.email || 'No email'}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center gap-2 px-3 py-2 ${payment.bg} rounded-lg ${payment.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-semibold">{payment.text}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
