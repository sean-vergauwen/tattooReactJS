import React, { useEffect, useState } from "react";
import styles from './content.module.css'
import Tatoueurs from './Tatoueurs.js';
import { data } from "../data/tattoo.js"



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

export default function RecordList({ id }) {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('')
  function handleInput(e) {
    const filter = e.target.value
    setFilter(filter.trim().toLowerCase());
  }

  // Fetch records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5001/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
  }, []);

  // Delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5001/${id}`, {
      method: "DELETE"
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

      <h1 className='my-30'>Découvrez nos tatoueurs </h1>
      <div className={`d-flex flex-column card p-20 ${styles.contentCard} `}>
        <div className={`my-30 d-flex flex-row justify-content-center allign-items-center ${styles.searchBar}`}>
          <input onInput={handleInput} className='flex-fill' type="text" placeholder='Rechercher' />
        </div>
        <div className={styles.grid} >
          {records
            .filter((r) => r.name.toLowerCase().startsWith(filter))
            .map((r) => (
              <Tatoueurs id={r._id} name={r.name} photoDeProfil={r.photoDeProfil} address={r.address} />
            ))}
        </div>
      </div>
    </div>


  );
}
