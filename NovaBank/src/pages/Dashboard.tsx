import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Wallet, Eye, EyeOff, Lock, ArrowDownCircle, ArrowRightLeft, PiggyBank,
  TrendingUp, TrendingDown, ArrowRight, ShieldCheck, BarChart3,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import * as storage from '@/utils/storage';
import { calculateBalance, calculateSummary } from '@/utils/bankingUtils';
import { formatCurrency, formatDate } from '@/utils/formatCurrency';
import SummaryCard from '@/components/SummaryCard';
import PinVerificationModal from '@/components/PinVerificationModal';
import Alert from '@/components/Alert';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, transactions, loans } = useApp();
  const [showPinModal, setShowPinModal] = useState(false);
  const [balanceRevealed, setBalanceRevealed] = useState(storage.isBalanceRevealed());
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  if (!user) return null;

  const balance = calculateBalance(transactions);
  const summary = calculateSummary(transactions);
  const recentTransactions = [...transactions].slice(-5).reverse();
  const activeLoans = loans.filter((l) => l.status === 'Approved');

  const handleViewBalance = () => {
    if (storage.isBalanceBlocked()) {
      setShowPinModal(true); // Will show blocked screen with forgot PIN
      return;
    }
    if (balanceRevealed) {
      // Hide balance
      storage.setBalanceRevealed(false);
      setBalanceRevealed(false);
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSuccess = () => {
    storage.setBalanceRevealed(true);
    setBalanceRevealed(true);
    setShowPinModal(false);
    setAlert({ type: 'success', message: 'Balance verified successfully.' });
  };

  // Chart data: deposits vs withdrawals per transaction
  const chartData = [...transactions].slice(-10).map((tx) => ({
    label: tx.type,
    credit: tx.amount > 0 ? tx.amount : 0,
    debit: tx.amount < 0 ? Math.abs(tx.amount) : 0,
  }));
  const maxChartValue = Math.max(...chartData.map((d) => Math.max(d.credit, d.debit)), 1);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900">Hello, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-1">
            Here's your NovaBank demo dashboard overview.
          </p>
        </div>

        {alert && (
          <div className="mb-6">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column: Balance + Summary + Chart + Recent */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-navy-900 to-accent-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 90% 10%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-accent-400" />
                    <span className="text-sm text-gray-300">Available Balance</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 backdrop-blur">
                    {user.accountType} Account
                  </span>
                </div>

                {balanceRevealed && !storage.isBalanceBlocked() ? (
                  <div className="animate-fade-in">
                    <p className="text-3xl font-bold mb-1">{formatCurrency(balance)}</p>
                    <p className="text-xs text-gray-400">Acct: ••••••••{user.accountNumber.slice(-4)}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Lock className="w-8 h-8 text-accent-400" />
                    <div>
                      <p className="text-xl font-semibold text-gray-300">Balance hidden for security</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {storage.isBalanceBlocked()
                          ? 'Access blocked after 3 incorrect PIN attempts'
                          : 'Click View Balance and enter your PIN'}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleViewBalance}
                  className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur hover:bg-white/20 transition-colors text-sm font-medium"
                >
                  {balanceRevealed && !storage.isBalanceBlocked() ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Balance
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      View Balance
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SummaryCard
                title="Total Deposited"
                value={formatCurrency(summary.totalDeposited)}
                icon={<ArrowDownCircle className="w-5 h-5" />}
                color="green"
              />
              <SummaryCard
                title="Total Withdrawn"
                value={formatCurrency(summary.totalWithdrawn)}
                icon={<TrendingDown className="w-5 h-5" />}
                color="red"
              />
              <SummaryCard
                title="Total Transferred"
                value={formatCurrency(summary.totalTransferred)}
                icon={<ArrowRightLeft className="w-5 h-5" />}
                color="orange"
              />
              <SummaryCard
                title="Loan Disbursed"
                value={formatCurrency(summary.totalLoanDisbursed)}
                icon={<PiggyBank className="w-5 h-5" />}
                color="purple"
              />
              <SummaryCard
                title="EMI Paid"
                value={formatCurrency(summary.totalEmiPaid)}
                icon={<TrendingUp className="w-5 h-5" />}
                color="blue"
              />
              <SummaryCard
                title="Total Transactions"
                value={String(summary.totalTransactions)}
                icon={<BarChart3 className="w-5 h-5" />}
                color="navy"
              />
            </div>

            {/* Loan Summary (if any active loans) */}
            {activeLoans.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-accent-600" />
                  Loan Summary
                </h3>
                <div className="space-y-3">
                  {activeLoans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-navy-800">{loan.type}</p>
                        <p className="text-xs text-gray-500">
                          EMI: {formatCurrency(loan.emi)} | Remaining: {loan.installmentsRemaining} months
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-navy-900">{formatCurrency(loan.remainingBalance)}</p>
                        <p className="text-xs text-green-600">Active</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-600" />
                Deposits vs Withdrawals
              </h3>
              {chartData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No transaction data yet.</p>
              ) : (
                <div className="flex items-end justify-between gap-2 h-40">
                  {chartData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="w-full flex flex-col justify-end items-center gap-0.5 h-32">
                        {data.credit > 0 && (
                          <div
                            className="w-full max-w-[24px] bg-green-400 rounded-t group-hover:bg-green-500 transition-colors"
                            style={{ height: `${(data.credit / maxChartValue) * 100}%` }}
                            title={`Deposit: ${formatCurrency(data.credit)}`}
                          />
                        )}
                        {data.debit > 0 && (
                          <div
                            className="w-full max-w-[24px] bg-orange-400 rounded-t group-hover:bg-orange-500 transition-colors"
                            style={{ height: `${(data.debit / maxChartValue) * 100}%` }}
                            title={`Withdrawal: ${formatCurrency(data.debit)}`}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 truncate w-full text-center">
                        {data.label.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-green-400" />
                  <span className="text-xs text-gray-500">Credits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-orange-400" />
                  <span className="text-xs text-gray-500">Debits</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-900">Recent Transactions</h3>
                <Link
                  to="/transactions"
                  className="flex items-center gap-1 text-sm text-accent-600 hover:text-accent-700 font-medium"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No transactions yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                        <th className="pb-2 font-medium">Txn ID</th>
                        <th className="pb-2 font-medium">Date</th>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium text-right">Amount</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 font-mono text-xs text-gray-600">{tx.id.slice(0, 10)}...</td>
                          <td className="py-3 text-gray-600">{formatDate(tx.date)}</td>
                          <td className="py-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              {tx.type}
                            </span>
                          </td>
                          <td className={`py-3 text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                            {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                          </td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              tx.status === 'Success' ? 'bg-green-100 text-green-700' :
                              tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button
                onClick={() => navigate('/transactions')}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-navy-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                View All Transactions
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right column: Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/deposit')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <ArrowDownCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-navy-900">Deposit</p>
                    <p className="text-xs text-gray-500">Add funds to your account</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/transfer')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <ArrowRightLeft className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-navy-900">Fund Transfer</p>
                    <p className="text-xs text-gray-500">Send money (simulated)</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/loan')}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <PiggyBank className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-navy-900">Apply for Loan</p>
                    <p className="text-xs text-gray-500">Home, Car, or Education</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Security info card */}
            <div className="bg-gradient-to-br from-accent-50 to-navy-50 rounded-2xl p-5 border border-accent-100">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-accent-600" />
                <h3 className="font-semibold text-navy-900">PIN Security</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your balance is protected by a 4-digit demo PIN. After 3 incorrect attempts,
                access is blocked until you complete the Forgot PIN recovery process.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                This is educational only — not real banking security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPinModal && (
        <PinVerificationModal
          onSuccess={handlePinSuccess}
          onClose={() => setShowPinModal(false)}
          title="View Balance"
          message="Enter your 4-digit PIN to view your balance."
        />
      )}
    </div>
  );
}
