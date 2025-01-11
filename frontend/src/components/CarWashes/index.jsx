import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CarWashes.module.scss";
import wash from "./wash.mp4";
const CarWashes = () => {
  const [carWashes, setCarWashes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCarWashes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/carwashes?page=${page}`);
        setCarWashes(response.data);
      } catch (error) {
        console.error("Error fetching car washes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarWashes();
  }, [page]);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <section className={styles.carwashGallery}>
      {/* Hero Section with Video */}
      <div className={styles.heroSection}>
        <video
          autoPlay
          loop
          muted
          className={styles.backgroundVideo}
          src={wash}
        >
          Car Washes in Łódź
        </video>
        <div className={styles.heroOverlay}>
          <h1>Premium Car Washes in Łódź</h1>
          <p>Discover the finest automotive care services</p>
          <button 
            onClick={() => document.querySelector(`.${styles.container}`).scrollIntoView({ behavior: 'smooth' })}
            className={styles.scrollButton}
          >
            Explore Locations
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loader}>
            <div className={styles.spinnerWrap}>
              <div className={styles.spinner}></div>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {carWashes.map((carWash, index) => (
                <div key={index} className={styles.card}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <h2>{carWash.name}</h2>
                      <div className={styles.rating}>
                        <span className={styles.ratingNumber}>{carWash.rating}</span>
                        <div className={styles.reviewCount}>
                          {carWash.reviews} reviews
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.location}>
                        <p>{carWash.address}</p>
                        <p>{carWash.locality}, {carWash.postalCode}</p>
                      </div>
                      <div className={styles.contact}>
                        <p>{carWash.phone}</p>
                      </div>
                    </div>
                    <a 
                      href={carWash.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.visitButton}
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.pagination}>
              <button 
                onClick={prevPage} 
                disabled={page === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.pageNumber}>Page {page}</span>
              <button 
                onClick={nextPage}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CarWashes;