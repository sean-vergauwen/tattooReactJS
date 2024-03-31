import React, { useEffect, useState, useRef } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import customIcon from 'D:/LILIAN/EPHEC/2ième/Dev3/TATOO/tattooReactJS/client/src/images/points.png'; // Chemin vers votre icône personnalisée

export default function MapWithMarkers() {
  const [records, setRecords] = useState([]);
  const mapRef = useRef(null); // Ref for the map container

  // Fetch records from the database
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`http://localhost:5001/record/`);
        if (!response.ok) {
          throw new Error(`An error occurred: ${response.statusText}`);
        }
        const records = await response.json();
        setRecords(records);
      } catch (error) {
        console.error(error);
        window.alert(error.message);
      }
    }
    getRecords();
  }, []);

  // Initialize map on component mount
  useEffect(() => {
    const map = L.map(mapRef.current).setView([50.8503, 4.3517], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Configuration de l'icône personnalisée
    const customMarkerIcon = L.icon({
      iconUrl: customIcon,
      iconSize: [15, 32], // Taille de l'icône en pixels
      iconAnchor: [16, 32], // Point d'ancrage de l'icône, où la pointe du marqueur est placée par rapport à ses coordonnées
      popupAnchor: [0, -32] // Point d'ancrage du popup, où il est attaché par rapport à l'icône
    });

    records.forEach(async (record) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(record.address)}`);
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          L.marker([lat, lon], { icon: customMarkerIcon }).addTo(map).bindPopup(record.name);
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    });

    // Clean up map on component unmount
    return () => {
      map.remove();
    };
  }, [records]);

  return (
    <div ref={mapRef} style={{ width: '800px', height: '400px' }}></div>
  );
}