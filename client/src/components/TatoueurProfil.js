import { useParams } from 'react-router-dom';
import styles2 from './content.module.css'
import { useEffect, useState } from 'react';

function TatoueurProfil() {
    let { id } = useParams();

    const [tatoueur, setTatoueur] = useState(null);
    const [showReviewInput, setShowReviewInput] = useState(false); // Pour afficher/cacher l'input
    const [reviewText, setReviewText] = useState(''); // Pour stocker le texte de l'avis


    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5001/record/`);
            if (!response.ok) {
                const message = `Une erreur est survenue : ${response.statusText}`;
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

    const handleSaveReview = async () => {
        try {
            const response = await fetch(`http://localhost:5001/avis/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ avis: reviewText }), // Envoie l'avis comme partie du corps de la requête
            });

            if (!response.ok) {

                throw new Error(`Une erreur est survenue : ${response.statusText}`);

            }


            console.log("Avis enregistré :");


        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'avis:", error);
            window.alert("Erreur lors de l'enregistrement de l'avis.");
        } finally {
            // Réinitialise le formulaire d'avis indépendamment du résultat de la requête
            setShowReviewInput(false);
            setReviewText('');
        }
    };

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
                <p>Identifiant : {id} </p>
                <p>Site web : <a href={tatoueur.website} target='_blank'>{tatoueur.website}</a> </p>
                <button onClick={() => setShowReviewInput(true)} className='btn btn-primary d-flex  p-10 mb-20' >Ajouter en favoris</button>
                <h3 className='my-30'>Avis : </h3>
                {showReviewInput ? (
                    <>
                        <textarea
                            className='mb-20 textarea-avis'
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Laissez votre avis ici..."
                        />
                    
                        <button onClick={handleSaveReview} className='btn btn-primary d-flex   p-10 mb-20'>Enregistrer l'avis</button>
                    </>
                ) : (
                

                    <button onClick={() => setShowReviewInput(true)} className='btn btn-primary d-flex  p-10 mb-20' >Laisser un avis</button>
                )}
                <div className={`d-flex flex-column card p-20 ${styles2.contentCard} `}>
                    {tatoueur.avis && tatoueur.avis.length > 0 ? (
                        tatoueur.avis.map((avis, index) => (
                            <p className={`d-flex flex-column card p-20 ${styles2.contentCard} `} key={index}>Avis de {avis._id} {index + 1}: {avis.avis}</p>
                        ))
                    ) : (
                        <p>Aucun avis pour le moment.</p>
                    )}
                </div>

            </div>

        </div>

    );
}

export default TatoueurProfil;