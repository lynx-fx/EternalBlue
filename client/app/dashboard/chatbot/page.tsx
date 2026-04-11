"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Send, 
  Paperclip, 
  Compass, 
  User, 
  Sparkles,
  Plane,
  Info,
  Palmtree,
  Globe,
  Loader2,
  ArrowRight,
  Shield,
  MapPin
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
}

export default function DashboardChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your VoyageAI Travel Assistant. How can I help you plan your next adventure today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Format history for Gemini API
    const history = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    try {
      const data = await fetchApi('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: currentInput,
          history: history 
        }),
      });

      const aiMsg: Message = {
        id: Date.now().toString(),
        text: data.text,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      toast.error(error.message || 'AI failed to respond');
      const errorMsg: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, I'm having trouble connecting to my global travel database. Please try again in a moment.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-white/30 backdrop-blur-sm">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-100/20 rounded-full blur-[100px]" />
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <div className={`flex gap-5 max-w-[90%] ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                    m.sender === "user" ? "bg-slate-900 text-white" : "bg-emerald-600 text-white"
                  }`}>
                    {m.sender === "user" ? <User size={22} strokeWidth={2.5} /> : <Sparkles size={22} strokeWidth={2.5} />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className={`relative p-6 rounded-[2rem] shadow-xl border ${
                      m.sender === "user" 
                        ? "bg-slate-900 text-white rounded-tr-none border-white/10 shadow-slate-200/50" 
                        : "bg-white/80 backdrop-blur-md text-slate-700 rounded-tl-none border-emerald-50 shadow-emerald-200/20"
                    }`}>
                      <div className="prose prose-sm max-w-none prose-emerald dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.text}
                        </ReactMarkdown>
                      </div>
                      
                      {/* Sub-actions for AI messages */}
                      {m.sender === "ai" && m.id !== "1" && (
                        <div className="mt-4 pt-4 border-t border-emerald-50 flex gap-3">
                           <button className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-3 py-1.5 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors">Apply to Itinerary</button>
                           <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 hover:text-slate-600 transition-colors">Copy Info</button>
                        </div>
                      )}
                    </div>
                    <span className={`text-[11px] font-bold text-slate-400 block px-2 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-5">
                  <div className="w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center bg-emerald-600 text-white shadow-lg shadow-emerald-200 animate-pulse">
                    <Sparkles size={22} className="animate-spin-slow" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] rounded-tl-none border border-emerald-50 shadow-xl shadow-emerald-200/20 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-8 bg-gradient-to-t from-white via-white/80 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-emerald-500 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-10 transition-opacity duration-1000"></div>
              <div className="relative flex items-center gap-4 bg-white border border-emerald-100 p-3 rounded-[2.5rem] shadow-2xl shadow-emerald-200/40 focus-within:border-emerald-500/50 transition-all duration-500">
                <button className="p-4 text-slate-400 hover:text-emerald-600 transition-all hover:bg-emerald-50 rounded-full">
                  <Paperclip size={24} />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Where is your next destination?" 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-700 placeholder:text-slate-300"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-400/40"
                >
                  {isTyping ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-6">
              Powered by VoyageAI Core • Verified Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Side Panel (Context) */}
      <aside className="hidden xl:flex w-[380px] border-l border-emerald-100/50 flex-col bg-white overflow-y-auto custom-scrollbar">
        <div className="p-10 space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Compass size={20} className="text-emerald-600" />
              </div>
              <h3 className="font-display font-bold text-slate-900 uppercase tracking-widest text-sm">Quick Actions</h3>
            </div>
            
            <div className="grid gap-3">
              <button className="flex items-center justify-between p-4 bg-white border border-emerald-100 rounded-2xl hover:shadow-md hover:border-emerald-200 transition-all text-left group">
                <div>
                  <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700">Find Destinations</p>
                  <p className="text-[10px] font-bold text-slate-400">Discover hidden gems</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-between p-4 bg-white border border-emerald-100 rounded-2xl hover:shadow-md hover:border-emerald-200 transition-all text-left group">
                <div>
                  <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700">Book Flights</p>
                  <p className="text-[10px] font-bold text-slate-400">Best rates guaranteed</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Shield size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-display font-bold text-slate-900 uppercase tracking-widest text-sm">Security Matrix</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Global Safety Index</span>
                  <span className="text-emerald-600 font-black text-xs">9.4/10</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div>
             <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <MapPin size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-display font-bold text-slate-900 uppercase tracking-widest text-sm">Discoveries</h3>
            </div>
            
            <div className="grid gap-4">
              {[
                { name: 'Kyoto, Japan', type: 'Cultural Hub', color: 'bg-emerald-500' },
                { name: 'Zermatt, Swiss', type: 'Adventure', color: 'bg-blue-500' }
              ].map((dest, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="bg-white border border-slate-100 rounded-3xl p-5 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-200/20 transition-all duration-500 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-slate-900 mb-0.5">{dest.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dest.type}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${dest.color} animate-pulse`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Voyage Pass</p>
              <h4 className="text-xl font-black mb-6 leading-tight">Unlock Priority AI Insights</h4>
              <button className="w-full py-4 bg-emerald-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/40">
                Upgrade Now
              </button>
            </div>
            <Plane className="absolute -bottom-4 -right-4 text-emerald-900/30 rotate-12" size={120} />
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
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
        .prose ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .prose ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .prose p {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .prose strong {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
