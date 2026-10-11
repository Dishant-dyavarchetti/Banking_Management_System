import { useState } from 'react';
import { User as UserIcon, Mail, CreditCard, Calendar, BadgeCheck, Pencil, Save, X, Eye, EyeOff, Lock, Settings2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import * as storage from '@/utils/storage';
import { maskAccountNumber } from '@/utils/bankingUtils';
import { calculateBalance } from '@/utils/bankingUtils';
import { formatCurrency, formatDateShort } from '@/utils/formatCurrency';
import PinVerificationModal from '@/components/PinVerificationModal';
import Alert from '@/components/Alert';
import type { User } from '@/types';

export default function Account() {
  const { user, updateUser, transactions } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  // Account page has its own balance reveal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [balanceRevealed, setBalanceRevealed] = useState(storage.isAccountBalanceRevealed());

  if (!user) return null;

  const balance = calculateBalance(transactions);
  const isBlocked = storage.isBalanceBlocked();

  const handleEditSave = () => {
    setEditError('');
    setEditSuccess('');

    if (!editName.trim()) {
      setEditError('Name cannot be empty.');
      return;
    }
    if (!editEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEditError('Please enter a valid email address.');
      return;
    }

    const updatedUser: User = { ...user, name: editName.trim(), email: editEmail.trim().toLowerCase() };
    updateUser(updatedUser);
    setIsEditing(false);
    setEditSuccess('Account details updated successfully.');
  };

  const handleEditCancel = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditError('');
    setIsEditing(false);
  };

  const handleViewBalance = () => {
    if (isBlocked) {
      setShowPinModal(true);
      return;
    }
    if (balanceRevealed) {
      storage.setAccountBalanceRevealed(false);
      setBalanceRevealed(false);
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    storage.setAccountBalanceRevealed(true);
    setBalanceRevealed(true);
    setShowPinModal(false);
    setAlert({ type: 'success', message: 'Balance verified successfully.' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <Settings2 className="w-7 h-7 text-accent-600" />
            Account
          </h1>
          <p className="text-gray-500 mt-1">View and manage your demo account details.</p>
        </div>

        {alert && (
          <div className="mb-4">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}
        {editSuccess && <div className="mb-4"><Alert type="success" message={editSuccess} onClose={() => setEditSuccess('')} /></div>}

        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-navy-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-gray-200 text-navy-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleEditCancel}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
            )}
          </div>

          {editError && <div className="mb-4"><Alert type="error" message={editError} autoClose={false} /></div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <UserIcon className="w-3.5 h-3.5" />
                <span>Full Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all text-sm"
                />
              ) : (
                <p className="text-sm font-semibold text-navy-900">{user.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Email Address</span>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all text-sm"
                />
              ) : (
                <p className="text-sm font-semibold text-navy-900">{user.email}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Account Type</span>
              </div>
              <p className="text-sm font-semibold text-navy-900">{user.accountType} Account</p>
            </div>

            {/* Account Number */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Account Number</span>
              </div>
              <p className="text-sm font-semibold text-navy-900 font-mono">{maskAccountNumber(user.accountNumber)}</p>
            </div>

            {/* Creation Date */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Account Created</span>
              </div>
              <p className="text-sm font-semibold text-navy-900">{formatDateShort(user.createdAt)}</p>
            </div>

            {/* Status */}
            <div className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>Account Status</span>
              </div>
              <p className="text-sm font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>

        {/* Balance card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-navy-900 mb-4">Account Balance</h2>

          {balanceRevealed && !isBlocked ? (
            <div className="animate-fade-in">
              <div className="p-6 rounded-xl bg-gradient-to-br from-navy-900 to-accent-800 text-white">
                <p className="text-sm text-gray-300 mb-1">Current Balance</p>
                <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
                <p className="text-xs text-gray-400 mt-2">{user.accountType} Account</p>
              </div>
              <button
                onClick={handleViewBalance}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 text-navy-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <EyeOff className="w-4 h-4" />
                Hide Balance
              </button>
            </div>
          ) : (
            <div>
              <div className="p-6 rounded-xl bg-gray-50 flex items-center gap-4">
                <Lock className="w-10 h-10 text-gray-400" />
                <div>
                  <p className="text-lg font-semibold text-gray-600">
                    {isBlocked ? 'Balance Access Blocked' : 'Balance hidden for security'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {isBlocked
                      ? 'Access blocked after 3 incorrect PIN attempts. Use Forgot PIN to recover.'
                      : 'Click View Account Balance and enter your 4-digit PIN.'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleViewBalance}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Account Balance
              </button>
            </div>
          )}
        </div>
      </div>

      {showPinModal && (
        <PinVerificationModal
          onSuccess={handlePinSuccess}
          onClose={() => setShowPinModal(false)}
          title="View Account Balance"
          message="Enter your 4-digit PIN to view your account balance."
        />
      )}
    </div>
  );
}
