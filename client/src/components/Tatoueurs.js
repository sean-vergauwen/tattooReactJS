import styles from "./Tatoueurs.module.css";
import { useNavigate } from "react-router-dom";

function Recipe({ id, name, photoDeProfil, address }) {
  let navigate = useNavigate();
  function handleClick() {
    navigate(`/tatoueur/${id}`);
  }
  return (
    <div onClick={handleClick} className={styles.tatoueur}>
      <div className={styles.imageContainer}>
        <img src={photoDeProfil} alt="tatoueurProfil" />
      </div>
      <div
        className={`${styles.infos} d-flex flex-column justify-content-center allign-items-center `}
      >
        <h3 className="mb-10">{name}</h3>
        <p className="mb-10">{address}</p>
      </div>
    </div>
  );
}

export default Recipe;
