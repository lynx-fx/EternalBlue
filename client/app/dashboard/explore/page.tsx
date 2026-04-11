'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldAlert, 
  Info, 
  Globe, 
  Filter,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  History
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface Scam {
  _id: string;
  country: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export default function ExplorePage() {
  const [scams, setScams] = useState<Scam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const fetchScams = async (country?: string) => {
    setLoading(true);
    try {
      const endpoint = country 
        ? `/scams/country/${country}` 
        : '/scams';
      const data = await fetchApi(endpoint);
      if (data.success) {
        setScams(data.scams);
      }
    } catch (error) {
      console.error('Error fetching scams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScams();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchScams(searchQuery.trim());
      setSelectedCountry(searchQuery.trim());
    } else {
      fetchScams();
      setSelectedCountry(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCountry(null);
    fetchScams();
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Low':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-12 text-white">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-emerald-600/10 blur-[120px] -z-0" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -z-0" />
        
        <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Globe size={14} />
              Global Safety Index
            </div>
            <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              Explore <br />
              <span className="text-emerald-500">Security Matrices</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
              Real-time intelligence on travel scams, safety alerts, and localized risks across 195 nations. Stay updated with crowdsourced and AI-verified security data.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] w-full lg:w-[400px]">
             <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search country (e.g. France)" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest text-sm"
                >
                  Query Registry
                </button>
             </form>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-[1fr_350px] gap-12">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">
                {selectedCountry ? `Results for ${selectedCountry}` : 'Global Intelligence Feed'}
              </h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                {selectedCountry ? `Viewing localized alerts for ${selectedCountry}` : 'Synchronized with real-time global reports'}
              </p>
            </div>
            {selectedCountry && (
              <button 
                onClick={clearSearch}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest"
              >
                Clear Filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 4, 5].map((i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : scams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scams.map((scam) => (
                <div 
                  key={scam._id}
                  className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-emerald-900/5 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getSeverityStyles(scam.severity)}`}>
                        {scam.severity} Risk
                      </div>
                      <div className="text-slate-300 group-hover:text-emerald-500 transition-colors">
                        <MapPin size={20} />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                        {scam.title}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Region: {scam.country}
                      </p>
                    </div>

                    <p className="text-slate-600 text-sm font-medium leading-relaxed line-clamp-3">
                      {scam.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <History size={14} className="text-slate-300" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         Added {new Date(scam.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                       <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <ShieldAlert size={40} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">No intelligence found</h3>
                  <p className="text-slate-500 font-medium max-w-sm mt-2">
                    Our sensors haven't picked up any specific alerts for this query yet. Try a different region.
                  </p>
               </div>
               <button 
                 onClick={clearSearch}
                 className="px-8 py-3 bg-slate-950 text-white font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all"
               >
                 Reset Search
               </button>
            </div>
          )}
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
           <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] space-y-6">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                 <TrendingUp size={22} />
              </div>
              <div>
                 <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Active Hotspots</h4>
                 <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest">Current priority regions</p>
              </div>
              <div className="space-y-4">
                 {['Nepal', 'Thailand', 'France', 'Vietnam'].map((c) => (
                   <div 
                    key={c}
                    onClick={() => {
                      setSearchQuery(c);
                      fetchScams(c);
                      setSelectedCountry(c);
                    }}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100/50 hover:border-emerald-300 cursor-pointer transition-all hover:-translate-y-1"
                   >
                     <span className="text-sm font-bold text-slate-700">{c}</span>
                     <div className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-black rounded-md uppercase tracking-widest">Hot</div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                 <AlertTriangle size={18} className="text-amber-500" />
                 <h4 className="text-xs font-black text-slate-950 uppercase tracking-[0.2em]">Safety Protocol</h4>
              </div>
              <div className="space-y-4">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-sm font-bold text-slate-900 uppercase">Verification Engine Active</p>
                 </div>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   Reports are cross-referenced with official travel advisories and verified community data.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
