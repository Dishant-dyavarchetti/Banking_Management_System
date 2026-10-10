import type { LoanType } from '@/types';

// Configurable loan interest rates (fictional demo rates)
export const LOAN_RATES: Record<LoanType, number> = {
  'Home Loan': 8.5,
  'Car Loan': 9.5,
  'Education Loan': 6.5,
};

export const LOAN_INFO: Record<LoanType, string> = {
  'Home Loan':
    'Finance your dream home with flexible repayment tenures up to 30 years.',
  'Car Loan':
    'Drive home your new vehicle with quick approval and competitive rates.',
  'Education Loan':
    'Invest in your future with affordable education financing for tuition and expenses.',
};

// Configurable eligibility rules (fictional)
export const LOAN_RULES = {
  minAmount: 50000,
  maxAmount: 5000000,
  minDuration: 6,
  maxDuration: 360,
  minIncome: 15000,
  // Loan amount should not exceed 30x monthly income for demo approval
  incomeMultiplier: 30,
};

/**
 * Calculate EMI using the standard reducing-balance formula.
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where r = monthly interest rate, P = principal, n = number of months
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  months: number
): { emi: number; totalInterest: number; totalRepayment: number } {
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    // Zero-interest case: simply divide principal evenly
    const emi = principal / months;
    return {
      emi,
      totalInterest: 0,
      totalRepayment: principal,
    };
  }

  const pow = Math.pow(1 + monthlyRate, months);
  const emi = (principal * monthlyRate * pow) / (pow - 1);
  const totalRepayment = emi * months;
  const totalInterest = totalRepayment - principal;

  return {
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
  };
}

// Check loan eligibility based on fictional demo rules
export function checkLoanEligibility(
  amount: number,
  income: number,
  duration: number
): { approved: boolean; reason: string } {
  if (amount < LOAN_RULES.minAmount) {
    return {
      approved: false,
      reason: `Minimum loan amount is ₹${LOAN_RULES.minAmount.toLocaleString('en-IN')}.`,
    };
  }
  if (amount > LOAN_RULES.maxAmount) {
    return {
      approved: false,
      reason: `Maximum loan amount is ₹${LOAN_RULES.maxAmount.toLocaleString('en-IN')}.`,
    };
  }
  if (duration < LOAN_RULES.minDuration || duration > LOAN_RULES.maxDuration) {
    return {
      approved: false,
      reason: `Loan duration must be between ${LOAN_RULES.minDuration} and ${LOAN_RULES.maxDuration} months.`,
    };
  }
  if (income < LOAN_RULES.minIncome) {
    return {
      approved: false,
      reason: `Monthly income must be at least ₹${LOAN_RULES.minIncome.toLocaleString('en-IN')} to qualify.`,
    };
  }
  if (amount > income * LOAN_RULES.incomeMultiplier) {
    return {
      approved: false,
      reason: `Requested amount exceeds ${LOAN_RULES.incomeMultiplier}x your monthly income, which is the demo eligibility limit.`,
    };
  }
  return {
    approved: true,
    reason: 'Your demo loan application meets all fictional eligibility criteria.',
  };
}

// Add one month to a date string
export function addMonth(dateStr: string): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}
