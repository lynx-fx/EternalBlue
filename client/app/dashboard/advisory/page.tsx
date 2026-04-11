'use client';

import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Wind, 
  CloudRain, 
  Heart, 
  Wallet,
  MapPin,
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const ADVISORIES = [
  {
    category: "High Altitude Intelligence",
    icon: Wind,
    color: "text-blue-600",
    bg: "bg-blue-50",
    updates: [
      { id: 1, title: "AMS Protocol", status: "Critical", description: "Altitude sickness (AMS) risk is currently high for Everest & Annapurna circuits. Acclimatization days are mandatory." },
      { id: 2, title: "Weather Window", status: "Advisory", description: "Unpredictable wind shifts detected near Namche Bazaar. Trekking after 3PM is highly discouraged." }
    ]
  },
  {
    category: "Bureaucratic Protocol",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    updates: [
      { id: 3, title: "TIMS Card Requirement", status: "Alert", description: "New TIMS regulations in effect. Solo trekking without a certified guide is now restricted in most protected regions." },
      { id: 4, title: "Permit Processing", status: "Operational", description: "Upper Mustang permits are being processed at normal speeds (24-48 hours window)." }
    ]
  },
  {
    category: "Financial Security",
    icon: Wallet,
    color: "text-amber-600",
    bg: "bg-amber-50",
    updates: [
      { id: 5, title: "ATM Reliability", status: "Advisory", description: "Frequent power outages in Lukla & Namche affecting ATM availability. Carry sufficient NPR cash for higher altitude sectors." },
      { id: 6, title: "Conversion Rates", status: "Market", description: "Volatility detected in exchange rates for USD to NPR at local Kathmandu counters." }
    ]
  }
];

export default function AdvisoryPage() {
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

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {ADVISORIES.map((section, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={section.category}
            className="group"
          >
            <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-xl hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${section.bg} ${section.color} rounded-[1.5rem] flex items-center justify-center shadow-inner`}>
                  <section.icon size={28} strokeWidth={2.5} />
                </div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">{section.category}</h2>
              </div>

              <div className="space-y-6">
                {section.updates.map((update) => (
                  <div key={update.id} className="space-y-2 group/item cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] border ${
                        update.status === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                        update.status === 'Alert' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {update.status}
                      </span>
                      <ChevronRight size={14} className="text-slate-300 group-hover/item:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-sm font-black text-slate-800">{update.title}</h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                      {update.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cultural Protocols Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative bg-slate-950 rounded-[3.5rem] p-10 md:p-16 overflow-hidden text-white shadow-2xl shadow-slate-900/20"
      >
        <div className="relative z-10 max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Heart size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Cultural Etiquette</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">Respecting the <span className="text-emerald-500">Divine Terrain</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <span className="font-black text-xs">01</span>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest mb-2">Sacred Direction</h4>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed italic">Always pass Mani stones (prayer walls) and Stupas in a clockwise direction. Never disturb these markers.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0">
                   <span className="font-black text-xs">02</span>
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest mb-2">Permission to Capture</h4>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed italic">Ask for authorization before photographing people or sacred interiors of monasteries. Many rituals are private.</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-emerald-600 rounded-[2.5rem] flex flex-col justify-between">
              <p className="text-lg font-medium italic leading-relaxed">
                "Take only pictures, leave only footprints, kill only time."
              </p>
              <div className="flex items-center gap-4 mt-8">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">Voyage Guardian</p>
                  <p className="text-[10px] font-bold text-emerald-200 uppercase">Himalayas Verified</p>
                </div>
              </div>
            </div>
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
    </div>
  );
}
