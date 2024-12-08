import React, { useState, useEffect } from "react";
import styles from "./servicesSection.module.scss";

const ServicesSection = () => {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    const fetchWorkshops = async () => {
      try {
        const response = await fetch("https://car-service-ruby.vercel.app/api/workshop");
        if (!response.ok) {
          throw new Error("Failed to fetch workshops");
        }
        const data = await response.json();
        setWorkshops(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredWorkshops = workshops.filter((workshop) => {
    const nameMatch = workshop.name.toLowerCase().includes(searchQuery);
    const addressMatch = workshop.address.toLowerCase().includes(searchQuery);
    const servicesMatch = workshop.services.some((service) =>
      service.toLowerCase().includes(searchQuery)
    );

    return nameMatch || addressMatch || servicesMatch;
  });

  const openPopup = (workshop) => setSelectedWorkshop(workshop);
  const closePopup = () => setSelectedWorkshop(null);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (loading) return <p>Loading workshops...</p>;
  if (error) return <p>Error: {error}</p>;

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
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map((workshop) => (
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
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No workshops found.</p>
        )}
      </div>

      {selectedWorkshop && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <button className={styles.closeBtn} onClick={closePopup}>
              X
            </button>
            <h3>{selectedWorkshop.name}</h3>
            <div className={styles.popupImage}>
              <img
                src={`/src/assets/${selectedWorkshop.id}.png`}
                alt={selectedWorkshop.name}
                className={styles.popupImageContent}
              />
            </div>
            <p>
              <strong>Phone:</strong> {selectedWorkshop.phone}
            </p>
            <div className={styles.popupInfo}>
              <p>
                <strong>Accepted Car Brands:</strong>{" "}
                {selectedWorkshop.acceptedBrands?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Services Provided:</strong>
              </p>
              <div className={styles.truncate}>
                {selectedWorkshop.services.slice(0, 3).join(", ")}
              </div>
              {selectedWorkshop.services.length > 3 && !isExpanded && (
                <span className={styles.showMore} onClick={toggleExpand}>
                  ... See More
                </span>
              )}
              {isExpanded && (
                <div className={styles.fullText}>
                  {selectedWorkshop.services.join(", ")}
                </div>
              )}
            </div>
            <p>
              <strong>Payment Methods:</strong>{" "}
              {selectedWorkshop.paymentMethods?.join(", ") || "N/A"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
