import React, { useCallback, useEffect, useState } from "react";
import styles from "./content.module.css";
import Tatoueurs from "./Tatoueurs.js";
import Select from "react-select";

const Record = (props) => (
  <tr>
    <td>{props.record.name}</td>
    <td>{props.record.address}</td>
    <td>
      <a href={props.record.website} target="_blank" rel="noopener noreferrer">
        {props.record.website}
      </a>
    </td>
  </tr>
);

const options = [
  { value: "Traditionnel", label: "Traditionnel" },
  { value: "Réaliste", label: "Réaliste" },
  { value: "Blackwork", label: "Blackwork" },
  { value: "Dotwork", label: "Dotwork" },
  { value: "Géométrique", label: "Géométrique" },
  { value: "Biomechanical", label: "Biomechanical" },
  { value: "Celtique", label: "Celtique" },
  { value: "Polynésien", label: "Polynésien" },
  { value: "Minimaliste", label: "Minimaliste" },
  { value: "Abstrait", label: "Abstrait" },
  { value: "Mandala", label: "Mandala" },
  { value: "Black & Grey", label: "Black & Grey" },
  { value: "Old School", label: "Old School" },
  { value: "Maori", label: "Maori" },
  { value: "Pointillisme", label: "Pointillisme" },
  { value: "Japonais", label: "Japonais" },
  { value: "Neo traditionnel", label: "Neo traditionnel" },
  { value: "Trash Polka", label: "Trash Polka" },
  { value: "Sketch", label: "Sketch" },
  { value: "Linework", label: "Linework" },
  { value: "Surréaliste", label: "Surréaliste" },
  { value: "Portrait", label: "Portrait" },
  { value: "Tribal", label: "Tribal" },
  { value: "Aquarelle", label: "Aquarelle" },
  { value: "Horreur", label: "Horreur" },
  { value: "Lettering", label: "Lettering" },
];

export default function RecordList({}) {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("");
  const [tattooData, setTattooData] = useState([]);
  const [userData, setUserData] = useState();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [data, setData] = useState(tattooData);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (tattooData) {
      setData(tattooData);
    }
  }, [tattooData]);

  const handleStyleChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedFilter(selectedValue);
    setFilter("");
    console.log("Selected value:", selectedValue);
  };

  const handleAllData = () => {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (storageData) {
      try {
        fetch("http://localhost:3000/user/all-tattoos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storageData?.data?.token}`,
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.statusCode === 200) {
              setTattooData(responseData?.data);
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

  const handleInput = (e) => {
    const filterValue = e.target.value.trim().toLowerCase();
    const userData = tattooData.filter((data) => {
      return data?.name.toLowerCase().includes(filterValue);
    });
    setFilter(filterValue);
    setData(userData);
  };

  useEffect(() => {
    if (filter == "") {
      handleAllData();
    } else {
      const userData = tattooData.filter((data) => {
        return data?.name.toLowerCase().includes(filter);
      });
      setData(userData);
      setSelectedFilter("");
    }
  }, [filter]);

  // Fetch records from the database.
  useEffect(() => {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (storageData) {
      handleAllData();
    }
  }, []);

  useEffect(() => {
    if (selectedFilter) {
      const userData = tattooData.filter((data) => {
        return data?.tattooStyle == selectedFilter;
      });
      setData(userData);
    }
  }, [selectedFilter]);

  // Delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:3000/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
  }

  // Map out the records on the table
  function recordList() {
    return records.map((record) => (
      <Record
        record={record}
        deleteRecord={() => deleteRecord(record._id)}
        key={record._id}
      />
    ));
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
            value={filter}
          />

          <select
            value={selectedFilter}
            onChange={handleStyleChange}
            style={{ height: "40px", borderRadius: "14px" }}
          >
            <option value="">Select a style</option>
            {options.map((data) => (
              <option
                key={data.value}
                value={data.value}
                style={{ height: "40px", borderRadius: "14px" }}
              >
                {data.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.grid}>
          {data.map((r) => {
            return (
              <Tatoueurs
                id={r._id}
                name={r.name}
                photoDeProfil={r.image}
                address={r.description}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
