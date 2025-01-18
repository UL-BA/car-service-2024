import { useParams } from "react-router-dom";
import styles from "./workshopDetails.module.scss";

const workshops = [
  { _id: "6755be0aed0066918b67bd06", name: "ACS Premium Auto Centrum Serwisowe", details: "Detailed information about ACS Premium." },
  { _id: "67561b12a6855e9b68aeec06", name: "ALFCAR Serwis Mechaniczny Stacja Kontroli Pojazdów", details: "Detailed information about ALFCAR." },
  { _id: "67561b63a6855e9b68aeec08", name: "AutoCentrum Elektronowa 18", details: "Detailed information about AutoCentrum." },
];

const WorkshopDetails = () => {
  const { id } = useParams();
  const workshop = workshops.find((w) => w._id === id);

  if (!workshop) {
    return <p>Workshop not found.</p>;
  }

  return (
    <div className={styles.detailsContainer}>
      <h1>{workshop.name}</h1>
      <p>{workshop.details}</p>
    </div>
  );
};

export default WorkshopDetails;
