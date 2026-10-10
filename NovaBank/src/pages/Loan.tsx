import { useState } from 'react';
import {
  PiggyBank, Home, Car, GraduationCap, Calculator, CheckCircle2, XCircle,
  Clock, CreditCard, TrendingDown, Info,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateBalance, generateTransactionId } from '@/utils/bankingUtils';
import { formatCurrency, formatDateShort } from '@/utils/formatCurrency';
import {
  LOAN_RATES, LOAN_INFO, calculateEMI, checkLoanEligibility, addMonth, LOAN_RULES,
} from '@/utils/loanUtils';
import PinVerificationModal from '@/components/PinVerificationModal';
import Alert from '@/components/Alert';
import ConfirmationModal from '@/components/ConfirmationModal';
import type { Loan, LoanType, Transaction } from '@/types';

const LOAN_ICONS: Record<LoanType, typeof Home> = {
  'Home Loan': Home,
  'Car Loan': Car,
  'Education Loan': GraduationCap,
};

export default function LoanPage() {
  const { user, transactions, setTransactions, loans, setLoans } = useApp();
  const [selectedType, setSelectedType] = useState<LoanType | null>(null);
  const [form, setForm] = useState({
    amount: '',
    duration: '',
    applicantName: user?.name || '',
    applicantEmail: user?.email || '',
    purpose: '',
    monthlyIncome: '',
  });
  const [calculation, setCalculation] = useState<{ emi: number; totalInterest: number; totalRepayment: number } | null>(null);
  const [loanResult, setLoanResult] = useState<{ status: 'Approved' | 'Rejected' | 'Pending'; reason: string } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pendingLoan, setPendingLoan] = useState<Loan | null>(null);

  if (!user) return null;

  const balance = calculateBalance(transactions);
  const activeLoans = loans.filter((l) => l.status === 'Approved');

  const handleCalculate = () => {
    setError('');
    if (!selectedType) {
      setError('Please select a loan type.');
      return;
    }
    const amt = parseFloat(form.amount);
    const dur = parseInt(form.duration);
    if (!amt || amt <= 0) {
      setError('Please enter a valid loan amount.');
      return;
    }
    if (!dur || dur <= 0) {
      setError('Please enter a valid loan duration in months.');
      return;
    }
    const rate = LOAN_RATES[selectedType];
    const calc = calculateEMI(amt, rate, dur);
    setCalculation(calc);
  };

  const validateAndSubmit = (): Loan | null => {
    if (!selectedType) {
      setError('Please select a loan type.');
      return null;
    }
    const amt = parseFloat(form.amount);
    const dur = parseInt(form.duration);
    const income = parseFloat(form.monthlyIncome);

    if (!amt || amt <= 0) { setError('Please enter a valid loan amount.'); return null; }
    if (!dur || dur <= 0) { setError('Please enter a valid loan duration.'); return null; }
    if (!form.applicantName.trim()) { setError('Applicant name is required.'); return null; }
    if (!form.applicantEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setError('Please enter a valid applicant email.'); return null; }
    if (!form.purpose.trim()) { setError('Please describe the purpose of the loan.'); return null; }
    if (!income || income <= 0) { setError('Please enter a valid monthly income.'); return null; }

    const eligibility = checkLoanEligibility(amt, income, dur);
    const rate = LOAN_RATES[selectedType];
    const calc = calculateEMI(amt, rate, dur);

    const newLoan: Loan = {
      id: `LOAN${Date.now().toString(36).toUpperCase()}`,
      type: selectedType,
      principal: amt,
      interestRate: rate,
      durationMonths: dur,
      emi: calc.emi,
      totalInterest: calc.totalInterest,
      totalRepayment: calc.totalRepayment,
      monthlyIncome: income,
      purpose: form.purpose.trim(),
      applicantName: form.applicantName.trim(),
      applicantEmail: form.applicantEmail.trim(),
      status: eligibility.approved ? 'Approved' : 'Rejected',
      remainingBalance: eligibility.approved ? calc.totalRepayment : 0,
      installmentsRemaining: eligibility.approved ? dur : 0,
      totalInstallments: dur,
      nextPaymentDate: addMonth(new Date().toISOString()),
      paymentHistory: [],
    };

    setLoanResult({ status: newLoan.status, reason: eligibility.reason });
    return newLoan;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoanResult(null);

    // Check for duplicate loan application (same type + amount + not fully repaid)
    const loan = validateAndSubmit();
    if (!loan) return;

    if (loan.status === 'Approved') {
      // Check for duplicate — prevent same loan from being credited twice
      const existingDuplicate = loans.find(
        (l) =>
          l.type === loan.type &&
          l.principal === loan.principal &&
          l.durationMonths === loan.durationMonths &&
          l.status === 'Approved'
      );
      if (existingDuplicate) {
        setError('This loan has already been approved and credited. Duplicate applications are not allowed.');
        return;
      }

      // Require PIN before crediting
      setPendingLoan(loan);
      setShowPinModal(true);
    } else {
      // Rejected — save the loan record without crediting
      setLoans([...loans, loan]);
      setError(eligibilityMessage(loan.status, loanResult?.reason || ''));
    }
  };

  const handlePinSuccess = () => {
    if (!pendingLoan) return;
    setShowPinModal(false);

    // Credit the loan principal to the balance
    const newBalance = balance + pendingLoan.principal;
    const disbursementTx: Transaction = {
      id: generateTransactionId(),
      date: new Date().toISOString(),
      type: 'Loan Disbursement',
      description: `${pendingLoan.type} disbursed — Principal: ${formatCurrency(pendingLoan.principal)} at ${pendingLoan.interestRate}% p.a.`,
      amount: pendingLoan.principal,
      balanceAfter: newBalance,
      status: 'Success',
    };

    const loanWithTx = { ...pendingLoan, disbursementTransactionId: disbursementTx.id };
    setTransactions([...transactions, disbursementTx]);
    setLoans([...loans, loanWithTx]);
    setSuccess('Your demo loan has been approved! The principal has been credited to your account.');
    setPendingLoan(null);

    // Reset form
    setForm({ amount: '', duration: '', applicantName: user.name, applicantEmail: user.email, purpose: '', monthlyIncome: '' });
    setCalculation(null);
    setSelectedType(null);
  };

  const handlePayEmi = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || loan.status !== 'Approved') return;

    // Prevent duplicate processing for the same scheduled month
    const lastPayment = loan.paymentHistory[loan.paymentHistory.length - 1];
    if (lastPayment && lastPayment.status === 'Paid') {
      const lastMonth = new Date(lastPayment.date).getMonth();
      const lastYear = new Date(lastPayment.date).getFullYear();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      if (lastMonth === currentMonth && lastYear === currentYear) {
        setError('EMI for this month has already been paid. Duplicate processing is not allowed.');
        return;
      }
    }

    if (balance < loan.emi) {
      // Insufficient balance — record missed installment
      const missedPayment = {
        id: `PAY${Date.now().toString(36).toUpperCase()}`,
        date: new Date().toISOString(),
        amount: loan.emi,
        status: 'Missed' as const,
        balanceAfter: balance,
      };
      const updatedLoan: Loan = {
        ...loan,
        paymentHistory: [...loan.paymentHistory, missedPayment],
      };
      setLoans(loans.map((l) => (l.id === loanId ? updatedLoan : l)));
      setError(
        `Insufficient balance to pay EMI of ${formatCurrency(loan.emi)}. Current balance: ${formatCurrency(balance)}. Please deposit funds and retry.`
      );
      return;
    }

    // Deduct EMI from balance
    const newBalance = balance - loan.emi;
    const emiTx: Transaction = {
      id: generateTransactionId(),
      date: new Date().toISOString(),
      type: 'Loan EMI',
      description: `EMI payment for ${loan.type} (${loan.id}) — Installment ${loan.totalInstallments - loan.installmentsRemaining + 1}/${loan.totalInstallments}`,
      amount: -loan.emi,
      balanceAfter: newBalance,
      status: 'Success',
    };

    const newInstallmentsRemaining = loan.installmentsRemaining - 1;
    const newRemainingBalance = Math.max(0, loan.remainingBalance - loan.emi);
    const isFullyRepaid = newInstallmentsRemaining <= 0;

    const payment = {
      id: `PAY${Date.now().toString(36).toUpperCase()}`,
      date: new Date().toISOString(),
      amount: loan.emi,
      status: 'Paid' as const,
      balanceAfter: newBalance,
    };

    const updatedLoan: Loan = {
      ...loan,
      remainingBalance: newRemainingBalance,
      installmentsRemaining: newInstallmentsRemaining,
      nextPaymentDate: isFullyRepaid ? loan.nextPaymentDate : addMonth(new Date().toISOString()),
      status: isFullyRepaid ? 'Fully Repaid' : 'Approved',
      paymentHistory: [...loan.paymentHistory, payment],
    };

    setTransactions([...transactions, emiTx]);
    setLoans(loans.map((l) => (l.id === loanId ? updatedLoan : l)));
    setSuccess(`EMI of ${formatCurrency(loan.emi)} paid successfully for ${loan.type}.`);
    setError('');
  };

  const handleSimulatePayment = (loanId: string) => {
    // Same as Pay EMI but labelled as simulation
    handlePayEmi(loanId);
  };

  const handleResetAllData = () => {
    import('@/utils/storage').then((storage) => {
      storage.resetAllData();
      window.location.href = '/';
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <PiggyBank className="w-7 h-7 text-accent-600" />
            Loans
          </h1>
          <p className="text-gray-500 mt-1">Apply for a demo loan with automatic EMI calculation.</p>
        </div>

        {/* Demo rates notice */}
        <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              The interest rates shown below are fictional demonstration rates, not actual bank offers.
              Loan approval is based on fictional eligibility rules for educational purposes only.
            </p>
          </div>
        </div>

        {error && <div className="mb-4"><Alert type="error" message={error} autoClose={false} /></div>}
        {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

        {/* Loan type selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(Object.keys(LOAN_RATES) as LoanType[]).map((type) => {
            const Icon = LOAN_ICONS[type];
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setCalculation(null);
                  setLoanResult(null);
                }}
                className={`text-left p-5 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-accent-500 bg-accent-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-accent-100 text-accent-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-1">{type}</h3>
                <p className="text-2xl font-bold text-accent-600 mb-1">{LOAN_RATES[type]}%</p>
                <p className="text-xs text-gray-500">Interest rate p.a.</p>
                <p className="text-xs text-gray-400 mt-2">{LOAN_INFO[type]}</p>
              </button>
            );
          })}
        </div>

        {/* Loan application form */}
        {selectedType && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 animate-slide-up">
            <h2 className="text-lg font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-accent-600" />
              Loan Application — {selectedType} at {LOAN_RATES[selectedType]}% p.a.
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder={`Min ₹${LOAN_RULES.minAmount.toLocaleString('en-IN')}`}
                  min={LOAN_RULES.minAmount}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Duration (months)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder={`Max ${LOAN_RULES.maxDuration} months`}
                  min={LOAN_RULES.minDuration}
                  max={LOAN_RULES.maxDuration}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Applicant Name</label>
                <input
                  type="text"
                  value={form.applicantName}
                  onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Applicant Email</label>
                <input
                  type="email"
                  value={form.applicantEmail}
                  onChange={(e) => setForm({ ...form, applicantEmail: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Monthly Income (₹)</label>
                <input
                  type="number"
                  value={form.monthlyIncome}
                  onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })}
                  placeholder={`Min ₹${LOAN_RULES.minIncome.toLocaleString('en-IN')}`}
                  min={LOAN_RULES.minIncome}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Purpose of Loan</label>
                <input
                  type="text"
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  placeholder="e.g. Buy a new car"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>

              <div className="sm:col-span-2 flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="px-5 py-2.5 rounded-xl border-2 border-accent-200 text-accent-700 font-medium hover:bg-accent-50 transition-colors"
                >
                  Calculate Loan
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-2.5 rounded-xl bg-accent-600 text-white font-medium hover:bg-accent-700 transition-colors"
                >
                  Submit Loan Application
                </button>
              </div>
            </form>

            {/* Calculation results */}
            {calculation && (
              <div className="mt-6 p-5 rounded-xl bg-accent-50 border border-accent-100 animate-slide-up">
                <h4 className="font-semibold text-navy-900 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-accent-600" />
                  Loan Calculation
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Principal</p>
                    <p className="text-sm font-semibold text-navy-900">{formatCurrency(parseFloat(form.amount) || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Monthly EMI</p>
                    <p className="text-sm font-semibold text-accent-600">{formatCurrency(calculation.emi)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Interest</p>
                    <p className="text-sm font-semibold text-orange-600">{formatCurrency(calculation.totalInterest)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Repayment</p>
                    <p className="text-sm font-semibold text-navy-900">{formatCurrency(calculation.totalRepayment)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loan result */}
            {loanResult && (
              <div className={`mt-4 p-5 rounded-xl border animate-slide-up ${
                loanResult.status === 'Approved'
                  ? 'bg-green-50 border-green-200'
                  : loanResult.status === 'Rejected'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start gap-3">
                  {loanResult.status === 'Approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : loanResult.status === 'Rejected' ? (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-semibold ${
                      loanResult.status === 'Approved' ? 'text-green-800' :
                      loanResult.status === 'Rejected' ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      Loan {loanResult.status}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{loanResult.reason}</p>
                    {loanResult.status === 'Approved' && (
                      <p className="text-xs text-gray-500 mt-2">
                        Please verify your PIN to complete the loan disbursement.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loan Overview — active loans */}
        {activeLoans.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-navy-900">Loan Overview</h2>
            {activeLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = LOAN_ICONS[loan.type];
                      return <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent-600" />
                      </div>;
                    })()}
                    <div>
                      <h3 className="font-semibold text-navy-900">{loan.type}</h3>
                      <p className="text-xs text-gray-500 font-mono">{loan.id}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    loan.status === 'Fully Repaid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {loan.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Principal</p>
                    <p className="text-sm font-semibold text-navy-900">{formatCurrency(loan.principal)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Interest Rate</p>
                    <p className="text-sm font-semibold text-navy-900">{loan.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Monthly EMI</p>
                    <p className="text-sm font-semibold text-accent-600">{formatCurrency(loan.emi)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Remaining Balance</p>
                    <p className="text-sm font-semibold text-navy-900">{formatCurrency(loan.remainingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Next Payment</p>
                    <p className="text-sm font-semibold text-navy-900">{formatDateShort(loan.nextPaymentDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Installments Remaining</p>
                    <p className="text-sm font-semibold text-navy-900">{loan.installmentsRemaining} / {loan.totalInstallments}</p>
                  </div>
                </div>

                {/* Payment history */}
                {loan.paymentHistory.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-gray-50">
                    <p className="text-xs font-medium text-gray-600 mb-2">Payment History</p>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {loan.paymentHistory.map((pay) => (
                        <div key={pay.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{formatDateShort(pay.date)}</span>
                          <span className="font-medium">{formatCurrency(pay.amount)}</span>
                          <span className={pay.status === 'Paid' ? 'text-green-600' : 'text-red-600'}>
                            {pay.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {loan.status === 'Approved' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handlePayEmi(loan.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay EMI Now
                    </button>
                    <button
                      onClick={() => handleSimulatePayment(loan.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-navy-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <TrendingDown className="w-4 h-4" />
                      Simulate Monthly Payment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Demo data reset — utility area, NOT on Account page */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Demo Administration</h3>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Reset All Demo Data
          </button>
          <p className="text-xs text-gray-400 mt-1">
            Deletes your local demo account, transactions, and loans. Returns to the original state.
          </p>
        </div>
      </div>

      {showPinModal && (
        <PinVerificationModal
          onSuccess={handlePinSuccess}
          onClose={() => {
            setShowPinModal(false);
            setPendingLoan(null);
          }}
          title="Confirm Loan Disbursement"
          message="Enter your PIN to authorize the loan disbursement."
        />
      )}

      {showResetConfirm && (
        <ConfirmationModal
          title="Reset All Demo Data?"
          message="This will permanently delete your demo account, all transactions, and loan records. This cannot be undone. You will be redirected to the home page."
          confirmLabel="Yes, Reset Everything"
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={handleResetAllData}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}

function eligibilityMessage(status: string, reason: string): string {
  if (status === 'Rejected') return `Your demo loan application was rejected. ${reason}`;
  if (status === 'Pending') return `Your demo loan application is pending review. ${reason}`;
  return reason;
}
