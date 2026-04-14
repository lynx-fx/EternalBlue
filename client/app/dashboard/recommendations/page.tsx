'use client';

import React, { useEffect, useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Star, 
  Hotel, 
  Trees, 
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { motion } from 'framer-motion';

export default function DiscoveryPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecs = async () => {
      const res = await fetchApi('/recommendations');
      if (res.$ok) {
        setRecommendations(res.data.data);
      }
      setLoading(false);
    };
    loadRecs();
  }, []);

  const filtered = recommendations.filter((r: any) => filter === 'all' || r.type === filter);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative bg-slate-950 rounded-[3.5rem] p-10 md:p-16 overflow-hidden text-white shadow-2xl shadow-slate-900/40">
        <div className="absolute top-0 right-0 w-2/3 md:w-1/2 h-full opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full">
            <Sparkles size={14} className="text-primary-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">Voyager Selection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Discover the <span className="text-primary-500">Unseen</span> Himalayas
          </h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed italic">
            Hand-picked expeditions and elite sanctuaries, curated for the modern Voyager.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {[
          { id: 'all', label: 'All Experiences', icon: Compass },
          { id: 'trip', label: 'Adventure Trips', icon: Trees },
          { id: 'hotel', label: 'Elite Stays', icon: Hotel }
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-8 py-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === btn.id 
                ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20' 
                : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'
            }`}
          >
            <btn.icon size={16} />
            {btn.label}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} className="h-96 bg-slate-100 rounded-[3rem] animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center">
             <Filter size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest">No matching discoveries found.</p>
          </div>
        ) : (
          filtered.map((rec: any, idx: number) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={rec._id}
              className="group bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-500"
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={rec.imageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={rec.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-2 rounded-full backdrop-blur-md text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${
                    rec.type === 'trip' ? 'bg-primary-600/80 text-white' : 'bg-blue-600/80 text-white'
                  }`}>
                    {rec.type === 'trip' ? <Trees size={12} /> : <Hotel size={12} />}
                    {rec.type}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < rec.rating ? "fill-amber-500" : "text-slate-200"} />
                      ))}
                    </div>
                    <span className="text-sm font-black text-primary-600 tracking-tighter">{rec.price || 'Contact for Pricing'}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter leading-tight line-clamp-2">{rec.title}</h3>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">{rec.location}</span>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-500 leading-relaxed italic line-clamp-2">
                  {rec.description}
                </p>

                <button className="w-full py-4 bg-slate-50 hover:bg-primary-600 hover:text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all group/btn">
                  View Intelligence <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
