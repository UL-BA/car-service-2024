import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./adminPage.module.scss";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GoogleMap } from "@react-google-maps/api";
import config from "../../config";
import { v4 as uuidv4 } from "uuid";

const GEOCODING_API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_MAPS_API_KEY}`;

const AdminPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]); // List of workshops/services
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    pricing: "",
    phone: "",
    id: uuidv4(), // Include a unique ID field
    paymentMethods: [],
    services: [],
    acceptedBrands: [],
  });
  const [editId, setEditId] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });

// Access restriction temporarily disabled for debugging
useEffect(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      //alert("Access Denied: No user found.");
      navigate("/");
    } else {
      console.log("Temporary bypass for testing admin access.");
    }
  });
}, [navigate]);

  // Fetch all services on component load
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/workshop"); // API endpoint
      setServices(response.data); // Set fetched services
    } catch (error) {
      console.error("Error fetching services:", error.response?.data || error.message);
      alert("Failed to load services. Please try again later.");
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());

  const filteredServices = services.filter((service) =>
    ["name", "description", "address"].some((key) =>
      service[key]?.toLowerCase().includes(searchQuery)
    )
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update workshop
        await axios.put(`http://localhost:3000/api/workshop/${editId}`, form);
        alert("Workshop updated successfully!");
      } else {
        // Add new workshop
        await axios.post("http://localhost:3000/api/workshop/create-workshop", form);
        alert("Workshop added successfully!");
      }
      setForm({
        name: "",
        description: "",
        address: "",
        pricing: "",
        phone: "",
        id: uuidv4(),
        paymentMethods: [],
        services: [],
        acceptedBrands: [],
      });
      setEditId(null);
      fetchServices();
    } catch (error) {
      console.error("Error saving workshop:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to save workshop. Please try again.");
    }
  };

  const handleEdit = (service) => {
    setForm(service);
    setEditId(service._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workshop?")) {
      try {
        await axios.delete(`http://localhost:3000/api/workshop/${id}`);
        alert("Workshop deleted successfully!");
        fetchServices();
      } catch (error) {
        console.error("Error deleting workshop:", error.response?.data || error.message);
        alert("Failed to delete workshop. Please try again.");
      }
    }
  };

  const handleViewLocation = async (workshop) => {
    setSelectedWorkshop(workshop);
    try {
      const response = await axios.get(GEOCODING_API_URL, {
        params: { address: workshop.address, region: "PL" },
      });
      const location = response.data.results[0]?.geometry.location;
      setMarkerPosition(location || { lat: 51.759, lng: 19.457 }); // Default to Lodz, Poland
    } catch (error) {
      console.error("Error fetching workshop location:", error);
      setMarkerPosition({ lat: 51.759, lng: 19.457 }); // Default to Lodz, Poland
    }
  };

  return (
    <div className={styles.adminPage}>
      <h1>Admin Dashboard</h1>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search workshops"
          value={searchQuery}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      {/* Add/Edit Workshop Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Workshop Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="pricing"
          placeholder="Pricing"
          value={form.pricing}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? "Update Workshop" : "Add Workshop"}</button>
      </form>

      {/* Workshop List */}
      <ul className={styles.serviceList}>
        {filteredServices.map((service) => (
          <li key={service._id} className={styles.serviceItem}>
            <h4>{service.name}</h4>
            <p>Description: {service.description}</p>
            <p>Address: {service.address}</p>
            <p>Pricing: ${service.pricing}</p>
            <button onClick={() => handleEdit(service)}>Edit</button>
            <button onClick={() => handleDelete(service._id)}>Delete</button>
            <button onClick={() => handleViewLocation(service)}>View Location</button>
          </li>
        ))}
      </ul>

      {/* Map for Selected Workshop */}
      {selectedWorkshop && (
        <div className={styles.mapContainer}>
          <h3>Location for: {selectedWorkshop.name}</h3>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "250px" }}
            center={markerPosition}
            zoom={15}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPage;
