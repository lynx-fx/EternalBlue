'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2, KeyRound, ShieldCheck } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !token) {
      toast.error('Invalid or expired reset link.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetchApi('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, token, password }),
      });
      if (res.$ok) {
        setSuccess(true);
        toast.success('System updated. Password reset successful.');
        setTimeout(() => router.push('/auth/login'), 3000);
      } else {
        toast.error(res.data?.message || res.message || 'Reset failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6 py-8 animate-fade-in">
        <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary-900/10 rotate-3">
          <ShieldCheck size={44} strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">Account Secured</h2>
          <p className="text-slate-500 text-sm font-medium">Redirecting you to the login portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-slate-950 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-[-3deg]">
          <KeyRound size={28} />
        </div>
        <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">Set New Password</h2>
        <p className="text-slate-500 text-sm font-medium">Update your digital signature credentials.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
            New Password
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all text-sm font-bold"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all text-sm font-bold"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white rounded-2xl py-4 font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-lg shadow-primary-200 mt-6"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Update System
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-20"><Loader2 className="animate-spin mx-auto w-8 h-8 text-primary-600" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
