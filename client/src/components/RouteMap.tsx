import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Iconos de Leaflet (para que no se rompan en React)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface Props {
    deliveries: any[];
}

// COMPONENTE AUXILIAR: Para mover la cámara automáticamente
function MapRecenter({ lat, lng }: { lat: number, lng: number }) {
    const map = useMap();
    useEffect(() => {
        // Mueve el mapa suavemente a las nuevas coordenadas
        map.flyTo([lat, lng], 13);
    }, [lat, lng, map]);
    return null;
}

export default function RouteMap({ deliveries }: Props) {
    // 1. Definir el centro inicial del mapa
    // Si hay entregas, usamos la primera como centro. Si no, usamos Santiago por defecto.
    const defaultCenter = { lat: -33.4489, lng: -70.6693 };
    
    const centerLat = deliveries.length > 0 ? parseFloat(deliveries[0].client.latitude) : defaultCenter.lat;
    const centerLng = deliveries.length > 0 ? parseFloat(deliveries[0].client.longitude) : defaultCenter.lng;

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0">
            <MapContainer center={[defaultCenter.lat, defaultCenter.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                
                {/* Esto mueve la cámara a Concepción (o donde sea la entrega) */}
                <MapRecenter lat={centerLat} lng={centerLng} />

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* Marcadores REALES (Sin trucos matemáticos) */}
                {deliveries.map((delivery, index) => (
                    <Marker 
                        key={delivery.id} 
                        // AQUÍ LEEMOS LOS DATOS DE TU BASE DE DATOS 👇
                        position={[delivery.client.latitude, delivery.client.longitude]} 
                        icon={defaultIcon}
                    >
                        <Popup>
                            <strong>Entrega #{index + 1}</strong> <br />
                            {delivery.client.companyName} <br />
                            <span className={delivery.status === 'DELIVERED' ? 'text-green-600' : 'text-yellow-600'}>
                                {delivery.status}
                            </span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}