import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, XCircle, Printer } from 'lucide-react';
import Loading from '../../../components/Loading'; // adjust path if needed
import './ReceiptPage.css';

export default function ReceiptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate(-1);
      return;
    }

    const fetchReceipt = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to view the receipt');
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/transactions/receipt/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch receipt');
        }

        setTx(data.data || {});
      } catch (err) {
        console.error('Failed to fetch transaction receipt:', err);
        alert(err.message || 'Could not load transaction details');
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print(); // simpler and safer in React
  };

  if (loading) {
    return <Loading fullScreen={true} text="Loading transaction..." />;
  }

  if (!tx) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <p className="text-gray-500">No transaction details available.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    done: {
      icon: <CheckCircle size={20} />,
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      label: 'COMPLETED',
    },
    pending: {
      icon: <Clock size={20} />,
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      label: 'PENDING',
    },
    refunded: {
      icon: <XCircle size={20} />,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      label: 'REFUNDED',
    },
    cancelled: {
      icon: <XCircle size={20} />,
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      label: 'CANCELLED',
    },
  };

  const statusKey = tx?.status?.trim().toLowerCase() || 'pending';
  const currentStatus = statusConfig[statusKey] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-white transition-all shadow-sm hover:shadow-md print:hidden"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Receipt Document */}
        <div id="receipt" className="bg-white shadow-2xl">
          {/* Header */}
          <div className="border-b-2 border-gray-300 p-6 flex items-start justify-between">
            <div></div>
            <div className="text-center">
              <div className="bg-teal-800 text-white px-6 py-2 font-black text-xl mb-2">
                Exchain
              </div>
              <div className="text-xs text-gray-600">+961 76-410-921</div>
            </div>
            <div></div>
          </div>

          {/* Notice */}
          <div className="bg-gray-100 border-b border-gray-300 px-6 py-3">
            <p className="text-xs text-gray-700">
              <span className="font-bold">CUSTOMER NOTICE:</span> PLEASE PRINT
              CLEARLY. Keep this receipt as proof of transaction.
            </p>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Sender Section */}
            <div className="border-2 border-gray-300">
              <div className="bg-gray-200 px-3 py-1 border-b border-gray-300">
                <h3 className="text-xs font-bold uppercase">
                  Sender Information
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Sender Name
                    </label>
                    <div className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      {tx.sender?.full_name || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Currency
                    </label>
                    <div className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      {tx.sender?.currency || tx.currency_code || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="border-2 border-teal-800">
              <div className="bg-teal-800 text-white px-3 py-2">
                <h3 className="text-sm font-bold uppercase">
                  Transaction Details
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Transfer Amount
                    </label>
                    <div className="text-lg font-bold text-gray-900 border-b-2 border-gray-400 pb-1">
                      ${tx.transfer_details?.amount || tx.transfer_amount || 0}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Currency
                    </label>
                    <div className="text-lg font-bold text-gray-900 border-b-2 border-gray-400 pb-1">
                      {tx.sender?.currency || tx.currency_code || ''}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Recipient Name
                    </label>
                    <div className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      {tx.receiver?.name || tx.receiver_email || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Recipient Email
                    </label>
                    <div className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      {tx.receiver?.email || '-'}
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Fees
                      </label>
                      <div className="text-sm font-semibold text-gray-900">
                        ${tx.transfer_details?.fee || tx.transfer_fee || 0}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Exchange Rate
                      </label>
                      <div className="text-sm font-semibold text-gray-900">
                        {tx.transfer_details?.exchange_rate || 1}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Status
                      </label>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold ${currentStatus.bg} ${currentStatus.text} border ${currentStatus.border} rounded`}
                      >
                        {currentStatus.icon}
                        {currentStatus.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Received */}
            <div className="border-2 border-gray-900">
              <div className="bg-yellow-400 text-gray-900 px-3 py-2 border-b-2 border-gray-900">
                <h3 className="text-sm font-bold uppercase">Amount Received</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Received Amount
                    </label>
                    <div className="text-2xl font-black text-teal-800 border-b-2 border-gray-400 pb-1">
                      ${tx.transfer_details?.received_amount || 0}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Currency
                    </label>
                    <div className="text-2xl font-black text-teal-800 border-b-2 border-gray-400 pb-1">
                      {tx.receiver?.currency || ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reference & Date */}
            <div className="border-2 border-gray-300">
              <div className="bg-gray-900 text-white px-3 py-1">
                <h3 className="text-xs font-bold uppercase">
                  Transaction Reference
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">
                    Reference Number (MTCN)
                  </label>
                  <div className="text-xl font-mono font-black text-gray-900 bg-gray-100 border-2 border-gray-400 p-3 text-center tracking-wider">
                    {tx.reference_code || tx.transaction_id}
                  </div>
                </div>
                {tx.created_at && (
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Transaction Date & Time
                    </label>
                    <div className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1">
                      {new Date(tx.created_at).toLocaleString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-gray-50 border border-gray-300 p-4">
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold">IMPORTANT:</span> This receipt is
                proof of your transaction. Please keep it for your records. The
                reference number above is required to track or modify this
                transaction. If you have any questions, please contact customer
                service at +961 76-410-921.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-600 mb-2">
              Thank you for your transaction
            </p>
            <p className="text-xs text-gray-500">
              Generated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
          >
            <Printer size={20} />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-teal-800 text-white rounded-xl font-semibold hover:bg-teal-900 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={20} />
            <span>Back to Transactions</span>
          </button>
        </div>
      </div>
    </div>
  );
}
