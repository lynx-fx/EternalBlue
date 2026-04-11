'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  ChevronRight,
  Heart,
  Search,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { emergencyContacts } from '@/constant/contacts';

const PREDEFINED_COUNTRIES = emergencyContacts.SAARC_emergency_contacts.slice(0, 5).map(c => c.country);

export default function AdvisoryPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCountry, setSearchCountry] = useState('Nepal');
  const [isSearching, setIsSearching] = useState(false);
  const [emergencyData, setEmergencyData] = useState<any>(
    emergencyContacts.SAARC_emergency_contacts.find(c => c.country === 'Nepal')
  );

  const fetchEmergencyInfo = async (e?: React.FormEvent, overrideCountry?: string) => {
    if (e) e.preventDefault();
    const query = overrideCountry || searchCountry;
    if (!query.trim()) return;
    
    setIsSearching(true);
    if (overrideCountry) setSearchCountry(overrideCountry);

    // Simulated network delay
    await new Promise(r => setTimeout(r, 400));

    const found = emergencyContacts.SAARC_emergency_contacts.find(c => 
      c.country.toLowerCase() === query.toLowerCase().trim()
    );

    if (found) {
       setEmergencyData(found);
       toast.success(`Emergency data retrieved for ${found.country}`);
    } else {
       setEmergencyData(null);
       toast.error("No intelligence found for this region.");
    }
    
    setIsSearching(false);
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetchApi('/recommendations');
        if (res.$ok) {
          setRecommendations(res.data.data || []);
        } else {
          toast.error("Failed to load recommendations");
        }
      } catch (err) {
        toast.error("Error connecting to terminal");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const dynamicTips = recommendations.filter(r => r.type === 'tip');
  const travelTips = [
    { _id: 'static-01', title: 'Sacred Direction', description: 'Always pass Mani stones (prayer walls) and Stupas in a clockwise direction. Never disturb these markers.' },
    { _id: 'static-02', title: 'Permission to Capture', description: 'Ask for authorization before photographing people or sacred interiors of monasteries. Many rituals are private.' },
    ...dynamicTips
  ];

  if (loading) {
    return <div className="h-[calc(100vh-140px)] flex items-center justify-center font-black animate-pulse text-slate-400 uppercase tracking-widest text-sm">Accessing Safety Terminal...</div>;
  }

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter">Safety Terminal</h1>
          </div>
          <p className="text-slate-500 font-medium max-w-xl leading-relaxed">
            Real-time tactical intelligence and safety protocols for the Himalayan region. Stay synchronized with the latest regional updates.
          </p>
        </div>
        
        <div className="px-6 py-4 bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center gap-4">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Global Status: Operational</p>
        </div>
      </div>

      {/* Cultural Protocols Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-slate-950 rounded-[3.5rem] p-10 md:p-16 overflow-hidden text-white shadow-2xl shadow-slate-900/20"
      >
        <div className="relative z-10 max-w-6xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Heart size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Cultural Etiquette</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Respecting the <span className="text-emerald-500">Divine Terrain</span></h2>
          
          <div className="space-y-4">
            {travelTips.length > 0 ? travelTips.map((tip, index) => (
              <div key={tip._id} className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <span className="font-black text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest mb-2">{tip.title}</h4>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed italic">{tip.description}</p>
                </div>
              </div>
            )) : (
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                <p className="text-xs font-bold text-slate-400 italic">No localized travel tips broadcasted by Admin command yet.</p>
              </div>
            )}
          </div>
            
        </div>
        
        {/* Background Graphic */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
            <path d="M0 100 L50 20 L100 100 Z" opacity="0.5" />
            <path d="M20 100 L60 40 L100 100 Z" opacity="0.3" />
          </svg>
        </div>
      </motion.div>

      {/* Emergency Section Fold */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-10 md:p-14 bg-red-600 rounded-[3.5rem] border border-red-500 shadow-xl shadow-red-900/20 relative overflow-hidden group text-white"
      >
        <div className="relative z-10 w-full h-full flex flex-col md:flex-row gap-12 justify-between items-center">
          <div className="md:w-1/2 space-y-6">
            <h4 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Emergency <span className="text-red-200">Support</span></h4>
            <p className="text-red-100 font-medium leading-relaxed max-w-md">Immediate access to verified Himalayan rescue logic. Connect to the local coordinate matrix to pull dispatch numbers instantly.</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Voyage Guardian</p>
                <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest">Himalayas Verified</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 w-full bg-black/20 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <form onSubmit={fetchEmergencyInfo} className="mb-6 relative">
              <input 
                type="text" 
                value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                placeholder="Enter country (e.g. Nepal, Japan)" 
                className="w-full bg-black/40 text-white placeholder:text-red-200/40 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-white/30 text-sm font-bold uppercase transition-all"
              />
              <button type="submit" disabled={isSearching} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white disabled:opacity-50">
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </button>
            </form>

            <div className="flex flex-wrap gap-3 mb-8">
              {PREDEFINED_COUNTRIES.map(c => (
                 <button 
                     key={c} 
                     onClick={() => fetchEmergencyInfo(undefined, c)} 
                     type="button" 
                     disabled={isSearching}
                     className="px-4 py-2 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-[10px] font-bold text-white tracking-[0.2em] uppercase transition-colors"
                 >
                   {c}
                 </button>
              ))}
            </div>

            {emergencyData ? (
              <div className="space-y-4 animate-fade-in flex-1">
                <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-red-200">Police</span>
                  <span className="text-lg font-black tracking-widest">{emergencyData.police || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-red-200">Ambulance</span>
                  <span className="text-lg font-black tracking-widest">{emergencyData.ambulance || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                  <span className="text-xs font-bold uppercase tracking-widest text-red-200">Fire / Rescue</span>
                  <span className="text-lg font-black tracking-widest">{emergencyData.fire || emergencyData.rescue || 'N/A'}</span>
                </div>
                {emergencyData.tourist_helpline && (
                  <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Tourist Helpline</span>
                    <span className="text-lg font-black tracking-widest text-emerald-400">{emergencyData.tourist_helpline}</span>
                  </div>
                )}
                {emergencyData.tourist_police && (
                  <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5 hover:bg-black/30 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Tourist Police</span>
                    <span className="text-lg font-black tracking-widest text-emerald-400">{emergencyData.tourist_police}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center border-2 border-dashed border-red-500/30 rounded-3xl bg-black/10 p-10">
                <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest opacity-80 text-center px-8 leading-relaxed">
                  Query matrix by ISO format to scan local emergency networks and global rescue contacts
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Abstract Geometry */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </div>
  );
}
