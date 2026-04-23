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
import Cookies from 'js-cookie';

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
    Cookies.remove('auth');
    router.push('/auth/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Social Matrix', href: '/dashboard/chats', icon: Users },
    { name: 'Advisory Chat', href: '/dashboard/chatbot', icon: MessageSquare },
    { name: 'Discovery', href: '/dashboard/recommendations', icon: Compass },
    { name: 'Safety Tips', href: '/dashboard/advisory', icon: ShieldCheck },
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
        className="lg:hidden fixed bottom-8 right-8 z-50 bg-primary-600 text-white w-14 h-14 rounded-2xl shadow-2xl shadow-primary-900/40 flex items-center justify-center active:scale-95 transition-all border border-primary-400/20"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-primary-600 lg:rounded-tr-[3rem] lg:rounded-br-[3rem] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col shadow-2xl shadow-primary-600/20
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col py-10">
          <div className="pl-10 flex flex-col mb-12">
            <span className="font-display font-black text-2xl tracking-widest text-white uppercase">VOYAGE</span>
            <span className="font-bold text-[10px] tracking-[0.2em] text-primary-100/70 uppercase mt-1">Command Center</span>
          </div>

          <nav className="flex-1 flex flex-col pl-6 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-4 py-4 pl-6 relative group
                    ${active 
                      ? "bg-[#F8FDF9] text-primary-700 z-10 shadow-sm pointer-events-none rounded-l-full" 
                      : "text-primary-50 hover:text-white hover:bg-primary-500/30 rounded-2xl mr-10 transition-colors duration-300"
                    }
                  `}
                >
                  {/* Flawless Top Curve Injection */}
                  {active && (
                    <>
                      <div className="absolute -top-6 right-0 w-6 h-6 pointer-events-none">
                         <div className="absolute inset-0 bg-[#F8FDF9]"></div>
                         <div className="absolute inset-0 bg-primary-600 rounded-br-[1.5rem]"></div>
                      </div>
                      
                      {/* Flawless Bottom Curve Injection */}
                      <div className="absolute -bottom-6 right-0 w-6 h-6 pointer-events-none">
                         <div className="absolute inset-0 bg-[#F8FDF9]"></div>
                         <div className="absolute inset-0 bg-primary-600 rounded-tr-[1.5rem]"></div>
                      </div>
                    </>
                  )}

                  <Icon size={20} className={`transition-colors duration-300 ${active ? 'text-primary-600' : 'group-hover:scale-110'}`} />
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
                  ) : (user.name.charAt(0).toUpperCase()
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
      <main className={`flex-1 min-w-0 h-screen ${pathname === '/dashboard/chatbot' ? 'overflow-hidden' : 'overflow-y-auto'} relative no-scrollbar`}>
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary-50/50 rounded-full blur-[100px] pointer-events-none -z-10" />
        
        <header className="h-16 md:h-20 flex items-center justify-between px-6 lg:px-12 bg-white/40 backdrop-blur-md sticky top-0 z-30 border-b border-primary-100/30">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary-500" />
            <h2 className="text-[11px] md:text-sm font-display font-bold text-primary-950 uppercase tracking-widest">Command Center</h2>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/dashboard/settings" className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-600 transition-colors shadow-sm cursor-pointer overflow-hidden">
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
          ${pathname === '/dashboard/chatbot' ? 'p-0' : 'p-4 sm:p-8 lg:p-12'} 
          transition-all duration-500 animate-fade-in
        `}>
          {children}
        </div>
      </main>
    </div>
  );
}
