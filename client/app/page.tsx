import Image from "next/image";
import Link from "next/link";
import { Search, Send, User, ChevronRight, Star, Plane, Train, Bus, Car, ArrowUpRight } from "lucide-react";
import RecommendationsSection from "@/components/landing/RecommendationsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] text-slate-900 font-sans pb-10 selection:bg-[#1C3E43] selection:text-white">
      {/* Fixed Navigation */}
      <div className="fixed top-0 inset-x-0 z-50 bg-[#F7F7F7]/80 backdrop-blur-md">
        <nav className="flex items-center justify-between px-6 py-4 md:px-10 max-w-[1400px] mx-auto">
          <div className="font-semibold text-2xl tracking-tighter text-[#1C3E43]">Voyage</div>
          
          <div className="hidden md:flex items-center gap-10 bg-white px-8 py-3.5 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-sm font-medium border border-slate-100/50">
            <Link href="#" className="text-slate-900">Discover</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Group Chats</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">AI Itineraries</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Alerts</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 transition-colors">
              Log In
            </Link>
            <Link href="/auth/signup" className="bg-[#1C3E43] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#122b2e] transition-colors shadow-lg shadow-[#1C3E43]/20">
              Sign Up
            </Link>
          </div>
        </nav>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 pt-28 md:pt-32">
        {/* Hero Section */}
        <section className="mb-28">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-10">
            <h1 className="text-6xl md:text-[5.5rem] font-medium leading-[0.95] tracking-tight text-[#161616]">
              Sync Your <br /> Travel Squad
            </h1>
            <div className="max-w-[280px] flex flex-col items-start md:items-end text-left md:text-right gap-5">
              <p className="text-slate-600 text-[13px] leading-relaxed">
                Collaborate in real-time group chats and let our AI travel planner build your perfect group itinerary automatically.
              </p>
              <Link href="/auth/signup" className="flex items-center justify-center gap-2 bg-[#1C3E43] text-white px-7 py-3 rounded-[2rem] text-sm font-medium hover:bg-[#122b2e] transition-colors shadow-lg shadow-[#1C3E43]/20">
                Start Chatting <Send size={14} />
              </Link>
            </div>
          </div>

          {/* Banner & Search */}
          <div className="relative">
            <div className="w-full h-[500px] relative rounded-[2.5rem] overflow-hidden bg-slate-200">
              <Image 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
                alt="Mountains landscape" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-[10s]" 
                priority
              />
            </div>
            
            {/* Search Bar Container */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-3 flex items-center justify-between">
              <div className="flex items-center flex-1 divide-x divide-slate-100/80">
                <div className="px-8 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Location</p>
                  <p className="text-sm font-semibold text-slate-800">Annapurna Circuit, Nepal</p>
                </div>
                <div className="px-8 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Check In</p>
                  <p className="text-sm font-semibold text-slate-800">27. January 2025</p>
                </div>
                <div className="px-8 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Check Out</p>
                  <p className="text-sm font-semibold text-slate-800">30. January 2025</p>
                </div>
                <div className="px-8 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">People</p>
                  <p className="text-sm font-semibold text-slate-800">4 People, 1 Child</p>
                </div>
              </div>
              <button className="w-16 h-16 bg-[#1C3E43] rounded-full flex items-center justify-center text-white hover:bg-[#122b2e] transition-colors shrink-0 shadow-lg shadow-[#1C3E43]/30">
                <Search size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </section>

        {/* Dynamic Recommendations Section */}
        <RecommendationsSection />

        {/* Collaborative Group Travel Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-20 bg-white rounded-[3rem] p-6 lg:p-10 shadow-[0_4px_40px_rgba(0,0,0,0.03)] border border-slate-100/50">
          
          {/* Visual Side */}
          <div className="relative w-full min-h-[400px] lg:min-h-[500px] bg-slate-200 rounded-[2.5rem] overflow-hidden flex items-center justify-center group pointer-events-none">
             <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" fill alt="Friends traveling" className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-[10s]" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1C3E43]/95 via-[#1C3E43]/40 to-transparent mix-blend-multiply" />
             
             {/* Abstract Chat Bubbles */}
             <div className="relative z-10 w-full max-w-md flex flex-col gap-4 mt-32 px-6">
                <div className="self-end bg-white text-slate-800 text-[13px] font-semibold px-5 py-3 rounded-2xl rounded-tr-sm shadow-xl shadow-black/10 max-w-[85%]">
                   Where are we heading next? 🗺️
                </div>
                <div className="self-start bg-[#9ECEC2] text-[#132c2f] text-[13px] font-semibold px-5 py-3 rounded-2xl rounded-tl-sm shadow-xl shadow-black/10 flex items-center gap-3 max-w-[90%]">
                   <div className="w-7 h-7 rounded-full bg-white overflow-hidden flex shrink-0 items-center justify-center">
                     <Image src="https://i.pravatar.cc/100?img=4" width={28} height={28} alt="user avatar" className="object-cover" />
                   </div>
                   Group chat created! AI is generating an Osaka itinerary right now.
                </div>
             </div>
          </div>

          {/* Text/Copy Side */}
          <div className="flex flex-col justify-center px-4 py-8 lg:px-10">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C3E43]/5 border border-[#1C3E43]/10 text-[#1C3E43] text-[10px] font-bold uppercase tracking-widest mb-6 w-max">
                Community & Chat
             </div>
             
             <h2 className="text-4xl lg:text-[42px] font-medium tracking-tight mb-5 text-[#161616] leading-[1.1]">
               Link up with fellow travelers
             </h2>
             
             <p className="text-slate-500 leading-relaxed mb-10 text-[14px] max-w-md">
               Don't travel alone. Create persistent group chats, share AI-generated itineraries instantly, and meet up with people heading to identical coordinates natively.
             </p>
             
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <div className="w-11 h-11 rounded-2xl bg-[#1C3E43]/5 flex items-center justify-center shrink-0 text-[#1C3E43]">
                      <User size={20} strokeWidth={2}/>
                   </div>
                   <div>
                      <h4 className="font-semibold text-[#161616] text-[15px] mb-1">Find Companions</h4>
                      <p className="text-[12px] text-slate-500 leading-relaxed">Match with travelers heading to the same destinations across the world and start planning instantly.</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="w-11 h-11 rounded-2xl bg-[#1C3E43]/5 flex items-center justify-center shrink-0 text-[#1C3E43]">
                      <Send size={20} strokeWidth={2}/>
                   </div>
                   <div>
                      <h4 className="font-semibold text-[#161616] text-[15px] mb-1">Live Group Chats</h4>
                      <p className="text-[12px] text-slate-500 leading-relaxed">Discuss plans in specialized rooms. Sync up with intelligent AI bots to pull data flawlessly.</p>
                   </div>
                </div>
             </div>
             
             <div className="mt-10 pt-10 border-t border-slate-100 flex items-center">
                <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 bg-[#1C3E43] text-white px-8 py-3.5 rounded-full text-[13px] font-medium hover:bg-[#122b2e] transition-colors shadow-lg shadow-[#1C3E43]/20">
                  Find your squad <ArrowUpRight size={16} />
                </Link>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
