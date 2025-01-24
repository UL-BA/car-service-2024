import React, { useState } from "react";
import styles from "./footer.module.scss";

export default function Footer() {
  const [sortOrder, setSortOrder] = useState("date"); // Sorting options: "date" or "rating"

  // Base reviews (provided and generated)
  const reviews = [
    {
      date: "2025-01-22",
      user: "Paweł",
      workshop: { name: "DAWO Serwis Samochodowy Przemysław Dziedzic", link: "/dawo" },
      vehicle: "Mitsubishi",
      review: "Years long customer of this company. You never know the price range but they sure know something about cars.",
      rating: 5,
    },
    {
      date: "2024-12-14",
      user: "Piotr",
      workshop: { name: "Radical Garage", link: "/radical-garage" },
      vehicle: "Mitsubishi",
      review: "All issues detected and repaired quickly... Highly recommend this service.",
      rating: 5,
    },
    {
      date: "2024-12-09",
      user: "Rafał",
      workshop: { name: "Radical Garage", link: "/radical-garage" },
      vehicle: "Opel Vectra C GTS",
      review:
        "I’ve been a customer for years—always professional, focusing on what needs to be done. Highly recommend!",
      rating: 5,
    },
    {
      date: "2023-06-20",
      user: "Ola",
      workshop: { name: "Radical Garage", link: "/radical-garage" },
      vehicle: "Toyota Yaris 998 2007",
      review:
        "Quick and solid air conditioning repair with excellent customer care. Highly recommend this workshop.",
      rating: 5,
    },
    {
      date: "2023-05-14",
      user: "Iwona",
      workshop: { name: "Radical Garage", link: "/radical-garage" },
      vehicle: "Fiat Punto Evo 2011",
      review:
        "Oil and filters replaced. Highly recommend this place for their professionalism and attention to detail.",
      rating: 5,
    },
    // 30 generated reviews
    ...[
      {
        user: "Iwona",
        workshop: { name: "NAPRAWIAMY-AUTA Przemysław Firaza", link: "/naprawiamy-auta" },
        vehicle: "Fiat Punto",
        review: "Average service! Highly recommend.",
        date: "2024-11-23",
        rating: 5,
      },
      {
        user: "Trexon",
        workshop: { name: "HABENDA S.C.", link: "/habenda" },
        vehicle: "Mitsubishi Lancer",
        review: "Good service! Very professional.",
        date: "2024-04-19",
        rating: 1,
      },
      {
        user: "Krzysztof",
        workshop: { name: "Zamiennik Q Service Castrol", link: "/zamiennik-q-service" },
        vehicle: "Toyota Yaris",
        review: "Excellent service! Very professional.",
        date: "2024-02-06",
        rating: 3,
      },
      // Add the rest of the 30 reviews here
    ],
  ];

  // Sort reviews by selected criteria
  const sortedReviews =
    sortOrder === "rating"
      ? [...reviews].sort((a, b) => b.rating - a.rating)
      : [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Workshop Reviews</h2>
        <div className={styles.sortOptions}>
          <button
            className={sortOrder === "date" ? styles.active : ""}
            onClick={() => setSortOrder("date")}
          >
            Sort by Date
          </button>
          <button
            className={sortOrder === "rating" ? styles.active : ""}
            onClick={() => setSortOrder("rating")}
          >
            Sort by Rating
          </button>
        </div>
        <div className={styles.reviews}>
          {sortedReviews.map((review, index) => (
            <div key={index} className={styles.review}>
              <p>
                <strong>{review.user}</strong> | {review.date}
              </p>
              <p>
                <a href={review.workshop.link} className={styles.workshopLink}>
                  {review.workshop.name}
                </a>{" "}
                | Vehicle: {review.vehicle}
              </p>
              <p>{review.review}</p>
              <p>
                Rating: {"⭐".repeat(review.rating)}
              </p>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <p>&copy; 2024 Road Ready. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
