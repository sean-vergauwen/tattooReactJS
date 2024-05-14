import React, { useEffect, useState, useRef } from "react";
import L, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import customIcon from "../images/points.png"; // Chemin vers votre icône personnalisée
import styles from "./content.module.css";

export default function MapWithMarkers() {
  const [records, setRecords] = useState([]);
  const mapRef = useRef(null); // Ref for the map container

  // Initialize map on component mount
  useEffect(() => {
    const map = L.map(mapRef.current).setView([50.8503, 4.3517], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Configuration de l'icône personnalisée
    const customMarkerIcon = L.icon({
      iconUrl: customIcon,
      iconSize: [15, 32], // Taille de l'icône en pixels
      iconAnchor: [16, 32], // Point d'ancrage de l'icône, où la pointe du marqueur est placée par rapport à ses coordonnées
      popupAnchor: [0, -32], // Point d'ancrage du popup, où il est attaché par rapport à l'icône
    });

    records.forEach(async (record) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            record.address
          )}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          const marker = L.marker([lat, lon], { icon: customMarkerIcon }).addTo(
            map
          );

          // Crée un élément HTML pour le popup qui inclut un gestionnaire de clic
          const popupContent = `<a href="/tatoueur/${record._id}" style="text-decoration: none; color: blue;">${record.name}</a>`;

          marker.bindPopup(popupContent);

          // Ajoute un gestionnaire de clic directement sur le contenu du popup
          marker.on("popupopen", () => {
            document
              .querySelector(`a[href='/tatoueur/${record._id}']`)
              .addEventListener("click", (e) => {
                e.preventDefault(); // Empêche la navigation par défaut du lien
                window.location.href = e.target.getAttribute("href"); // Redirige vers l'URL du tatoueur
              });
          });
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    });

    // Clean up map on component unmount
    return () => {
      map.remove();
    };
  }, [records]);

  return (
    <div
      className={`my-30 d-flex flex-row justify-content-center allign-items-center `}
    >
      <div
        className={`my-30 flex-fill allign-items-center card p-20 ${styles.contentCard}`}
      >
        <h2>Carte</h2>
        <div
          className={`card p-20 my-30 `}
          ref={mapRef}
          style={{ width: "800px", height: "400px" }}
        ></div>
      </div>
    </div>
  );
}
