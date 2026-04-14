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
  History,
  Plus,
  X,
  MapPin
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
    <div className="prose prose-sm max-w-none prose-primary dark:prose-invert">
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
  const [discoveries, setDiscoveries] = useState<{ id: string, name: string, time: string, fullText: string }[]>([]);
  const [selectedDiscovery, setSelectedDiscovery] = useState<{ id: string, name: string, time: string, fullText: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addToItinerary = (text: string) => {
    // Extract a name (first few words)
    const name = text.split('\n')[0].replace(/[#*]/g, '').trim().substring(0, 20) || "Dossier Entry";
    const newEntry = {
      id: Date.now().toString(),
      name: name,
      time: "Just now",
      fullText: text
    };
    setDiscoveries(prev => [newEntry, ...prev]);
    toast.success(`${name} added to your itinerary`);
  };

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
    setMessages([
      {
        id: "intro",
        text: "Hello! I'm your Voyage Travel Assistant. I'm specially trained on Himalayan logistics and Nepal-specific travel intelligence. How can I help you plan your next secure expedition today?",
        sender: "ai",
        timestamp: new Date(),
      }
    ]);
    setCurrentChatId(null);
  };

  useEffect(() => {
    if (messages.length === 0 && !currentChatId) {
      startNewChat();
    }
  }, [messages, currentChatId]);

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

    const history = messages
      .filter((msg, index) => !(index === 0 && msg.sender === 'ai'))
      .map(msg => ({
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
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-100/20 rounded-full blur-[120px]" />
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
                      m.sender === "user" ? "bg-slate-900 text-white" : "bg-primary-600 text-white"
                    }`}>
                      {m.sender === "user" ? <User size={22} strokeWidth={2.5} /> : <Sparkles size={22} strokeWidth={2.5} />}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className={`relative p-6 rounded-[2rem] shadow-xl border ${
                        m.sender === "user" 
                          ? "bg-slate-900 text-white rounded-tr-none border-white/10 shadow-slate-200/50" 
                          : "bg-white/80 backdrop-blur-md text-slate-700 rounded-tl-none border-primary-50 shadow-primary-200/10"
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
                        
                        {m.sender === "ai" && m.id !== "intro" && !m.isStreaming && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t border-primary-50 flex gap-3"
                          >
                             <button 
                               onClick={() => addToItinerary(m.text)}
                               className="text-[10px] font-bold text-primary-600 uppercase tracking-widest px-3 py-1.5 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors active:scale-95"
                             >
                               Apply to Itinerary
                             </button>
                             <button 
                               onClick={() => {
                                 navigator.clipboard.writeText(m.text);
                                 toast.success("Intelligence copied to clipboard");
                               }}
                               className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 hover:text-slate-600 transition-colors active:scale-95"
                             >
                               Copy Info
                             </button>
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
                  <div className="w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center bg-primary-600 text-white shadow-lg shadow-primary-200 animate-pulse">
                    <Sparkles size={22} className="animate-spin-slow" />
                  </div>
                  <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] rounded-tl-none border border-primary-50 shadow-xl shadow-primary-200/10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
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
                <button className="p-4 text-slate-400 hover:text-primary-600 transition-all hover:bg-primary-50 rounded-full">
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
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-primary-700 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-all"
                >
                  {isTyping ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-6">
              Powered by Voyage Core • Verified Intelligence
            </p>
          </div>
        </div>
      </div>

      <aside className="hidden xl:flex w-[380px] border-l border-primary-100/50 flex-col bg-white overflow-y-auto custom-scrollbar">
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
                onClick={() => startNewChat()}
                className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-100 transition-colors active:scale-95"
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
                        ? 'bg-primary-600 border-primary-600 shadow-lg shadow-primary-200/50' 
                        : 'bg-slate-50 border-slate-100 hover:border-primary-200'
                    }`}
                  >
                    <p className={`text-[10px] font-black truncate mb-1 uppercase tracking-tight ${
                      currentChatId === session._id ? 'text-white' : 'text-slate-900'
                    }`}>
                      {session.title || "Untitled Expedition"}
                    </p>
                    <div className="flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${
                         currentChatId === session._id ? 'bg-white' : 'bg-primary-500'
                       }`} />
                       <span className={`text-[9px] font-bold uppercase tracking-widest ${
                         currentChatId === session._id ? 'text-primary-100' : 'text-slate-400'
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
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <Compass size={20} className="text-primary-600" />
              </div>
              <h3 className="font-display font-bold text-slate-900 uppercase tracking-widest text-sm">Quick Actions</h3>
            </div>
            
            <div className="grid gap-3">
              <button 
                onClick={() => handleSend("I'm looking for some hidden gems for my next trip. Can you suggest some destinations that are off the beaten path but still safe?")}
                className="flex items-center justify-between p-4 bg-white border border-primary-100 rounded-2xl hover:shadow-md hover:border-primary-200 transition-all text-left group active:scale-95"
              >
                <div>
                  <p className="text-xs font-black text-slate-900 group-hover:text-primary-700">Find Destinations</p>
                  <p className="text-[10px] font-bold text-slate-400">Discover hidden gems</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => handleSend("I need advice on finding the best flight deals. What are some tactical tips for booking affordable international flights without compromising on safety?")}
                className="flex items-center justify-between p-4 bg-white border border-primary-100 rounded-2xl hover:shadow-md hover:border-primary-200 transition-all text-left group active:scale-95"
              >
                <div>
                  <p className="text-xs font-black text-slate-900 group-hover:text-primary-700">Travel Protocol</p>
                  <p className="text-[10px] font-bold text-slate-400">Best rates & safety tips</p>
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>



          {/* Discoveries */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <MapPin size={20} className="text-blue-600" />
              </div>
              <h3 className="font-display font-bold text-slate-900 uppercase tracking-widest text-sm">Discoveries</h3>
            </div>
            
            <div className="grid gap-4">
              {discoveries.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center opacity-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">No Nodes Detected</p>
                </div>
              ) : (
                discoveries.map((dest, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={dest.id} 
                    className="group cursor-pointer"
                    onClick={() => setSelectedDiscovery(dest)}
                  >
                    <div className="bg-white border border-slate-100 rounded-3xl p-5 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-200/20 transition-all duration-500 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">{dest.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Added to route • {dest.time}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full bg-primary-500 animate-pulse`}></div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>


        </div>
      </aside>

      {/* Discovery Modal Popup */}
      {selectedDiscovery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar relative shadow-2xl">
            <button 
              onClick={() => setSelectedDiscovery(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X size={18} strokeWidth={3} />
            </button>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <MapPin size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{selectedDiscovery.name}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Added {selectedDiscovery.time}</p>
               </div>
            </div>
            
            <div className="prose prose-sm max-w-none prose-primary prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedDiscovery.fullText}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

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
