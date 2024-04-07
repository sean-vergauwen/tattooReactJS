import styles from './Tatoueurs.module.css'
import { useState } from 'react';

function Recipe ({name, photoDeProfil,address}) { 
    const [liked, setLiked ]= useState(false);
    function handleClick(){
        setLiked(!liked)
    }
    return (
        <div onClick={handleClick} className={styles.tatoueur} >
            <div className={styles.imageContainer} >
                <img src={photoDeProfil} alt='reciipe'/> 
            </div>
            <div className= {`${styles.infos} d-flex flex-column justify-content-center allign-items-center `} >
                <h3 className='mb-10'>{name}</h3>
                <p className='mb-10'>{address}</p>
                <i className={`fa-solid fa-heart ${liked ? 'text-primary' : ""} `}></i>
            </div>

        </div>

    );
}

export default Recipe;