import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateBalance, generateTransactionId } from '@/utils/bankingUtils';
import { formatCurrency } from '@/utils/formatCurrency';
import PinVerificationModal from '@/components/PinVerificationModal';
import Alert from '@/components/Alert';
import type { Transaction } from '@/types';

interface TransferForm {
  recipientName: string;
  recipientAccount: string;
  amount: string;
  description: string;
}

export default function FundTransfer() {
  const navigate = useNavigate();
  const { transactions, setTransactions } = useApp();
  const [form, setForm] = useState<TransferForm>({
    recipientName: '',
    recipientAccount: '',
    amount: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingTransfer, setPendingTransfer] = useState<TransferForm | null>(null);

  const balance = calculateBalance(transactions);

  const handleChange = (field: keyof TransferForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleVerifyAndTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.recipientName.trim()) {
      setError('Recipient name is required.');
      return;
    }
    if (!form.recipientAccount.trim()) {
      setError('Recipient account number is required.');
      return;
    }
    if (!/^\d{6,18}$/.test(form.recipientAccount.trim())) {
      setError('Please enter a valid recipient account number (6–18 digits).');
      return;
    }

    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }
    if (amt > balance) {
      setError(`Insufficient balance. Your available balance is ${formatCurrency(balance)}.`);
      return;
    }

    setPendingTransfer({ ...form });
    setShowPinModal(true);
  };

  const handlePinSuccess = () => {
    if (!pendingTransfer) return;
    setShowPinModal(false);

    const amt = parseFloat(pendingTransfer.amount);
    const currentBalance = calculateBalance(transactions);
    const newBalance = currentBalance - amt;

    const newTx: Transaction = {
      id: generateTransactionId(),
      date: new Date().toISOString(),
      type: 'Fund Transfer',
      description: `Transfer to ${pendingTransfer.recipientName} (Acct: ••••${pendingTransfer.recipientAccount.slice(-4)}) — ${pendingTransfer.description || 'No description'}`,
      amount: -amt,
      balanceAfter: newBalance,
      status: 'Success',
    };

    setTransactions([...transactions, newTx]);
    setSuccess(
      `Successfully transferred ${formatCurrency(amt)} to ${pendingTransfer.recipientName}.`
    );
    setForm({ recipientName: '', recipientAccount: '', amount: '', description: '' });
    setPendingTransfer(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <ArrowRightLeft className="w-7 h-7 text-orange-600" />
            Fund Transfer
          </h1>
          <p className="text-gray-500 mt-1">Transfer funds to a fictional recipient (simulated, PIN-verified).</p>
        </div>

        {error && <div className="mb-4"><Alert type="error" message={error} autoClose={false} /></div>}
        {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

        {/* Simulated notice */}
        <div className="mb-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              This is a simulated internal transfer for educational purposes. No real money is sent
              and no real bank accounts are involved.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Balance display (hidden unless known) */}
          <div className="mb-5 p-4 rounded-xl bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">Available Balance</span>
            <span className="text-sm font-semibold text-navy-900">{formatCurrency(balance)}</span>
          </div>

          <form onSubmit={handleVerifyAndTransfer} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Recipient Name</label>
              <input
                type="text"
                value={form.recipientName}
                onChange={(e) => handleChange('recipientName', e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Recipient Account Number</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.recipientAccount}
                onChange={(e) => handleChange('recipientAccount', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 123456789012"
                maxLength={18}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Demo account number (6–18 digits).</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="Enter transfer amount"
                min="1"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Description / Transfer Purpose</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="e.g. Rent payment, gift, loan repayment"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
              />
            </div>

            {form.amount && parseFloat(form.amount) > balance && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-700">
                  Insufficient balance for this transfer.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-100">
              <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <span className="text-xs text-orange-700">
                Transfer requires PIN verification. The amount will be deducted from your demo balance.
              </span>
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
                className="flex-1 px-5 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors"
              >
                Verify PIN & Transfer
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
            setPendingTransfer(null);
          }}
          title="Confirm Transfer"
          message="Enter your PIN to authorize this fund transfer."
        />
      )}
    </div>
  );
}
