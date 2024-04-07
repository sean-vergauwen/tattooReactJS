import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './content.module.css'
import Tatoueurs from './Tatoueurs.js';
import {data} from '../data/tattoo.js'


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

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const tatoo = data ;
  const [filter,setFilter] = useState('')
    function handleInput(e){
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
    <div>
    <div className="container mt-4">
      <h3 className="text-center mb-4">Liste de tatoueurs</h3>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Addresse</th>
            <th scope="col">Site Web</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table>
    </div>

       
    

  
    <div className="flex-fill container p-20"> 
        <h1 className='my-30'>Découvrez nos nouveaux tatoueurs </h1>
        <div className={`d-flex flex-column card p-20 ${styles.contentCard} `}> 
        <div className={`my-30 d-flex flex-row justify-content-center allign-items-center ${styles.searchBar}`}>
                <i className="fa-solid fa-magnifying-glass mr-15"></i>
                <input onInput={handleInput} className='flex-fill'type="text" placeholder='Rechercher'/>
          </div>
            <div className={styles.grid}>
                {tatoo
                .filter((r)=>r.name.toLowerCase().startsWith(filter))
                .map( (r) => (
                <Tatoueurs  key={r._id} name ={r.name} photoDeProfil={r.photoDeProfil} address={r.address}/>
                ))}
            </div>
        </div>
    </div>
  </div>
    
  );
}
