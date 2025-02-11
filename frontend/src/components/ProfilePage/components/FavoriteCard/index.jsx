import React from "react";
import styles from "./FavoriteCard.module.scss";

const FavoriteCard = ({ favorite, onRemoveFavorite }) => {
  if (!favorite || !favorite.itemId) {
    return <div className={styles.favoriteCard}>Invalid Favorite Item</div>;
  }

  const { name, address, phone, id } = favorite.itemId;

  return (
    <div className={styles.favoriteCard}>
      <img src={`/src/assets/${id}.png`} alt={name || "Workshop"} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{name || "No Name"}</h4>
        <p className={styles.cardAddress}>{address || "No Address"}</p>
        {phone && (
          <p className={styles.cardPhone}>
            <strong>Phone:</strong> {phone}
          </p>
        )}
        <button
          className={styles.removeButton}
          onClick={() => onRemoveFavorite(favorite.itemId)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default FavoriteCard;
