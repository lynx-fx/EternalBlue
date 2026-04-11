import React from 'react';
import { ShieldAlert, MapPin, TrendingUp, Calendar, ArrowRight, Plane, Clock, Globe } from 'lucide-react';

export default function UserDashboard({ user }: { user: any }) {
  const stats = [
    { label: 'Active Alerts', value: '4', icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Trips Planned', value: '12', icon: Plane, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Countries Sync', value: '194', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-950 uppercase tracking-tighter mb-2">
            Welcome back, {user?.name.split(' ')[0] || 'Voyager'}
          </h1>
          <p className="text-slate-500 font-medium">Your global safety matrix is synchronized and ready.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <Calendar size={18} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status Date</p>
                <p className="text-sm font-bold text-slate-900">April 11, 2026</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-950">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[1fr_0.4fr] gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-slate-950 uppercase tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-emerald-600" size={24} />
              Recent Alerts
            </h3>
            <button className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
              View All Alerts
            </button>
          </div>
          
          <div className="space-y-4">
             {[
               { title: 'Japan Visa Policy Revision', location: 'Japan', status: 'High', date: '2h ago' },
               { title: 'Weather Advisory: Alpine Region', location: 'Switzerland', status: 'Moderate', date: '5h ago' },
               { title: 'Local Transport Strike', location: 'France', status: 'Low', date: '1d ago' },
             ].map((alert, i) => (
               <div key={i} className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-emerald-100/50 hover:shadow-lg transition-all flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <MapPin size={20} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-1">{alert.title}</h4>
                        <div className="flex items-center gap-4">
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{alert.location}</p>
                           <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">● {alert.status} Priority</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{alert.date}</p>
                     <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all">
                        <ArrowRight size={18} />
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-950 rounded-[3rem] p-8 text-white relative overflow-hidden group">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/20 rounded-full blur-3xl group-hover:bg-emerald-600/40 transition-colors" />
             
             <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-900/20">
                   <TrendingUp size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4 leading-tight">Plan Your Next Voyage</h3>
                <p className="text-slate-400 text-sm font-medium mb-8">AI-driven trip modeling based on your profile and global data.</p>
                <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all">
                  New Model
                </button>
             </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 space-y-6 shadow-sm">
             <div className="flex items-center gap-3">
                <Clock size={16} className="text-emerald-600" />
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.2em]">Next Planned Sync</h4>
             </div>
             <div>
                <p className="text-2xl font-bold text-slate-950 uppercase tracking-tighter">In 14 Hours</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">UTC Synchronization</p>
             </div>
             <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                <div className="w-[60%] h-full bg-emerald-600" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
