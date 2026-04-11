'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleGoogleSuccess = async (response: any) => {
    setLoading(true);
    try {
      const { code } = response;
      const data = await fetchApi('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      
      if (!data.$ok) {
        toast.error(data.message || 'Google Authentication failed');
        return;
      }

      localStorage.setItem('token', data.token);
      toast.success(data.message || 'Access granted. Welcome Back.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google login was unsuccessful. Try again.'),
    flow: 'auth-code',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!data.$ok) {
        toast.error(data.message || 'Authentication failed');
        return;
      }

      localStorage.setItem('token', data.token);
      toast.success('Access granted. Welcome Back.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Sign In Account</h2>
        <p className="text-slate-500 text-sm font-medium">Synchronize with your global profile.</p>
      </div>

      <button 
        onClick={() => loginWithGoogle()}
        disabled={loading}
        className="w-full flex items-center justify-center gap-4 bg-white border border-slate-100 rounded-2xl py-4 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-emerald-200 transition-all shadow-sm group disabled:opacity-50"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
        Continue with Google
      </button>

      <div className="flex items-center gap-6 py-2">
        <div className="h-px bg-slate-100 flex-1" />
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Access Protocol</span>
        <div className="h-px bg-slate-100 flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Identity</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold"
            placeholder="voyager@network.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Encryption Key
            </label>
            <Link 
              href="/auth/forgot-password" 
              className="text-[10px] font-black text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-widest"
            >
              Recover
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold"
              placeholder="••••••••"
            />
            <button 
              type="button"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white rounded-2xl py-4.5 font-black transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-200/50 hover:bg-slate-950"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Grant Access
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
        New explorer?{' '}
        <Link href="/auth/signup" className="text-emerald-600 hover:underline decoration-2 underline-offset-4 font-black">
          Create Dossier
        </Link>
      </p>
    </div>
  );
}
