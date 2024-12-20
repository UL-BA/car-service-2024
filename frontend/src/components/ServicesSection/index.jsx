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

const ServicesSection = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const [smallMapInstance, setSmallMapInstance] = useState(null);
  const [fullScreenMapInstance, setFullScreenMapInstance] = useState(null);
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();
  const { data: workshops = [], isLoading: workshopsLoading } = useGetWorkshopsQuery();
  const { data: favorites = [], refetch: refetchFavorites } = useGetFavoritesQuery(user?.uid);
  const [addFavorite] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  const handleSearchChange = (event) => setSearchQuery(event.target.value.toLowerCase());

  const toggleFavorite = async (workshop) => {
    if (!user) {
      toast.error("Please log in to favorite workshops");
      return;
    }

    try {
      const isFavorited = favorites.some((fav) => fav.itemId === workshop._id);

      if (isFavorited) {
        await removeFavorite({ userId: user.uid, itemId: workshop._id.toString() }).unwrap();
        toast.success("Removed from favorites");
      } else {
        await addFavorite({ userId: user.uid, itemId: workshop._id.toString() }).unwrap();
        toast.success("Added to favorites");
      }

      // Refetch favorites to ensure UI updates correctly
      refetchFavorites();
    } catch (error) {
      toast.error("Failed to update favorites");
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
          <div key={workshop._id} className={styles.workshopItem}>
            <img src={`/src/assets/${workshop.id}.png`} alt={workshop.name} className={styles.workshopImage} />
            <h4>{workshop.name}</h4>
            <p>{workshop.address}</p>
            <button
              className={`${styles.favoriteBtn}`}
              onClick={() => toggleFavorite(workshop)}
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
    </section>
  );
};

export default ServicesSection;
