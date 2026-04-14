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
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
  const [selectedScam, setSelectedScam] = useState<Scam | null>(null);

  const fetchScams = async (country?: string) => {
    setLoading(true);
    try {
      const endpoint = country 
        ? `/scams/country/${country}` 
        : '/scams';
      const response = await fetchApi(endpoint);
      if (response.$ok) {
        setScams(response.data.scams || []);
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


  const [severityFilter, setSeverityFilter] = useState<string>('All');

  const filteredScams = scams.filter(s => {
    if (severityFilter === 'All') return true;
    return s.severity === severityFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-10 animate-fade-in pb-20 px-4 sm:px-6 md:px-0">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-slate-950 p-8 md:p-12 text-white shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-primary-600/10 blur-[120px] -z-0" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -z-0" />
        
        <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-[10px] md:text-xs font-black uppercase tracking-widest">
              <Globe size={14} />
              Global Security Matrix
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85]">
              Scam <br />
              <span className="text-primary-500 italic">Registry</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-xl font-medium leading-relaxed opacity-80">
              Synchronized intelligence on travel risks and safety protocols. Verified by AI across 195 nations.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] w-full lg:w-[400px] shadow-inner">
             <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search region (e.g. Nepal)" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-11 md:pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50 transition-all font-bold text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-xl shadow-primary-900/40 uppercase tracking-widest text-xs md:text-sm active:scale-95"
                >
                  Query Intelligence
                </button>
             </form>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto custom-scrollbar no-scrollbar">
           {['All', 'High', 'Medium', 'Low'].map((level) => (
             <button 
              key={level}
              onClick={() => setSeverityFilter(level)}
              className={`px-5 py-2 md:px-6 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                severityFilter === level 
                ? 'bg-slate-950 text-white border-slate-950 shadow-xl shadow-slate-900/20 scale-105' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-primary-200'
              }`}
             >
                {level}
             </button>
           ))}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedCountry && (
            <button 
              onClick={clearSearch}
              className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
            >
              Clear
            </button>
          )}
          <button className="flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-primary-100 transition-all">
             Report interaction
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 md:gap-12">
        <div className="space-y-6 md:space-y-8">
          <div className="px-2">
            <h2 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tighter">
              {selectedCountry ? `Results: ${selectedCountry}` : 'Operational Risk Feed'}
            </h2>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">
              Synchronized with verified local ground reports
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[1, 2, 4, 5].map((i) => (
                <div key={i} className="h-48 md:h-64 bg-slate-100 rounded-[2rem] md:rounded-[2.5rem] animate-pulse" />
              ))}
            </div>
          ) : filteredScams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {filteredScams.map((scam) => (
                <div 
                  key={scam._id}
                  onClick={() => setSelectedScam(scam)}
                  className="group bg-white border border-slate-100 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] hover:shadow-2xl hover:shadow-primary-900/5 transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${getSeverityStyles(scam.severity)}`}>
                        {scam.severity} Risk
                      </div>
                      <div className="text-slate-300 group-hover:text-primary-500 transition-colors">
                        <MapPin size={20} />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                        {scam.title}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Region: {scam.country}
                      </p>
                    </div>

                    <p className="text-slate-600 text-[13px] md:text-sm font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
                      {scam.description}
                    </p>
                  </div>

                  <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <History size={14} className="text-slate-300" />
                       <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         {new Date(scam.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                       <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-20 flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <ShieldAlert size={40} />
               </div>
               <div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter">No intelligence found</h3>
                  <p className="text-slate-500 text-[13px] md:text-sm font-medium max-w-sm mt-2">
                    Our sensors haven't picked up any specific alerts for this query yet. Try a different region.
                  </p>
               </div>
               <button 
                 onClick={clearSearch}
                 className="px-8 py-3 bg-slate-950 text-white font-bold rounded-xl md:rounded-2xl text-[10px] md:text-xs uppercase tracking-widest hover:bg-primary-600 transition-all font-black"
               >
                 Reset Search
               </button>
            </div>
          )}
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6 md:space-y-8">
           <div className="bg-primary-50 border border-primary-100 p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-6">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                 <TrendingUp size={22} />
              </div>
              <div>
                 <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Active Hotspots</h4>
                 <p className="text-primary-700 text-[10px] font-bold uppercase tracking-widest">Current priority regions</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
                 {['Nepal', 'Thailand', 'France', 'Vietnam'].map((c) => (
                   <div 
                    key={c}
                    onClick={() => {
                      setSearchQuery(c);
                      fetchScams(c);
                      setSelectedCountry(c);
                    }}
                    className="flex items-center justify-between p-3.5 md:p-4 bg-white rounded-xl md:rounded-2xl border border-primary-100/50 hover:border-primary-300 cursor-pointer transition-all hover:-translate-y-1"
                   >
                     <span className="text-xs md:text-sm font-bold text-slate-700">{c}</span>
                     <div className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] md:text-[9px] font-black rounded-md uppercase tracking-widest">Hot</div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white border border-slate-100 p-8 rounded-[2rem] md:rounded-[2.5rem] space-y-4 md:space-y-6 shadow-sm">
              <div className="flex items-center gap-3">
                 <AlertTriangle size={18} className="text-amber-500" />
                 <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">Safety Protocol</h4>
              </div>
              <div className="space-y-3 md:space-y-4">
                 <div className="p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xs md:text-sm font-bold text-slate-900 uppercase">Engine Active</p>
                 </div>
                 <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                   Reports are cross-referenced with official travel advisories.
                 </p>
              </div>
           </div>
        </div>
      </div>


      <AnimatePresence>
        {selectedScam && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedScam(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="relative w-full max-w-2xl bg-white rounded-t-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => setSelectedScam(null)}
                className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-400 hover:text-slate-600 transition-colors z-20"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-16 space-y-6 md:space-y-8">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-4">
                    <div className={`inline-flex px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border ${getSeverityStyles(selectedScam.severity)}`}>
                      {selectedScam.severity} Risk Personnel
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight md:leading-none">
                      {selectedScam.title}
                    </h2>
                    <div className="flex items-center gap-2 text-primary-600">
                       <MapPin size={16} />
                       <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Region: {selectedScam.country}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-2">Intelligence Brief</p>
                   <p className="text-slate-600 text-[14px] md:text-base font-medium leading-relaxed italic">
                     {selectedScam.description}
                   </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 md:pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400">
                      <History size={20} />
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Observation Logged</p>
                      <p className="text-xs md:text-sm font-black text-slate-900">{new Date(selectedScam.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-primary-50 rounded-xl md:rounded-2xl border border-primary-100">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                    <span className="text-[9px] md:text-[10px] font-black text-primary-950 uppercase tracking-widest">Verified Entry</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedScam(null)}
                  className="w-full py-4 md:py-5 bg-slate-950 text-white rounded-xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-slate-900/10"
                >
                  Close Intelligence Brief
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
