'use client';
import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, Activity, AlertOctagon, CheckCircle, Database } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';

import { motion } from 'framer-motion';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetchApi('/admin/analytics');
        if (res.$ok) {
          setStats(res.data.analytics);
        } else {
          toast.error(res.data?.message || 'Failed to load telemetry data');
        }
      } catch (err: any) {
        toast.error('Failed to load telemetry data');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);



  const threatPercentage = stats ? Math.min(100, (stats.priorityAlerts / Math.max(1, stats.activeDirectives)) * 100) : 0;
  const activityPercentage = stats ? Math.min(100, (stats.activeUsers / Math.max(1, stats.totalUsers)) * 100) : 0;

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Network <span className="text-emerald-600">Telemetry</span>
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">Real-time oversight of the Voyager security matrix.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-950 uppercase tracking-widest text-nowrap">Live Satellite Sync Active</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse h-40 bg-slate-100 rounded-[2.5rem]" />
          ))}
        </div>
      ) : stats ? (
        <div className="space-y-12">
          {/* Main Stat Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Network Users', val: stats.totalUsers, icon: Users, color: 'emerald', shadow: 'shadow-emerald-900/5' },
              { label: 'Active Personnel', val: stats.activeUsers, icon: CheckCircle, color: 'blue', shadow: 'shadow-blue-900/5' },
              { label: 'Global Directives', val: stats.activeDirectives, icon: Activity, color: 'amber', shadow: 'shadow-amber-900/5' },
              { label: 'Priority Alerts', val: stats.priorityAlerts, icon: AlertOctagon, color: 'red', shadow: 'shadow-red-900/5', isAlert: true }
            ].map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={stat.label}
                className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col hover:shadow-xl ${stat.shadow} transition-all group relative overflow-hidden`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-100 text-${stat.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                   <stat.icon size={20} strokeWidth={2.5}/>
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className={`text-3xl font-black ${stat.isAlert ? 'text-red-600' : 'text-slate-950'}`}>{stat.val}</h3>
                
                <div className={`absolute -bottom-4 -right-4 w-20 h-20 bg-${stat.color}-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700`} />
              </motion.div>
            ))}
          </div>

          {/* Advanced Analytics Section */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
               <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/10 blur-[100px]" />
               <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-500/10 blur-[80px]" />
               
               <div className="relative z-10 flex flex-col h-full gap-10">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">System Health Matrix</h3>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Aggregated node performance and risk</p>
                     </div>
                     <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        Operational Status: 99.8%
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1 items-center">
                     <div className="space-y-8">
                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Personnel Engagement</span>
                              <span className="text-2xl font-black text-white">{Math.round(activityPercentage)}%</span>
                           </div>
                           <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${activityPercentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                              />
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Global Threat Level</span>
                              <span className={`text-2xl font-black ${threatPercentage > 50 ? 'text-red-500' : 'text-amber-500'}`}>{Math.round(threatPercentage)}%</span>
                           </div>
                           <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${threatPercentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                className={`h-full ${threatPercentage > 50 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]'}`} 
                              />
                           </div>
                        </div>
                     </div>

                     <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-white/[0.08] transition-colors cursor-default">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10 mb-2">
                           <Activity size={32} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight">Active Pulse</h4>
                        <p className="text-slate-500 text-xs font-medium max-w-[200px]">Node synchronization across all regions is currently stable and encrypted.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm flex flex-col gap-8">
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Node Breakdown</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Administrative Hierarchy</p>
               </div>

               <div className="space-y-4">
                  {[
                    { label: 'Administrator Nodes', val: stats.admins, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Support Agents', val: 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { label: 'Database Integrity', val: '100%', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center justify-between p-5 ${item.bg} ${item.border} border rounded-[2rem] transition-all hover:translate-x-1`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center ${item.color} shadow-sm border border-black/[0.02]`}>
                             <item.icon size={18} strokeWidth={2.5} />
                          </div>
                          <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{item.label}</span>
                       </div>
                       <span className="text-lg font-black text-slate-950">{item.val}</span>
                    </div>
                  ))}
               </div>
               
               <div className="mt-2 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                     All network nodes are monitored for unauthorized access or suspicious frequency shifts.
                  </p>
               </div>
            </div>
          </div>
        </div>
      ) : null}


    </div>
  );
}
