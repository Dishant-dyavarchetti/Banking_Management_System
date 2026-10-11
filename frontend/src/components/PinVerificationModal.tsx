import { useState, useEffect, useRef } from 'react';
import { Lock, ShieldAlert, KeyRound, X } from 'lucide-react';
import * as storage from '@/utils/storage';

interface PinVerificationModalProps {
  onSuccess: () => void;
  onClose: () => void;
  title?: string;
  message?: string;
}

const MAX_ATTEMPTS = 3;

export default function PinVerificationModal({
  onSuccess,
  onClose,
  title = 'PIN Verification',
  message = 'Enter your 4-digit demo PIN to continue.',
}: PinVerificationModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(storage.getPinAttempts());
  const [blocked, setBlocked] = useState(storage.isBalanceBlocked());
  const [showForgotPin, setShowForgotPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Check blocked state from storage whenever the modal opens or attempts change
  useEffect(() => {
    setBlocked(storage.isBalanceBlocked());
    setAttempts(storage.getPinAttempts());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked) return;

    const user = storage.getUser();
    if (!user) {
      setError('No demo account found.');
      return;
    }

    if (pin === user.pin) {
      // Correct PIN — reset attempt counter
      storage.setPinAttempts(0);
      setAttempts(0);
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      storage.setPinAttempts(newAttempts);
      setAttempts(newAttempts);
      setPin('');

      if (newAttempts >= MAX_ATTEMPTS) {
        storage.setBalanceBlocked(true);
        setBlocked(true);
        setError('');
      } else {
        setError(`Incorrect PIN. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`);
      }
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(val);
    setError('');
  };

  const handleForgotPinRecovery = () => {
    // After recovery, reset blocked state and attempts
    storage.setBalanceBlocked(false);
    storage.setPinAttempts(0);
    setBlocked(false);
    setAttempts(0);
    setShowForgotPin(false);
    setPin('');
    setError('');
  };

  if (blocked && !showForgotPin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-navy-900 mb-2">Balance Access Blocked</h3>
          <p className="text-sm text-gray-600 mb-4">
            Your balance access has been blocked after three incorrect PIN attempts.
            Please visit your bank branch for assistance.
          </p>
          <p className="text-xs text-gray-500 mb-4">
            For this demo, you can recover access using the Forgot PIN option below.
          </p>
          <button
            onClick={() => setShowForgotPin(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            Forgot PIN
          </button>
        </div>
      </div>
    );
  }

  if (showForgotPin) {
    return (
      <ForgotPinModal
        onRecovery={handleForgotPinRecovery}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">{title}</h3>
              <p className="text-sm text-gray-500">{message}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1.5">4-Digit PIN</label>
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={handlePinChange}
              maxLength={4}
              placeholder="••••"
              className="w-full text-center text-2xl tracking-[0.5em] px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          {attempts > 0 && !blocked && (
            <p className="text-xs text-orange-600">
              {MAX_ATTEMPTS - attempts} attempt(s) remaining
            </p>
          )}

          <button
            type="submit"
            disabled={pin.length !== 4}
            className="w-full px-4 py-2.5 rounded-lg bg-navy-900 text-white text-sm font-medium hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify PIN
          </button>

          <button
            type="button"
            onClick={() => setShowForgotPin(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-accent-600 hover:text-accent-700 font-medium"
          >
            <KeyRound className="w-4 h-4" />
            Forgot PIN?
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Forgot PIN Modal ---------- */

function ForgotPinModal({
  onRecovery: onRecovered,
  onClose,
}: {
  onRecovery: () => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<'email' | 'newPin'>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = storage.getUser();
    if (!user) {
      setEmailError('No demo account found.');
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (email !== user.email) {
      setEmailError('This email does not match your registered demo email.');
      return;
    }
    // Demo verification step — no real email/OTP is sent
    setEmailError('');
    setStep('newPin');
  };

  const handlePinReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(newPin)) {
      setPinError('PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match.');
      return;
    }
    // Save new PIN
    const user = storage.getUser();
    if (user) {
      storage.saveUser({ ...user, pin: newPin });
    }
    storage.setPinAttempts(0);
    storage.setBalanceBlocked(false);
    setPinError('');
    setSuccess(true);
    setTimeout(() => {
      onRecovered();
    }, 1500);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center animate-slide-up">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-navy-900 mb-2">PIN Reset Successful</h3>
          <p className="text-sm text-gray-600">
            Your demo PIN has been updated. You can now view your balance again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">Forgot PIN</h3>
              <p className="text-sm text-gray-500">Demo PIN recovery</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg">
              This is a demo verification step. No real email or OTP will be sent.
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">
                Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
              />
            </div>
            {emailError && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{emailError}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors"
            >
              Verify Email
            </button>
          </form>
        )}

        {step === 'newPin' && (
          <form onSubmit={handlePinReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">New 4-Digit PIN</label>
              <input
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-[0.5em] px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm PIN</label>
              <input
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-[0.5em] px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 outline-none transition-all"
              />
            </div>
            {pinError && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{pinError}</p>
            )}
            <button
              type="submit"
              disabled={newPin.length !== 4 || confirmPin.length !== 4}
              className="w-full px-4 py-2.5 rounded-lg bg-accent-600 text-white text-sm font-medium hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset PIN
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
