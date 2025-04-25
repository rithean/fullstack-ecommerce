import axios from "axios";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "./BaseUrl"; // Adjust your BaseUrl if necessary

const BestCollection = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/best`);
        if (res.data.status) {
          setCollections(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch collection data", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 fw-bold text-dark">
        BEST<span className="text-primary">COLLECTIONS</span>
      </h2>
      <div className="row g-4">
        {collections.length > 0 ? (
          collections.map((collection, index) => (
            <div key={index} className="col-12 col-md-6">
              <div
                className={`collection-card ${
                  index % 2 === 0 ? "bg-img-left" : "bg-img-right"
                } d-flex align-items-center justify-content-center text-white text-center`}
                style={{
                  backgroundImage: `url(${BaseUrl}${collection.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minHeight: "300px",
                  position: "relative",
                }}
              >
                <div
                  className="overlay-content"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)", 
                    padding: "2rem",
                    borderRadius: "10px",
                  }}
                >
                  <h2 className="fw-bold mb-3">{collection.name}</h2>
                  <p className="mb-3">{collection.description}</p>
                  <button className="btn btn-light rounded-pill px-4 py-2 fw-semibold">
                    {collection.buttonText || "Shop Now"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No collections available.</p>
        )}
      </div>
    </div>
  );
};

export default BestCollection;
