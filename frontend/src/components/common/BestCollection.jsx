import React from "react";

const BestCollection = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 fw-bold text-dark">
        BEST<span className="text-primary">COLLECTIONS</span>
      </h2>
      <div className="row g-4">
        {/* Left Card */}
        <div className="col-12 col-md-6">
          <div className="collection-card bg-img-left d-flex align-items-center justify-content-center text-white text-center">
            <div className="overlay-content">
              <h2 className="fw-bold mb-3">Men’s Collection</h2>
              <p className="mb-3">Stylish • Modern • Comfortable</p>
              <button className="btn btn-light rounded-pill px-4 py-2 fw-semibold">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="col-12 col-md-6">
          <div className="collection-card bg-img-right d-flex align-items-center justify-content-center text-white text-center">
            <div className="overlay-content">
              <h2 className="fw-bold mb-3">Women’s Collection</h2>
              <p className="mb-3">Elegant • Trendy • Beautiful</p>
              <button className="btn btn-light rounded-pill px-4 py-2 fw-semibold">
                Discover
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestCollection;
