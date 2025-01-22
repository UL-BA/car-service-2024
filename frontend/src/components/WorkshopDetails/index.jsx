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
  const workshop = workshops.find((w) => w._id === id);

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

  if (isLoading) return <p>Loading workshops...</p>;
  if (!workshop) return <p>Workshop not found.</p>;

  console.log("Rendering workshop details for:", workshop);

  return (
    <div className={styles.detailsContainer}>
      <h3 className={styles.workshopName}>{workshop.name}</h3>
      <p className={styles.workshopDetails}>
        <strong>Phone:</strong> {workshop.phone || "N/A"}
      </p>
      <p className={styles.workshopDetails}>
        <strong>Accepted Brands:</strong>{" "}
        {workshop.acceptedBrands?.join(", ") || "N/A"}
      </p>
      <p className={styles.workshopDetails}>
        <strong>Services:</strong> {workshop.services?.join(", ") || "N/A"}
      </p>
      <div className={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "300px",
          }}
          center={markerPosition || { lat: 51.759, lng: 19.457 }}
          zoom={15}
          onLoad={(mapInstance) => {
            console.log("Map loaded:", mapInstance);
            setMap(mapInstance);
          }}
        >
          {markerPosition && <AdvancedMarker map={map} position={markerPosition} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default WorkshopDetails;
