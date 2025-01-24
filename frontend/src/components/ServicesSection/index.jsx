import { useState, useEffect } from "react";
import { GoogleMap } from "@react-google-maps/api";
import axios from "axios";
import styles from "./servicesSection.module.scss";
import { useGetWorkshopsQuery } from "../../redux/features/workshopApi";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../redux/features/favoritesSlice";
import { useAuth } from "../../contexts/AuthContext";
import config from "../../config";
import favs from "../../assets/favs.png";
import fix from "./fix.mp4";
import unfavs from "../../assets/unfavs.png";
import Notification from "./message/index";
import AdvancedMarker from "./marker";
import { useTranslation } from "react-i18next";

const GEOCODING_API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_MAPS_API_KEY}`;

const ServicesSection = () => {
  const [pendingFavorites, setPendingFavorites] = useState(new Set());
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [smallMapInstance, setSmallMapInstance] = useState(null);
  const [fullScreenMapInstance, setFullScreenMapInstance] = useState(null);
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();
  const { data: workshops = [], isLoading: workshopsLoading } =
    useGetWorkshopsQuery();
  const { data: favorites = [], refetch: refetchFavorites } =
    useGetFavoritesQuery(user?.uid);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const { t } = useTranslation();

  const handleSearchChange = (event) =>
    setSearchQuery(event.target.value.toLowerCase());

  const toggleFavorite = async (workshop) => {
    if (!user) {
      setNotificationMessage("Please log in to favorite workshops");
      return;
    }

    setPendingFavorites((prev) => new Set([...prev, workshop._id]));

    try {
      const isFavorited = favorites.some((fav) => fav.itemId === workshop._id);

      if (isFavorited) {
        await removeFavorite({
          userId: user.uid,
          itemId: workshop._id.toString(),
        }).unwrap();
        setNotificationMessage("Removed from favorites");
      } else {
        const result = await addFavorite({
          userId: user.uid,
          itemId: workshop._id.toString(),
        }).unwrap();

        if (result.message === "Item already in favorites") {
          setNotificationMessage("This item is already in your favorites");
        } else {
          setNotificationMessage("Added to favorites");
        }
      }

      refetchFavorites();
    } catch {
      setNotificationMessage("Item already in favorites");
    } finally {
      setPendingFavorites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(workshop._id);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (selectedWorkshop) {
      const fetchCoordinates = async () => {
        try {
          const response = await axios.get(GEOCODING_API_URL, {
            params: { address: selectedWorkshop.address, region: "PL" },
          });
          const location = response.data.results[0]?.geometry.location;
          setMarkerPosition(location || { lat: 51.759, lng: 19.457 });
        } catch {
          setMarkerPosition({ lat: 51.759, lng: 19.457 });
        }
      };
      fetchCoordinates();
    }
  }, [selectedWorkshop]);

  const filteredWorkshops = workshops.filter((workshop) => {
    const nameMatch = workshop.name?.toLowerCase().includes(searchQuery);
    const addressMatch = workshop.address?.toLowerCase().includes(searchQuery);
    const servicesMatch = workshop.services?.some((service) =>
      service?.toLowerCase().includes(searchQuery)
    );

    return nameMatch || addressMatch || servicesMatch;
  });

  if (workshopsLoading) {
    return <div className={styles.loading}>Loading workshops...</div>;
  }

  const openPopup = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsFullScreenMapOpen(false);
  };

  const closePopup = () => {
    setSelectedWorkshop(null);
    setIsFullScreenMapOpen(false);
  };

  const openFullScreenMap = () => setIsFullScreenMapOpen(true);
  const closeFullScreenMap = () => {
    setIsFullScreenMapOpen(false);
    if (smallMapInstance) {
      smallMapInstance.panTo(markerPosition);
    }
  };

  return (
    <section id="workshops" className={styles.workshopGallery}>
<div className={styles.heroSection}>
        <video
          autoPlay
          loop
          muted
          className={styles.backgroundVideo}
          src={fix}
        >
          Car Services in Łódź
        </video>
        <div className={styles.heroOverlay}>
          <h1>Best Rated Workshops in Łódź</h1>
          <p>Discover the finest automotive care services</p>
          <button 
            onClick={() => document.querySelector(`.${styles.container}`).scrollIntoView({ behavior: 'smooth' })}
            className={styles.scrollButton}
          >
            Explore Locations
          </button>
        </div>
      </div>

      <h2 className={styles.title}>{"Enter the name, address of the workshop or the service you're looking for."}</h2>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder={t("workshops.search")}
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.workshopGrid}>
        {filteredWorkshops.map((workshop) => (
          <div
            key={workshop._id}
            className={styles.workshopItem}
            onClick={() => openPopup(workshop)}
          >
            <img
              src={`/src/assets/${workshop.id}.png`}
              alt={workshop.name}
              className={styles.workshopImage}
            />
            <h4>{workshop.name}</h4>
            <p>{workshop.address}</p>
            <button
              className={`${styles.favoriteBtn} ${
                pendingFavorites.has(workshop._id) ? styles.loading : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (!pendingFavorites.has(workshop._id)) {
                  toggleFavorite(workshop);
                }
              }}
              disabled={pendingFavorites.has(workshop._id)}
            >
              {favorites.some((fav) => fav.itemId === workshop._id) ? (
                <img src={favs} alt="Favorite" className={styles.heartIcon} />
              ) : (
                <img
                  src={unfavs}
                  alt="Not Favorite"
                  className={styles.heartIcon}
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {selectedWorkshop && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={closePopup}>
              X
            </button>
            <h3>{selectedWorkshop.name}</h3>
            <p>
              <strong>{t("workshops.phone")}</strong> {selectedWorkshop.phone}
            </p>
            <p>
              <strong>{t("workshops.acceptedBrands")}</strong>{" "}
              {selectedWorkshop.acceptedBrands.join(", ") || "N/A"}
            </p>
            <p>
              <strong>{t("workshops.services")}</strong>{" "}
              {selectedWorkshop.services.join(", ") || "N/A"}
            </p>
            <div className={styles.mapContainer}>
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "250px",
                  // margin: "0 auto",
                }}
                center={markerPosition}
                zoom={15}
                onLoad={(map) => setSmallMapInstance(map)}
              >
                <AdvancedMarker
                  map={smallMapInstance}
                  position={markerPosition}
                />
              </GoogleMap>
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={styles.fullScreenButton}
                onClick={openFullScreenMap}
              >
                {t("workshops.openFullScreen")}
              </button>
            </div>
          </div>
        </div>
      )}

      {isFullScreenMapOpen && selectedWorkshop && (
        <div className={styles.fullScreenMapOverlay}>
          <div className={styles.fullScreenMapContainer}>
            <button className={styles.closeBtn} onClick={closeFullScreenMap}>
              X
            </button>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={markerPosition}
              zoom={15}
              onLoad={(map) => setFullScreenMapInstance(map)}
            >
              <AdvancedMarker
                map={fullScreenMapInstance}
                position={markerPosition}
              />
            </GoogleMap>
          </div>
        </div>
      )}
      {notificationMessage && (
        <Notification
          message={notificationMessage}
          onClose={() => setNotificationMessage("")}
        />
      )}
    </section>
  );
};

export default ServicesSection;
