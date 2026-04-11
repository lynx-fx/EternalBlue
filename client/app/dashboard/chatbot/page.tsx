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
  MapPin,
  History,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
  isStreaming?: boolean;
}

// Custom Typewriter component for AI responses
const AIResponse = ({ text, isNew }: { text: string; isNew?: boolean }) => {
  const [displayedText, setDisplayedText] = useState(isNew ? "" : text);
  
  useEffect(() => {
    if (isNew) {
      let index = 0;
      // Calculate step size to finish within ~2-3 seconds for long texts
      // Min step of 1, scale up for longer texts
      const step = Math.max(2, Math.ceil(text.length / 150));
      
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index));
        index += step;
        if (index > text.length) {
          setDisplayedText(text);
          clearInterval(interval);
        }
      }, 5);
      return () => clearInterval(interval);
    }
  }, [text, isNew]);

  return (
    <div className="prose prose-sm max-w-none prose-emerald dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {displayedText}
      </ReactMarkdown>
    </div>
  );
};

export default function DashboardChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetchApi('/ai/history');
      if (response.$ok && response.data.sessions) {
        setSessions(response.data.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  const loadSession = async (chatId: string) => {
    try {
      setIsTyping(true);
      const response = await fetchApi(`/ai/history?chatId=${chatId}`);
      if (response.$ok) {
        const formattedMessages: Message[] = response.data.messages.map((m: any, idx: number) => ({
          id: idx.toString(),
          text: m.text,
          sender: m.role === 'user' ? 'user' : 'ai',
          timestamp: new Date(m.createdAt || Date.now())
        }));
        setMessages(formattedMessages);
        setCurrentChatId(chatId);
      }
    } catch (err) {
      toast.error("Failed to restore mission log");
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (overrideMsg?: string) => {
    const finalInput = overrideMsg || input;
    if (!finalInput.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: finalInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = finalInput;
    setInput("");
    setIsTyping(true);

    const history = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    try {
      const response = await fetchApi('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          prompt: currentInput,
          history: history,
          chatId: currentChatId
        }),
      });
      
      if (!response.$ok) throw new Error(response.message || "AI failed to respond");

      if (!currentChatId && response.data.chatId) {
        setCurrentChatId(response.data.chatId);
        fetchSessions(); // Refresh sidebar to show the new session
      }

      const aiMsg: Message = {
        id: Date.now().toString(),
        text: response.data.text,
        sender: "ai",
        timestamp: new Date(),
        isStreaming: true // Mark as new for animation
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
      <div className="flex-1 flex flex-col relative min-w-0">
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-100/20 rounded-full blur-[100px]" />
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div 
                  key={m.id} 
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
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
                          : "bg-white/80 backdrop-blur-md text-slate-700 rounded-tl-none border-emerald-50 shadow-emerald-200/10"
                      }`}>
                        {m.sender === "ai" ? (
                          <AIResponse text={m.text} isNew={m.isStreaming} />
                        ) : (
                          <div className="prose prose-sm max-w-none prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {m.text}
                            </ReactMarkdown>
                          </div>
                        )}
                        
                        {m.sender === "ai" && m.id !== "1" && !m.isStreaming && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t border-emerald-50 flex gap-3"
                          >
                             <button className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-3 py-1.5 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors">Apply to Itinerary</button>
                             <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 hover:text-slate-600 transition-colors">Copy Info</button>
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-[11px] font-bold text-slate-400 block px-2 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-5">
                  <div className="w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center bg-emerald-600 text-white shadow-lg shadow-emerald-200 animate-pulse">
                    <Sparkles size={22} className="animate-spin-slow" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] rounded-tl-none border border-emerald-50 shadow-xl shadow-emerald-200/10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-8 bg-gradient-to-t from-white via-white/80 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="relative flex items-center gap-4 bg-white border border-slate-100 p-3 rounded-[2.5rem] shadow-2xl shadow-slate-200/20 transition-all duration-500">
                <button className="p-4 text-slate-400 hover:text-emerald-600 transition-all hover:bg-emerald-50 rounded-full">
                  <Paperclip size={24} />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Where is your next destination?" 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-700 placeholder:text-slate-300 outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-emerald-600 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-all"
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

      <aside className="hidden xl:flex w-[380px] border-l border-emerald-100/50 flex-col bg-white overflow-y-auto custom-scrollbar">
        <div className="p-10 space-y-10">
          {/* Mission Log / History */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <History size={20} strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-bold text-slate-900 uppercase tracking-widest text-sm">Mission Log</h3>
              </div>
              <button 
                onClick={startNewChat}
                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors active:scale-95"
                title="New Expedition"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
            
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">No active logs detected</p>
              ) : (
                sessions.slice(0, 5).map((session, i) => (
                  <button 
                    key={i} 
                    onClick={() => loadSession(session._id)}
                    className={`w-full p-4 border rounded-2xl text-left transition-all ${
                      currentChatId === session._id 
                        ? 'bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-200/50' 
                        : 'bg-slate-50 border-slate-100 hover:border-emerald-200'
                    }`}
                  >
                    <p className={`text-[10px] font-black truncate mb-1 uppercase tracking-tight ${
                      currentChatId === session._id ? 'text-white' : 'text-slate-900'
                    }`}>
                      {session.title || "Untitled Expedition"}
                    </p>
                    <div className="flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${
                         currentChatId === session._id ? 'bg-white' : 'bg-emerald-500'
                       }`} />
                       <span className={`text-[9px] font-bold uppercase tracking-widest ${
                         currentChatId === session._id ? 'text-emerald-100' : 'text-slate-400'
                       }`}>
                         {new Date(session.updatedAt).toLocaleDateString()}
                       </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Compass size={20} className="text-emerald-600" />
              </div>
              <h3 className="font-display font-bold text-slate-900 uppercase tracking-widest text-sm">Quick Actions</h3>
            </div>
            
            <div className="grid gap-3">
              <button 
                onClick={() => handleSend("I'm looking for some hidden gems for my next trip. Can you suggest some destinations that are off the beaten path but still safe?")}
                className="flex items-center justify-between p-4 bg-white border border-emerald-100 rounded-2xl hover:shadow-md hover:border-emerald-200 transition-all text-left group active:scale-95"
              >
                <div>
                  <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700">Find Destinations</p>
                  <p className="text-[10px] font-bold text-slate-400">Discover hidden gems</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => handleSend("I need advice on finding the best flight deals. What are some tactical tips for booking affordable international flights without compromising on safety?")}
                className="flex items-center justify-between p-4 bg-white border border-emerald-100 rounded-2xl hover:shadow-md hover:border-emerald-200 transition-all text-left group active:scale-95"
              >
                <div>
                  <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700">Travel Protocol</p>
                  <p className="text-[10px] font-bold text-slate-400">Best rates & safety tips</p>
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
                { name: 'Kathmandu, NP', type: 'Heritage Hub', color: 'bg-emerald-500' },
                { name: 'Pokhara, NP', type: 'Adventure Base', color: 'bg-blue-500' }
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
