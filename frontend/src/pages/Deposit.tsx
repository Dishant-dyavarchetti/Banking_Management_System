import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import * as storage from '@/utils/storage';
import { calculateBalance, generateTransactionId } from '@/utils/bankingUtils';
import { formatCurrency } from '@/utils/formatCurrency';
import PinVerificationModal from '@/components/PinVerificationModal';
import Alert from '@/components/Alert';
import type { Transaction } from '@/types';

export default function Deposit() {
  const navigate = useNavigate();
  const { transactions, setTransactions } = useApp();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingDeposit, setPendingDeposit] = useState<{ amount: number; description: string } | null>(null);

  const handleVerifyAndDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amt = parseFloat(amount);
    if (!amount || isNaN(amt)) {
      setError('Please enter a valid amount.');
      return;
    }
    if (amt <= 0) {
      setError('Deposit amount must be greater than zero.');
      return;
    }

    // Store pending deposit and ask for PIN
    setPendingDeposit({ amount: amt, description: description.trim() });
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    if (!pendingDeposit) return;
    setShowPinModal(false);

    const currentBalance = calculateBalance(transactions);
    const newBalance = currentBalance + pendingDeposit.amount;

    const newTx: Transaction = {
      id: generateTransactionId(),
      date: new Date().toISOString(),
      type: 'Deposit',
      description: pendingDeposit.description || 'Deposit',
      amount: pendingDeposit.amount,
      balanceAfter: newBalance,
      status: 'Success',
    };

    setTransactions([...transactions, newTx]);
    setSuccess(`Successfully deposited ${formatCurrency(pendingDeposit.amount)}.`);
    setAmount('');
    setDescription('');
    setPendingDeposit(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <ArrowDownCircle className="w-7 h-7 text-green-600" />
            Deposit Funds
          </h1>
          <p className="text-gray-500 mt-1">Add money to your demo account (PIN verification required).</p>
        </div>

        {error && <div className="mb-4"><Alert type="error" message={error} autoClose={false} /></div>}
        {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleVerifyAndDeposit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Deposit Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all text-lg"
              />
              <p className="text-xs text-gray-400 mt-1">Enter a positive amount. Invalid amounts will be rejected.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Salary deposit, cash deposit"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
              />
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Your deposit will be verified with your 4-digit PIN before processing.</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-navy-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                Verify PIN & Deposit
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPinModal && (
        <PinVerificationModal
          onSuccess={handlePinSuccess}
          onClose={() => {
            setShowPinModal(false);
            setPendingDeposit(null);
          }}
          title="Confirm Deposit"
          message="Enter your PIN to authorize this deposit."
        />
      )}
    </div>
  );
}
