import { useState, useEffect, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./servicesSection.module.scss";
import { useGetWorkshopsQuery } from "../../redux/features/workshopApi";
import {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../redux/features/favoritesSlice";
import config from "../../config";

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
          url: "/src/assets/custom-marker.png",
          scaledSize: new google.maps.Size(40, 40),
        },
      });
    } else {
      markerRef.current.setPosition(position);
      markerRef.current.setMap(map);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, position]);

  return null;
};

const ServicesSection = ({ userId }) => {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [smallMapInstance, setSmallMapInstance] = useState(null);
  const [fullScreenMapInstance, setFullScreenMapInstance] = useState(null);
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false);

  // Fetch workshops and user favorites
  const { data: workshops = [], isLoading: workshopsLoading, error: workshopsError } =
    useGetWorkshopsQuery();
  const { data: favorites = [] } = useGetFavoritesQuery(userId);

  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  useEffect(() => {
    if (selectedWorkshop) {
      const fetchCoordinates = async () => {
        try {
          const response = await fetch(
            `${GEOCODING_API_URL}&address=${selectedWorkshop.address}`
          );

          const data = await response.json();
          if (data.status === "OK" && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            setMarkerPosition({ lat: location.lat, lng: location.lng });
          } else {
            console.error("Geocoding failed or returned ambiguous results.");
            setMarkerPosition({ lat: 51.759, lng: 19.457 }); // Default location
          }
        } catch (error) {
          console.error("Error fetching geocoding data:", error);
          setMarkerPosition({ lat: 51.759, lng: 19.457 }); // Default location
        }
      };

      fetchCoordinates();
    }
  }, [selectedWorkshop]);

  const toggleFavorite = async (workshopId) => {
    if (favorites.some((fav) => fav.itemId === workshopId)) {
      // Remove from favorites
      await removeFavorite({ userId, itemId: workshopId });
    } else {
      // Add to favorites
      await addFavorite({ userId, itemId: workshopId });
    }
  };

  const openPopup = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsFullScreenMapOpen(false);
  };

  const closePopup = () => {
    setSelectedWorkshop(null);
    setIsFullScreenMapOpen(false);
  };

  const openFullScreenMap = () => {
    setIsFullScreenMapOpen(true);
  };

  const closeFullScreenMap = () => {
    setIsFullScreenMapOpen(false);
    if (smallMapInstance) {
      smallMapInstance.panTo(markerPosition);
    }
  };

  return (
    <section id="workshops" className={styles.workshopGallery}>
      <div className={styles.workshopGrid}>
        {workshops.map((workshop) => (
          <div
            key={workshop.id}
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
              className={styles.favoriteBtn}
              onClick={(e) => {
                e.stopPropagation(); // Prevents opening the popup
                toggleFavorite(workshop.id);
              }}
            >
              {favorites.some((fav) => fav.itemId === workshop.id) ? (
                <FaHeart className={styles.heartIcon} />
              ) : (
                <FaRegHeart className={styles.heartIcon} />
              )}
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
              <strong>Accepted Brands:</strong>{" "}
              {selectedWorkshop.acceptedBrands.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Services:</strong>{" "}
              {selectedWorkshop.services.join(", ") || "N/A"}
            </p>
            <GoogleMap
              mapContainerStyle={{
                width: "90%",
                height: "250px",
                margin: "0 auto",
              }}
              center={markerPosition}
              zoom={15}
              onLoad={(map) => setSmallMapInstance(map)}
            >
              <AdvancedMarker map={smallMapInstance} position={markerPosition} />
            </GoogleMap>
            <button
              className={styles.fullScreenButton}
              onClick={openFullScreenMap}
            >
              Open Full Screen
            </button>
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
    </section>
  );
};

export default ServicesSection;
