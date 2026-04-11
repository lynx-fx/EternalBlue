'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Compass, 
  Home, 
  MessageSquare, 
  Settings, 
  LogOut, 
  User, 
  ShieldCheck,
  Menu,
  X,
  Map,
  Sparkles,
  Users
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetchApi('/auth/get-me');
        if (response.$ok) {
          setUser(response.data.user);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        // If not authenticated, redirect to login
        router.push('/auth/login');
      }
    };
    getUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Advisory Chat', href: '/dashboard/chatbot', icon: MessageSquare },
    { name: 'Safety Tips', href: '/dashboard/advisory', icon: ShieldCheck },
    { name: 'Social Matrix', href: '/dashboard/chats', icon: Users },
    { name: 'Scam Registry', href: '/dashboard/explore', icon: Map },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', href: '/dashboard/admin', icon: ShieldCheck });
  }

  return (
    <div className="min-h-screen bg-[#F8FDF9] flex relative">
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-200"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-emerald-600 lg:rounded-tr-[3rem] lg:rounded-br-[3rem] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col shadow-2xl shadow-emerald-600/20
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col py-10">
          <div className="pl-10 flex flex-col mb-12">
            <span className="font-display font-black text-2xl tracking-widest text-white uppercase">VOYAGEAI</span>
            <span className="font-bold text-[10px] tracking-[0.2em] text-emerald-100/70 uppercase mt-1">Command Center</span>
          </div>

          <nav className="flex-1 flex flex-col pl-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-4 py-4 pl-6 relative transition-all duration-300 rounded-l-full group
                    ${active 
                      ? "bg-[#F8FDF9] text-emerald-700 z-10 shadow-sm pointer-events-none" 
                      : "text-emerald-50 hover:text-white hover:bg-emerald-500/30"
                    }
                  `}
                >
                  {/* Flawless Top Curve Injection */}
                  <div className={`absolute -top-8 right-0 w-8 h-8 pointer-events-none transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="absolute inset-0 bg-[#F8FDF9]"></div>
                     <div className="absolute inset-0 bg-emerald-600 rounded-br-[2rem]"></div>
                  </div>
                  
                  {/* Flawless Bottom Curve Injection */}
                  <div className={`absolute -bottom-8 right-0 w-8 h-8 pointer-events-none transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="absolute inset-0 bg-[#F8FDF9]"></div>
                     <div className="absolute inset-0 bg-emerald-600 rounded-tr-[2rem]"></div>
                  </div>

                  <Icon size={20} className={`transition-colors duration-300 ${active ? 'text-emerald-600' : 'group-hover:scale-110'}`} />
                  <span className="font-medium text-[15px] tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            {user && (
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-8 py-3 group">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
                  {user.profileUrl ? (
                    <img 
                      src={user.profileUrl.startsWith('http') ? user.profileUrl : `http://localhost:8000${user.profileUrl}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-white truncate uppercase tracking-wide">{user.name}</p>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{user.role}</p>
                </div>
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-8 py-4 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 h-screen ${pathname === '/dashboard/chatbot' ? 'overflow-hidden' : 'overflow-y-auto'} relative`}>
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-50/50 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <header className="h-20 flex items-center justify-between px-8 lg:px-12 bg-white/40 backdrop-blur-md sticky top-0 z-30 border-b border-emerald-100/30">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-500" />
            <h2 className="text-sm font-display font-bold text-emerald-950 uppercase tracking-widest">Command Center</h2>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/dashboard/settings" className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors shadow-sm cursor-pointer overflow-hidden">
                {user?.profileUrl ? (
                  <img 
                    src={user.profileUrl.startsWith('http') ? user.profileUrl : `http://localhost:8000${user.profileUrl}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User size={18} />
                )}
             </Link>
          </div>
        </header>

        <div className={`
          ${pathname === '/dashboard/chatbot' ? 'p-0' : 'p-8 lg:p-12'} 
          transition-all duration-500 animate-fade-in
        `}>
          {children}
        </div>
      </main>
    </div>
  );
}
