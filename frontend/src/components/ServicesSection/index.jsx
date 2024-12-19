import { useState, useEffect, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import axios from "axios";
import styles from "./servicesSection.module.scss";
import { useGetWorkshopsQuery } from "../../redux/features/workshopApi";
import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from "../../redux/features/favoritesSlice";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import config from "../../config";
import favs from "../../assets/favs.png";
import unfavs from "../../assets/unfavs.png";

const GEOCODING_API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_MAPS_API_KEY}`;

const AdvancedMarker = ({ map, position }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !position) return;

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        position,
        map,
        icon: {
          url: "/src/assets/custom-marker.png", // Update the URL to the correct marker image path
          scaledSize: new google.maps.Size(40, 40),
        },
      });
    } else {
      markerRef.current.setPosition(position);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [map, position]);

  return null;
};

const ServicesSection = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [smallMapInstance, setSmallMapInstance] = useState(null);
  const [fullScreenMapInstance, setFullScreenMapInstance] = useState(null);
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false);
  const [pendingFavorites, setPendingFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();
  const { data: workshops = [], isLoading: workshopsLoading } = useGetWorkshopsQuery();
  const { data: favorites = [] } = useGetFavoritesQuery(user?.uid);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleSearchChange = (event) => setSearchQuery(event.target.value.toLowerCase());

  const toggleFavorite = async (workshop) => {
    if (!user) {
      toast.error("Please log in to favorite workshops");
      return;
    }

    if (pendingFavorites.has(workshop._id)) return;

    setPendingFavorites((prev) => new Set([...prev, workshop._id]));

    try {
      const isFavorited = favorites.some((fav) => fav.itemId === workshop._id);

      if (isFavorited) {
        await removeFavorite({ userId: user.uid, itemId: workshop._id.toString() }).unwrap();
        toast.success("Removed from favorites");
      } else {
        await addFavorite({ userId: user.uid, itemId: workshop._id.toString() }).unwrap();
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
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

  const openPopup = (workshop) => setSelectedWorkshop(workshop);
  const closePopup = () => setSelectedWorkshop(null);
  const openFullScreenMap = () => setIsFullScreenMapOpen(true);
  const closeFullScreenMap = () => setIsFullScreenMapOpen(false);

  const filteredWorkshops = workshops.filter(
    (workshop) =>
      workshop.name.toLowerCase().includes(searchQuery) ||
      workshop.address.toLowerCase().includes(searchQuery) ||
      workshop.services.some((service) => service.toLowerCase().includes(searchQuery))
  );

  if (workshopsLoading) {
    return <div className={styles.loading}>Loading workshops...</div>;
  }

  return (
    <section id="workshops" className={styles.workshopGallery}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by workshop name, location, or services..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.workshopGrid}>
        {filteredWorkshops.map((workshop) => (
          <div key={workshop._id} className={styles.workshopItem} onClick={() => openPopup(workshop)}>
            <img src={`/src/assets/${workshop.id}.png`} alt={workshop.name} className={styles.workshopImage} />
            <h4>{workshop.name}</h4>
            <p>{workshop.address}</p>
            <button
              className={`${styles.favoriteBtn} ${pendingFavorites.has(workshop._id) ? styles.loading : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(workshop);
              }}
              disabled={pendingFavorites.has(workshop._id)}
            >
              <img
                src={favorites.some((fav) => fav.itemId === workshop._id) ? favs : unfavs}
                alt="Favorite"
                className={styles.heartIcon}
              />
            </button>
          </div>
        ))}
      </div>

      {selectedWorkshop && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button className={styles.closeBtn} onClick={closePopup}>
              X
            </button>
            <h3>{selectedWorkshop.name}</h3>
            <p>
              <strong>Phone:</strong> {selectedWorkshop.phone}
            </p>
            <p>
              <strong>Accepted Brands:</strong> {selectedWorkshop.acceptedBrands.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Services:</strong> {selectedWorkshop.services.join(", ") || "N/A"}
            </p>
            <GoogleMap
              mapContainerStyle={{ width: "90%", height: "250px", margin: "0 auto" }}
              center={markerPosition}
              zoom={15}
              onLoad={(map) => setSmallMapInstance(map)}
            >
              <AdvancedMarker map={smallMapInstance} position={markerPosition} />
            </GoogleMap>
            <button className={styles.fullScreenButton} onClick={openFullScreenMap}>
              Open Full Screen
            </button>
          </div>
        </div>
      )}

      {isFullScreenMapOpen && (
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
              <AdvancedMarker map={fullScreenMapInstance} position={markerPosition} />
            </GoogleMap>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
