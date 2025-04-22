import React from "react";
import { Card, Button } from "react-bootstrap";

const CollectionFeatured = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 fw-bold text-dark">
        OUR <span className="text-primary">COLLECTIONS</span>
      </h2>
      <div className="row">
        {/* Left Section */}
        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
          <Card className="shadow-lg border-0 rounded-3 h-100 overflow-hidden">
            <div className="image-container">
              <div
                className="bg-image"
                style={{
                  backgroundImage: "url('https://placehold.co/800x500')",
                }}
              >
                <div className="overlay-text">
                  <h3 className="text-white fw-bold">Featured Item 1</h3>
                  <p className="text-white-50 mb-3">
                    This is a description of the featured item. It's cool and
                    trendy!
                  </p>
                  <Button variant="light" className="rounded-pill px-4">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Section */}
        <div className="col-12 col-lg-6 d-flex flex-column gap-4">
          <Card className="shadow-lg border-0 rounded-3 overflow-hidden">
            <div className="image-container">
              <div
                className="bg-image"
                style={{
                  backgroundImage: "url('https://placehold.co/800x250')",
                }}
              >
                <div className="overlay-text">
                  <h5 className="text-white fw-bold mb-3">Item 2</h5>
                  <Button variant="light" className="rounded-pill px-4">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="row">
            {[3, 4].map((item) => (
              <div key={item} className="col-12 col-md-6 mb-3 mb-md-0">
                <Card className="shadow-lg border-0 rounded-3 overflow-hidden h-100">
                  <div className="image-container small">
                    <div
                      className="bg-image"
                      style={{
                        backgroundImage: `url('https://placehold.co/400x300?text=Item+${item}')`,
                      }}
                    >
                      <div className="overlay-text">
                        <h6 className="text-white fw-bold mb-2">Item {item}</h6>
                        <Button
                          variant="light"
                          className="rounded-pill px-3 py-1"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionFeatured;
