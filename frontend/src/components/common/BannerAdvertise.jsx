import React from "react";

const BannerAdvertise = () => {
  return (
    <div className="container-fluid my-5">
      <h2 className="text-center mb-5 fw-bold text-dark">
        BIGGEST <span className="text-primary">DISCOUNT</span>
      </h2>
      <div className="advertise-banner d-flex align-items-center justify-content-center text-center">
        <div className="overlay-content text-white">
          <h1 className="fw-bold mb-3">Discover Our Latest Deals</h1>
          <p className="mb-4">Grab your favorites now before they're gone!</p>
          <button className="btn btn-light rounded-pill px-4 py-2 fw-semibold">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerAdvertise;
