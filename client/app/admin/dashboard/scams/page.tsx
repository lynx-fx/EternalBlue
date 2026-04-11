'use client';
import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { ShieldAlert, MapPin, Trash2, Plus, AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminScamsPage() {
  const [scams, setScams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newScam, setNewScam] = useState({ country: '', title: '', description: '', severity: 'Medium' });

  const loadData = async () => {
    try {
      const scamsRes = await fetchApi('/scams');
      setScams(scamsRes.scams || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to authenticate or fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddScam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newScam.country || !newScam.title || !newScam.description) {
        return toast.error('Please fill all required fields');
      }
      await fetchApi('/scams', { method: 'POST', body: JSON.stringify(newScam) });
      toast.success('Scam directive deployed globally');
      setNewScam({ country: '', title: '', description: '', severity: 'Medium' });
      loadData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to authorize scam directive deployment');
    }
  };

  const handleDeleteScam = async (id: string) => {
    try {
      await fetchApi(`/scams/${id}`, { method: 'DELETE' });
      toast.success('Scam directive erased from system');
      loadData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to erase scam directive');
    }
  };

  if (loading) return <div className="animate-pulse flex items-center justify-center p-20 font-medium text-slate-400">Loading intelligence...</div>;

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-950 uppercase tracking-tighter">
          Scam Directives
        </h1>
        <p className="text-slate-500 font-medium">Broadcast and map custom global AI directives regarding localized threats and regional scams.</p>
      </div>

      <div className="grid lg:grid-cols-[0.4fr_1fr] gap-6 items-start">
        {/* Add Scam Form */}
        <form onSubmit={handleAddScam} className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col gap-6">
           <div className="flex flex-col gap-1">
             <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
               <AlertOctagon size={18} className="text-amber-500"/> Deploy Incident
             </h3>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global scam warning system</p>
           </div>
           
           <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Country Code</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="e.g. France, Japan" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={newScam.country} onChange={(e) => setNewScam({...newScam, country: e.target.value})} required/>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Incident Title</label>
                <input type="text" placeholder="Taxi meter hacking" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={newScam.title} onChange={(e) => setNewScam({...newScam, title: e.target.value})} required/>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Severity Flag</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold text-slate-700 uppercase tracking-wider focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" value={newScam.severity} onChange={(e) => setNewScam({...newScam, severity: e.target.value})}>
                   <option value="High">High Priority</option>
                   <option value="Medium">Medium Warning</option>
                   <option value="Low">Low Precaution</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Operational Details</label>
                <textarea placeholder="Describe the method of action..." rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none" value={newScam.description} onChange={(e) => setNewScam({...newScam, description: e.target.value})} required/>
              </div>
           </div>

           <button type="submit" className="w-full bg-[#1C3E43] hover:bg-[#122b2e] text-white py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#1C3E43]/20">
             <Plus size={16} /> Broadcast Intel
           </button>
        </form>

        {/* Global Scams List */}
        <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm h-full max-h-[600px] flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <ShieldAlert className="text-red-500" size={20} />
              Active Global Directives
            </h2>
            <div className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{scams.length} Incidents</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {scams.map((scam) => (
               <div key={scam._id} className="p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                     <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-[0.2em] ${scam.severity === 'High' ? 'bg-red-50 text-red-600' : scam.severity === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                           {scam.severity}
                        </span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-1"><MapPin size={10}/> {scam.country}</p>
                     </div>
                     <button onClick={() => handleDeleteScam(scam._id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 relative z-10"><Trash2 size={16}/></button>
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-900 tracking-tight leading-tight mb-2">{scam.title}</h4>
                  <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{scam.description}</p>
               </div>
             ))}
             {scams.length === 0 && (
                <div className="h-full min-h-[200px] flex items-center justify-center text-slate-400 text-sm font-medium">No active incident intel.</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
