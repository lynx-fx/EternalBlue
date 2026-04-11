'use client';
import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Users, Ban, CheckCircle, Trash2, Mail, Key, Plus, ShieldCheck, X, AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

  const loadData = async () => {
    try {
      const [usersRes, reportsRes] = await Promise.all([
        fetchApi('/admin/users'),
        fetchApi('/reports')
      ]);

      if (usersRes.$ok) {
        setUsers(usersRes.data.users || []);
      } else {
        toast.error(usersRes.data?.message || usersRes.message || 'Failed to fetch user data');
      }

      if (reportsRes.$ok && reportsRes.data.data) {
        setReports(reportsRes.data.data);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to authenticate or fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
        return toast.error('Please fill all required fields');
      }
      const resAdd = await fetchApi('/admin/users/admin', { method: 'POST', body: JSON.stringify(newAdmin) });
      
      if (!resAdd.$ok) {
        return toast.error(resAdd.data?.message || resAdd.message || 'Failed to create administrator');
      }

      toast.success('Admin authorization created successfully');
      setNewAdmin({ name: '', email: '', password: '' });
      setIsModalOpen(false);
      loadData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to create administrator');
    }
  };

  const toggleBan = async (id: string) => {
    try {
      const res = await fetchApi(`/admin/users/${id}/ban`, { method: 'PATCH' });
      if (res.$ok) {
        toast.success(res.data?.message || 'User status updated');
        loadData();
      } else {
        toast.error(res.data?.message || res.message || 'Failed to change user status');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to change user status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('WARNING: Erasing this user is irreversible. Proceed?')) return;
    try {
      const res = await fetchApi(`/admin/users/${id}`, { method: 'DELETE' });
      if (res.$ok) {
        toast.success(res.data?.message || 'Entity permanently erased');
        loadData();
      } else {
        toast.error(res.data?.message || res.message || 'Failed to erase user entity');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to erase user entity');
    }
  };

  const handleResolveReport = async (reportId: string) => {
    try {
      const res = await fetchApi(`/reports/${reportId}`, { 
        method: 'PUT', 
        body: JSON.stringify({ status: 'Resolved' }) 
      });
      if (res.$ok) {
        toast.success('Report resolved');
        loadData();
      } else {
        toast.error('Failed to resolve report');
      }
    } catch {
      toast.error('Failed to resolve report');
    }
  };

  if (loading) return <div className="animate-pulse flex items-center justify-center p-20 font-medium text-slate-400">Loading user matrix...</div>;

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-slate-950 uppercase tracking-tighter">User Control</h1>
          <p className="text-slate-500 font-medium">Manage and restrict access for registered platform users.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
        >
          <Plus size={16} /> Elevate Personnel
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
                type="button"
              >
                <X size={24} />
              </button>

              <div className="space-y-8">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                    <ShieldCheck size={32} className="text-emerald-500"/> Elevate Personnel
                  </h3>
                  <p className="text-slate-500 font-medium">Issue master authorization credentials to new administrators.</p>
                </div>
                
                <form onSubmit={handleAddAdmin} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-2">Full Name</label>
                      <div className="relative">
                        <Users size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Your Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" value={newAdmin.name} onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})} required/>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-2">Encrypted Email</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" placeholder="Your Email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" value={newAdmin.email} onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} required/>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-2">Initial Access Passphrase</label>
                    <div className="relative">
                      <Key size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="password" placeholder="••••••••" minLength={6} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} required/>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20"
                    >
                      Deploy Administrator
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <Users className="text-emerald-600" size={20} />
            Global User Personnel
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100/50 bg-white">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User Entity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action Directive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                       {u.profileUrl ? <img src={u.profileUrl} className="w-full h-full rounded-xl object-cover" /> : u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none mb-1">{u.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">ID: {u._id.slice(-6)}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-[13px] font-bold text-slate-600">
                    {u.email}
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-[#1C3E43] text-[#9ECEC2]' : 'bg-slate-100 text-slate-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                       {u.isActive ? (
                         <><CheckCircle size={14} className="text-emerald-500"/><span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Active</span></>
                       ) : (
                         <><Ban size={14} className="text-red-500"/><span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Restricted</span></>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => toggleBan(u._id)}
                         className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                       >
                         {u.isActive ? 'Suspend Access' : 'Restore Access'}
                       </button>
                       <button 
                         onClick={() => handleDelete(u._id)}
                         className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                         title="Erase Entity"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-10 text-center text-slate-400 text-sm font-medium">No personnel data located.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-red-50/30 border border-red-100 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(255,0,0,0.02)] mt-8">
        <div className="px-8 py-6 border-b border-red-100 flex items-center justify-between bg-red-50/50">
          <h2 className="text-lg font-bold text-red-900 uppercase tracking-tight flex items-center gap-3">
            <AlertOctagon className="text-red-500" size={20} />
            Flagged Personnel (Social Matrix)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-red-100/50 bg-white/50">
                <th className="px-8 py-5 text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Reporter</th>
                <th className="px-8 py-5 text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Violator</th>
                <th className="px-8 py-5 text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Evidence Log</th>
                <th className="px-8 py-5 text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-red-400 uppercase tracking-[0.2em] text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-50 bg-white">
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-red-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <p className="text-sm font-bold text-slate-900">{r.reporter?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{r.reporter?.email}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-sm font-bold text-slate-900">{r.reportedUser?.name || 'Unknown'}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{r.reportedUser?.email}</p>
                  </td>
                  <td className="px-8 py-4 max-w-xs">
                    <p className="text-[11px] text-slate-600 font-medium truncate" title={r.messageContent}>"{r.messageContent}"</p>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${r.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {r.status === 'Pending' && (
                         <button 
                           onClick={() => handleResolveReport(r._id)}
                           className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-colors"
                         >
                           Resolve
                         </button>
                       )}
                       {r.reportedUser && (
                         <button 
                           onClick={() => toggleBan(r.reportedUser._id)}
                           className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-colors"
                         >
                           Suspend User
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-10 text-center text-slate-400 text-sm font-medium">No flagged users logged in the matrix.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
