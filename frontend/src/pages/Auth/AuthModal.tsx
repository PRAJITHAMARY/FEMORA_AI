import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { Eye, EyeOff, X, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess: (user: any, isNewUser?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) return setError('Please enter your name');
      if (password !== confirmPassword) return setError('Passwords do not match');
      if (password.length < 6) return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const res = await api.register(name, email, password);
        setLoading(false);
        onSuccess(res.user, true);
      } else {
        const res = await api.login(email, password);
        setLoading(false);
        onSuccess(res.user, false);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#EDE3E0] w-full max-w-md rounded-3xl p-8 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#766D70] hover:text-[#403A3D] hover:bg-[#FFF9F5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Logo size="lg" />
          <h3 className="font-serif-heading text-2xl font-bold text-[#403A3D] pt-2">
            {mode === 'login' ? 'Welcome back to Femora 🌸' : 'Create your Femora account 🌸'}
          </h3>
          <p className="text-xs text-[#766D70]">
            {mode === 'login'
              ? 'Enter your credentials to access your personal wellness journal.'
              : 'Start tracking your cycle, symptoms, and lifestyle patterns today.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#403A3D]">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#766D70] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D] focus:outline-none focus:border-[#E8B4B8]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#403A3D]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#766D70] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="elena@femora.well"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D] focus:outline-none focus:border-[#E8B4B8]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#403A3D]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#766D70] absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D] focus:outline-none focus:border-[#E8B4B8]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#766D70] hover:text-[#403A3D]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#403A3D]">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#766D70] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D] focus:outline-none focus:border-[#E8B4B8]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#E8B4B8] via-[#C9B8D9] to-[#E8B4B8] text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin text-sm">🌸</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Log In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 text-xs text-[#766D70]">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-[#403A3D] font-semibold underline underline-offset-2 hover:text-[#E8B4B8]"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-[#403A3D] font-semibold underline underline-offset-2 hover:text-[#E8B4B8]"
              >
                Log In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
