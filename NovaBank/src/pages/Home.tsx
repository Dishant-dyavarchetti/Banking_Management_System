import { Link } from 'react-router-dom';
import { ShieldCheck, Wallet, ArrowRightLeft, PiggyBank, Landmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { isLoggedIn, user } = useApp();

  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Balance Viewing',
      desc: 'Your account balance is protected by a 4-digit PIN with a 3-attempt lockout system.',
      color: 'bg-accent-100 text-accent-600',
    },
    {
      icon: Wallet,
      title: 'Instant Deposits',
      desc: 'Add funds to your demo account with PIN-verified transactions and real-time updates.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: ArrowRightLeft,
      title: 'Simulated Transfers',
      desc: 'Transfer funds to fictional recipients with full transaction history tracking.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: PiggyBank,
      title: 'Loan Management',
      desc: 'Apply for home, car, or education loans with automatic EMI calculations and repayment tracking.',
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  const highlights = [
    'No real money involved — purely educational',
    'All data stored locally in your browser',
    'Beginner-friendly React codebase',
    'Full transaction ledger with balance tracking',
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-accent-800 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-sm mb-6">
                <Landmark className="w-4 h-4" />
                <span>Fictional Demo Banking Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Welcome to <span className="text-accent-400">NovaBank</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                Experience a complete digital banking dashboard with PIN-protected balances,
                simulated transfers, loan calculations, and full transaction history — all built
                for a college project. No real money, no real bank, just learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-500 text-white font-medium hover:bg-accent-600 transition-colors shadow-lg"
                  >
                    Continue to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-500 text-white font-medium hover:bg-accent-600 transition-colors shadow-lg"
                    >
                      Login
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur text-white font-medium hover:bg-white/20 transition-colors border border-white/20"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
              {isLoggedIn && user && (
                <p className="mt-6 text-sm text-gray-400">
                  Welcome back, {user.name.split(' ')[0]}! Pick up where you left off.
                </p>
              )}
            </div>

            {/* Hero card mockup */}
            <div className="hidden lg:block animate-fade-in">
              <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
                      <Landmark className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold">NovaBank</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">Active</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Available Balance</p>
                    <p className="text-2xl font-bold">₹25,000.00</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">Deposits</p>
                      <p className="text-sm font-semibold mt-1">₹30,000</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">Transfers</p>
                      <p className="text-sm font-semibold mt-1">₹5,000</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-xs text-gray-400">Txns</p>
                      <p className="text-sm font-semibold mt-1">4</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-accent-500/20 rounded-lg py-2 text-center text-xs">Deposit</div>
                    <div className="flex-1 bg-accent-500/20 rounded-lg py-2 text-center text-xs">Transfer</div>
                    <div className="flex-1 bg-accent-500/20 rounded-lg py-2 text-center text-xs">Loan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-3">Everything You Need to Explore Digital Banking</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A fully functional simulation of a modern banking dashboard, built with React and localStorage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlights banner */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-navy-50 to-accent-50 rounded-3xl p-8 lg:p-12 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Built for Learning, Not for Banking</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  NovaBank is a fictional banking system created for a college project. Every feature —
                  from PIN-protected balances to loan EMI calculations — is simulated entirely in your browser.
                </p>
                {!isLoggedIn && (
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-600 text-white font-medium hover:bg-accent-700 transition-colors"
                  >
                    Get Started — It's Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <ul className="space-y-3">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-navy-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
