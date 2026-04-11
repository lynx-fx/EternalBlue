'use client';
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, Mail, Key, Plus, Activity, AlertOctagon, CheckCircle, Database, Globe } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminOverview() {
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetchApi('/admin/analytics');
        setStats(res.analytics);
      } catch (err: any) {
        toast.error('Failed to load telemetry data');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
        return toast.error('Please fill all required fields');
      }
      await fetchApi('/admin/users/admin', { method: 'POST', body: JSON.stringify(newAdmin) });
      toast.success('Admin authorization created successfully');
      setNewAdmin({ name: '', email: '', password: '' });
      // Refresh admins stat natively
      const res = await fetchApi('/admin/analytics');
      setStats(res.analytics);
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

      {loading ? (
        <div className="animate-pulse h-32 bg-slate-100 rounded-3xl w-full"></div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-lg hover:shadow-emerald-900/5 transition-all group">
             <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={20} strokeWidth={2.5}/>
             </div>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Network Users</p>
             <h3 className="text-3xl font-bold text-slate-950">{stats.totalUsers}</h3>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-lg hover:shadow-emerald-900/5 transition-all group">
             <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle size={20} strokeWidth={2.5}/>
             </div>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Personnel</p>
             <h3 className="text-3xl font-bold text-slate-950">{stats.activeUsers}</h3>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-lg hover:shadow-red-900/5 transition-all group">
             <div className="relative w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity size={20} strokeWidth={2.5}/>
             </div>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Scam Directives</p>
             <h3 className="text-3xl font-bold text-slate-950">{stats.activeDirectives}</h3>
           </div>
           
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-lg hover:shadow-red-900/5 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
             <div className="relative z-10 w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <AlertOctagon size={20} strokeWidth={2.5}/>
             </div>
             <p className="relative z-10 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority Alerts</p>
             <h3 className="relative z-10 text-3xl font-bold text-red-600">{stats.priorityAlerts}</h3>
           </div>
        </div>
      ) : null}

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col gap-6">
             <div className="flex flex-col gap-1">
               <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                 <Database size={18} className="text-emerald-500"/> Infrastructure Status
               </h3>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Network Node Overview</p>
             </div>
             
             <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className="text-emerald-600"/>
                      <span className="text-sm font-bold text-slate-700">Administrator Nodes</span>
                   </div>
                   <span className="text-sm font-black text-slate-900">{stats ? stats.admins : '-'}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <Activity size={18} className="text-emerald-600"/>
                      <span className="text-sm font-bold text-slate-700">Database Connection</span>
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 px-3 py-1 bg-emerald-100 rounded-full">Stable</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div className="flex items-center gap-3">
                      <Globe size={18} className="text-emerald-600"/>
                      <span className="text-sm font-bold text-slate-700">Geospatial Sync</span>
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 px-3 py-1 bg-emerald-100 rounded-full">Updated</span>
                </div>
             </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col gap-6">
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

                <button type="submit" className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
                  <Plus size={16} /> Deploy Administrator
                </button>
             </form>
        </div>
      </div>
    </div>
  );
}
