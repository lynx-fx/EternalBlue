'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Plane,
  Clock,
  Globe
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [scams, setScams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [discoveryCount, setDiscoveryCount] = useState(0);
  const [selectedScam, setSelectedScam] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, scamsRes, recsRes] = await Promise.all([
          fetchApi('/auth/get-me'),
          fetchApi('/scams'),
          fetchApi('/recommendations')
        ]);
        
        if (userRes.$ok) setUser(userRes.data.user);
        if (scamsRes.$ok) {
          const sortedScams = (scamsRes.data.scams || [])
            .sort((a: any, b: any) => (b.severity === 'High' ? 1 : -1))
            .slice(0, 3);
          setScams(sortedScams);
        }
        if (recsRes.$ok) {
          setDiscoveryCount(recsRes.data.data?.length || 0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Alerts', value: scams.length.toString(), icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Global Discoveries', value: discoveryCount.toString(), icon: Globe, color: 'text-primary-600', bg: 'bg-primary-100' },
    { label: 'Himalayan Sync', value: 'Active', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter mb-2">
            Welcome back, {user?.name.split(' ')[0] || 'Voyager'}
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Your global safety matrix is synchronized with Himalayan intelligence.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <Calendar size={18} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Date</p>
                <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary-900/5 transition-all group">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-950 uppercase">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_0.4fr] gap-10">
        {/* Recent Advisory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-primary-600" size={24} />
              Priority Intelligence
            </h3>
            <button 
              onClick={() => window.location.href = '/dashboard/explore'}
              className="text-[11px] font-black text-primary-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
            >
              Access Registry
            </button>
          </div>
          
          <div className="space-y-4">
             {loading ? (
               [1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-[2rem] animate-pulse" />)
             ) : scams.length > 0 ? (
               scams.map((scam, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedScam(scam)}
                  className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-primary-100/50 hover:shadow-xl transition-all flex items-center justify-between cursor-pointer"
                >
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                         <MapPin size={20} />
                      </div>
                      <div>
                         <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{scam.title}</h4>
                         <div className="flex items-center gap-4">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{scam.country}</p>
                            <p className={`${scam.severity === 'High' ? 'text-red-500' : 'text-primary-600'} text-[11px] font-black uppercase tracking-widest`}>
                              ● {scam.severity} Risk
                            </p>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                        {new Date(scam.createdAt).toLocaleDateString()}
                      </p>
                      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary-600 group-hover:border-primary-100 transition-all">
                         <ArrowRight size={18} />
                      </div>
                   </div>
                </div>
              ))
             ) : (
               <div className="bg-slate-50 border-2 border-dashed border-slate-100 p-12 rounded-[2.5rem] text-center">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Priority Intelligence Found</p>
               </div>
             )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-950 rounded-[3rem] p-8 text-white relative overflow-hidden group">
             {/* Decorative pattern */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl group-hover:bg-primary-600/40 transition-colors" />
             
             <div className="relative z-10">
                <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary-900/20">
                   <TrendingUp size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4 leading-tight">Plan Your Next Voyage</h3>
                <p className="text-slate-400 text-sm font-medium mb-8">AI-driven trip modeling based on your profile and global data.</p>
                <button 
                  onClick={() => router.push('/dashboard/chatbot')}
                  className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-primary-50 transition-all active:scale-95"
                >
                  New Model
                </button>
             </div>
          </div>


          <AnimatePresence>
        {selectedScam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScam(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedScam(null)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors z-20"
              >
                <X size={24} />
              </button>

              <div className="p-10 md:p-16 space-y-8">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-4">
                    <div className="inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-red-50 text-red-600 border-red-100">
                      High Risk Personnel
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none">
                      {selectedScam.title}
                    </h2>
                    <div className="flex items-center gap-2 text-primary-600">
                       <MapPin size={16} />
                       <span className="text-xs font-black uppercase tracking-widest">Region: {selectedScam.country}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-2">Intelligence Brief</p>
                   <p className="text-slate-600 text-base font-medium leading-relaxed italic">
                     {selectedScam.description}
                   </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <History size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Observation Logged</p>
                      <p className="text-sm font-black text-slate-900">{new Date(selectedScam.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary-50 rounded-2xl border border-primary-100">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-primary-950 uppercase tracking-widest text-nowrap">Verified Protocol</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedScam(null)}
                  className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10"
                >
                  Confirm Intelligence & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
      </div>
    </div>
  );
}
