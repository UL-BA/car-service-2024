import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap } from "@react-google-maps/api";
import axios from "axios";
import { useGetWorkshopsQuery } from "../../redux/features/workshopApi";
import AdvancedMarker from "./marker";
import styles from "./workshopDetails.module.scss";
import config from "../../config";

const GEOCODING_API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_MAPS_API_KEY}`;

const WorkshopDetails = () => {
  const { id } = useParams();
  const { data: workshops = [], isLoading } = useGetWorkshopsQuery();
  const [markerPosition, setMarkerPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  const workshop = workshops.find((w) => w._id === id);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User location:", { lat: latitude, lng: longitude });
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching user location:", error);
          setUserLocation(null);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      console.log("Workshops are still loading...");
      return;
    }
    if (!workshop) {
      console.log(`Workshop with ID ${id} not found.`);
      return;
    }

    console.log("Fetching coordinates for workshop address:", workshop.address);

    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(GEOCODING_API_URL, {
          params: { address: workshop.address, region: "PL" },
        });
        console.log("Geocoding API response:", response.data);
        const location = response.data.results[0]?.geometry.location;
        if (location) {
          console.log("Coordinates found:", location);
          setMarkerPosition(location);
        } else {
          console.warn("No valid location found. Using fallback coordinates.");
          setMarkerPosition({ lat: 51.759, lng: 19.457 });
        }
      } catch (error) {
        console.error("Error fetching geocoding data:", error);
        setMarkerPosition({ lat: 51.759, lng: 19.457 });
      }
    };

    fetchCoordinates();
  }, [workshop, id, isLoading]);

  useEffect(() => {
    if (userLocation && markerPosition) {
      const R = 6371;
      const toRad = (deg) => (deg * Math.PI) / 180;

      const lat1 = userLocation.lat;
      const lon1 = userLocation.lng;
      const lat2 = markerPosition.lat;
      const lon2 = markerPosition.lng;

      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      setDistance(distance.toFixed(2));
    }
  }, [userLocation, markerPosition]);

  if (isLoading) return <p>Loading workshops...</p>;
  if (!workshop) return <p>Workshop not found.</p>;

  console.log("Rendering workshop details for:", workshop);

  return (
    <div className={styles.detailsContainer}>
      <header className={styles.header}>
        <h1 className={styles.workshopName}>{workshop.name}</h1>
        {distance && (
          <p className={styles.distance}>
            <strong>Distance:</strong> {distance} km
          </p>
        )}
      </header>

      <div className={styles.contact}>
          <h2>Contact:</h2>
          <span>{workshop.phone || "Not available"}</span>
        </div>
  
      <section className={styles.infoSection}>
        <div className={styles.infoItem}>
          <h2>Accepted Brands</h2>
          <p>{workshop.acceptedBrands?.join(", ") || "Not specified"}</p>
        </div>
        <div className={styles.infoItem}>
          <h2>Services</h2>
          <p>{workshop.services?.join(", ") || "Not specified"}</p>
        </div>
      </section>
  
      <section className={styles.mapSection}>
        <h2>Workshop Location</h2>
        <div className={styles.mapContainer}>
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "400px",
            }}
            center={markerPosition || { lat: 51.759, lng: 19.457 }}
            zoom={15}
            onLoad={(mapInstance) => {
              setMap(mapInstance);
            }}
          >
            {markerPosition && <AdvancedMarker map={map} position={markerPosition} />}
          </GoogleMap>
        </div>
      </section>
    </div>
  );
};

export default WorkshopDetails;
