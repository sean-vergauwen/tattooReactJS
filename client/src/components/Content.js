import React, { useEffect, useState } from "react";
import styles from './content.module.css';
import Tatoueurs from './Tatoueurs.js';

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [allStyles, setAllStyles] = useState([]); // État pour stocker tous les styles uniques
  const [selectedStyle, setSelectedStyle] = useState(''); // État pour le style sélectionné pour le filtrage
  const [filter, setFilter] = useState(''); // État pour le filtrage du nom

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

      // Extraction des styles uniques pour le menu déroulant de filtrage
      const loadedStyles = Array.from(new Set(records.flatMap(record => record.styles)));
      setAllStyles(loadedStyles);
    }
    getRecords();
  }, []);

  function handleStyleChange(e) {
    setSelectedStyle(e.target.value);
  }

  // Gère la saisie dans la barre de recherche pour le filtrage par nom
  function handleInput(e) {
    setFilter(e.target.value.toLowerCase());
  }

  // Filtrage des tatoueurs par nom et style
  function filteredRecords() {
    return records
      .filter((record) =>
        record.name.toLowerCase().includes(filter) &&
        (selectedStyle ? record.styles.includes(selectedStyle) : true)
      )
      .map((record) => (
        <Tatoueurs
          key={record._id}
          id={record._id}
          name={record.name}
          photoDeProfil={record.photoDeProfil}
          address={record.address}
        />
      ));
  }

  return (
    <div className="flex-fill container p-20">
      <h1 className='my-30'>Découvrez nos tatoueurs</h1>
      <div className={`d-flex flex-column card p-20 ${styles.contentCard}`}>
        <div className={`my-30 d-flex flex-row justify-content-center align-items-center ${styles.searchBar}`}>
          <input onInput={handleInput} className='flex-fill' type="text" placeholder='Rechercher' />
          <select onChange={handleStyleChange} className='flex-fill'>
            <option value="">Tous les styles</option>
            {allStyles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        <div className={styles.grid}>
          {filteredRecords()}
        </div>
      </div>
    </div>
  );
}
