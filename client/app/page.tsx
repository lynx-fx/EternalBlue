import Image from "next/image";
import Link from "next/link";
import { Plane, Compass, Globe, ArrowRight, Shield, Clock, MapPin, Bell } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6FBF5] text-slate-900 font-sans selection:bg-emerald-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Compass size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-emerald-950">VoyageAI</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
            <a href="#destinations" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Destinations</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Safety First</a>
          </div>
          <Link 
            href="/chatbot" 
            className="px-6 py-3 bg-emerald-600 text-white rounded-full font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
          >
            Start Chatting
          </Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10">
            <Globe className="w-[120%] h-[120%] text-emerald-600 animate-[spin_60s_linear_infinite]" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6">
                <Shield size={14} /> AI-Powered Travel Advisory
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-950 leading-tight mb-8">
                Your Personal <span className="text-emerald-600 italic">Global</span> Guide.
              </h1>
              <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-lg">
                Navigate the world with confidence. Real-time safety alerts, visa requirements, and personalized itineraries, all through our advanced AI assistant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/chatbot" 
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 group"
                >
                  Join the Voyage <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 px-6">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-slate-900">2.5k+ Travelers</p>
                    <p className="text-slate-500">Advisory active now</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-200/30 blur-3xl animate-pulse -z-10"></div>
              <div className="bg-white p-6 rounded-[3rem] shadow-2xl shadow-emerald-200 relative overflow-hidden group">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-emerald-50 relative">
                  {/* Mock Image using a gradient/illustration style */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 flex flex-col items-center justify-center p-12 text-center">
                     <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 mb-6 group-hover:scale-110 transition-transform duration-700">
                        <Plane size={48} className="text-emerald-800" />
                     </div>
                     <h3 className="text-2xl font-bold text-emerald-950 mb-2">Explore the Unseen</h3>
                     <p className="text-sm text-emerald-800/70">From the peaks of Patagonia to the temples of Kyoto.</p>
                  </div>
                </div>
                {/* Floating Card */}
                <div className="absolute top-12 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-emerald-50 animate-bounce duration-[3000ms]">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                         <Bell size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Alert</p>
                        <p className="text-xs font-bold text-slate-800">New Visa Policy: Japan</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold text-slate-950 mb-6 tracking-tight">Everything you need for the <span className="text-emerald-600 italic">perfect</span> trip.</h2>
              <p className="text-slate-500 text-lg">We combine global data sources with sophisticated AI to keep you informed and safe, 24/7.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="text-emerald-600" size={32} />,
                  title: "Real-time Safety",
                  desc: "Get instant alerts on weather, political stability, and local health guidelines."
                },
                {
                  icon: <Clock className="text-blue-600" size={32} />,
                  title: "Smart Itineraries",
                  desc: "Our AI constructs optimized travel plans based on your interests and current conditions."
                },
                {
                  icon: <MapPin className="text-orange-600" size={32} />,
                  title: "Hidden Gems",
                  desc: "Discover off-the-beaten-path locations recommended by our vast destination engine."
                }
              ].map((f, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all group">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                     {f.icon}
                   </div>
                   <h3 className="text-xl font-bold text-slate-950 mb-4">{f.title}</h3>
                   <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                  <Compass size={24} />
                </div>
                <span className="font-bold text-2xl tracking-tight">VoyageAI</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-8">
                Empowering travelers with smart, safe, and sustainable travel information powered by world-class AI.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold mb-6 text-emerald-500">Product</h4>
                <ul className="space-y-4 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Safety Index</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Visa Checker</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Trip Planner</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-emerald-500">Company</h4>
                <ul className="space-y-4 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-bold mb-6 text-emerald-500">Newsletter</h4>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email" className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-emerald-500" />
                  <button className="p-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all"><ArrowRight size={18} /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between gap-6 text-slate-500 text-xs">
            <p>© 2024 VoyageAI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
