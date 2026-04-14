'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetchApi(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
      if (res.$ok) {
        setSent(true);
        toast.success('Recovery link sent to your email.');
      } else {
        toast.error(res.data?.message || res.message || 'Request failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-950">Reset Password</h2>
        <p className="text-slate-500 text-sm">We'll send you a link to recover your account.</p>
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all text-sm font-medium"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white rounded-2xl py-4 font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-lg shadow-primary-200"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Send Link
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <p className="text-sm font-medium text-slate-600">
            A recovery email has been sent to <span className="text-slate-950 font-bold">{email}</span>. Please check your inbox.
          </p>
        </div>
      )}

      <div className="text-center">
        <Link 
          href="/auth/login" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest"
        >
          <ChevronLeft size={16} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
