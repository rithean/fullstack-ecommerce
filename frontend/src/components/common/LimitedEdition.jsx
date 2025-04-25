import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { FaShoppingCart, FaEye, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { BaseUrl } from "./BaseUrl"; // Assuming BaseUrl is set in a separate file

const LimitedEdition = () => {
  const [products, setProducts] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/products`);
        if (res.data.status) {
          setProducts(res.data.data.data || []); // Accessing the nested data
        } else {
          setProducts([]); // If the response doesn't have the right status, fallback to empty array
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]); // Fallback to an empty array in case of error
      }
    };

    fetchProducts();
  }, []);

  // Function to handle ratings (star rendering)
const getRating = (rating) => {
  const safeRating =
    typeof rating === "number" && !isNaN(rating) && rating >= 0 ? rating : 0;
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating - fullStars >= 0.5;
  return { fullStars, hasHalfStar };
};


  // Clone the array to create an infinite loop (for slider effect)
  const items = [...products, ...products];

  return (
    <div className="limited-section py-5">
      <h2 className="text-center fw-bold mb-4 text-dark">
        LIMITED <span className="text-primary">EDITION</span>
      </h2>
      <div className="slider-container">
        <div className="slider-track">
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item, index) => {
              const { fullStars, hasHalfStar } = getRating(item.rating);
              return (
                <div className="slide-item" key={index}>
                  <Card className="h-100 shadow-sm border-0 rounded-lg overflow-hidden">
                    <div className="position-relative">
                      <div className="overflow-hidden rounded-top bg-light">
                        <Card.Img
                          variant="top"
                          src={`${BaseUrl}${item.image}`} 
                          alt={item.name}
                          className="product-image w-100"
                          style={{
                            objectFit: "cover",
                            height: "220px",
                            transition: "transform 0.3s ease-in-out",
                          }}
                        />
                      </div>
                      {item.status === 1 && (
                        <Badge
                          bg="danger"
                          className="position-absolute top-0 end-0 px-4 py-2 m-3 rounded-pill"
                        >
                          Limited
                        </Badge>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column p-3">
                      <div className="mb-2">
                        <Card.Title className="fw-semibold text-dark mb-1 line-clamp-1">
                          {item.name}
                        </Card.Title>
                        <Card.Subtitle className="text-muted small mb-2">
                          {item.category?.name}
                        </Card.Subtitle>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-danger fw-bold fs-5">
                          ${item.price}
                        </span>
                        {item.qty <= 5 && (
                          <Badge bg="warning" pill>
                            Low Stock
                          </Badge>
                        )}
                      </div>
                      <Card.Text className="small text-secondary line-clamp-2 mb-3">
                        {item.description}
                      </Card.Text>
                      {/* Rating Stars */}
                      <div className="d-flex align-items-center mb-2">
                        {[...Array(fullStars)].map((_, index) => (
                          <FaStar
                            key={`full-${item.id}-${index}`}
                            className="text-warning me-1"
                            size={14}
                          />
                        ))}
                        {hasHalfStar && (
                          <FaStarHalfAlt
                            className="text-warning me-1"
                            size={14}
                          />
                        )}
                        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map(
                          (_, index) => (
                            <FaStar
                              key={`empty-${item.id}-${index}`}
                              className="text-muted me-1"
                              size={14}
                            />
                          )
                        )}
                        <span className="text-muted small ms-2">
                          ({item.rating})
                        </span>
                      </div>
                      <div className="mt-auto d-grid">
                        <Button
                          variant="primary"
                          className="rounded-pill btn-sm"
                        >
                          Shop Now
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              );
            })
          ) : (
            <div className="text-center">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LimitedEdition;
