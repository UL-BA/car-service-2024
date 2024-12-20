import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ProfilePage.module.scss";
import { auth } from "../../firebase/firebase.config";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from "../../redux/features/favoritesSlice";
import FavoriteCard from "./components/FavoriteCard";

const ProfilePage = () => {
  const [nickname, setNickname] = useState("User");
  const [image, setImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { t } = useTranslation();

  const { data: favorites = [], refetch: refetchFavorites } =
    useGetFavoritesQuery(user?.uid);
  const [removeFavorite] = useRemoveFavoriteMutation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setNickname(user.displayName || "User");

        try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${user.email}`
          );

          if (response.data.profilePhoto) {
            setPhotoUrl(response.data.profilePhoto);
          } else {
            console.log("No profile photo found in database.");
            setPhotoUrl("");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemoveFavorite = async (itemId) => {
    try {
      await removeFavorite({ userId: user.uid, itemId }).unwrap();
      refetchFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("profilePhoto", file);
    formData.append("email", user?.email);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful:", response.data);
      setPhotoUrl(response.data.photoUrl);
    } catch (error) {
      console.error(
        "Upload failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleNicknameChange = async () => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: nickname,
        });
        console.log("Nickname updated successfully in Firebase Authentication");
      } catch (error) {
        console.error("Error updating nickname:", error);
      }
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
            {photoUrl || user?.photoURL ? (
              <img src={photoUrl || user.photoURL} className={styles.avatar} />
            ) : (
              <FaUser className={styles.defaultAvatar} />
            )}
            <input
              type="file"
              id="fileInput"
              onChange={handlePhotoChange}
              className={styles.fileInput}
              accept="image/*"
              style={{ display: "none" }}
            />
            <button
              className={styles.changePhotoBtn}
              onClick={triggerFileInput}
            >
              Change Photo
            </button>
          </div>
          <div className={styles.userInfo}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onBlur={handleNicknameChange}
              className={styles.nicknameInput}
              placeholder="Enter your nickname"
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
