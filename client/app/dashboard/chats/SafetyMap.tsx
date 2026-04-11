'use client';

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Sparkles } from 'lucide-react';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// Discovery points (bubbles) that aren't hubs yet
const BEACONS = [
  { id: 'b1', name: 'Thamel Pulse', coords: [27.7149, 85.3123], intensity: 200 },
  { id: 'b2', name: 'Lakeside Echo', coords: [28.2095, 83.9589], intensity: 150 },
  { id: 'b3', name: 'Annapurna Signal', coords: [28.5300, 83.9447], intensity: 300 },
  { id: 'b4', name: 'Everest Node', coords: [27.9881, 86.9250], intensity: 100 },
];

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: any[];
  coordinates?: [number, number];
}

interface SafetyMapProps {
  hubs: Chat[];
  onJoin: (hub: Chat) => void;
  onCreateHub: (name: string, coords: [number, number]) => void;
}

export default function SafetyMap({ hubs, onJoin, onCreateHub }: SafetyMapProps) {
  const customIcon = useMemo(() => {
    return new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }, []);

  return (
    <MapContainer 
      center={[27.7172, 85.3240]} 
      zoom={7} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Existing Hubs */}
      {hubs.map(hub => hub.coordinates && (
        <Marker 
          key={hub._id} 
          position={hub.coordinates}
          icon={customIcon}
        >
          <Popup className="custom-popup">
            <div className="p-2 space-y-2 text-center">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Hub</p>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">{hub.chatName}</h4>
              <p className="text-[10px] font-medium text-slate-500">{hub.users.length} explorers active</p>
              <button 
                onClick={() => onJoin(hub)}
                className="w-full mt-2 py-2 bg-slate-950 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-emerald-600 transition-colors"
                type="button"
              >
                Join Cluster
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Beacon Bubbles for New Hubs (only show if no hub exists at those coords) */}
      {BEACONS.filter(beacon => 
        !hubs.some(hub => hub.coordinates && hub.coordinates[0] === beacon.coords[0] && hub.coordinates[1] === beacon.coords[1])
      ).map(beacon => (
        <CircleMarker
          key={beacon.id}
          center={beacon.coords as [number, number]}
          radius={12}
          pathOptions={{
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.3,
            weight: 2,
            dashArray: '5, 10'
          }}
        >
          <Popup className="custom-popup">
            <div className="p-4 space-y-3 text-center min-w-[180px]">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-2 animate-pulse">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Unlinked Signal</p>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{beacon.name}</h4>
              </div>
              <p className="text-[10px] font-medium text-slate-400 leading-tight">Initialize this cluster to establish a secure regional network node.</p>
              <button 
                onClick={() => onCreateHub(beacon.name, beacon.coords as [number, number])}
                className="w-full py-3 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-950 transition-all shadow-lg shadow-emerald-200"
                type="button"
              >
                Activate & Join
              </button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
