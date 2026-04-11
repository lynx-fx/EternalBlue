'use client';

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

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
}

export default function SafetyMap({ hubs, onJoin }: SafetyMapProps) {
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
      {hubs.map(hub => hub.coordinates && (
        <Marker 
          key={hub._id} 
          position={hub.coordinates}
          icon={customIcon}
          eventHandlers={{
            click: () => {}
          }}
        >
          <Popup className="custom-popup">
            <div className="p-2 space-y-2 text-center">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Safety Hub</p>
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
    </MapContainer>
  );
}
