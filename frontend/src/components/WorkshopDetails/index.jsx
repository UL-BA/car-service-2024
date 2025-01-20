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
  const { data: workshops = [] } = useGetWorkshopsQuery();
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  const workshop = workshops.find((w) => w._id === id);

  useEffect(() => {
    if (workshop) {
      const fetchCoordinates = async () => {
        try {
          const response = await axios.get(GEOCODING_API_URL, {
            params: { address: workshop.address, region: "PL" },
          });
          const location = response.data.results[0]?.geometry.location;
          setMarkerPosition(location || { lat: 51.759, lng: 19.457 });
        } catch {
          setMarkerPosition({ lat: 51.759, lng: 19.457 });
        }
      };
      fetchCoordinates();
    }
  }, [workshop]);

  if (!workshop) return <p>Workshop not found.</p>;

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
          center={markerPosition}
          zoom={15}
        >
          <AdvancedMarker position={markerPosition} />
        </GoogleMap>
      </div>
    </div>
  );
};

export default WorkshopDetails;
