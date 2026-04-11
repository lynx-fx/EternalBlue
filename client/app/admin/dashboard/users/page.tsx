'use client';
import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Users, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const usersRes = await fetchApi('/admin/users');
      setUsers(usersRes.users || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to authenticate or fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleBan = async (id: string) => {
    try {
      await fetchApi(`/admin/users/${id}/ban`, { method: 'PATCH' });
      toast.success('User status updated');
      loadData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to change user status');
    }
  };

  if (loading) return <div className="animate-pulse flex items-center justify-center p-20 font-medium text-slate-400">Loading user matrix...</div>;

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-950 uppercase tracking-tighter">User Control</h1>
        <p className="text-slate-500 font-medium">Manage and restrict access for registered platform users.</p>
      </div>

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
                    <button 
                      onClick={() => toggleBan(u._id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      {u.isActive ? 'Suspend Access' : 'Restore Access'}
                    </button>
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
    </div>
  );
}
