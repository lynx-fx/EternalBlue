'use client';

import React, { useEffect, useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Star, 
  Plus, 
  Trash2, 
  Edit3,
  X,
  Hotel, 
  Trees, 
  Image as ImageIcon,
  AlertTriangle,
  DollarSign,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRec, setNewRec] = useState({
    title: '',
    description: '',
    type: 'trip',
    location: '',
    price: '',
    rating: 5,
    imageUrl: '',
    isFeatured: false
  });

  const loadData = async () => {
    setLoading(true);
    const res = await fetchApi('/recommendations');
    if (res.$ok) {
      setRecommendations(res.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setNewRec({
      title: '',
      description: '',
      type: 'trip',
      location: '',
      price: '',
      rating: 5,
      imageUrl: '',
      isFeatured: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingId ? `/recommendations/${editingId}` : '/recommendations';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetchApi(endpoint, {
      method,
      body: JSON.stringify(newRec)
    });

    if (res.$ok) {
      toast.success(editingId ? 'Record updated successfully' : 'Recommendation deployed to network');
      resetForm();
      loadData();
    } else {
      toast.error(res.data?.message || 'Failed to process request');
    }
  };

  const handleEdit = (rec: any) => {
    setEditingId(rec._id);
    setNewRec({
      title: rec.title,
      description: rec.description,
      type: rec.type,
      location: rec.location,
      price: rec.price || '',
      rating: rec.rating || 5,
      imageUrl: rec.imageUrl || '',
      isFeatured: rec.isFeatured || false
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to decommission this record?')) return;
    const res = await fetchApi(`/recommendations/${id}`, { method: 'DELETE' });
    if (res.$ok) {
      toast.success('Record purged from database');
      loadData();
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Voyager Discovery</h1>
          <p className="text-slate-500 font-medium">Curate premium Himalayan experiences and elite accommodations.</p>
        </div>
        <button 
          onClick={showAddForm ? resetForm : () => setShowAddForm(true)}
          className={`px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-xl active:scale-95 ${showAddForm ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/20'}`}
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? 'Cancel Operation' : 'Deploy New Selection'}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-primary-900/5 mb-8">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-6 lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Title / Name</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                        placeholder="e.g. Ama Dablam Base Camp Trek"
                        value={newRec.title}
                        onChange={e => setNewRec({...newRec, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Primary Location</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500" />
                        <input 
                          type="text" 
                          required 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-950 placeholder:text-slate-400 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                          placeholder="e.g. Solu-Khumbu Region"
                          value={newRec.location}
                          onChange={e => setNewRec({...newRec, location: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Description / Intel</label>
                    <textarea 
                      required 
                      className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-4 text-sm font-medium text-slate-950 placeholder:text-slate-400 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all min-h-[140px] resize-none"
                      placeholder="Detail the experience, highlights, and unique selling points..."
                      value={newRec.description}
                      onChange={e => setNewRec({...newRec, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Classification</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        type="button"
                        onClick={() => setNewRec({...newRec, type: 'trip'})}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${newRec.type === 'trip' ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                      >
                        <Trees size={16} />
                        <span className="text-[9px] font-black uppercase">Expedition</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewRec({...newRec, type: 'hotel'})}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${newRec.type === 'hotel' ? 'bg-primary-600 border-primary-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                      >
                        <Hotel size={16} />
                        <span className="text-[9px] font-black uppercase">Safehouse</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewRec({...newRec, type: 'tip'})}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all ${newRec.type === 'tip' ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                      >
                        <AlertTriangle size={16} />
                        <span className="text-[9px] font-black uppercase">Travel Tip</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Price Estimate</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text" 
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-4 text-sm font-black text-slate-950 placeholder:text-slate-400 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                          placeholder="$1,200"
                          value={newRec.price}
                          onChange={e => setNewRec({...newRec, price: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Voyager Rating</label>
                      <div className="relative">
                        <Star size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                        <input 
                          type="number" 
                          min="1" max="5"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-4 text-sm font-black text-slate-950 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                          value={newRec.rating}
                          onChange={e => setNewRec({...newRec, rating: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Visual Asset URL</label>
                    <div className="relative">
                      <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="url" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-4 text-sm font-medium text-slate-950 placeholder:text-slate-400 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                        placeholder="https://images.unsplash.com/..."
                        value={newRec.imageUrl}
                        onChange={e => setNewRec({...newRec, imageUrl: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {editingId ? 'Update Authorization' : 'Authorize Selection'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="animate-pulse bg-slate-100 h-96 rounded-[3rem]" />
          ))
        ) : recommendations.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-4 bg-white border border-dashed border-slate-200 rounded-[3rem]">
            <Compass size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No discovery records found in the security matrix.</p>
          </div>
        ) : (
          recommendations.map((rec: any, idx: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={rec._id}
              className="group bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary-900/5 transition-all duration-500"
            >
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={rec.imageUrl || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80'} 
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <div className={`px-4 py-2 rounded-full backdrop-blur-md text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${rec.type === 'trip' ? 'bg-primary-600/80 text-white' : 'bg-blue-600/80 text-white'}`}>
                    {rec.type === 'trip' ? <Trees size={12} /> : <Hotel size={12} />}
                    {rec.type}
                  </div>
                </div>
                <div className="absolute top-6 right-6 flex gap-2">
                  <button 
                    onClick={() => handleEdit(rec)}
                    className="w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg hover:bg-primary-50"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(rec._id)}
                    className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black text-slate-900">{rec.rating}.0</span>
                    </div>
                    {rec.price && (
                      <span className="text-sm font-black text-primary-600 tracking-tighter">{rec.price}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-950 leading-tight uppercase tracking-tighter">{rec.title}</h3>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">{rec.location}</span>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-500 leading-relaxed italic line-clamp-3">
                  {rec.description}
                </p>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-primary-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Verified</span>
                  </div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
