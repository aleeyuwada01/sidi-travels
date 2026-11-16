import React, { useState } from 'react';
import { ShieldCheck, User, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SidiLogoEmblem } from './BrandVisuals';

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, register, navigate } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('user@siditravel.com');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Kano');
  const [busy, setBusy] = useState(false);

  if (!authModalOpen) return null;

  const handleQuickLogin = async (demoEmail: string, target: '/dashboard' | '/admin') => {
    setBusy(true);
    const user = await login(demoEmail);
    setBusy(false);
    if (user) {
      navigate(target);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === 'login') {
      const user = await login(email);
      if (user) {
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } else {
      const user = await register({ name, email, phone, city });
      if (user) {
        navigate('/dashboard');
      }
    }
    setBusy(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 sm:p-7 shadow-xl relative">
        <button
          type="button"
          onClick={() => setAuthModalOpen(false)}
          aria-label="Close sign in dialog"
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <SidiLogoEmblem className="w-10 h-10 shrink-0" />
          <div>
            <h2 id="auth-modal-title" className="font-display text-xl font-bold text-[#0A224E]">
              {mode === 'login' ? 'Account Access' : 'Create Traveler Account'}
            </h2>
            <p className="text-xs text-slate-500">Sidi Travel &amp; Tours Ltd. Portal</p>
          </div>
        </div>

        {/* 1-Click Demo Login Panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 space-y-2">
          <p className="text-xs font-semibold text-[#0A224E]">1-Click Demo Quick Access</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleQuickLogin('user@siditravel.com', '/dashboard')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 hover:border-[#0A224E] text-[#0A224E] rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Pilgrim Demo</span>
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => handleQuickLogin('admin@siditravel.com', '/admin')}
              className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-[#0A224E] hover:bg-[#0F2C67] text-white rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F5B800]" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Mode Switch */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-4">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'login' ? 'bg-white text-[#0A224E] shadow-xs' : 'text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'register' ? 'bg-white text-[#0A224E] shadow-xs' : 'text-slate-600'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="auth-name" className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sadiq Abubakar"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="auth-phone" className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="auth-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0803..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                  />
                </div>
                <div>
                  <label htmlFor="auth-city" className="block text-xs font-medium text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    id="auth-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@siditravel.com"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A224E]"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 text-sm font-semibold bg-[#0A224E] hover:bg-[#0F2C67] text-white rounded-lg transition-colors"
          >
            {busy ? 'Processing...' : mode === 'login' ? 'Sign In to Portal' : 'Create Traveler Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
