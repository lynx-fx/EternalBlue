import Image from "next/image";
import Link from "next/link";
import { Search, Send, User, ChevronRight, Star, Plane, Train, Bus, Car, ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] text-slate-900 font-sans pb-10 selection:bg-[#1C3E43] selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="font-semibold text-2xl tracking-tighter text-[#1C3E43]">VoyageAI</div>
        
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

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 mt-8 md:mt-12">
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
                  <p className="text-sm font-semibold text-slate-800">Rinjani, Indonesia</p>
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

        {/* Packages Section */}
        <section className="mb-24 pt-6">
          <div className="flex justify-between items-end gap-8 mb-12">
            <h2 className="text-[2.5rem] font-medium leading-[1.05] tracking-tight max-w-[400px] text-[#161616]">
              Explore Our Exclusive Tour Packages
            </h2>
            <p className="text-slate-500 text-[13px] max-w-[280px] text-right leading-relaxed pb-1">
              Find your perfect getaway with our curated tour packages. Adventure, relaxation or culture—it's all here for you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-[2rem] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col group cursor-pointer hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300">
              <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-5">
                <Image src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2070&auto=format&fit=crop" alt="Jaya Wijaya Mountain" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                   <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> Indonesia
                </div>
              </div>
              <div className="px-2 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-slate-800 text-[17px]">Jaya Wijaya Mountain</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> 5.0
                  </div>
                </div>
                <p className="text-slate-900 font-bold text-[15px] mb-5">$456.80</p>
                
                <div className="flex justify-between items-end">
                   <div className="space-y-1.5">
                     <p className="text-[9px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wide"><ChevronRight size={10} className="text-slate-300"/> Including Accommodation</p>
                     <p className="text-[9px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wide"><ChevronRight size={10} className="text-slate-300"/> Free Professional Guide Tour</p>
                     <p className="text-[9px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wide"><ChevronRight size={10} className="text-slate-300"/> 3 Days 2 Nights Trip</p>
                   </div>
                   <button className="bg-[#1C3E43] text-white text-[11px] px-5 py-2.5 rounded-full font-medium hover:bg-[#122b2e] transition-colors border border-[#1C3E43]">
                     Booking
                   </button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[2rem] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col group cursor-pointer hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300">
              <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-5">
                <Image src="https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=2070&auto=format&fit=crop" alt="Fuji Mountain" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                   <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> Japan
                </div>
              </div>
              <div className="px-2 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-slate-800 text-[17px]">Fuji Mountain</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> 4.8
                  </div>
                </div>
                <p className="text-slate-900 font-bold text-[15px] mb-5">$456.80</p>
                
                <div className="flex justify-between items-end">
                   <div className="space-y-1.5">
                     <p className="text-[9px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wide"><ChevronRight size={10} className="text-slate-300"/> Bullet Train Included</p>
                     <p className="text-[9px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wide"><ChevronRight size={10} className="text-slate-300"/> Tour Guide Available</p>
                     <p className="text-[9px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wide"><ChevronRight size={10} className="text-slate-300"/> 2 Days 1 Night Trip</p>
                   </div>
                   <button className="bg-transparent text-[#1C3E43] text-[11px] px-5 py-2.5 rounded-full font-bold transition-colors border border-[#1C3E43]/20 hover:bg-[#1C3E43] hover:text-white">
                     Booking
                   </button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[2rem] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100/50 flex flex-col group cursor-pointer hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300">
              <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-5">
                <Image src="https://images.unsplash.com/photo-1524866299105-08103df12ba6?q=80&w=2066&auto=format&fit=crop" alt="Kilimanjaro" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                   <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> Africa
                </div>
              </div>
              <div className="px-2 pb-2">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-slate-800 text-[17px]">Kilimanjaro</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Star size={12} className="fill-amber-400 text-amber-400" /> 5.0
                  </div>
                </div>
                <p className="text-slate-900 font-bold text-[15px] mb-5">$456.80</p>
                <div className="flex justify-between items-end">
                   <div className="space-y-1.5">
                     <p className="text-[9px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wide"><ChevronRight size={10} className="text-slate-300"/> Full Gear Provided</p>
                     <p className="text-[9px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wide"><ChevronRight size={10} className="text-slate-300"/> Base Camp Setup</p>
                     <p className="text-[9px] text-slate-500 flex items-center gap-1.5 font-medium uppercase tracking-wide"><ChevronRight size={10} className="text-slate-300"/> 7 Days Hike</p>
                   </div>
                   <button className="bg-transparent text-[#1C3E43] text-[11px] px-5 py-2.5 rounded-full font-bold transition-colors border border-[#1C3E43]/20 hover:bg-[#1C3E43] hover:text-white">
                     Booking
                   </button>
                </div>
              </div>
            </div>

            {/* Guide Profile Cards (Right Stack) */}
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
                   {/* Background map graphic abstract */}
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
