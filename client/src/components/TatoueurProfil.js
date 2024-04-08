import { useParams } from 'react-router-dom';
import styles from './Tatoueurs.module.css'
import styles2 from './content.module.css'
import { useEffect, useState } from 'react';

function TatoueurProfil() {
    let { id } = useParams();
    const [tatoueur, setTatoueur] = useState(null);
    useEffect(() => {
        // Remplace cette URL par l'URL de ton API ou de ta source de données
        const url = `http://localhost:5001/record/${id}`;

        fetch(url)
            .then(response => response.json())
            .then(data => setTatoueur(data))
            .catch(error => console.error("Il y a eu un problème avec l'opération fetch: ", error));
    }, [id]); // Ce useEffect dépend de l'ID, il se réexécutera si l'ID change


    return (
        <div className="flex-fill container p-20">
            <h1 className='my-30'>Profil du tatoueur {id} </h1>
            <div className={`d-flex flex-column card p-20 ${styles2.contentCard} `}>

                Profil du tatoueur {tatoueur.name}

            </div>

        </div>

    );
}

export default TatoueurProfil;