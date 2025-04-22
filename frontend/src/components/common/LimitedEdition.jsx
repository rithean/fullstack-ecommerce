import React from "react";
import { Button, Card, Badge } from "react-bootstrap";
import { FaShoppingCart, FaEye, FaStar, FaStarHalfAlt } from "react-icons/fa";

const products = [
  {
    id: 1,
    title: "Limited Jacket",
    category: { name: "Apparel" },
    price: 99.99,
    qty: 3,
    img: "https://placehold.co/300x400?text=Jacket",
    description: "A limited edition jacket with a unique design.",
    rating: 4.5,
    status: 1,
  },
  {
    id: 2,
    title: "Sneakers",
    category: { name: "Footwear" },
    price: 149.99,
    qty: 5,
    img: "https://placehold.co/300x400?text=Sneakers",
    description: "Comfortable sneakers with a stylish touch.",
    rating: 4.2,
    status: 1,
  },
  {
    id: 3,
    title: "Cap",
    category: { name: "Accessories" },
    price: 29.99,
    qty: 2,
    img: "https://placehold.co/300x400?text=Cap",
    description: "A stylish cap for a modern look.",
    rating: 3.8,
    status: 1,
  },
  {
    id: 4,
    title: "Backpack",
    category: { name: "Accessories" },
    price: 79.99,
    qty: 1,
    img: "https://placehold.co/300x400?text=Backpack",
    description: "A durable backpack for everyday use.",
    rating: 4.0,
    status: 1,
  },
  {
    id: 5,
    title: "Wristwatch",
    category: { name: "Accessories" },
    price: 199.99,
    qty: 4,
    img: "https://placehold.co/300x400?text=Watch",
    description: "A luxury wristwatch with classic design.",
    rating: 4.7,
    status: 1,
  },
  {
    id: 6,
    title: "T-Shirt",
    category: { name: "Apparel" },
    price: 19.99,
    qty: 10,
    img: "https://placehold.co/300x400?text=T-Shirt",
    description: "A comfortable and stylish T-shirt.",
    rating: 4.3,
    status: 1,
  },
];

const LimitedEdition = () => {
  const getRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    return { fullStars, hasHalfStar };
  };

  // Clone the array to create an infinite loop
  const items = [...products, ...products];

  return (
    <div className="limited-section py-5">
      <h2 className="text-center fw-bold mb-4 text-dark">
        LIMITED <span className="text-primary">EDITION</span>
      </h2>
      <div className="slider-container">
        <div className="slider-track">
          {items.map((item, index) => {
            const { fullStars, hasHalfStar } = getRating(item.rating);
            return (
              <div className="slide-item" key={index}>
                <Card className="h-100 shadow-sm border-0 rounded-lg overflow-hidden">
                  <div className="position-relative">
                    <div className="overflow-hidden rounded-top bg-light">
                      <Card.Img
                        variant="top"
                        src={item.img}
                        alt={item.title}
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
                        {item.title}
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
                      <Button variant="primary" className="rounded-pill btn-sm">
                        Shop Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LimitedEdition;
