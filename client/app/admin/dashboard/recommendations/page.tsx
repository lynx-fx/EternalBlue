'use client';
import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { ShieldAlert, MapPin, Trash2, Plus, AlertOctagon, Info, Globe, Map } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRec, setNewRec] = useState({ title: '', description: '', location: '', category: 'Place' });

  const loadData = async () => {
    try {
      const res = await fetchApi('/recommendations');
      if (res.$ok) {
        setRecommendations(res.data.data || []);
      } else {
        toast.error(res.data?.message || res.message || 'Failed to fetch recommendations');
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

  const handleAddRec = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newRec.title || !newRec.description || !newRec.location) {
        return toast.error('Please fill all required fields');
      }
      
      const res = await fetchApi('/recommendations', { method: 'POST', body: JSON.stringify(newRec) });
      if (res.$ok) {
        toast.success('Recommendation deployed globally');
        setNewRec({ title: '', description: '', location: '', category: 'Place' });
        loadData();
      } else {
        toast.error(res.data?.message || res.message || 'Failed to deploy recommendation');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to deploy recommendation');
    }
  };

  const handleDeleteRec = async (id: string) => {
    if (!window.confirm('Erase this recommendation from the system?')) return;
    try {
      const res = await fetchApi(`/recommendations/${id}`, { method: 'DELETE' });
      if (res.$ok) {
        toast.success('Recommendation erased');
        loadData();
      } else {
        toast.error(res.data?.message || res.message || 'Failed to erase recommendation');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to erase recommendation');
    }
  };

  if (loading) return <div className="animate-pulse flex items-center justify-center p-20 font-medium text-slate-400 text-xs tracking-[0.3em] uppercase">Synchronizing Data...</div>;

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-950 uppercase tracking-tighter">
          Recommendations
        </h1>
        <p className="text-slate-500 font-medium font-display uppercase text-xs tracking-widest">Manage Hotels & Places</p>
      </div>

      <div className="grid lg:grid-cols-[450px_1fr] gap-10 items-start">
        {/* Left Col: Deployment Form */}
        <section className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm sticky top-32">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100/50">
                 <Map size={24} />
              </div>
              <div>
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Add Protocol</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add new hotel or place</p>
              </div>
           </div>
           
           <form onSubmit={handleAddRec} className="space-y-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Location</label>
                 <div className="relative">
                    <Globe size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. Kathmandu" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 outline-none transition-all placeholder:text-slate-300 shadow-inner" 
                      value={newRec.location} 
                      onChange={(e) => setNewRec({...newRec, location: e.target.value})}
                      required
                    />
                 </div>
              </div>
              
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Title</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Everest View Hotel" 
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 outline-none transition-all placeholder:text-slate-300 shadow-inner" 
                   value={newRec.title} 
                   onChange={(e) => setNewRec({...newRec, title: e.target.value})} 
                   required
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Category</label>
                 <div className="grid grid-cols-2 gap-3">
                    {['Hotel', 'Place'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewRec({...newRec, category: c})}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${newRec.category === c ? 'bg-slate-950 border-slate-950 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                      >
                        {c}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Description</label>
                 <textarea 
                   placeholder="Details about this place or hotel..." 
                   rows={5} 
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 outline-none transition-all resize-none placeholder:text-slate-300 shadow-inner" 
                   value={newRec.description} 
                   onChange={(e) => setNewRec({...newRec, description: e.target.value})} 
                   required
                 />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 group active:scale-[0.98]">
                 <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> Apply Recommendation
              </button>
           </form>
        </section>

        {/* Right Col: Feed */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                    <Map size={16} />
                 </div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em]">Live Recommendations</h3>
              </div>
              <span className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{recommendations.length} Active</span>
           </div>

           <div className="grid gap-6">
              {recommendations.map((rec) => (
                <div key={rec._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
                   <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none transition-transform group-hover:scale-110 bg-emerald-600 rounded-bl-full`} />
                   
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${rec.category === 'Hotel' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {rec.category}
                         </div>
                         <div className="flex items-center gap-1.5 text-slate-400">
                            <MapPin size={12} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{rec.location}</span>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteRec(rec._id)} 
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>

                   <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-emerald-700 transition-colors uppercase">{rec.title}</h4>
                   <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6 italic border-l-4 border-slate-100 pl-6">
                      {rec.description}
                   </p>

                   <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">C</div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Verified</span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                         <Info size={12} className="text-slate-300" />
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Logged: {new Date(rec.createdAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                </div>
              ))}
              {recommendations.length === 0 && (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                   <Globe size={40} className="opacity-20 translate-y-2" />
                   <p className="font-black uppercase tracking-[0.3em] text-[10px]">No Active Recommendations</p>
                </div>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
