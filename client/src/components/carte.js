import React, { useEffect, useState, useRef } from "react";
import L, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import customIcon from "../images/points.png"; // Chemin vers votre icône personnalisée
import styles from "./content.module.css";

export default function MapWithMarkers() {
  const [records, setRecords] = useState();
  const mapRef = useRef(null); // Ref for the map container

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      const storageData = JSON.parse(data);
      console.log("storageData", storageData);
      let userObject = storageData?.data?.user;

      setRecords(userObject);
    }
  }, []);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([50.8503, 4.3517], 10);

    if (records) {
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

      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          records.address
        )}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            const marker = L.marker([lat, lon], {
              icon: customMarkerIcon,
            }).addTo(map);
            if (records.tattoos[0]) {
              const popupContent = `<a href="/tatoueur/${records.tattoos[0]}" style="text-decoration: none; color: blue;">${records.userName}</a>`;
              marker.bindPopup(popupContent);
              marker.on("popupopen", () => {
                document
                  .querySelector(`a[href='/tatoueur/${records.tattoos[0]}']`)
                  .addEventListener("click", (e) => {
                    e.preventDefault();
                    window.location.href = e.target.getAttribute("href");
                  });
              });
            } else {
              const popupContent = `<a style="text-decoration: none; color: blue;">${records.userName}</a>`;
              marker.bindPopup(popupContent);
              marker.on("popupopen", () => {
                document
                  .querySelector(
                    `a[style="text-decoration: none; color: blue;"]`
                  )
                  .addEventListener("click", (e) => {
                    e.preventDefault();
                    alert("Ajouter d’abord un tatouage");
                  });
              });
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching coordinates:", error);
        });

      // records?.map(async (record) => {
      // try {
      //   const response = fetch(
      //     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      //       records.address
      //     )}`
      //   );
      //   if (response) {
      //     console.log("response", response);
      //     const data = response;
      //     if (data && data.length > 0) {
      //       const { lat, lon } = data[0];
      //       const marker = L.marker([lat, lon], {
      //         icon: customMarkerIcon,
      //       }).addTo(map);

      //       // Crée un élément HTML pour le popup qui inclut un gestionnaire de clic
      //       const popupContent = `<a href="/tatoueur/${records._id}" style="text-decoration: none; color: blue;">${records.name}</a>`;

      //       marker.bindPopup(popupContent);

      //       // Ajoute un gestionnaire de clic directement sur le contenu du popup
      //       marker.on("popupopen", () => {
      //         document
      //           .querySelector(`a[href='/tatoueur/${records._id}']`)
      //           .addEventListener("click", (e) => {
      //             e.preventDefault(); // Empêche la navigation par défaut du lien
      //             window.location.href = e.target.getAttribute("href"); // Redirige vers l'URL du tatoueur
      //           });
      //       });
      //     }
      //   }
      // } catch (error) {
      //   console.error("Error fetching coordinates:", error);
      // }
      // });
    }

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
