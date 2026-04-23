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

  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

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
    { label: 'Active Alerts', value: scams.length.toString(), icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-100', trend: '+12%' },
    { label: 'Global Discoveries', value: discoveryCount.toString(), icon: Globe, color: 'text-primary-600', bg: 'bg-primary-100', trend: 'Live' },
    { label: 'Himalayan Sync', value: 'Active', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', trend: 'Stable' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 md:space-y-8 animate-fade-in"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">System Online</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none">
            {greeting}, {user?.name.split(' ')[0] || 'Voyager'}
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-tight">Your global safety matrix is synchronized with Himalayan intelligence.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-5 py-3.5 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center gap-4 hover:border-primary-100 transition-colors">
             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <Calendar size={18} />
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Date</p>
                <p className="text-xs font-black text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary-900/5 transition-all group relative overflow-hidden">
              <div className="absolute top-4 right-6 text-[10px] font-black text-primary-500/50 uppercase tracking-widest">
                {stat.trend}
              </div>
              <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-inner`}>
                <Icon size={22} strokeWidth={2.5} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-950 uppercase">{stat.value}</h3>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 md:gap-10">
        {/* Recent Advisory */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-950 uppercase tracking-tight">Priority Intelligence</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Real-time risk assessment</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/dashboard/explore'}
              className="px-4 py-2 bg-slate-50 hover:bg-primary-50 text-[10px] font-black text-primary-600 uppercase tracking-widest rounded-full transition-colors border border-transparent hover:border-primary-100"
            >
              Access Registry
            </button>
          </div>
          
          <div className="space-y-4">
             {loading ? (
               [1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-[2rem] animate-pulse" />)
             ) : scams.length > 0 ? (
               scams.map((scam, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedScam(scam)}
                  className="group bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 hover:border-primary-100/50 hover:shadow-xl transition-all flex items-center justify-between cursor-pointer"
                >
                   <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors shadow-inner">
                         <MapPin size={18} />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-0.5 group-hover:text-primary-600 transition-colors">{scam.title}</h4>
                         <div className="flex items-center gap-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{scam.country}</p>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <p className={`${scam.severity === 'High' ? 'text-red-500' : 'text-primary-600'} text-[10px] font-bold uppercase tracking-widest`}>
                              {scam.severity} Risk
                            </p>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 md:gap-6">
                      <p className="hidden sm:block text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {new Date(scam.createdAt).toLocaleDateString()}
                      </p>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                         <ArrowRight size={16} />
                      </div>
                   </div>
                </motion.div>
              ))
             ) : (
               <div className="bg-slate-50 border-2 border-dashed border-slate-100 p-12 rounded-[2.5rem] text-center">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Priority Intelligence Found</p>
               </div>
             )}
          </div>
        </motion.div>

        {/* Action Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-slate-950 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 text-white relative overflow-hidden group min-h-[350px] flex flex-col justify-between">
             {/* Dynamic background effect */}
             <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-blue-600/10 opacity-50" />
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-[100px] group-hover:bg-primary-600/30 transition-colors duration-700" />
             <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]" />
             
             <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-900/40 group-hover:scale-110 transition-transform duration-500">
                   <TrendingUp size={24} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 leading-tight">Plan Your <br />Next Voyage</h3>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed">AI-driven trip modeling based on your profile and global risk indices.</p>
                </div>
             </div>

             <div className="relative z-10 pt-8">
                <button 
                  onClick={() => router.push('/dashboard/chatbot')}
                  className="w-full py-4.5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-slate-950/20"
                >
                  Initialize Model
                </button>
             </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                   <ShieldAlert size={16} />
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol status</h4>
             </div>
             <p className="text-xs text-slate-500 font-medium leading-relaxed">
               All systems operational. Intelligence nodes synchronized with global travel advisories.
             </p>
          </div>
        </motion.div>
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
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedScam(null)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors z-20"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-16 space-y-8">
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
    </motion.div>
  );
}
