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
  const [selectedFilter, setSelectedFilter] = useState();
  const [filterData, setFilterData] = useState();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
  }, []);

  // useEffect(() => {
  //   window.location.reload();
  // }, []);

  async function handleStyleChange(selectedOptions) {
    setSelectedFilter(selectedOptions?.label);
    if (selectedOptions) {
      const payload = {
        tattooStyle: "tattoo",
      };
      try {
        const response = await fetch(
          "http://localhost:3000/user/all-by-style",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData?.data?.token}`,
            },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        if (response.ok) {
          if (data.statusCode === 200) {
            let tattooValue = [];
            const userData = data.data.map((tatto) => {
              tattooValue.push(...tatto?.tattoos);
            });
            setFilterData(tattooValue);
          } else {
            window.alert(data?.message);
          }
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
        window.alert(error.message);
      }
    }
  }

  const handleFilterData = async () => {
    const payload = {
      tattooStyle: selectedFilter,
    };
    try {
      const response = await fetch("http://localhost:3000/user/all-by-style", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.data?.token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.statusCode === 200) {
          let tattooData = [];
          const userData = data.data.map((tatto) => {
            tattooData.push(...tatto?.tattoos);
          });
          setTattooData(tattooData);
        } else {
          window.alert(data?.message);
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      window.alert(error.message);
    }
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

  function handleInput(e) {
    const filter = e.target.value.trim().toLowerCase();
    setFilter(filter);
  }

  // Fetch records from the database.
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
          />
          <Select
            className="basic-single"
            classNamePrefix="select"
            // defaultValue={options[0]}
            onChange={handleStyleChange}
            name="styles"
            options={options}
          />
        </div>

        <div className={styles.grid}>
          {tattooData
            ?.filter((tattoo) => tattoo?.name?.toLowerCase().includes(filter))
            .map((r) => {
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
