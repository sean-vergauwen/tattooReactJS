import { useParams } from "react-router-dom";
import styles2 from "./content.module.css";
import { useEffect, useState } from "react";

function TatoueurProfil() {
  let { id } = useParams();

  const [tatoueur, setTatoueur] = useState(null);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [userData, setUserData] = useState();

  const [reviewText, setReviewText] = useState("");

  const handleAllData = () => {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (storageData) {
      try {
        fetch(`http://localhost:3000/user/tattoo/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storageData?.data?.token}`,
          },
        })
          .then((response) => response.json())
          .then((responseData) => {
            if (responseData.statusCode === 200) {
              setTatoueur(responseData?.data);
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

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
    if (storageData) {
      handleAllData();
    }
  }, [id]);

  const handleAddFavourite = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/user/like/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.data?.token}`,
        },
      });
      const responseData = await response.json();
      if (responseData.statusCode === 200) {
        window.alert(responseData?.message);
      } else {
        throw new Error(`Une erreur est survenue : ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'avis:", error);
      window.alert("Erreur lors de l'enregistrement de l'avis.");
    } finally {
      // Réinitialise le formulaire d'avis indépendamment du résultat de la requête
      setShowReviewInput(false);
      setReviewText("");
    }
  };

  if (!tatoueur) {
    // Gérer l'affichage pendant le chargement ou si le tatoueur n'est pas trouvé
    return <div>Chargement des détails du tatoueur...</div>;
  }

  const handleSaveReview = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.data?.token}`,
        },
        body: JSON.stringify({ id: id, comment: reviewText }),
      });

      if (response.status === 200) {
        handleAllData();
      } else {
        throw new Error(`Une erreur est survenue : ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'avis:", error);
      window.alert("Erreur lors de l'enregistrement de l'avis.");
    } finally {
      // Réinitialise le formulaire d'avis indépendamment du résultat de la requête
      setShowReviewInput(false);
      setReviewText("");
    }
  };

  return (
    <div className="flex-fill container p-20">
      <h1 className="my-30">Profil du Salon {tatoueur.name} </h1>
      <div className={`d-flex flex-column card p-20 ${styles2.contentCard} `}>
        <p>Nom : {tatoueur.name} </p>
        <p>Addresse : {tatoueur.description} </p>
        <p>Identifiant : {id} </p>
        <p>
          Site web :{" "}
          <a href={tatoueur.website} target="_blank">
            {tatoueur.website}
          </a>{" "}
        </p>
        <button
          onClick={() => handleAddFavourite(tatoueur?._id)}
          className="btn btn-primary d-flex  p-10 mb-20"
        >
          Ajouter en favoris
        </button>
        <h3 className="my-30">Avis : </h3>
        {showReviewInput ? (
          <>
            <textarea
              className="mb-20 textarea-avis"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Laissez votre avis ici..."
            />
            <button
              className="btn btn-primary d-flex   p-10 mb-20"
              onClick={handleSaveReview}
              disabled={reviewText.length < 1}
            >
              Enregistrer l'avis
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowReviewInput(true)}
            className="btn btn-primary d-flex  p-10 mb-20"
          >
            Laisser un avis
          </button>
        )}
        <div className={`d-flex flex-column card p-20 ${styles2.contentCard} `}>
          {tatoueur.comments && tatoueur.comments.length > 0 ? (
            tatoueur.comments.map((avis, index) => {
              console.log("avis", avis);
              return (
                <p
                  className={`d-flex flex-column card p-20 ${styles2.contentCard} `}
                  key={index}
                >
                  Avis de {avis.userName ? avis.userName : "------- "}{" "}
                  {index + 1}: {avis.comment}
                </p>
              );
            })
          ) : (
            <p>Aucun avis pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TatoueurProfil;
