import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; // Importamos Leaflet base
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine'; // Importamos la máquina de rutas
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Sus estilos

// Iconos
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new L.Icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Truco para TypeScript: Extendemos Leaflet para que reconozca "Routing"
declare module 'leaflet' {
    namespace Routing {
        function control(options: any): any;
    }
}

interface Props {
    deliveries: any[];
}

// --- COMPONENTE QUE DIBUJA LA RUTA ---
function RoutingLayer({ deliveries, defaultCenter }: { deliveries: any[], defaultCenter: { lat: number, lng: number } }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // 1. Definimos los puntos de paso (Waypoints)
        // El primer punto es la BASE (Santiago), luego siguen las entregas
        const waypoints = [
            L.latLng(defaultCenter.lat, defaultCenter.lng), // Inicio: Base
            ...deliveries.map(d => L.latLng(d.client.latitude, d.client.longitude)) // Destinos
        ];

        // 2. Creamos el control de ruta
        const routingControl = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            show: false, // Ocultar cuadro de texto con instrucciones (girar a la derecha...)
            addWaypoints: false, // No dejar que el usuario agregue puntos manuales
            draggableWaypoints: false,
            fitSelectedRoutes: true, // Ajustar zoom para ver toda la ruta
            lineOptions: {
                styles: [{ color: '#3B82F6', opacity: 0.7, weight: 5 }] // Línea Azul bonita
            },
            createMarker: function() { return null; } // No crear marcadores extra (ya tenemos los nuestros)
        }).addTo(map);

        // 3. Limpieza al salir (para no duplicar líneas)
        return () => {
            map.removeControl(routingControl);
        };
    }, [map, deliveries, defaultCenter]);

    return null;
}

export default function RouteMap({ deliveries }: Props) {
    // Coordenadas de tu Base Central (Santiago)
    const defaultCenter = { lat: -33.4489, lng: -70.6693 };

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0">
            <MapContainer center={[defaultCenter.lat, defaultCenter.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* Marcador de la BASE (Oficina) */}
                <Marker position={[defaultCenter.lat, defaultCenter.lng]} icon={defaultIcon}>
                    <Popup>🏭 CENTRO DE DISTRIBUCIÓN</Popup>
                </Marker>

                {/* Marcadores de los CLIENTES */}
                {deliveries.map((delivery, index) => (
                    <Marker 
                        key={delivery.id} 
                        position={[delivery.client.latitude, delivery.client.longitude]} 
                        icon={defaultIcon}
                    >
                        <Popup>
                            <strong>Parada #{index + 1}</strong> <br />
                            {delivery.client.companyName}
                        </Popup>
                    </Marker>
                ))}

                {/* Capa Mágica de Rutas */}
                <RoutingLayer deliveries={deliveries} defaultCenter={defaultCenter} />

            </MapContainer>
        </div>
    );
}