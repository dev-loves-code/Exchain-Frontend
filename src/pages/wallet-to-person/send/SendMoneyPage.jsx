import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import BeneficiarySelector from '../../../components/beneficiaries/BeneficiarySelector';
import CurrencySelector from '../../../components/wallet-to-person/CurrencySelector';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loading from '../../../components/Loading';
import ValidationErrors from '../../../components/ValidationErrors';
import WalletSelector from '../../../components/Wallet/WalletSelector';

export default function SendMoneyPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    senderWalletId: '',
    recipient: '',
    recipientEmail: '',
    amount: '',
    currency: 'USD',
    recipientCurrency: 'USD',
    includeFees: true,
    serviceId: '',
  });

  // Fetch cash-out services
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:8000/api/services?filter[service_type]=cash_out', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setServices(data.data.data);
      })
      .catch(console.error);
  }, [user]);

  const handleBeneficiarySelect = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setFormData((prev) => ({
      ...prev,
      recipient: beneficiary.name,
      recipientEmail: beneficiary.email || '',
    }));
  };

  // Calculations
  const selectedService = services.find(
    (s) => String(s.service_id) === String(formData.serviceId)
  );

  const amountNum = parseFloat(formData.amount) || 0;
  const feePercentage = selectedService ? Number(selectedService.fee_percentage) : 0;
  const fees = (amountNum * (feePercentage / 100)).toFixed(2);
  const totalToPay = formData.includeFees
    ? (amountNum + parseFloat(fees)).toFixed(2)
    : amountNum.toFixed(2);

  const recipientGets = amountNum.toFixed(2);

  const onContinue = () => {
    if (!formData.senderWalletId) return setErrors(['Enter sender wallet ID']);
    if (!formData.recipient || !formData.recipientEmail)
      return setErrors(['Enter recipient details']);
    if (!formData.serviceId) return setErrors(['Select a cash-out service']);
    if (amountNum < 5) return setErrors(['Minimum amount allowed is 5']);

    navigate('/send/confirm', {
      state: { formData, fees, totalToPay, recipientGets },
    });
  };

  if (loading) return <Loading fullScreen text="Loading user data..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Steps Header */}
        <div className="flex justify-center items-center gap-8 mb-10">
          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Confirm' },
            { num: 3, label: 'Success' },
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  step === s.num
                    ? 'bg-teal-800 text-white shadow-lg'
                    : step > s.num
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s.num ? <Check className="w-6 h-6" /> : s.num}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  step === s.num ? 'text-teal-800' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* GRID LAYOUT FIXED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT PANEL — FORM */}
          <div className="bg-white rounded-2xl shadow-lg p-8 h-fit lg:sticky lg:top-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Send Money</h1>
              <p className="text-gray-600">Send your money anytime, anywhere in the world.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Details</h2>

              <div className="space-y-5">

                {/* Wallet */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Your Wallet ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.senderWalletId}
                    onChange={(e) =>
                      setFormData({ ...formData, senderWalletId: e.target.value })
                    }
                    placeholder="Enter your wallet ID"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>

                {/* Recipient */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Recipient <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) =>
                      setFormData({ ...formData, recipient: e.target.value })
                    }
                    placeholder="Recipient Name"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900"
                  />
                </div>

                {/* Recipient Email */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Recipient Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.recipientEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientEmail: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    You Send <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 flex-col">
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="Amount"
                      className={`flex-1 px-4 py-3 border rounded-xl bg-white ${
                        amountNum < 5 ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {amountNum < 5 && (
                      <p className="text-red-500 text-sm mt-1">
                        Minimum amount allowed is 5
                      </p>
                    )}
                  </div>
                </div>

                {/* Include Fees */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Include Fees</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="includeFees"
                        value="true"
                        checked={formData.includeFees === true}
                        onChange={() =>
                          setFormData({ ...formData, includeFees: true })
                        }
                        className="accent-teal-800"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="includeFees"
                        value="false"
                        checked={formData.includeFees === false}
                        onChange={() =>
                          setFormData({ ...formData, includeFees: false })
                        }
                        className="accent-teal-800"
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Service */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Select Cash-Out Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceId: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl"
                  >
                    <option value="">Select Service</option>
                    {services.map((s) => (
                      <option key={s.service_id} value={s.service_id}>
                        {s.service_type} - {s.transfer_speed} - Fee: {s.fee_percentage}%
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient Currency */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Recipient Currency
                  </label>
                  <CurrencySelector
                    value={formData.recipientCurrency}
                    onChange={(c) =>
                      setFormData({ ...formData, recipientCurrency: c })
                    }
                  />
                </div>

              </div>
            </div>

            {/* Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-700 font-medium">Total Fees</span>
                <span className="text-gray-900 font-bold">
                  {fees} {formData.currency}
                </span>
              </div>

              <div className="flex justify-between py-3">
                <span className="text-gray-900 font-bold text-lg">Total To Pay</span>
                <span className="text-gray-900 font-bold text-xl">
                  {totalToPay} {formData.currency}
                </span>
              </div>
            </div>

            <button
              onClick={onContinue}
              className="w-full py-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-lg rounded-xl shadow-lg"
            >
              CONTINUE
            </button>
          </div>

          {/* RIGHT PANEL — BENEFICIARY + WALLET */}
          <div className="bg-white p-8 rounded-xl shadow-lg">

            {/* Beneficiary selector */}
            <h2 className="text-2xl font-bold mb-6">Select Beneficiary</h2>
            <BeneficiarySelector onSelect={handleBeneficiarySelect} />

            {/* Wallet selector */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Select Wallet</h2>
              <WalletSelector
                compact={true}
                showAllOption={false}
                onSelect={(wallet) =>
                  setFormData((prev) => ({
                    ...prev,
                    senderWalletId: wallet?.wallet_id || "",
                  }))
                }
              />
            </div>

          </div>
        </div>
      </div>

      {/* Validation Errors Popup */}
      <ValidationErrors errors={errors} onClose={() => setErrors([])} />
    </div>
  );
}
