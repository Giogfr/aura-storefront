import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, User, Package, MapPin, LogOut, CheckCircle2, ArrowRight } from 'lucide-react';

export const AccountModal: React.FC = () => {
  const { isAccountOpen, setIsAccountOpen, user, loginUser, logoutUser, showToast } = useStore();
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAccountOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const derivedName = email
      .split('@')[0]
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    loginUser(email, tab === 'register' ? name.trim() : derivedName || 'Demo Customer');
  };

  const handleDemoLogin = () => {
    loginUser('sarah.jenkins@example.com', 'Sarah Jenkins');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={user ? 'My account' : 'Sign in or create an account'}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsAccountOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden z-10 animate-fade-in">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-neutral-900" />
            <h2 className="text-base font-bold text-neutral-900">
              {user ? 'My Account' : tab === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsAccountOpen(false)}
            aria-label="Close"
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {user ? (
            /* Logged in state */
            <div className="space-y-6">
              <div className="flex items-center gap-3.5 pb-5 border-b border-neutral-100">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center text-lg">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">{user.name}</h3>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                    <CheckCircle2 className="w-3 h-3" /> Demo account
                  </span>
                </div>
              </div>

              {/* Account Quick Links */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => showToast('Order history is simulated in this demo.', 'info')}
                  className="w-full p-3.5 rounded-lg border border-neutral-200/80 hover:border-neutral-900 transition-colors flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900" />
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900">Orders & Returns</h4>
                      <p className="text-[11px] text-neutral-500">Sample order #AU-89421 · Delivered Sep 14</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900" />
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Saved addresses are simulated in this demo.', 'info')}
                  className="w-full p-3.5 rounded-lg border border-neutral-200/80 hover:border-neutral-900 transition-colors flex items-center justify-between group text-left"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900" />
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900">Saved Addresses</h4>
                      <p className="text-[11px] text-neutral-500">424 Broadway, 4th Fl, SoHo, New York</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900" />
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={logoutUser}
                  className="w-full py-2.5 px-4 border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged out state */
            <div>
              <p className="mb-5 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
                Demo mode — sign-in is simulated. No credentials are submitted or stored.
              </p>

              {/* Tab switcher */}
              <div className="flex border-b border-neutral-200 mb-5">
                <button
                  type="button"
                  onClick={() => setTab('signin')}
                  aria-pressed={tab === 'signin'}
                  className={`flex-1 pb-2.5 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors ${
                    tab === 'signin'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  aria-pressed={tab === 'register'}
                  className={`flex-1 pb-2.5 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors ${
                    tab === 'register'
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {tab === 'register' && (
                  <div>
                    <label
                      htmlFor="account-name"
                      className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="account-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="account-email"
                    className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="account-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label
                      htmlFor="account-password"
                      className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    {tab === 'signin' && (
                      <button
                        type="button"
                        onClick={() => showToast('Password recovery is not available in this demo.', 'info')}
                        className="text-[11px] text-neutral-500 hover:text-neutral-900 hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <input
                    id="account-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded focus:outline-hidden focus:border-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold uppercase tracking-wider rounded transition-colors mt-2"
                >
                  {tab === 'signin' ? 'Sign In to Store' : 'Create My Account'}
                </button>
              </form>

              {/* Demo 1-click test button */}
              <div className="mt-5 pt-5 border-t border-neutral-100 text-center">
                <span className="text-[11px] text-neutral-400 block mb-2">Want to test without typing?</span>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded transition-colors"
                >
                  1-Click Demo Customer Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
