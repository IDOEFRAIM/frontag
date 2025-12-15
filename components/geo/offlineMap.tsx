// components/Geo/OfflineMap.tsx
'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- HACK POUR LES ICÔNES LEAFLET EN NEXT.JS ---
// Leaflet perd ses icônes par défaut lors du build Webpack. On les remet manuellement.
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Petit composant pour recentrer la carte quand les props changent
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

interface OfflineMapProps {
    lat: number;
    lng: number;
}

const OfflineMap = ({ lat, lng }: OfflineMapProps) => {
    return (
        <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #ddd', marginTop: '20px' }}>
            <MapContainer 
                center={[lat, lng]} 
                zoom={15} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
            >
                {/* Couche OpenStreetMap standard.
                   En mode Offline, ces images ne chargeront pas (grille grise), 
                   MAIS le Marker restera visible au centre, ce qui est l'essentiel.
                */}
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <Marker position={[lat, lng]} icon={icon}>
                    <Popup>
                        Point de livraison estimé.
                    </Popup>
                </Marker>
                
                <ChangeView center={[lat, lng]} />
            </MapContainer>
        </div>
    );
};

export default OfflineMap;