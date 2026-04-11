'use client';
import React, { useState } from 'react';
import { ShieldCheck, Users, Mail, Key, Plus } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminOverview() {
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
        return toast.error('Please fill all required fields');
      }
      await fetchApi('/admin/users/admin', { method: 'POST', body: JSON.stringify(newAdmin) });
      toast.success('Admin authorization created successfully');
      setNewAdmin({ name: '', email: '', password: '' });
    } catch (e: any) {
      toast.error(e.message || 'Failed to create administrator');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-950 uppercase tracking-tighter">
          Command Center: Overview
        </h1>
        <p className="text-slate-500 font-medium">Manage global security access parameters and operational directives.</p>
      </div>

      <div className="max-w-2xl bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col gap-6">
           <div className="flex flex-col gap-1">
             <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
               <ShieldCheck size={18} className="text-emerald-500"/> Elevate Personnel
             </h3>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Create master authorization credentials</p>
           </div>
           
           <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} required/>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Encrypted Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" placeholder="admin@voyager.ai" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} required/>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Initial Access Passphrase</label>
                <div className="relative">
                  <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" placeholder="••••••••" minLength={6} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} required/>
                </div>
              </div>

              <button type="submit" className="w-full mt-2 bg-[#1C3E43] hover:bg-[#122b2e] text-white py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#1C3E43]/20">
                <Plus size={16} /> Deploy Administrator
              </button>
           </form>
      </div>
    </div>
  );
}
