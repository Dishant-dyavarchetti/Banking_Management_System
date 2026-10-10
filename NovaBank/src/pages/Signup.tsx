import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, User, Mail, Lock, PiggyBank, KeyRound, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import * as storage from '@/utils/storage';
import Alert from '@/components/Alert';
import type { AccountType } from '@/types';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: '' as AccountType | '',
    pin: '',
    confirmPin: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Full name is required.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email address.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 4) return 'Password must be at least 4 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!form.accountType) return 'Please select an account type.';
    if (!/^\d{4}$/.test(form.pin)) return 'PIN must be exactly 4 digits.';
    if (form.pin !== form.confirmPin) return 'PINs do not match.';

    // Check for duplicate demo account
    const existing = storage.getUser();
    if (existing && existing.email === form.email) {
      return 'A demo account with this email already exists. Please login instead.';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    // Create the demo account with starting balance and sample transactions
    storage.createDemoAccount({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      accountType: form.accountType as AccountType,
      pin: form.pin,
    });

    login();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-800 to-accent-600 flex items-center justify-center shadow-md">
                <Landmark className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Create Your Demo Account</h1>
            <p className="text-sm text-gray-500 mt-1">Get started with ₹25,000 fictional starting balance</p>
          </div>

          {error && <div className="mb-4"><Alert type="error" message={error} autoClose={false} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Savings', 'Current'] as AccountType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('accountType', type)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      form.accountType === type
                        ? 'border-accent-500 bg-accent-50 text-accent-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <PiggyBank className="w-4 h-4" />
                    <span className="text-sm font-medium">{type} Account</span>
                  </button>
                ))}
              </div>
            </div>

            {/* PINs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">4-Digit PIN</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    inputMode="numeric"
                    value={form.pin}
                    onChange={(e) => handleChange('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm PIN</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    inputMode="numeric"
                    value={form.confirmPin}
                    onChange={(e) => handleChange('confirmPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-600 text-white font-medium hover:bg-accent-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Demo Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link to="/login" className="text-sm text-accent-600 hover:text-accent-700 font-medium">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
