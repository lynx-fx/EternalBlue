'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Send, 
  Circle, 
  User, 
  Users,
  MessageCircle,
  Hash,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Globe,
  MapPin,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import io from 'socket.io-client';
import "leaflet/dist/leaflet.css";

// Dynamic import for the entire Map component to prevent SSR and DOM issues
const SafetyMap = dynamic(() => import('./SafetyMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" />
    </div>
  )
});

const SOCKET_ENDPOINT = "http://localhost:8000";

interface Traveller {
  _id: string;
  name: string;
  email: string;
  profileUrl?: string;
}

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: Traveller[];
  latestMessage?: any;
  coordinates?: [number, number];
}

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Traveller | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Traveller[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const socket = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Map related state
  const [hubs, setHubs] = useState<Chat[]>([]);
  const [L, setL] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      import("leaflet").then((leaflet) => {
        setL(leaflet.default);
      });
    }
    fetchUserData();
    fetchExistingChats();
    fetchHubs();
  }, []);

  const customIcon = useMemo(() => {
    if (!L) return null;
    return new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }, [L]);

  useEffect(() => {
    if (user) {
      socket.current = io(SOCKET_ENDPOINT);
      socket.current.emit("setup", user);
      socket.current.on("connected", () => setSocketConnected(true));

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("message recieved", (newMessageRecieved: any) => {
        if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
          fetchExistingChats();
        } else {
          setMessages(prev => [...prev, newMessageRecieved]);
        }
      });
    }
  });

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      socket.current?.emit("join chat", selectedChat._id);
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserData = async () => {
    try {
      const response = await fetchApi('/auth/get-me');
      if (response.$ok) setUser(response.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExistingChats = async () => {
    setLoading(true);
    try {
      const response = await fetchApi('/chat');
      setChats(response.data || []);
    } catch (err) {
      toast.error("Cloud connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHubs = async () => {
    try {
      // For now, hubs are just group chats with coordinates
      const response = await fetchApi('/chat');
      const filteredHubs = (response.data || []).filter((c: Chat) => c.isGroupChat && c.coordinates);
      setHubs(filteredHubs);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const response = await fetchApi(`/message/${selectedChat._id}`);
      setMessages(response.data || []);
    } catch (err) {
      toast.error("Failed to sync transmission.");
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetchApi(`/auth/search?search=${query}`);
      if (response.$ok) setSearchResults(response.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const accessChat = async (userId: string) => {
    try {
      const response = await fetchApi('/chat', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      
      if (!response.$ok) throw new Error("Link failed");

      const chatData = response.data;
      const chatExists = chats.find(c => c._id === chatData._id);
      if (!chatExists) setChats([chatData, ...chats]);
      
      setSelectedChat(chatData);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) {
      toast.error("Frequency lock failed.");
    }
  };

  const joinHub = async (hub: Chat) => {
    const isMember = hub.users.some(u => u._id === user?._id);
    if (isMember) {
      setSelectedChat(hub);
      return;
    }

    try {
      toast.loading(`Establishing link to ${hub.chatName}...`);
      const response = await fetchApi('/chat/groupadd', {
        method: 'PUT',
        body: JSON.stringify({
          chatId: hub._id,
          userId: user?._id
        }),
      });
      toast.dismiss();
      
      if (!response.$ok) {
        toast.error(response.message || "Hub entry denied.");
        return;
      }

      toast.success(`Successfully joined ${hub.chatName}`);
      
      fetchExistingChats();
      setSelectedChat(response.data);
    } catch (err) {
      toast.error("Hub entry denied.");
    }
  };

  const createHub = async (name: string, coords: [number, number]) => {
    try {
      toast.loading(`Initializing cluster at ${name}...`);
      const response = await fetchApi('/chat/group', {
        method: 'POST',
        body: JSON.stringify({
          name: `${name} Hub`,
          users: JSON.stringify([user?._id]),
          coordinates: coords
        }),
      });
      
      if (!response.$ok) {
        toast.dismiss();
        toast.error(response.data.message || "Failed to initialize cluster.");
        return;
      }

      toast.dismiss();
      toast.success(`Cluster ${name} initialized.`);
      
      setChats(prev => [response.data, ...prev]);
      setSelectedChat(response.data);
      fetchHubs();
    } catch (err) {
      toast.error("Cluster initialization failed.");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      const response = await fetchApi('/message', {
        method: 'POST',
        body: JSON.stringify({
          content: newMessage,
          chatId: selectedChat._id
        }),
      });
      
      if (response.$ok) {
        socket.current.emit("new message", response.data);
        setMessages([...messages, response.data]);
        setNewMessage("");
      }
    } catch (err) {
      toast.error("Transmission failed.");
    }
  };

  const getOtherUser = (users: Traveller[]) => {
    return users.find(u => u._id !== user?._id);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white overflow-hidden shadow-2xl shadow-emerald-900/5 animate-fade-in">
      
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-[380px] flex flex-col border-r border-slate-100 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">Global Net</h2>
            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
               <Globe size={18} />
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Locate fellow travellers..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 custom-scrollbar">
          {searchQuery ? (
            <div className="space-y-4 pt-2">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sensor Search Results</p>
              {isSearching ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
              ) : searchResults.length > 0 ? (
                searchResults.map(u => (
                  <button 
                    key={u._id}
                    onClick={() => accessChat(u._id)}
                    className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-emerald-50 transition-all text-left border border-transparent hover:border-emerald-100"
                  >
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                       {u.profileUrl ? <img src={u.profileUrl} className="w-full h-full object-cover rounded-2xl" /> : <User size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{u.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.email}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="px-4 text-xs font-medium text-slate-400">No explorers found on this frequency.</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <p className="px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Active Links</p>
              {loading ? (
                [1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse m-2" />)
              ) : chats.length > 0 ? (
                chats.map(chat => {
                  const otherUser = getOtherUser(chat.users);
                  return (
                    <button 
                      key={chat._id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full flex items-center gap-4 p-4 rounded-[2rem] transition-all text-left border ${
                        selectedChat?._id === chat._id 
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xl shadow-slate-900/20 scale-[0.98]' 
                          : 'hover:bg-slate-50 border-transparent'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-14 h-14 bg-emerald-100 rounded-[1.2rem] flex items-center justify-center text-emerald-600 shadow-sm overflow-hidden">
                          {chat.isGroupChat ? (
                            <Hash size={24} strokeWidth={2.5} />
                          ) : otherUser?.profileUrl ? (
                            <img src={otherUser.profileUrl} className="w-full h-full object-cover" />
                          ) : (
                            <User size={24} strokeWidth={2.5} />
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <p className={`text-sm font-black truncate uppercase tracking-tight ${selectedChat?._id === chat._id ? 'text-white' : 'text-slate-900'}`}>
                            {chat.isGroupChat ? chat.chatName : otherUser?.name}
                          </p>
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedChat?._id === chat._id ? 'text-white/40' : 'text-slate-400'}`}>
                            {chat.latestMessage ? new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sync'}
                          </span>
                        </div>
                        <p className={`text-[11px] font-medium truncate ${selectedChat?._id === chat._id ? 'text-white/60' : 'text-slate-500'}`}>
                          {chat.latestMessage?.content || 'Initialize transmission...'}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-40 grayscale">
                   <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
                     <Hash size={32} />
                   </div>
                   <p className="text-xs font-black uppercase tracking-widest text-slate-400">No Active Transmissions</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area / Map Integration */}
      <div className={`flex-1 flex flex-col relative ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                   {selectedChat.isGroupChat ? (
                     <Hash size={22} strokeWidth={2.5} />
                   ) : getOtherUser(selectedChat.users)?.profileUrl ? (
                     <img src={getOtherUser(selectedChat.users)?.profileUrl} className="w-full h-full object-cover rounded-2xl" />
                   ) : (
                     <User size={22} strokeWidth={2.5} />
                   )}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">
                    {selectedChat.isGroupChat ? selectedChat.chatName : getOtherUser(selectedChat.users)?.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Circle size={8} fill="currentColor" className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Transmission Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                   <ShieldCheck size={11} />
                   End-to-End Secure
                 </div>
                 <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
                   <MoreVertical size={20} />
                 </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar">
              {messages.map((m, i) => {
                const isMine = m.sender._id === user?._id;
                return (
                  <motion.div 
                    key={m._id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] space-y-2 ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`p-5 rounded-[2.5rem] text-sm font-medium shadow-xl border ${
                        isMine 
                          ? 'bg-slate-950 text-white rounded-tr-none border-slate-800 shadow-slate-900/10' 
                          : 'bg-white text-slate-700 rounded-tl-none border-slate-100 shadow-slate-200/50'
                      }`}>
                        {m.content}
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block px-2">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white border-t border-slate-100">
              <div className="relative flex items-center gap-4 bg-slate-50 p-2 rounded-[2.5rem] border border-slate-100 focus-within:border-emerald-500/30 focus-within:bg-white transition-all duration-500 shadow-inner">
                 <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all rounded-full hover:bg-emerald-50">
                    <Plus size={22} />
                 </button>
                 <input 
                   type="text" 
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                   placeholder="Inject transmission into frequencies..."
                   className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400 py-4"
                 />
                 <button 
                   onClick={sendMessage}
                   disabled={!newMessage.trim()}
                   className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                     newMessage.trim() 
                     ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-400/40 hover:scale-105 active:scale-95' 
                     : 'bg-slate-200 text-slate-400'
                   }`}
                 >
                    <Send size={22} strokeWidth={2.5} />
                 </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col relative h-full bg-slate-50">
            {/* Tactical Map Integration */}
            <div className="absolute inset-0 z-0">
               {mounted && (
                 <SafetyMap hubs={hubs} onJoin={joinHub} onCreateHub={createHub} />
               )}
            </div>

            {/* Subtle Map Controls / Status */}
            <div className="absolute top-8 left-8 z-10 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-100 shadow-xl flex items-center gap-3 pointer-events-auto">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Global Hub Matrix Active</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e2e8f0;
        }
        .leaflet-container {
          background-color: #f8fafc !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 2rem;
          padding: 0.5rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
}
