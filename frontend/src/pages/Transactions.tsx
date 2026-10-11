import { useState, useMemo } from 'react';
import { ArrowRightLeft, Search, Calendar, X, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, getLocalDateString } from '@/utils/formatCurrency';
import type { TransactionType } from '@/types';

const FILTER_TYPES: (TransactionType | 'All')[] = [
  'All', 'Deposit', 'Fund Transfer', 'Loan Disbursement', 'Loan EMI', 'Withdrawal',
];

export default function Transactions() {
  const { transactions } = useApp();
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'All'>('All');
  const [dateFilter, setDateFilter] = useState('');

  const filteredTransactions = useMemo(() => {
    let result = [...transactions].reverse(); // newest first

    if (typeFilter !== 'All') {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    if (dateFilter) {
      result = result.filter((tx) => getLocalDateString(tx.date) === dateFilter);
    }

    return result;
  }, [transactions, typeFilter, dateFilter]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <ArrowRightLeft className="w-7 h-7 text-accent-600" />
            Transaction History
          </h1>
          <p className="text-gray-500 mt-1">View and filter all your demo transactions.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-navy-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Transaction Type</label>
              <div className="flex flex-wrap gap-2">
                {FILTER_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      typeFilter === type
                        ? 'bg-accent-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Date Filter</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all text-sm"
                  />
                </div>
                {dateFilter && (
                  <button
                    onClick={() => setDateFilter('')}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-gray-500 text-xs hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {(typeFilter !== 'All' || dateFilter) && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Search className="w-3.5 h-3.5" />
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
          )}
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 mb-1">No Transactions Found</h3>
              <p className="text-sm text-gray-500">
                {transactions.length === 0
                  ? 'You have no transactions yet. Make a deposit or transfer to get started.'
                  : 'No transactions match the selected filters. Try adjusting your filters.'}
              </p>
              {(typeFilter !== 'All' || dateFilter) && (
                <button
                  onClick={() => { setTypeFilter('All'); setDateFilter(''); }}
                  className="mt-4 px-4 py-2 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 font-medium">Txn ID</th>
                    <th className="px-4 py-3 font-medium">Date & Time</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                    <th className="px-4 py-3 font-medium text-right">Balance After</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{tx.id}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(tx.date)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 whitespace-nowrap">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{tx.description}</td>
                      <td className={`px-4 py-3 text-right font-medium whitespace-nowrap ${
                        tx.amount > 0 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 whitespace-nowrap">{formatCurrency(tx.balanceAfter)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
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
        </div>
      </div>
    </div>
  );
}
