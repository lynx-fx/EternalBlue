'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Globe, Eye, EyeOff } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userRole: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleGoogleSuccess = async (response: any) => {
    setLoading(true);
    try {
      const { code } = response;
      const res = await fetchApi('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      
      if (!res.$ok) {
        toast.error(res.data?.message || res.message || 'Google Authentication failed');
        return;
      }

      localStorage.setItem('token', res.data.token);
      toast.success(res.data.message || 'Access granted. Welcome to Voyage');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Google Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google registration was unsuccessful. Try again.'),
    flow: 'auth-code',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await fetchApi('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email: formData.email,
          password: formData.password,
          userRole: formData.userRole
        }),
      });

      if (!res.$ok) {
        toast.error(res.data?.message || res.message || 'Signup failed');
        return;
      }

      toast.success('Dossier created. Verification required.');
      router.push('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter">Initialize Account</h2>
        <p className="text-slate-500 text-sm font-medium">Draft your credentials to begin the journey.</p>
      </div>

      <button 
        onClick={() => signupWithGoogle()}
        disabled={loading}
        className="w-full flex items-center justify-center gap-4 bg-white border border-slate-100 rounded-2xl py-3.5 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm group disabled:opacity-50"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
        Continue with Google
      </button>

      <div className="flex items-center gap-6 py-1">
        <div className="h-px bg-slate-100 flex-1" />
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Security Layer</span>
        <div className="h-px bg-slate-100 flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3.5 px-5 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-emerald-500 transition-all text-xs font-bold"
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3.5 px-5 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-emerald-500 transition-all text-xs font-bold"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Identity</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3.5 px-5 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-emerald-500 transition-all text-xs font-bold"
            placeholder="voyager@network.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Key</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3.5 px-5 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-emerald-500 transition-all text-xs font-bold"
              placeholder="••••••••"
            />
            <button 
              type="button"
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white rounded-2xl py-4 font-black transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-200/50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
             'Initialize Account'
          )}
        </button>
      </form>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
        Already a voyager?{' '}
        <Link href="/auth/login" className="text-emerald-600 hover:underline decoration-2 underline-offset-4 font-black">
          Authenticate
        </Link>
      </p>
    </div>
  );
}
