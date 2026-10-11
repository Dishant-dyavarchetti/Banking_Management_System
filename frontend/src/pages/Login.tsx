import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, Mail, Lock, ArrowRight, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import * as storage from '@/utils/storage';
import Alert from '@/components/Alert';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    // Check credentials against locally saved demo account
    const user = storage.getUser();
    if (!user) {
      setError('No demo account found. Please create an account first.');
      setLoading(false);
      return;
    }

    if (user.email !== email) {
      setError('No account found with this email. Please check or create a new account.');
      setLoading(false);
      return;
    }

    if (user.password !== password) {
      setError('Incorrect password. Please try again.');
      setLoading(false);
      return;
    }

    // Success
    login();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-800 to-accent-600 flex items-center justify-center shadow-md">
                <Landmark className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-1">Login to your NovaBank demo account</p>
          </div>

          {error && <div className="mb-4"><Alert type="error" message={error} autoClose={false} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-5 space-y-3">
            <Link
              to="/signup"
              className="block text-center text-sm text-accent-600 hover:text-accent-700 font-medium"
            >
              Don't have an account? Create one now
            </Link>
            <p className="text-center text-xs text-gray-400">
              Forgot password? This is a demo app — create a new account to start fresh.
            </p>
          </div>
        </div>

        {/* Demo info */}
        <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-semibold mb-1">Demo Notice</p>
              <p>This is a simulated login for educational purposes. It is not real or secure banking authentication. Create an account to get started, or login with your existing demo credentials.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
