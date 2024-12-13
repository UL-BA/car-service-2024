import { useState, useEffect } from "react";
import styles from "./ProfilePage.module.scss";
import { auth } from "../../firebase/firebase.config";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const [nickname, setNickname] = useState("User");
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { t } = useTranslation();
  
  useEffect(() => {
    // Fetch the nickname from Firebase when the component mounts
    if (user?.displayName) {
      setNickname(user.displayName);
    }
  }, [user]);

  const handleNicknameChange = async (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);

    if (user) {
      try {
        await updateProfile(user, {
          displayName: newNickname,
        });
        console.log("Nickname updated successfully");
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
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className={styles.avatar}
              />
            ) : (
              <FaUser className={styles.defaultAvatar} />
            )}
            <button className={styles.changePhotoBtn}>Change Photo</button>
          </div>
          <div className={styles.userInfo}>
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              className={styles.nicknameInput}
            />
            <p className={styles.email}>{user?.email}</p>
          </div>
        </div>

        <div className={styles.favoritesSection}>
          <h3>Favorited Workshops</h3>
          <div className={styles.favoritesList}>
            <p className={styles.noFavorites}>
              No favorited workshops yet. Start exploring!
            </p>
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
