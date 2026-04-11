import Image from "next/image";
import Link from "next/link";
import { Plane, Compass, Globe, ArrowRight, Shield, Clock, MapPin, Bell, Star, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FDF9] text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-teal-100/30 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] px-8 h-20 flex items-center justify-between transition-all hover:bg-white/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 ring-2 ring-white">
            <Compass size={22} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-950 uppercase">VoyageAI</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <a href="#features" className="text-[13px] font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">Features</a>
          <a href="#destinations" className="text-[13px] font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">Explore</a>
          <a href="#about" className="text-[13px] font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest">Safety</a>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/auth/login" 
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-bold text-sm hover:bg-emerald-700 transition-all shadow-[0_4px_20px_rgba(5,150,105,0.2)] hover:scale-105 active:scale-95"
          >
            Join the journey
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 overflow-hidden px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 backdrop-blur-md border border-emerald-200/50 text-emerald-700 text-[11px] font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in">
                <Sparkles size={14} /> Redefining Global Exploration
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-slate-950 leading-[0.95] mb-10 tracking-tight">
                Travel <span className="text-emerald-600 relative">Smarter<div className="absolute -bottom-2 left-0 w-full h-2 bg-emerald-100/50 -z-10 rounded-full" /></span>, Not Harder.
              </h1>
              
              <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl font-medium">
                Experience the first AI-driven travel consultant that merges institutional safety data with personalized wanderlust.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <Link 
                  href="/chatbot" 
                  className="w-full sm:w-auto px-10 py-5 bg-slate-950 text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 group relative overflow-hidden"
                >
                  <span className="relative z-10">Start Your Adventure</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                
                <div className="px-6 py-3 border border-slate-200 rounded-full flex items-center gap-4 bg-white/40 backdrop-blur-md">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[12px] font-bold text-slate-600 flex items-center gap-1.5">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    4.9/5 from 2k+ explorers
                  </div>
                </div>
              </div>
            </div>

            <div className="relative group">
              {/* Glass Card Stack */}
              <div className="relative aspect-[4/5] perspective-1000">
                {/* Decorative blob behind */}
                <div className="absolute -inset-10 bg-emerald-200/20 blur-[100px] rounded-full animate-pulse group-hover:bg-emerald-300/30 transition-colors duration-1000" />
                
                {/* Main Glass Illustration Container */}
                <div className="relative w-full h-full bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3.5rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:bg-white/60">
                  <div className="h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 relative group-hover:scale-[1.02] transition-transform duration-700">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                       <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center border border-white/40 mb-8 rotate-3 group-hover:rotate-6 transition-transform duration-700 shadow-xl shadow-emerald-900/5">
                          <Plane size={56} className="text-emerald-800" strokeWidth={1.5} />
                       </div>
                       <h3 className="text-3xl font-black text-emerald-950 mb-4 px-4 leading-tight">Your Passport to the Future</h3>
                       <p className="text-sm font-bold text-emerald-800/60 uppercase tracking-widest px-8">Real-time Global Sync</p>
                    </div>
                  </div>

                  {/* Floating Glass UI Elements */}
                  <div className="absolute top-12 -right-6 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-white border-b-emerald-100 animate-bounce duration-[4000ms] group-hover:scale-110 transition-transform">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                           <Bell size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter opacity-50">Intelligence Alert</p>
                          <p className="text-[13px] font-bold text-slate-800">Japan Visa Update</p>
                        </div>
                     </div>
                  </div>

                  <div className="absolute bottom-12 -left-6 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-white border-t-teal-100 group-hover:translate-x-4 transition-transform duration-1000">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner">
                           <Globe size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-teal-800 uppercase tracking-tighter opacity-50">Local Status</p>
                          <p className="text-[13px] font-bold text-slate-800">Safety Index: High</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#059669 0.5px, transparent 0.5px)', backgroundSize: '24px 24px'}} />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <h2 className="text-5xl font-black text-slate-950 mb-8 tracking-tighter leading-tight">Master your travel <span className="text-emerald-600 italic">experience</span>.</h2>
              <p className="text-slate-500 text-lg font-medium underline decoration-emerald-100 underline-offset-8">Precision data meets personal wanderlust.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: <Shield className="text-emerald-600" size={32} strokeWidth={2.5} />,
                  title: "Border Intelligence",
                  desc: "Instant insights on visa changes, local regulations, and political stability reports.",
                  color: "bg-emerald-50"
                },
                {
                  icon: <Clock className="text-teal-600" size={32} strokeWidth={2.5} />,
                  title: "Algorithmic Itineraries",
                  desc: "Schedules that adapt to weather patterns and crowd metrics in real-time.",
                  color: "bg-teal-50"
                },
                {
                  icon: <MapPin className="text-amber-600" size={32} strokeWidth={2.5} />,
                  title: "Curated Safety",
                  desc: "Verified local safe zones and immediate SOS guidance for over 190 countries.",
                  color: "bg-amber-50"
                }
              ].map((f, i) => (
                <div key={i} className="group p-12 rounded-[3.5rem] bg-white border border-slate-100 hover:shadow-[0_24px_64px_rgba(0,0,0,0.06)] hover:border-emerald-100/50 transition-all duration-500">
                   <div className={`w-20 h-20 ${f.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner`}>
                     {f.icon}
                   </div>
                   <h3 className="text-2xl font-black text-slate-950 mb-6 tracking-tight">{f.title}</h3>
                   <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-24 relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white ring-4 ring-slate-900 shadow-xl shadow-emerald-900/20">
                  <Compass size={28} strokeWidth={2.5} />
                </div>
                <span className="font-black text-3xl tracking-tighter uppercase">VoyageAI</span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                Merging global security intelligence with personalized exploration. Navigate with total confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
              <div>
                <h4 className="font-black mb-8 text-emerald-500 uppercase tracking-widest text-xs">Intelligence</h4>
                <ul className="space-y-5 text-slate-400 text-sm font-bold">
                  <li><a href="#" className="hover:text-white hover:translate-x-2 inline-block transition-all">Safety Index</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-2 inline-block transition-all">Visa Matrix</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-2 inline-block transition-all">Crisis Map</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black mb-8 text-emerald-500 uppercase tracking-widest text-xs">Company</h4>
                <ul className="space-y-5 text-slate-400 text-sm font-bold">
                  <li><a href="#" className="hover:text-white hover:translate-x-2 inline-block transition-all">Mission</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-2 inline-block transition-all">Privacy Vault</a></li>
                  <li><a href="#" className="hover:text-white hover:translate-x-2 inline-block transition-all">Contact</a></li>
                </ul>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <h4 className="font-black mb-8 text-emerald-500 uppercase tracking-widest text-xs">Stay Synced</h4>
                <div className="flex gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 backdrop-blur-md">
                  <input type="email" placeholder="Email" className="bg-transparent px-4 py-2 text-sm w-full focus:outline-none focus:placeholder-emerald-500/50" />
                  <button className="w-12 h-12 bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/40"><ArrowRight size={20} /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-8 text-slate-500 text-[11px] font-black uppercase tracking-widest">
            <p>© 2024 VOYAGEAI CORE SYSTEMS. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Safety Protocol</a>
              <a href="#" className="hover:text-white transition-colors">System Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
