'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!email || !token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        await fetchApi(`/auth/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
        setStatus('success');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Verification failed.');
      }
    };

    verify();
  }, [email, token]);

  return (
    <div className="text-center space-y-8">
      {status === 'loading' && (
        <div className="space-y-6 py-8">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-primary-100 rounded-3xl animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-primary-600 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">Verifying...</h2>
            <p className="text-slate-500 text-sm font-medium">Authenticating your travel passport</p>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6 py-8">
          <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary-900/5 rotate-3">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter text-primary-600">Verified!</h2>
            <p className="text-slate-500 text-sm font-medium px-4">Your email has been confirmed. You are ready to explore the world.</p>
          </div>
          <Link 
            href="/auth/login" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 group"
          >
            Go to Login
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6 py-8">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-red-900/5 -rotate-3">
            <ShieldAlert size={40} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter text-red-600">Auth Error</h2>
            <p className="text-slate-500 text-sm font-medium px-4">{message}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link 
              href="/auth/signup" 
              className="text-sm font-bold text-primary-600 hover:underline underline-offset-4 decoration-2"
            >
              Try Signing Up Again
            </Link>
            <Link 
              href="/" 
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Return to Base
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center p-20"><Loader2 className="animate-spin mx-auto w-8 h-8 text-primary-600" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}
