'use client';
import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { Shield, Key, User, Activity, Bell, Lock, Settings as SettingsIcon } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Profile state
  const [profileData, setProfileData] = useState({ name: '', bio: '' });
  // Password state
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchApi('/auth/get-me');
        setUser(data.user);
        setProfileData({ name: data.user.name, bio: data.user.bio || '' });
      } catch (error) {
        toast.error('Failed to load credentials');
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      toast.success('Admin identity updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    try {
      await fetchApi('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      toast.success('Security passphrase updated');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message || 'Authentication error');
    }
  };

  if (loading) return <div className="animate-pulse p-12 text-slate-400 font-medium tracking-widest uppercase text-xs">Synchronizing Identity...</div>;

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-950 uppercase tracking-tighter">
          Admin Settings
        </h1>
        <p className="text-slate-500 font-medium">Configure your master credentials and global platform parameters.</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-start">
        {/* Sidebar Navigation */}
        <aside className="space-y-2">
           <button 
             onClick={() => setActiveTab('profile')}
             className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <User size={16} /> Identity Parameters
           </button>
           <button 
             onClick={() => setActiveTab('security')}
             className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-slate-950 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <Lock size={16} /> Security Protocol
           </button>
           
           <div className="pt-10 space-y-6">
              <div className="bg-[#1C3E43] rounded-[2rem] p-6 text-white relative overflow-hidden">
                 <Shield className="text-[#9ECEC2] mb-4 opacity-50" size={32} />
                 <h3 className="text-sm font-black uppercase tracking-tighter mb-2">Master Access</h3>
                 <p className="text-emerald-100/60 text-[10px] font-bold uppercase leading-relaxed">Full administrative privileges active on this node.</p>
              </div>
           </div>
        </aside>

        {/* Content Area */}
        <div className="space-y-10">
          {activeTab === 'profile' && (
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                     <User size={20} />
                  </div>
                  <div>
                     <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Identity Parameters</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage your global administrator identity</p>
                  </div>
               </div>

               <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <input 
                          type="text" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300 shadow-inner"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Account Email (Static)</label>
                        <input 
                          type="email" 
                          value={user?.email} 
                          disabled 
                          className="w-full bg-slate-100 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-400 cursor-not-allowed"
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Operational Bio / Role Description</label>
                     <textarea 
                       value={profileData.bio}
                       onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                       rows={4}
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all resize-none shadow-inner"
                       placeholder="Enter role description..."
                     />
                  </div>
                  <button type="submit" className="w-full md:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2">
                     Update Identity
                  </button>
               </form>
            </section>
          )}

          {activeTab === 'security' && (
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                     <Lock size={20} />
                  </div>
                  <div>
                     <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Security Protocol</h2>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update your master encryption passphrase</p>
                  </div>
               </div>

               <form onSubmit={handleChangePassword} className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Passphrase</label>
                     <input 
                       type="password" 
                       value={passwordData.currentPassword}
                       onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all shadow-inner"
                       required
                       placeholder="••••••••"
                     />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Passphrase</label>
                        <input 
                          type="password" 
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all shadow-inner"
                          required
                          placeholder="••••••••"
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm New Passphrase</label>
                        <input 
                          type="password" 
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all shadow-inner"
                          required
                          placeholder="••••••••"
                        />
                     </div>
                  </div>
                  <button type="submit" className="w-full md:w-auto px-10 py-5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                     Deploy Security Update
                  </button>
               </form>
            </section>
          )}

          {/* System Status Mock (Static) */}
          <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
             <div className="flex items-center gap-3 mb-6">
                <Activity size={18} className="text-emerald-600" />
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Live System Telemetry</h4>
             </div>
             <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Status</p>
                   <p className="text-sm font-black text-emerald-600 uppercase">Authenticated</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Passphrase Strength</p>
                   <div className="flex items-center gap-1">
                      <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
                      <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
                      <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Security Sync</p>
                   <p className="text-sm font-black text-slate-900 uppercase">2m ago</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
