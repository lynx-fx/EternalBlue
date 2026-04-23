'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Lock, 
  Shield, 
  Settings as SettingsIcon, 
  Camera, 
  Check, 
  AlertCircle,
  Loader2,
  Trash2,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

type Tab = 'profile' | 'security' | 'notifications';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
    email: ''
  });
  
  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi('/auth/get-me');
      if (res.$ok) {
        const userData = res.data.user;
        setUser(userData);
        setProfileForm({
          name: userData.name || '',
          bio: userData.bio || '',
          email: userData.email || ''
        });
        if (userData.profileUrl) {
          setPreviewUrl(userData.profileUrl.startsWith('http') 
            ? userData.profileUrl 
            : `http://localhost:8000${userData.profileUrl}`);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    
    try {
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('bio', profileForm.bio);
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }
      
      const res = await fetchApi('/auth/update-profile', {
        method: 'PUT',
        body: formData
      });
      
      if (res.$ok) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setUser(res.data.user);
        // Clean up preview if upload was successful
        setSelectedFile(null);
      } else {
        setMessage({ text: res.data?.message || res.message || 'Failed to update profile', type: 'error' });
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    
    setSubmitting(true);
    setMessage(null);
    
    try {
      const res = await fetchApi('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      if (res.$ok) {
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ text: res.data?.message || res.message || 'Failed to change password', type: 'error' });
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to change password', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Synchronizing Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter">Account Setup</h1>
          <p className="text-slate-500 font-medium">Manage your global profile and security credentials.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-primary-50 rounded-2xl border border-primary-100">
          <Shield className="text-primary-600" size={18} />
          <span className="text-xs font-black text-primary-950 uppercase tracking-widest">Verification Active</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-12">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { id: 'profile', icon: User, label: 'Standard Profile' },
            { id: 'security', icon: Lock, label: 'Access Control' },
            { id: 'notifications', icon: Bell, label: 'Warning Systems' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as Tab); setMessage(null); }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-slate-950 text-white shadow-xl shadow-slate-900/20' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          
          <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <div className="flex items-center gap-2 mb-4 text-slate-400">
                <AlertCircle size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Privacy Note</span>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Your data is encrypted using high-fidelity protocols before being stored in our safety matrix.
             </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-slate-100 rounded-[3rem] p-8 lg:p-12 shadow-sm relative overflow-hidden">
           {/* Feedback Message */}
           {message && (
             <div className={`mb-10 p-4 rounded-2xl border flex items-center gap-4 animate-slide-up ${
               message.type === 'success' ? 'bg-primary-50 text-primary-700 border-primary-100' : 'bg-red-50 text-red-700 border-red-100'
             }`}>
               {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
               <span className="text-sm font-bold uppercase tracking-tight">{message.text}</span>
             </div>
           )}

           {activeTab === 'profile' && (
             <form onSubmit={handleProfileSubmit} className="space-y-10">
               <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                      {previewUrl ? (
                         <img src={previewUrl} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                         <User size={40} className="text-slate-300" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-[2.5rem]">
                       <Camera size={24} className="text-white" />
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                     <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Identify Yourself</h3>
                     <p className="text-slate-500 font-medium">Your public metadata visible to the network.</p>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Name</label>
                     <input 
                       type="text" 
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-slate-900"
                       value={profileForm.name}
                       onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                       required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Access ID</label>
                     <input 
                       type="email" 
                       className="w-full bg-slate-100 border border-slate-100 rounded-2xl px-6 py-4 text-slate-400 font-bold cursor-not-allowed"
                       value={profileForm.email}
                       disabled
                     />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Personal Dossier (Bio)</label>
                     <textarea 
                       rows={4}
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-slate-900 resize-none"
                       placeholder="Tell the network about yourself..."
                       value={profileForm.bio}
                       onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                     />
                  </div>
               </div>

               <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="px-10 py-4 bg-primary-600 hover:bg-primary-500 disabled:bg-slate-300 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary-900/20 uppercase tracking-widest text-xs flex items-center gap-2"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Synchronize Profile'}
                  </button>
               </div>
             </form>
           )}

           {activeTab === 'security' && (
             <form onSubmit={handlePasswordSubmit} className="space-y-10">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Access Control</h3>
                  <p className="text-slate-500 font-medium">Update your encryption keys to maintain high security.</p>
               </div>

               <div className="space-y-6 max-w-lg">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Encryption Key</label>
                     <div className="relative">
                        <input 
                          type={showCurrentPass ? 'text' : 'password'} 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-slate-900"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          required
                        />
                        <button 
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          onClick={() => setShowCurrentPass(!showCurrentPass)}
                        >
                          {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Encryption Key</label>
                     <div className="relative">
                        <input 
                          type={showNewPass ? 'text' : 'password'} 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-slate-900"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          required
                        />
                        <button 
                          type="button"
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          onClick={() => setShowNewPass(!showNewPass)}
                        >
                          {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Key</label>
                     <input 
                       type="password" 
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-slate-900"
                       value={passwordForm.confirmPassword}
                       onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                       required
                     />
                  </div>
               </div>

               <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="px-10 py-4 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/20 uppercase tracking-widest text-xs flex items-center gap-2"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Re-Key Access'}
                  </button>
               </div>
             </form>
           )}

           {activeTab === 'notifications' && (
             <div className="space-y-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Warning Systems</h3>
                  <p className="text-slate-500 font-medium">Configure how the network alerts you of potential compromises.</p>
                </div>

                <div className="space-y-4">
                   {[
                     { title: 'Priority Intelligence', desc: 'Alerts for high-severity travel scams in your regions.', enabled: true },
                     { title: 'Network Updates', desc: 'Sync reports and security protocol revisions.', enabled: true },
                     { title: 'Login Notifications', desc: 'Alerts when your credentials are used on a new node.', enabled: false },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="space-y-1">
                           <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{item.title}</h4>
                           <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${item.enabled ? 'bg-primary-500' : 'bg-slate-300'}`}>
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'left-7' : 'left-1'}`} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
