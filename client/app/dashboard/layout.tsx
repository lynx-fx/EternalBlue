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
  Sparkles
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
        const data = await fetchApi('/auth/get-me');
        setUser(data.user);
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
    { name: 'Explore', href: '/dashboard/explore', icon: Map },
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
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-emerald-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <Compass size={22} strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-emerald-950 uppercase">VoyageAI</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all group
                    ${active 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200/50' 
                      : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}
                  `}
                >
                  <Icon size={20} className={active ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-slate-50">
            {user && (
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-2 py-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold overflow-hidden shadow-sm">
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
                  <p className="text-xs font-display font-bold text-slate-900 truncate uppercase tracking-tighter">{user.name}</p>
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                  </div>
                </div>
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 transition-all group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
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
