import { useState, useEffect, useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import axios from "axios";
import styles from "./servicesSection.module.scss";
import { useGetWorkshopsQuery } from "../../redux/features/workshopApi";
import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from "../../redux/features/favoritesSlice";
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import config from "../../config";
const GEOCODING_API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_MAPS_API_KEY}`;
import favs from "../../assets/favs.png";
import unfavs from "../../assets/unfavs.png";

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

const ServicesSection = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [smallMapInstance, setSmallMapInstance] = useState(null);
  const [fullScreenMapInstance, setFullScreenMapInstance] = useState(null);
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false);
  const [pendingFavorites, setPendingFavorites] = useState(new Set());

  const { user } = useAuth();
  const { data: workshops = [], isLoading: workshopsLoading } = useGetWorkshopsQuery();
  const { data: favorites = [] } = useGetFavoritesQuery(user?.uid);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const toggleFavorite = async (workshop) => {
    if (!user) {
      toast.error("Please log in to favorite workshops");
      return;
    }
  
    console.log('Attempting to toggle favorite with:', {
      userId: user.uid,
      itemId: workshop._id,
      workshop
 
    });
  
    setPendingFavorites(prev => new Set([...prev, workshop._id]));
  
    try {
      const isFavorited = favorites.some(fav => fav.itemId === workshop._id);
      
      if (isFavorited) {
        const result = await removeFavorite({
          userId: user.uid,
          itemId: workshop._id.toString() // Ensure it's a string
        }).unwrap();
        console.log('Remove result:', result);
        toast.success("Removed from favorites");
      } else {
        const result = await addFavorite({
          userId: user.uid,
          itemId: workshop._id.toString() // Ensure it's a string
        }).unwrap();
        console.log('Add result:', result);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Failed to update favorites");
    } finally {
      setPendingFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(workshop._id);
        return newSet;
      });
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  useEffect(() => {
    if (selectedWorkshop) {
      const fetchCoordinates = async () => {
        try {
          const response = await axios.get(GEOCODING_API_URL, {
            params: {
              address: selectedWorkshop.address,
              region: "PL",
              components: "country:PL",
            },
          });

          if (
            response.data.status === "OK" &&
            response.data.results.length > 0
          ) {
            const location = response.data.results[0].geometry.location;
            setMarkerPosition({ lat: location.lat, lng: location.lng });
          } else {
            setMarkerPosition({ lat: 51.759, lng: 19.457 });
          }
        } catch (error) {
          setMarkerPosition({ lat: 51.759, lng: 19.457 });
        }
      };

      fetchCoordinates();
    }
  }, [selectedWorkshop]);

  const openPopup = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsFullScreenMapOpen(false);
  };

  const closePopup = () => {
    setSelectedWorkshop(null);
    setIsFullScreenMapOpen(false);
  };

  const openFullScreenMap = () => setIsFullScreenMapOpen(true);
  const filteredWorkshops = workshops.filter((workshop) => {
    const nameMatch = workshop.name?.toLowerCase().includes(searchQuery);
    const addressMatch = workshop.address?.toLowerCase().includes(searchQuery);
    const servicesMatch = workshop.services?.some((service) =>
      service?.toLowerCase().includes(searchQuery)
    );

    return nameMatch || addressMatch || servicesMatch;
  });
  const closeFullScreenMap = () => {
    setIsFullScreenMapOpen(false);
    if (smallMapInstance) {
      smallMapInstance.panTo(markerPosition);
    }
  };

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
              className={`${styles.favoriteBtn} ${pendingFavorites.has(workshop._id) ? styles.loading : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!pendingFavorites.has(workshop._id)) {
                  toggleFavorite(workshop);
                }
              }}
              disabled={pendingFavorites.has(workshop._id)}
            >
              {favorites.some(fav => fav.itemId === workshop._id) ? (
                <img src={favs} alt="Favorite" className={styles.heartIcon} />
              ) : (
                <img src={unfavs} alt="Not Favorite" className={styles.heartIcon} />
              )}
            </button>
          </div>
        ))}
      </div>

      {selectedWorkshop && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button className={styles.closeBtn} onClick={closePopup}>X</button>
            <h3>{selectedWorkshop.name}</h3>
            <p><strong>Phone:</strong> {selectedWorkshop.phone}</p>
            <p><strong>Accepted Brands:</strong> {selectedWorkshop.acceptedBrands.join(", ") || "N/A"}</p>
            <p><strong>Services:</strong> {selectedWorkshop.services.join(", ") || "N/A"}</p>
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
              <AdvancedMarker
                map={smallMapInstance}
                position={markerPosition}
              />
            </GoogleMap>
            <button className={styles.fullScreenButton} onClick={openFullScreenMap}>
              Open Full Screen
            </button>
          </div>
        </div>
      )}

      {isFullScreenMapOpen && selectedWorkshop && (
        <div className={styles.fullScreenMapOverlay}>
          <div className={styles.fullScreenMapContainer}>
            <button className={styles.closeBtn} onClick={closeFullScreenMap}>X</button>
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