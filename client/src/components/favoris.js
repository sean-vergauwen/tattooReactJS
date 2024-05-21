import React, { useEffect, useState } from "react";
import styles from "./content.module.css";
import Tatoueurs from "./Tatoueurs.js";
import { data } from "../data/tattoo.js";

export default function Favoris({}) {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("");
  const [tattooData, setTattooData] = useState([]);
  const [userData, setUserData] = useState();

  const handleAllData = () => {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (storageData) {
      try {
        fetch("http://localhost:3001/user/all-likes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storageData?.data?.token}`,
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.statusCode === 200) {
              setTattooData(responseData?.data?.tattoos);
            } else {
              window.alert(responseData?.message);
            }
          })
          .catch((error) => {
            console.error(error);
            window.alert(error);
          });
      } catch (error) {
        console.error(error);
        window.alert(error);
      }
    }
  };

  function handleInput(e) {
    const filter = e.target.value.trim().toLowerCase();
    const filteredData = tattooData.filter((tattoo) =>
      tattoo.name.toLowerCase().includes(filter)
    );
    setFilter(filter);
    if (filter.length >= 1) {
      setTattooData(filteredData);
    } else {
      handleAllData();
    }
  }

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (storageData) {
      handleAllData();
    }
  }, []);

  // Delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // Display the table with the records of individuals
  return (
    <div className="flex-fill container p-20">
      <h1 className="my-30">Découvrez nos tatoueurs </h1>
      <div className={`d-flex flex-column card p-20 ${styles.contentCard} `}>
        <div
          className={`my-30 d-flex flex-row justify-content-center allign-items-center ${styles.searchBar}`}
        >
          <input
            onInput={handleInput}
            className="flex-fill"
            type="text"
            placeholder="Rechercher"
          />
        </div>
        {tattooData?.length > 0 || tattooData?.length != null ? (
          <div className={styles.grid}>
            {tattooData?.map((r) => (
              <Tatoueurs
                id={r._id}
                name={r.name}
                photoDeProfil={r.image}
                address={r.description}
                Favoris={true}
              />
            ))}
          </div>
        ) : (
          "Aucune donnée disponible"
        )}
      </div>
    </div>
  );
}
