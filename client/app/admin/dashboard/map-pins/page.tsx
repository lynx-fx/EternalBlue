'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { 
  MapPin, 
  Trash2, 
  ShieldAlert, 
  Hash, 
  Users, 
  Clock, 
  Globe,
  AlertTriangle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface MapPinData {
  _id: string;
  type: 'hub' | 'scam';
  name: string;
  description?: string;
  coordinates: [number, number];
  usersCount?: number;
  severity?: string;
  createdAt: string;
}

export default function MapModerationPage() {
  const [pins, setPins] = useState<MapPinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'hub' | 'scam'>('all');

  const loadPins = async () => {
    setLoading(true);
    try {
      const [hubsRes, scamsRes] = await Promise.all([
        fetchApi('/chat'),
        fetchApi('/scams')
      ]);

      const hubs: MapPinData[] = (hubsRes.data || [])
        .filter((c: any) => c.isGroupChat && c.coordinates && c.coordinates.length === 2)
        .map((c: any) => ({
          _id: c._id,
          type: 'hub' as const,
          name: c.chatName,
          coordinates: c.coordinates,
          usersCount: c.users.length,
          createdAt: c.createdAt
        }));

      const scams: MapPinData[] = (scamsRes.data.scams || [])
        .filter((s: any) => s.coordinates && s.coordinates.length === 2)
        .map((s: any) => ({
          _id: s._id,
          type: 'scam' as const,
          name: s.title,
          description: s.description,
          coordinates: s.coordinates,
          severity: s.severity,
          createdAt: s.createdAt
        }));

      setPins([...hubs, ...scams].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      toast.error("Failed to synchronize with Map Matrix.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPins();
  }, []);

  const handleDelete = async (pin: MapPinData) => {
    const confirmMsg = pin.type === 'hub' 
      ? `Erase tactical hub "${pin.name}" from global network?` 
      : `Expunge scam directive "${pin.name}" from intelligence matrix?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const endpoint = pin.type === 'hub' ? `/chat/${pin._id}` : `/scams/${pin._id}`;
      const res = await fetchApi(endpoint, { method: 'DELETE' });
      
      if (res.$ok) {
        toast.success(`${pin.type === 'hub' ? 'Hub' : 'Alert'} decommissioned successfully.`);
        setPins(prev => prev.filter(p => p._id !== pin._id));
      } else {
        toast.error(res.message || "Operation failed.");
      }
    } catch (err) {
      toast.error("Transmission error during decommissioning.");
    }
  };

  const filteredPins = filter === 'all' ? pins : pins.filter(p => p.type === filter);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Scanning Satellite Uplink...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter">Map Moderation</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
            <Globe size={12} /> Live Satellite Intel • {pins.length} active nodes
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm">
          {(['all', 'hub', 'scam'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === t 
                  ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/20' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'all' ? 'All Pins' : t === 'hub' ? 'Active Hubs' : 'Scam Alerts'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredPins.map((pin) => (
          <div 
            key={pin._id}
            className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                  pin.type === 'hub' 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'bg-red-50 text-red-600'
                }`}>
                  {pin.type === 'hub' ? <Hash size={24} strokeWidth={2.5} /> : <ShieldAlert size={24} strokeWidth={2.5} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      pin.type === 'hub' 
                        ? 'bg-primary-100/50 text-primary-700' 
                        : 'bg-red-100/50 text-red-700'
                    }`}>
                      {pin.type === 'hub' ? 'Network Cluster' : 'Intelligence Alert'}
                    </span>
                    {pin.severity && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {pin.severity} Risk
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{pin.name}</h3>
                </div>
              </div>

              <button 
                onClick={() => handleDelete(pin)}
                className="w-12 h-12 bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-600 rounded-2xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 active:scale-95"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {pin.description && (
              <p className="text-sm text-slate-500 font-bold leading-relaxed mb-6 italic border-l-4 border-slate-50 pl-6">
                {pin.description}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Coordinates</p>
                  <p className="text-[10px] font-bold text-slate-700">[{pin.coordinates[0].toFixed(4)}, {pin.coordinates[1].toFixed(4)}]</p>
                </div>
              </div>

              {pin.type === 'hub' && (
                <div className="flex items-center gap-2.5">
                  <Users size={14} className="text-slate-400" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Population</p>
                    <p className="text-[10px] font-bold text-slate-700">{pin.usersCount} Active</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <Clock size={14} className="text-slate-400" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Deployed</p>
                  <p className="text-[10px] font-bold text-slate-700">{new Date(pin.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Decorative background icon */}
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none group-hover:scale-110 transition-transform duration-700">
               {pin.type === 'hub' ? <Hash size={120} /> : <ShieldAlert size={120} />}
            </div>
          </div>
        ))}

        {filteredPins.length === 0 && (
          <div className="col-span-full py-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 gap-4">
            <AlertTriangle size={48} className="opacity-20" />
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.3em]">No localized data nodes found</p>
              <p className="text-[10px] font-bold mt-1">Satellite sweeps are coming up empty on this frequency.</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
                  <ShieldAlert size={12} className="text-primary-400" />
                  Protocol Information
               </div>
               <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Moderation Protocol Alpha</h2>
               <p className="text-sm text-white/50 font-medium max-w-xl">
                 Removing a node from this matrix will immediately sever all linked transmissions. Scams are removed from the global registry, and Hubs are permanently decommissioned.
               </p>
            </div>
            <div className="w-24 h-24 border-8 border-white/10 rounded-full flex items-center justify-center">
               <Info size={40} className="text-white/20" />
            </div>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
      </div>
    </div>
  );
}
