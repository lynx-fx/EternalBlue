'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Star, ChevronRight, ArrowUpRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function RecommendationsSection() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetchApi('/recommendations');
        if (res.$ok) {
          setRecommendations(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  // Use dummy fallbacks if data hasn't been added yet, just to keep the visual structure intact
  const displayItems = recommendations.length > 0 ? recommendations.slice(0, 3) : [];

  return (
    <section className="mb-24 pt-6">
      <div className="flex justify-between items-end gap-8 mb-12">
        <h2 className="text-[2.5rem] font-medium leading-[1.05] tracking-tight max-w-[400px] text-[#161616]">
          Explore Our Travel Recommendations
        </h2>
        <p className="text-slate-500 text-[13px] max-w-[280px] text-right leading-relaxed pb-1">
          Discover top-rated places and hotels dynamically verified by our intelligence matrix.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full h-40 flex items-center justify-center">
             <div className="text-slate-400 uppercase tracking-widest text-xs font-bold animate-pulse">Syncing matrix data...</div>
          </div>
        ) : displayItems.map((rec, i) => (
          <div key={rec._id || i} className="bg-white rounded-[2rem] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col group cursor-pointer hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300">
            <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-5 bg-slate-100 flex items-center justify-center">
              {/* Fallback image selection based on category */}
              <Image 
                src={rec.category === 'Hotel' 
                  ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop' 
                  : `https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=2000&auto=format&fit=crop`} 
                alt={rec.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
                onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2070&auto=format&fit=crop' }}
              />
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                 <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> {rec.location}
              </div>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-slate-800 text-[17px] truncate pr-2">{rec.title}</h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Star size={12} className="fill-amber-400 text-amber-400" /> 5.0
                </div>
              </div>
              <p className="text-slate-400 font-bold text-[11px] mb-4 uppercase tracking-widest">{rec.category}</p>
              
              <div className="flex justify-between items-end">
                 <div className="space-y-1.5 flex-1 pr-4">
                   <p className="text-[9px] text-slate-500 leading-relaxed font-medium line-clamp-2 italic">{rec.description}</p>
                 </div>
                 <button className="bg-[#1C3E43] text-white text-[11px] px-5 py-2.5 rounded-full font-medium hover:bg-[#122b2e] transition-colors border border-[#1C3E43] shrink-0">
                   Explore
                 </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Fill empty spots if less than 3 recommendations */}
        {!loading && displayItems.length === 0 && (
          <div className="col-span-3 h-full min-h-[300px] border border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400 text-sm font-medium">
             No recommendations added yet. 
          </div>
        )}

        {/* Guide Profile Cards (Right Stack) - Keeping the identical layout block at the end */}
        <div className="flex flex-col gap-4 h-full">
           <div className="h-1/2 w-full relative rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100 p-2 pb-0 group cursor-pointer">
              <div className="w-full h-[65%] relative rounded-2xl overflow-hidden mb-3">
                <Image src="https://images.unsplash.com/photo-1695653422055-1262d00c3bcf?q=80&w=2072&auto=format&fit=crop" alt="Guide Experience" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                   <ArrowUpRight size={16} />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug px-2">More than 100+ tour guides ready to accompany you.</p>
           </div>
           
           <div className="h-1/2 bg-[#1C3E43] text-white rounded-3xl p-6 flex flex-col justify-between items-center text-center relative overflow-hidden group cursor-pointer">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
               <p className="text-[10px] uppercase tracking-widest text-[#9ECEC2] font-bold">Special</p>
               <h3 className="font-semibold text-lg leading-tight relative z-10">Guide <br/>Offers</h3>
               <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#1C3E43] transition-all relative z-10">
                  <ArrowUpRight size={16} />
               </button>
           </div>
        </div>
      </div>
    </section>
  );
}
