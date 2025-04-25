import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { BaseUrl } from "./BaseUrl";
import { Link } from "react-router-dom";

const CollectionFeatured = () => {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/featured`);
        if (res.data.status) {
          setCollection(res.data.data.filter((item) => item.status === 1));
        }
      } catch (error) {
        console.error("Failed to fetch collection data", error);
      }
    };

    fetchCollection();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 fw-bold text-dark">
        OUR <span className="text-primary">COLLECTIONS</span>
      </h2>
      <div className="row">
        {/* Left Section */}
        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
          {collection[0] && (
            <Card className="shadow-lg border-0 rounded-3 h-100 overflow-hidden">
              <div className="image-container">
                <div
                  className="bg-image"
                  style={{
                    backgroundImage: `url(${BaseUrl}${collection[0].image})`,
                  }}
                >
                  <div className="overlay-text">
                    <h3 className="text-white fw-bold">{collection[0].name}</h3>
                    <p className="desc text-white mb-3">
                      {collection[0].description}
                    </p>
                    <Link
                      to="/shop"
                      variant="light"
                      className="btn btn-light rounded-pill px-4"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Section */}
        <div className="col-12 col-lg-6 d-flex flex-column gap-4">
          {collection[1] && (
            <Card className="shadow-lg border-0 rounded-3 overflow-hidden">
              <div className="image-container">
                <div
                  className="bg-image"
                  style={{
                    backgroundImage: `url(${BaseUrl}${collection[1].image})`,
                  }}
                >
                  <div className="overlay-text">
                    <h5 className="text-white fw-bold mb-3">
                      {collection[1].name}
                    </h5>
                    <p className="desc text-white mb-3">
                      {collection[1].description}
                    </p>
                    <Link
                      to="/shop"
                      variant="light"
                      className="btn btn-light rounded-pill px-4"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="row">
            {[2, 3].map(
              (i) =>
                collection[i] && (
                  <div
                    key={collection[i].id}
                    className="col-12 col-md-6 mb-3 mb-md-0"
                  >
                    <Card className="shadow-lg border-0 rounded-3 overflow-hidden h-100">
                      <div className="image-container small">
                        <div
                          className="bg-image"
                          style={{
                            backgroundImage: `url(${BaseUrl}${collection[i].image})`,
                          }}
                        >
                          <div className="overlay-text">
                            <h6 className="text-white fw-bold mb-2">
                              {collection[i].name}
                            </h6>
                            <p className="desc text-white mb-3">
                              {collection[i].description}
                            </p>
                            <Button
                              variant="light"
                              className="rounded-pill px-3 py-1"
                            >
                              View Detail
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionFeatured;
