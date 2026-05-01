'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <section id="recommendations" className="mb-24 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 md:gap-8 mb-10 md:mb-12">
        <h2 className="text-3xl md:text-[2.5rem] font-medium leading-[1.05] tracking-tight max-w-[400px] text-[#161616]">
          Explore Our Travel Recommendations
        </h2>
        <p className="text-slate-500 text-[12px] md:text-[13px] max-w-[280px] md:text-right leading-relaxed pb-1">
          Discover top-rated places and hotels dynamically verified by our intelligence matrix.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full h-40 flex items-center justify-center">
             <div className="text-slate-400 uppercase tracking-widest text-xs font-bold animate-pulse">Syncing matrix data...</div>
          </div>
        ) : displayItems.map((rec, i) => (
          <div key={rec._id || i} className="bg-white rounded-[2rem] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col group cursor-pointer hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300">
            <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-5 bg-slate-100 flex items-center justify-center">
              {/* Fallback image selection based on category */}
              <Image 
                src={rec.imageUrl || rec.image || (rec.category === 'Hotel' 
                  ? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop' 
                  : ['https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1524866299105-08103df12ba6?q=80&w=2066&auto=format&fit=crop'][i % 3])} 
                alt={rec.title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                 <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> {rec.location}
              </div>
            </div>
            <div className="px-2 pb-2 text-left">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-slate-800 text-[16px] md:text-[17px] truncate pr-2">{rec.title}</h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Star size={12} className="fill-amber-400 text-amber-400" /> 5.0
                </div>
              </div>
              <p className="text-slate-400 font-bold text-[11px] mb-4 uppercase tracking-widest">{rec.category}</p>
              
              <div className="flex justify-between items-end">
                 <div className="space-y-1.5 flex-1 pr-4">
                   <p className="text-[9px] text-slate-500 leading-relaxed font-medium line-clamp-2 italic">{rec.description}</p>
                 </div>
                 <Link href="/dashboard">
                   <button className="bg-primary-600 text-white text-[11px] px-5 py-2.5 rounded-full font-medium hover:bg-primary-700 transition-colors border border-primary-600 shrink-0">
                     Explore
                   </button>
                 </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Fill empty spots if less than 3 recommendations */}
        {!loading && displayItems.length === 0 && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 h-full min-h-[300px] border border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400 text-sm font-medium">
             No recommendations added yet. 
          </div>
        )}

        {/* Guide Profile Cards (Right Stack) */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 h-full">
           <div className="h-48 md:h-1/2 w-full relative rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100 p-2 pb-0 group cursor-pointer">
              <div className="w-full h-[65%] relative rounded-2xl overflow-hidden mb-3">
                <Image src="https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJla2tpbmd8ZW58MHx8MHx8fDA%3D" alt="Guide Experience" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                   <ArrowUpRight size={16} />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug px-2">100+ tour guides ready to accompany you.</p>
           </div>
           
           <div className="h-48 md:h-1/2 w-full bg-primary-600 text-white rounded-3xl p-6 flex flex-col justify-between items-center text-center relative overflow-hidden group cursor-pointer">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
               <p className="text-[10px] uppercase tracking-widest text-primary-200 font-bold">Special</p>
               <h3 className="font-semibold text-lg leading-tight relative z-10">Guide <br/>Offers</h3>
               <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-primary-600 transition-all relative z-10">
                  <ArrowUpRight size={16} />
               </button>
           </div>
        </div>
      </div>
    </section>
  );
}
