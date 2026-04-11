'use client';
import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { ShieldCheck, UserMinus, ShieldAlert, Flag, MessageSquare, Shield, CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const res = await fetchApi('/reports');
      if (res.$ok) {
        setReports(res.data.data || []);
      } else {
        toast.error(res.data?.message || res.message || 'Failed to fetch reports');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to authenticate or fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetchApi(`/reports/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify({ status }) 
      });
      if (res.$ok) {
        toast.success(`Report marked as ${status}`);
        loadReports();
      } else {
        toast.error(res.data?.message || res.message || 'Failed to update report');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to update report');
    }
  };

  if (loading) return <div className="animate-pulse flex items-center justify-center p-20 font-medium text-slate-400 text-xs tracking-[0.3em] uppercase">Checking Moderation Queue...</div>;

  const pendingReports = reports.filter(r => r.status === 'Pending');
  const resolvedReports = reports.filter(r => r.status !== 'Pending');

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-950 uppercase tracking-tighter">
          Intelligence Queue
        </h1>
        <p className="text-slate-500 font-medium font-display uppercase text-xs tracking-widest">User Moderation & Behavior Reports</p>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-sm shadow-red-100/50">
              <Flag size={24} />
           </div>
           <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Active Reports ({pendingReports.length})</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flags requiring immediate administrative review</p>
           </div>
        </div>

        <div className="grid gap-6">
          {pendingReports.map(report => (
            <div key={report._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-xl hover:border-red-100 transition-all">
               <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                       <ShieldAlert size={10} /> Pending
                     </span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       Reported at {new Date(report.createdAt).toLocaleString()}
                     </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-widest">
                     <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-slate-600">
                        Reporter: <span className="text-slate-900 ml-1">{report.reporter?.name || 'Unknown'}</span>
                     </div>
                     <span className="text-slate-300">→</span>
                     <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-xl text-red-600">
                        Target: <span className="text-red-900 ml-1">{report.reportedUser?.name || 'Unknown'}</span>
                     </div>
                  </div>

                  <div className="bg-slate-950 text-slate-300 p-6 rounded-[2rem] font-medium text-sm leading-relaxed relative">
                     <MessageSquare size={16} className="absolute top-6 left-6 text-slate-700" />
                     <p className="pl-10 italic text-white/90">"{report.messageContent}"</p>
                  </div>
               </div>

               <div className="flex md:flex-col gap-3 shrink-0">
                  <button 
                    onClick={() => handleUpdateStatus(report._id, 'Resolved')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                  >
                    <CheckCircle size={14} /> Resolve 
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(report._id, 'Dismissed')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                  >
                    <Trash2 size={14} /> Dismiss
                  </button>
               </div>
            </div>
          ))}
          {pendingReports.length === 0 && (
             <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
               <ShieldCheck size={40} className="opacity-20 translate-y-2 text-emerald-600" />
               <p className="font-black uppercase tracking-[0.3em] text-[10px]">No pending operations</p>
            </div>
          )}
        </div>
      </div>

      {resolvedReports.length > 0 && (
        <div className="space-y-8 pt-10 border-t border-slate-100 mt-10">
          <div className="flex items-center gap-4 opacity-50">
             <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                <Shield size={24} />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Archived Reports</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logs of resolved or dismissed flags</p>
             </div>
          </div>
          <div className="grid gap-4 opacity-50">
            {resolvedReports.map(report => (
              <div key={report._id} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                       {report.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
                      Target: {report.reportedUser?.name}
                    </span>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   {new Date(report.createdAt).toLocaleString()}
                 </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
