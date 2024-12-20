import React, { useEffect, useState } from "react";
import styles from "./ProfilePage.module.scss";
import { auth } from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useGetFavoritesQuery, useRemoveFavoriteMutation } from "../../redux/features/favoritesSlice";
import FavoriteCard from "./components/FavoriteCard";

const ProfilePage = () => {
  const [nickname, setNickname] = useState("User");
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { t } = useTranslation();

  const { data: favorites = [], refetch: refetchFavorites } = useGetFavoritesQuery(user?.uid);
  const [removeFavorite] = useRemoveFavoriteMutation();

  useEffect(() => {
    if (user?.displayName) {
      setNickname(user.displayName);
    }
  }, [user]);

  const handleRemoveFavorite = async (itemId) => {
    try {
      await removeFavorite({ userId: user.uid, itemId }).unwrap();
      refetchFavorites(); // Refetch favorites to update UI
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className={styles.avatar} />
            ) : (
              <FaUser className={styles.defaultAvatar} />
            )}
          </div>
          <div className={styles.userInfo}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={styles.nicknameInput}
            />
            <p className={styles.email}>{user?.email}</p>
          </div>
        </div>
        <div className={styles.favoritesSection}>
          <h3>Favorited Workshops</h3>
          <div className={styles.favoritesList}>
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <FavoriteCard
                  key={favorite._id}
                  favorite={favorite}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              ))
            ) : (
              <p className={styles.noFavorites}>No favorites yet!</p>
            )}
          </div>
        </div>
        <div className={styles.btn}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
