import { useParams } from 'react-router-dom';
import styles from './Tatoueurs.module.css'
import styles2 from './content.module.css'
import { useEffect, useState } from 'react';

function TatoueurProfil() {
    let { id } = useParams();

    const [tatoueur, setTatoueur] = useState(null);

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
            // Trouver le tatoueur après la mise à jour des records
            const lebon = records.find(tatoueur => tatoueur["_id"] === id);
            setTatoueur(lebon);
        }
        getRecords();
    }, [id])
    if (!tatoueur) {
        // Gérer l'affichage pendant le chargement ou si le tatoueur n'est pas trouvé
        return <div>Chargement des détails du tatoueur...</div>;
    }
    return (
        <div className="flex-fill container p-20">
            <h1 className='my-30'>Profil du Salon  {tatoueur.name} </h1>
            <div className={`d-flex flex-column card p-20 ${styles2.contentCard} `}>
                <p>Nom : {tatoueur.name} </p>
                <p>Addresse : {tatoueur.address} </p>
                <p>Identifiant : {tatoueur._id} </p>
                <p>Site web : <a href={tatoueur.website} target='_blank'>{tatoueur.website}</a> </p>
                <h3>Avis : </h3>



            </div>

        </div>

    );
}

export default TatoueurProfil;