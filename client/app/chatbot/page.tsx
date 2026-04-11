"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Compass, 
  Map, 
  Bell, 
  Plane, 
  Globe, 
  Palmtree, 
  Info, 
  Menu,
  X,
  Search,
  Settings,
  User,
  ArrowRight
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your Travel Advisory Assistant. How can I help you plan your next adventure today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "That sounds like a great plan! I've checked the latest travel advisories for you. Is there anything specific about that destination you'd like to know?",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#F6FBF5] text-[#181D1A] overflow-hidden font-sans">
      {/* Left Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-white border-r border-[#E2E8F0] flex flex-col z-20 overflow-hidden relative shadow-sm`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Globe size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-900">VoyageAI</span>
        </div>

        <nav className="flex-1 px-4 mt-4">
          <ul className="space-y-2">
            <li>
              <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-emerald-50 text-emerald-700 font-medium transition-all">
                <Compass size={20} />
                <span>Destinations</span>
              </button>
            </li>
            <li>
              <button className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group">
                <Map size={20} className="group-hover:text-emerald-500" />
                <span>Trip Planner</span>
              </button>
            </li>
            <li>
              <button className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group">
                <Bell size={20} className="group-hover:text-emerald-500" />
                <span>Travel Alerts</span>
              </button>
            </li>
          </ul>

          <div className="mt-10">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-4">Saved Trips</h3>
            <ul className="space-y-2">
              <li>
                <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                  <span className="truncate">Bali Getaway 2024</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </button>
              </li>
              <li>
                <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                  <span className="truncate">Swiss Alps Trek</span>
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <div className="mt-4 p-4 bg-emerald-900 rounded-2xl text-white relative overflow-hidden group cursor-pointer shadow-xl shadow-emerald-200/50">
             <div className="relative z-10">
               <p className="text-sm font-medium opacity-80">Free Plan</p>
               <p className="text-lg font-bold">Upgrade to Pro</p>
               <div className="mt-2 text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                 Explore more <ArrowRight size={12} />
               </div>
             </div>
             <Plane className="absolute -bottom-2 -right-2 text-emerald-800 rotate-12 group-hover:scale-110 transition-transform" size={80} />
          </div>
        </div>
      </aside>

      {/* Toggle Button for Mobile */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 left-6 z-30 lg:hidden bg-emerald-600 text-white p-3 rounded-full shadow-2xl"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0] px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="lg:hidden text-slate-600 cursor-pointer" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Travel Assistant</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Active Now</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64 transition-all"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-200 transition-all border border-slate-200">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth custom-scrollbar"
        >
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}
            >
              <div className={`flex gap-4 max-w-[80%] ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-md ${
                  m.sender === "user" ? "bg-slate-900 text-white" : "bg-emerald-600 text-white"
                }`}>
                  {m.sender === "user" ? <User size={20} /> : <Compass size={20} />}
                </div>
                <div>
                  <div className={`p-4 rounded-3xl shadow-sm border ${
                    m.sender === "user" 
                      ? "bg-slate-900 text-white border-slate-800" 
                      : "bg-white text-slate-700 border-emerald-50"
                  }`}>
                    <p className="text-sm leading-relaxed">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 block px-1">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-focus-within:opacity-5 blur-xl transition-all duration-500 -z-10"></div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 focus-within:border-emerald-500/50 transition-all">
              <button className="p-3 text-slate-400 hover:text-emerald-600 transition-all hover:bg-emerald-50 rounded-full">
                <Paperclip size={20} />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Where would you like to go next?" 
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-not-allowed transition-all shadow-lg shadow-emerald-200"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4">
            VoyageAI can make mistakes. Check important info.
          </p>
        </div>
      </main>

      {/* Right Sidebar - Travel Tips */}
      <aside className="hidden xl:flex w-80 bg-white border-l border-[#E2E8F0] flex-col overflow-y-auto">
        <div className="p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Info className="text-emerald-600" size={20} />
            Travel Insights
          </h2>

          <div className="space-y-6">
            {/* Fact Card */}
            <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-100/50 group hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-500">
               <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4 transition-transform group-hover:scale-110">
                 <Palmtree size={20} />
               </div>
               <h3 className="font-bold text-emerald-900 mb-2">Sustainable Travel</h3>
               <p className="text-xs text-emerald-700 leading-relaxed">
                 Choose eco-friendly resorts in Bali to help preserve its unique ecosystem while enjoying luxury.
               </p>
            </div>

            {/* Tip Card */}
            <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100/50 group hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-500">
               <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 transition-transform group-hover:scale-110">
                 <Plane size={20} />
               </div>
               <h3 className="font-bold text-blue-900 mb-2">Packing Pro Tip</h3>
               <p className="text-xs text-blue-700 leading-relaxed">
                 Roll your clothes instead of folding. It saves space and reduces wrinkles!
               </p>
            </div>

            {/* Weather Widget Placeholder */}
            <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl text-white shadow-xl shadow-emerald-200/50">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <p className="text-xs opacity-80 uppercase tracking-widest font-semibold">Today in Tokyo</p>
                   <p className="text-2xl font-bold mt-1">24°C</p>
                 </div>
                 <Globe size={24} className="opacity-50" />
               </div>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs">
                   <span className="opacity-80">Humidity</span>
                   <span className="font-medium">65%</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="opacity-80">Wind Speed</span>
                   <span className="font-medium">12 km/h</span>
                 </div>
               </div>
            </div>

            {/* Call to Action */}
            <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden mt-10">
               <p className="text-sm font-bold text-slate-800 mb-2">Ready to book?</p>
               <p className="text-xs text-slate-500 mb-4 leading-relaxed">Let us handle the details while you enjoy the journey.</p>
               <button className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 text-xs font-bold shadow-sm hover:shadow-md hover:border-emerald-200 hover:text-emerald-700 transition-all">
                 Explore Packages
               </button>
            </div>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}
