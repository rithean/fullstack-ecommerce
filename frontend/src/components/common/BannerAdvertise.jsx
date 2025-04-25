import axios from "axios";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "./BaseUrl";

const BannerAdvertise = () => {
  const [discount, setDiscount] = useState([]);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/discount`);
        if (res.data.status) {
          const activeDiscounts = res.data.data.filter(
            (item) => item.status === 1
          );
          setDiscount(activeDiscounts);
        }
      } catch (error) {
        console.error("Failed to fetch discount data", error);
      }
    };

    fetchDiscount();
  }, []);

  const firstDiscount = discount.length > 0 ? discount[0] : null;

  return (
    <div className="container-fluid my-5">
      <h2 className="text-center mb-5 fw-bold text-dark">
        BIGGEST <span className="text-primary">DISCOUNT</span>
      </h2>

      {firstDiscount ? (
        <div
          className="position-relative d-flex align-items-center justify-content-center text-center text-white"
          style={{
            backgroundImage: `url(${BaseUrl}${
              firstDiscount.image.startsWith("/") ? "" : "/"
            }${firstDiscount.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "500px",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 1,
            }}
          ></div>

          {/* Content on top of overlay */}
          <div
            style={{
              width: "850px",
              position: "relative",
              zIndex: 2,
              padding: "2rem",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderRadius: "12px",
            }}
          >
            <h1 className="fw-bold mb-3">
              {firstDiscount.name || "Discover Our Latest Deals"}
            </h1>
            <p className="mb-4">
              {firstDiscount.description ||
                "Grab your favorites now before they're gone!"}
            </p>
            <button className="btn btn-light rounded-pill px-4 py-2 fw-semibold">
              Shop Now
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center">No discounts available.</p>
      )}
    </div>
  );
};

export default BannerAdvertise;
